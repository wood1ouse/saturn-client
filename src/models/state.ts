import { ReadyState } from 'react-use-websocket';
import { AppDataSources } from './api.ts';

export interface DataSourceState {
  enabled: boolean;
  expanded: boolean;
  connection: ReadyState;
}

export type DataSourcesState = Record<AppDataSources, DataSourceState>;
