import React, { useEffect, useState } from 'react';
import { Layer, Source, useMap } from 'react-map-gl';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import {
  AppDataSources,
  FlightsRawResponse,
  FlightsState,
  FlightStateProperties
} from '../../../models/api';
import { Feature, FeatureCollection, Point } from 'geojson';
import DataStore from '../../../store/DataStore';
import LayerStore from '../../../store/LayerStore';
import { observer } from 'mobx-react';
import HistoricalStore from '../../../store/HistoricalStore';
import FlightsStore from '../../../store/FlightsStore';

const WS_URL = 'ws://localhost:8080';

function setActiveFlight(flight: Feature<Point, FlightStateProperties>) {
  FlightsStore.setActiveFlight(flight);
}

export const FlightsLayer: React.FC = observer(() => {
  const { isDataSourceEnabled } = DataStore;
  const { source } = HistoricalStore;
  const { flightsOpacity } = LayerStore;
  const { activeFlight } = FlightsStore;

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket<FlightsRawResponse>(
    isDataSourceEnabled(AppDataSources.OPEN_SKY_NETWORK) ? WS_URL : null,
    {
      share: false,
      shouldReconnect: () => true
    }
  );

  const [flightsState, setFlightsState] = useState<FlightsState | null>(null);

  const { live, geojson: historicalGeojson } = source(AppDataSources.OPEN_SKY_NETWORK);

  const { current: map } = useMap();

  useEffect(() => {
    if (map) {
      map.loadImage('/aircraft.png', (error, image) => {
        if (error) throw error;

        if (image && !map.hasImage('aircraft-icon')) {
          map.addImage('aircraft-icon', image);
        }
      });
      map.loadImage('/active_aircraft.png', (error, image) => {
        if (error) throw error;

        if (image && !map.hasImage('active-aircraft-icon')) {
          map.addImage('active-aircraft-icon', image);
        }
      });
    }
  }, [map]);

  useEffect(() => {
    DataStore.setSocketConnectionState(AppDataSources.OPEN_SKY_NETWORK, readyState);

    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({
        event: 'subscribe'
      });
    }
  }, [readyState, sendJsonMessage]);

  useEffect(() => {
    if (lastJsonMessage && live) {
      const geojson: FeatureCollection<Point, FlightStateProperties> = JSON.parse(
        lastJsonMessage.geojson
      );

      if (activeFlight) {
        const { features } = geojson;

        const active = features.find(
          (feature) => feature.properties.icao === activeFlight.properties.icao
        );

        if (active) setActiveFlight(active);
      }

      setFlightsState({
        timestamp: lastJsonMessage.timestamp,
        geojson
      });
    }
  }, [lastJsonMessage, live]);

  return (
    <Source
      id="flight-data"
      type="geojson"
      data={live && flightsState ? flightsState.geojson : historicalGeojson}>
      <Layer
        id="flights-layer"
        type="symbol"
        layout={{
          'icon-image': [
            'case',
            ['==', ['get', 'icao'], activeFlight?.properties?.icao || null],
            'active-aircraft-icon',
            'aircraft-icon'
          ],
          'icon-rotate': ['get', 'true_track'],
          'icon-size': 0.5
        }}
        paint={{
          'icon-opacity': flightsOpacity
        }}
      />
    </Source>
  );
});
