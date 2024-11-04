import { makeAutoObservable } from 'mobx';

import { LayerSettingsState } from '../models/state';
import { AppDataSources } from '../models/api';

class LayerStore {
  layers: LayerSettingsState = {
    [AppDataSources.OPEN_SKY_NETWORK]: {
      opacity: 1
    }
  };

  changeFlightsOpacity(value: number) {
    this.layers = {
      ...this.layers,
      [AppDataSources.OPEN_SKY_NETWORK]: {
        ...this.layers[AppDataSources.OPEN_SKY_NETWORK],
        opacity: value
      }
    };
  }

  get flightsOpacity() {
    return this.layers[AppDataSources.OPEN_SKY_NETWORK].opacity;
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new LayerStore();
