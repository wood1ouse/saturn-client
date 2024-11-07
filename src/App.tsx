import 'mapbox-gl/dist/mapbox-gl.css';
import Map, { MapRef } from 'react-map-gl';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { darkTheme, lightTheme } from './theme';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import React, { useRef, useEffect } from 'react';
import { MapDrawer } from './app/drawers/MapDrawer/MapDrawer.tsx';
import DrawControl from './app/DrawControl/DrawControl.tsx';
import { observer } from 'mobx-react';
import UIStore from './store/UIStore';
import HistoricalStore from './store/HistoricalStore.ts';
import MapStore from './store/MapStore.ts';
import FlightsStore from './store/FlightsStore.ts';
import { FlightsLayer } from './app/layers/FlightsLayer/FlightsLayer.tsx';
import { FlightsHistoricalAPI } from './api/FlightsHistroicalAPI.ts';
import { AppDataSources, FlightStateProperties } from './models/api.ts';
import { MapCursorState, SpatialObject } from './models/state.ts';
import { ActiveFlightPanel } from './app/ActiveFlightPanel/ActiveFlightPanel.tsx';
import { Feature, Point } from 'geojson';

import { AnalysisDialog } from './app/AnalysisDialog/AnalysisDialog.tsx';
import AnalysisStore from './store/AnalysisStore.ts';
import SpatialObjectStore from './store/SpatialObjectStore.ts';

import { SpatialObjectsDrawer } from './app/drawers/SpatialObjectsDrawer/SpatialObjectsDrawer.tsx';
import { css, Global } from '@emotion/react';
import { px } from './utils/ui.ts';
import { SpatialObjectsService } from './services/SpatialObjectsService.tsx';

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

function resetFlightsData() {
  AnalysisStore.resetFlightsData();
}

function addSpatialObject(object: SpatialObject) {
  SpatialObjectStore.addSpatialObject(object);
}

function removeSpatialObject(id: string) {
  SpatialObjectStore.removeSpatialObject(id);
}

const App: React.FC = observer(() => {
  const { isDrawerOpened, isSpatialObjectsDrawerOpened, theme: themeMode } = UIStore;
  const selectedTheme = themeMode === 'dark' ? darkTheme : lightTheme;
  const { cursor } = MapStore;

  const mapRef = useRef<MapRef>(null);

  const globalStyles = (
    <Global
      styles={css`
        .mapboxgl-ctrl-group {
          /* Use a slightly slower transition for collapsing */
          transition: margin-right ${isSpatialObjectsDrawerOpened ? '0.4s' : '0.25s'}
            ${isSpatialObjectsDrawerOpened
              ? 'cubic-bezier(0.25, 0.8, 0.5, 1)'
              : 'cubic-bezier(0.6, 0, 0.4, 1)'};
          margin-right: ${isSpatialObjectsDrawerOpened ? px(320) : px(64)} !important;
          background-color: ${selectedTheme.palette.background.paper};
          border-color: ${selectedTheme.palette.divider};
        }

        .mapboxgl-ctrl-group button {
          color: ${selectedTheme.palette.text.primary};

          ${themeMode === 'dark' &&
          css`
            filter: invert(1);
          `}
        }
      `}
    />
  );

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.easeTo({
        padding: {
          left: isDrawerOpened ? 370 : 0,
          right: isSpatialObjectsDrawerOpened ? 370 : 0
        },
        duration: 300
      });
    }
  }, [isDrawerOpened, isSpatialObjectsDrawerOpened]);

  useEffect(() => {
    const fetchTimestamps = async () => {
      const result = await FlightsHistoricalAPI.getTimestamps();
      setTimestamps(AppDataSources.OPEN_SKY_NETWORK, result);
    };

    fetchTimestamps();
  }, []);

  // const handleUpdate = (e) => {
  //   console.log('Updated features:', e.features);
  // };

  const handleDelete = (e: { features: object[] }) => {
    const features = e.features as Feature[];
    removeSpatialObject(features[0].id as string);
  };

  const handleCreate = (e: { features: object[] }) => {
    const feature = e.features[0] as Feature;
    addSpatialObject({
      name: SpatialObjectsService.getSpatialObjectNameByType(feature),
      edit: false,
      feature: feature
    });
  };

  return (
    <>
      {globalStyles}
      <CssBaseline />
      <ThemeProvider theme={themeMode === 'dark' ? darkTheme : lightTheme}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <Box
            sx={{
              display: 'flex',
              width: '100vw',
              height: '100vh'
            }}
          >
            <Map
              ref={mapRef}
              mapboxAccessToken="pk.eyJ1Ijoid29vZGxvdXNlIiwiYSI6ImNsbzF5eXVhMzB1YnMya3A3NXQyZDRiOHIifQ.pxl9r8lSBJGi-OUu5dWVoQ"
              initialViewState={{
                longitude: 15.2551,
                latitude: 54.526,
                zoom: 3
              }}
              style={{ width: '100%', height: '100%' }}
              mapStyle={
                themeMode === 'dark'
                  ? 'mapbox://styles/mapbox/dark-v11'
                  : 'mapbox://styles/mapbox/light-v11'
              }
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
                  resetFlightsData();
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
              cursor={cursor}
            >
              <FlightsLayer />

              <DrawControl
                position="top-right"
                displayControlsDefault={false}
                controls={{
                  polygon: true,
                  line_string: true,
                  point: true,
                  trash: true,
                  combine_features: true,
                  uncombine_features: true
                }}
                onCreate={handleCreate}
                onDelete={handleDelete}
                // onUpdate={handleUpdate}
              />
              <MapDrawer />
              <SpatialObjectsDrawer />
            </Map>
            <ActiveFlightPanel />
          </Box>
          <AnalysisDialog />
        </LocalizationProvider>
      </ThemeProvider>
    </>
  );
});

export default App;
