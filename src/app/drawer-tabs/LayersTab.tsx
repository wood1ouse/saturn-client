import React from 'react';
import { Card, Collapse, IconButton, Stack, Switch, Typography } from '@mui/material';
import { ExpandMoreRounded } from '@mui/icons-material';
import { ExpandLessRounded } from '@mui/icons-material';

import styled from './_shared.ts';
import { observer } from 'mobx-react';
import DataStore from '../../store/DataStore.ts';
import { AppDataSources } from '../../models/api.ts';
import { ConnectionStatus } from './LayersTab.components.tsx';
import { px } from '../../utils/ui.ts';

const { TabContainer } = styled;

function toggleDataSource(source: AppDataSources) {
  DataStore.toggleDataSource(source);
}

function toggleExpandDataSource(source: AppDataSources) {
  DataStore.toggleExpandDataSource(source);
}

export const LayersTab: React.FC = observer(() => {
  const { isDataSourceEnabled, isDataSourceExpanded } = DataStore;

  return (
    <TabContainer>
      <Stack gap={2}>
        <Stack direction="row" justifyContent="center" alignItems="center" gap={1}>
          <Card sx={{ p: 1.5, width: px(280) }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center">
                <Switch
                  value={isDataSourceEnabled(AppDataSources.OPEN_SKY_NETWORK)}
                  onChange={() => {
                    toggleDataSource(AppDataSources.OPEN_SKY_NETWORK);
                  }}
                />
                OpenSkyAPI Network
              </Stack>
              <IconButton
                onClick={() => {
                  toggleExpandDataSource(AppDataSources.OPEN_SKY_NETWORK);
                }}
                disabled={!isDataSourceEnabled(AppDataSources.OPEN_SKY_NETWORK)}
              >
                {isDataSourceExpanded(AppDataSources.OPEN_SKY_NETWORK) ? (
                  <ExpandLessRounded />
                ) : (
                  <ExpandMoreRounded />
                )}
              </IconButton>
            </Stack>
            <Collapse
              in={isDataSourceExpanded(AppDataSources.OPEN_SKY_NETWORK)}
              timeout="auto"
              unmountOnExit
            >
              <Typography variant="body2" sx={{ mt: 1 }}>
                Additional information about the OpenSkyAPI Network can be displayed here.
              </Typography>
            </Collapse>
          </Card>
          <ConnectionStatus />
        </Stack>
        <Stack direction="row" justifyContent="center" alignItems="center" gap={1}>
          <Card sx={{ p: 1.5, width: px(280) }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center">
                <Switch
                  value={isDataSourceEnabled(AppDataSources.OPEN_WEATHER)}
                  onChange={() => {
                    toggleDataSource(AppDataSources.OPEN_WEATHER);
                  }}
                />
                OpenWeather API
              </Stack>
              <IconButton
                onClick={() => {
                  toggleExpandDataSource(AppDataSources.OPEN_WEATHER);
                }}
                disabled={!isDataSourceEnabled(AppDataSources.OPEN_WEATHER)}
              >
                {isDataSourceExpanded(AppDataSources.OPEN_WEATHER) ? (
                  <ExpandLessRounded />
                ) : (
                  <ExpandMoreRounded />
                )}
              </IconButton>
            </Stack>
          </Card>
          <ConnectionStatus />
        </Stack>
      </Stack>
    </TabContainer>
  );
});
