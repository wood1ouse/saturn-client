import { AppDataSources } from './../models/api';
import { makeAutoObservable } from 'mobx';

import { HistoricalState, LayerHistoricalState } from '../models/state';
import { FeatureCollection } from 'geojson';

class HistroicalStore {
  state: LayerHistoricalState = {
    [AppDataSources.OPEN_SKY_NETWORK]: {
      live: true,
      time: Date.now(),
      geojson: null,
      timestamps: []
    },
    [AppDataSources.OPEN_WEATHER]: {
      live: true,
      time: Date.now(),
      geojson: null,
      timestamps: []
    }
  };

  toggleLive(source: AppDataSources): void {
    this.state[source].live = !this.state[source].live;
  }

  setTime(source: AppDataSources, value: number): void {
    this.state[source].time = value;
  }

  setTimestamps(source: AppDataSources, value: number[]): void {
    this.state[source].timestamps = value;
  }

  setHistoricalGeoJSON(source: AppDataSources, value: FeatureCollection): void {
    this.state[source].geojson = value;
  }

  get source(): (source: AppDataSources) => HistoricalState {
    return (source) => this.state[source];
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new HistroicalStore();
