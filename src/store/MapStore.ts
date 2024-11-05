import { makeAutoObservable } from 'mobx';

import { MapCursorState, MapState } from '../models/state';

class MapStore {
  state: MapState = {
    cursor: 'grab'
  };

  setCursor(value: MapCursorState) {
    this.state.cursor = value;
  }

  get cursor() {
    return this.state.cursor;
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new MapStore();
