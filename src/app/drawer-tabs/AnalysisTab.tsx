import { Card, IconButton, Stack } from '@mui/material';
import React from 'react';
import { px } from '../../utils/ui';
import styled from './_shared';

import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import { observer } from 'mobx-react';
import { AppDataSources } from '../../models/api';
import UIStore from '../../store/UIStore';
import FlightsStore from '../../store/FlightsStore';

const { TabContainer } = styled;

function openAnalysisDialog(source: AppDataSources) {
  UIStore.openAnalysisDialog(source);
}

export const AnalysisTab: React.FC = observer(() => {
  const { activeFlight } = FlightsStore;

  return (
    <TabContainer>
      <Card sx={{ width: px(300) }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" p={1.5}>
          <Stack direction="row" alignItems="center" p={1.5}>
            OpenSkyAPI Network
          </Stack>

          <IconButton
            disabled={!activeFlight}
            onClick={() => openAnalysisDialog(AppDataSources.OPEN_SKY_NETWORK)}
          >
            <OpenInNewRoundedIcon />
          </IconButton>
        </Stack>
      </Card>
    </TabContainer>
  );
});
