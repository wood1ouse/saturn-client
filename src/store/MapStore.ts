import { makeAutoObservable } from 'mobx';

import { MapCursorState, MapState } from '../models/state';
import { MapboxMap } from 'react-map-gl';

class MapStore {
  map: MapboxMap | null = null;
  state: MapState = {
    cursor: 'grab'
  };

  setMap(map: MapboxMap) {
    this.map = map;
  }

  setCursor(value: MapCursorState) {
    this.state.cursor = value;
  }

  flyTo(center: [number, number], zoom: number, speed: number): void {
    if (!this.map) return;
    this.map.flyTo({ center, zoom, speed });
  }

  get cursor() {
    return this.state.cursor;
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new MapStore();
