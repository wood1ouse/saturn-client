import { Card, Collapse, IconButton, Stack, Switch } from '@mui/material';
import { ExpandLessRounded, ExpandMoreRounded } from '@mui/icons-material';
import React, { PropsWithChildren } from 'react';
import { observer } from 'mobx-react';

import DataStore from '../../store/DataStore';
import { ConnectionStatus } from './LayersTab.components';
import { px } from '../../utils/ui';
import { AppDataSources } from '../../models/api';
import { UIService } from '../../services/UIService';

function toggleDataSource(source: AppDataSources) {
  DataStore.toggleDataSource(source);
}

function toggleExpandDataSource(source: AppDataSources) {
  DataStore.toggleExpandDataSource(source);
}

interface Props {
  name: string;
  source: AppDataSources;
}

export const LayersTabItem: React.FC<PropsWithChildren<Props>> = observer(
  ({ name, source, children }) => {
    const { isDataSourceEnabled, isDataSourceExpanded, dataSourceConnectionState } = DataStore;

    return (
      <Stack direction="row" justifyContent="center" alignItems="center" gap={1}>
        <Card sx={{ p: 1.5, width: px(280) }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center">
              <Switch
                checked={DataStore.isDataSourceEnabled(source)}
                onChange={() => {
                  toggleDataSource(source);
                }}
              />
              {name}
            </Stack>
            <IconButton
              onClick={() => {
                toggleExpandDataSource(source);
              }}
              disabled={!isDataSourceEnabled(source)}>
              {isDataSourceExpanded(source) ? <ExpandLessRounded /> : <ExpandMoreRounded />}
            </IconButton>
          </Stack>
          <Collapse in={isDataSourceExpanded(source)} timeout="auto" unmountOnExit>
            {children}
          </Collapse>
        </Card>
        <ConnectionStatus
          color={UIService.getConnectionStateColor(dataSourceConnectionState(source))}
        />
      </Stack>
    );
  }
);
