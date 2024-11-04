import { AppDataSources } from './../models/api';
import { makeAutoObservable } from 'mobx';
import { DrawerTabs } from '../models/ui';
import { ExpandedState } from '../models/state';

class UIStore {
  isDrawerOpened = false;

  drawerTab: DrawerTabs = DrawerTabs.LAYERS;

  layerSettingsExpanded: ExpandedState = {
    [AppDataSources.OPEN_SKY_NETWORK]: false,
    [AppDataSources.OPEN_WEATHER]: false
  };

  constructor() {
    makeAutoObservable(this);
  }

  get isDataSourceExpanded(): (source: AppDataSources) => boolean {
    return (source) => {
      return this.layerSettingsExpanded[source];
    };
  }

  toggleExpandDataSource(source: AppDataSources) {
    this.layerSettingsExpanded[source] = !this.layerSettingsExpanded[source];
  }

  setIsDrawerOpened(value: boolean) {
    this.isDrawerOpened = value;
  }

  setDrawerTab(tab: DrawerTabs) {
    this.drawerTab = tab;
  }
}

export default new UIStore();
