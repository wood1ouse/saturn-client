import { ReadyState } from 'react-use-websocket';
import { AppDataSources, FlightStateProperties } from './api.ts';
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

export interface AnalyisDialogState {
  open: boolean;
  source: AppDataSources | null;
}

export type FlightsAnalysisState = Pick<
  FlightStateProperties,
  'velocity' | 'true_track' | 'time_position' | 'baro_altitude' | 'vertical_rate'
>;

export interface AnalysisState {
  [AppDataSources.OPEN_SKY_NETWORK]: FlightsAnalysisState[];
}
