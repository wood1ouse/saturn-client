import { makeAutoObservable, reaction } from 'mobx';
import { AppDataSources } from '../models/api';
import { AnalysisState, FlightsAnalysisState } from '../models/state';
import FlightsStore from './FlightsStore';

class AnalysisStore {
  state: AnalysisState = {
    [AppDataSources.OPEN_SKY_NETWORK]: []
  };

  getSourceData: <Source extends keyof AnalysisState>(dataSource: Source) => AnalysisState[Source] =
    (dataSource) => {
      return this.state[dataSource];
    };

  addFlightsData(data: FlightsAnalysisState) {
    if (this.state) {
      this.state[AppDataSources.OPEN_SKY_NETWORK] = [
        ...this.state[AppDataSources.OPEN_SKY_NETWORK],
        data
      ].sort((a, b) => {
        if (a.time_position && b.time_position) {
          return a.time_position - b.time_position;
        }
        return 0;
      });
    }
  }

  resetFlightsData() {
    this.state[AppDataSources.OPEN_SKY_NETWORK] = [];
  }

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => FlightsStore.activeFlight,
      (flight) => {
        if (flight) {
          const { velocity, true_track, time_position, baro_altitude, vertical_rate } =
            flight.properties;
          this.addFlightsData({
            velocity,
            true_track,
            time_position,
            baro_altitude,
            vertical_rate
          });
        }
      }
    );
  }
}

export default new AnalysisStore();
