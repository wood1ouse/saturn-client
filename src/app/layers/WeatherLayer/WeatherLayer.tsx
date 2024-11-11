import React, { useEffect } from 'react';
import { useMap } from 'react-map-gl';
import { HeatmapPoint, create as InterpolateHeatmapLayer } from 'interpolateheatmaplayer';
import { observer } from 'mobx-react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { AppDataSources } from '../../../models/api';
import DataStore from '../../../store/DataStore';

const WS_URL = 'ws://3.67.68.210:8081';

export const WeatherLayer: React.FC = observer(() => {
  const { isDataSourceEnabled, dataSources } = DataStore;

  const { current } = useMap();

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket<HeatmapPoint[]>(
    isDataSourceEnabled(AppDataSources.OPEN_WEATHER) ? WS_URL : null,
    {
      share: false,
      shouldReconnect: () => true
    }
  );

  useEffect(() => {
    DataStore.setSocketConnectionState(AppDataSources.OPEN_WEATHER, readyState);

    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({
        event: 'subscribe'
      });
    }
  }, [readyState, sendJsonMessage]);

  useEffect(() => {
    const map = current?.getMap();

    if (map && map.isStyleLoaded() && lastJsonMessage) {
      const addLayer = () => {
        if (!map.getLayer('weatherLayer')) {
          const layer = InterpolateHeatmapLayer({
            points: lastJsonMessage,
            layerId: 'weatherLayer',
            valueToColor:
              'vec3 valueToColor(float value) {  return mix(vec3(0.0, 1.0, 0.0), vec3(0.0, 0.0, 1.0), smoothstep(0.0, 1.0, value)); }'
          });

          map.addLayer(layer);
        }
      };

      if (map.isStyleLoaded()) {
        addLayer();
      } else {
        map.on('load', addLayer);
      }

      console.log(dataSources.OPEN_WEATHER.enabled);

      if (!dataSources.OPEN_WEATHER.enabled) {
        map.removeLayer('weatherLayer');
      }
    }
  }, [current, dataSources.OPEN_WEATHER.enabled, lastJsonMessage]);

  return null;
});
