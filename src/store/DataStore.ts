import { makeAutoObservable } from 'mobx';
import { DataSourcesState } from '../models/state.ts';
import { AppDataSources } from '../models/api.ts';
import { ReadyState } from 'react-use-websocket';

class DataStore {
  dataSources: DataSourcesState = {
    [AppDataSources.OPEN_SKY_NETWORK]: {
      enabled: false,
      connection: ReadyState.UNINSTANTIATED
    },
    [AppDataSources.OPEN_WEATHER]: {
      enabled: false,
      connection: ReadyState.UNINSTANTIATED
    }
  };

  get isDataSourceEnabled(): (source: AppDataSources) => boolean {
    return (source) => {
      if (!this.dataSources) return false;

      return this.dataSources[source].enabled;
    };
  }

  get dataSourceConnectionState(): (source: AppDataSources) => ReadyState {
    return (source) => {
      if (!this.dataSources) return ReadyState.CLOSED;

      const datasource = this.dataSources[source];

      return datasource.connection;
    };
  }

  toggleDataSource(source: AppDataSources) {
    if (!this.dataSources) return;

    this.dataSources[source].enabled = !this.dataSources[source].enabled;
  }

  setSocketConnectionState(source: AppDataSources, state: ReadyState) {
    if (!this.dataSources) return;

    this.dataSources[source].connection = state;
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new DataStore();
