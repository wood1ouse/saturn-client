import React, { useEffect, useState } from 'react';
import { Layer, Source, useMap } from 'react-map-gl';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import {
  AppDataSources,
  FlightsRawResponse,
  FlightsState,
  FlightStateProperties
} from '../../../models/api';
import { FeatureCollection, Point } from 'geojson';
import DataStore from '../../../store/DataStore';
import LayerStore from '../../../store/LayerStore';
import { observer } from 'mobx-react';
import HistoricalStore from '../../../store/HistoricalStore';

const WS_URL = 'ws://localhost:8080';

export const FlightsLayer: React.FC = observer(() => {
  const { isDataSourceEnabled } = DataStore;
  const { source } = HistoricalStore;
  const { flightsOpacity } = LayerStore;

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

        if (image && !map.hasImage('custom-icon')) {
          map.addImage('custom-icon', image);
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
        id="points"
        type="symbol"
        layout={{
          'icon-image': 'custom-icon',
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
