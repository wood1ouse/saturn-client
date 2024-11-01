import React from 'react';
import { Stack } from '@mui/material';

import styled from './_shared.ts';
import { AppDataSources } from '../../models/api.ts';
import { LayersTabItem } from './LayersTabItem.tsx';

const { TabContainer } = styled;

export const LayersTab: React.FC = () => {
  return (
    <TabContainer>
      <Stack gap={2}>
        <LayersTabItem source={AppDataSources.OPEN_SKY_NETWORK} />
        <LayersTabItem source={AppDataSources.OPEN_WEATHER} />
      </Stack>
    </TabContainer>
  );
};
