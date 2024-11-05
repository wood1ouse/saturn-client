import { makeAutoObservable, reaction } from 'mobx';

import { Feature, FeatureCollection, Point } from 'geojson';
import { AppDataSources, FlightStateProperties } from '../models/api';
import HistoricalStore from './HistoricalStore';

class FlightsStore {
  activeFlight: Feature<Point, FlightStateProperties> | null = null;

  setActiveFlight(flight: Feature<Point, FlightStateProperties>) {
    this.activeFlight = flight;
  }

  resetActiveFlight() {
    this.activeFlight = null;
  }

  updateActiveFlight(geojson: FeatureCollection<Point, FlightStateProperties>) {
    const currentFlight = this.activeFlight;
    if (geojson.features.length > 0 && currentFlight) {
      const active = geojson.features.find(
        (feature) => feature.properties.icao === currentFlight.properties.icao
      );

      if (active) this.activeFlight = active;
    }
  }

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => HistoricalStore.source(AppDataSources.OPEN_SKY_NETWORK).geojson,
      (geojson) => {
        if (geojson) {
          this.updateActiveFlight(geojson as FeatureCollection<Point, FlightStateProperties>);
        }
      }
    );
  }
}

export default new FlightsStore();
