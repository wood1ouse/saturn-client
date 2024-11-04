import React from 'react';
import { Stack } from '@mui/material';

import styled from './_shared.ts';
import { AppDataSources } from '../../models/api.ts';
import { LayersTabItem } from './LayersTabItem.tsx';
import { FlightsSettings } from './settings/FlightsSettings.tsx';
import { WeatherSettings } from './settings/WeatherSettings.tsx';

const { TabContainer } = styled;

export const LayersTab: React.FC = () => {
  return (
    <TabContainer>
      <Stack gap={2}>
        <LayersTabItem name="OpenSky API Network" source={AppDataSources.OPEN_SKY_NETWORK}>
          <FlightsSettings />
        </LayersTabItem>
        <LayersTabItem name="OpenWeather API" source={AppDataSources.OPEN_WEATHER}>
          <WeatherSettings />
        </LayersTabItem>
      </Stack>
    </TabContainer>
  );
};
