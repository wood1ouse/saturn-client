import 'mapbox-gl/dist/mapbox-gl.css';
import Map, { MapRef } from 'react-map-gl';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './theme';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import React, { useRef, useEffect } from 'react';
import { MapDrawer } from './app/MapDrawer/MapDrawer';
import { observer } from 'mobx-react';
import UIStore from './store/UIStore';
import HistoricalStore from './store/HistoricalStore.ts';
import MapStore from './store/MapStore.ts';
import FlightsStore from './store/FlightsStore.ts';
import { FlightsLayer } from './app/layers/FlightsLayer/FlightsLayer.tsx';
import { FlightsHistoricalAPI } from './api/FlightsHistroicalAPI.ts';
import { AppDataSources, FlightStateProperties } from './models/api.ts';
import { MapCursorState } from './models/state.ts';
import { ActiveFlightPanel } from './app/ActiveFlightPanel/ActiveFlightPanel.tsx';
import { Feature, Point } from 'geojson';

function isPointFeature(
  feature: GeoJSON.Feature
): feature is Feature<Point, FlightStateProperties> {
  return feature.geometry && feature.geometry.type === 'Point';
}

function setTimestamps(source: AppDataSources, value: number[]) {
  HistoricalStore.setTimestamps(source, value);
}

function setCursor(cursor: MapCursorState) {
  MapStore.setCursor(cursor);
}

function setActiveFlight(flight: Feature<Point, FlightStateProperties>) {
  FlightsStore.setActiveFlight(flight);
}

const App: React.FC = observer(() => {
  const { isDrawerOpened } = UIStore;
  const { cursor } = MapStore;

  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.easeTo({
        padding: { left: isDrawerOpened ? 370 : 0 },
        duration: 300
      });
    }
  }, [isDrawerOpened]);

  useEffect(() => {
    const fetchTimestamps = async () => {
      const result = await FlightsHistoricalAPI.getTimestamps();
      setTimestamps(AppDataSources.OPEN_SKY_NETWORK, result);
    };

    fetchTimestamps();
  }, []);

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <Box
            sx={{
              display: 'flex',
              width: '100vw',
              height: '100vh'
            }}>
            <MapDrawer />
            <Map
              ref={mapRef}
              mapboxAccessToken="pk.eyJ1Ijoid29vZGxvdXNlIiwiYSI6ImNsbzF5eXVhMzB1YnMya3A3NXQyZDRiOHIifQ.pxl9r8lSBJGi-OUu5dWVoQ"
              initialViewState={{
                longitude: 15.2551,
                latitude: 54.526,
                zoom: 3
              }}
              style={{ width: '100%', height: '100%' }}
              mapStyle="mapbox://styles/mapbox/dark-v11"
              interactiveLayerIds={['flights-layer']}
              onMouseEnter={(event) => {
                const feature = event.features && event.features[0];

                if (feature) {
                  setCursor('pointer');
                }
              }}
              onClick={(event) => {
                const feature = event.features && event.features[0];

                if (feature && isPointFeature(feature)) {
                  setActiveFlight(feature);

                  if (mapRef.current) {
                    mapRef.current.flyTo({
                      center: [feature.geometry.coordinates[0], feature.geometry.coordinates[1]],
                      zoom: 6,
                      speed: 1
                    });
                  }
                }
              }}
              onMouseLeave={() => {
                setCursor('grab');
              }}
              cursor={cursor}>
              <FlightsLayer />
            </Map>
            <ActiveFlightPanel />
          </Box>
        </LocalizationProvider>
      </ThemeProvider>
    </>
  );
});

export default App;
