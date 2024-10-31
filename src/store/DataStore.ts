import { makeAutoObservable } from 'mobx';
import { DataSourcesState } from '../models/state.ts';
import { AppDataSources } from '../models/api.ts';
import { ReadyState } from 'react-use-websocket';

class DataStore {
  dataSources: DataSourcesState = {
    [AppDataSources.OPEN_SKY_NETWORK]: {
      enabled: false,
      expanded: false,
      connection: ReadyState.CLOSED
    },
    [AppDataSources.OPEN_WEATHER]: {
      enabled: false,
      expanded: false,
      connection: ReadyState.CLOSED
    }
  };

  get isDataSourceEnabled(): (source: AppDataSources) => boolean {
    return (source) => {
      if (!this.dataSources) return false;

      const datasource = this.dataSources[source];

      return datasource.enabled;
    };
  }

  get isDataSourceExpanded(): (source: AppDataSources) => boolean {
    return (source) => {
      if (!this.dataSources) return false;

      const datasource = this.dataSources[source];

      return datasource.expanded;
    };
  }

  toggleDataSource(source: AppDataSources) {
    if (!this.dataSources) return;

    this.dataSources = {
      ...this.dataSources,
      [source]: {
        ...this.dataSources[source],
        enabled: !this.dataSources[source].enabled
      }
    };

    console.log(this.dataSources);
  }

  toggleExpandDataSource(source: AppDataSources) {
    if (!this.dataSources) return;

    this.dataSources = {
      ...this.dataSources,
      [source]: {
        ...this.dataSources[source],
        expanded: !this.dataSources[source].expanded
      }
    };

    console.log(this.dataSources);
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new DataStore();
