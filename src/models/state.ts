import { ReadyState } from 'react-use-websocket';
import { AppDataSources } from './api.ts';
import { FeatureCollection } from 'geojson';

export interface DataSourceState {
  enabled: boolean;
  connection: ReadyState;
}

export type DataSourcesState = Record<AppDataSources, DataSourceState>;

export type ExpandedState = Record<AppDataSources, boolean>;

interface FlightsSettings {
  opacity: number;
}

export interface LayerSettingsState {
  [AppDataSources.OPEN_SKY_NETWORK]: FlightsSettings;
}

export interface HistoricalState {
  live: boolean;
  time: number;
  geojson: FeatureCollection | null;
  timestamps: number[];
}

export type LayerHistoricalState = Record<AppDataSources, HistoricalState>;

export type MapCursorState = 'grab' | 'pointer';

export interface MapState {
  cursor: MapCursorState;
}
