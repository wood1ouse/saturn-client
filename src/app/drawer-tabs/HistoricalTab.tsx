import React from 'react';

import styled from './_shared.ts';
import { Stack } from '@mui/material';
import { observer } from 'mobx-react';
import { HistoricalTabItem } from './HistoricalTabItem.tsx';
import { AppDataSources } from '../../models/api.ts';
import { FlightsHistoricalAPI } from '../../api/FlightsHistroicalAPI.ts';

const { TabContainer } = styled;

export const HistoricalTab: React.FC = observer(() => {
  return (
    <TabContainer>
      <Stack justifyContent="center" alignItems="center" gap={2}>
        <HistoricalTabItem
          name="OpenSky API Network"
          dataSource={AppDataSources.OPEN_SKY_NETWORK}
          getTimePositions={FlightsHistoricalAPI.getFlightPositionsForTime}
        />
      </Stack>
    </TabContainer>
  );
});
