import { makeAutoObservable } from 'mobx';
import { DrawerTabs } from '../models/ui';

class FlightsStore {
  isDrawerOpened = false;

  drawerTab: DrawerTabs = DrawerTabs.LAYERS;

  constructor() {
    makeAutoObservable(this);
  }

  setIsDrawerOpened(value: boolean) {
    this.isDrawerOpened = value;
  }

  setDrawerTab(tab: DrawerTabs) {
    this.drawerTab = tab;
  }
}

export default new FlightsStore();
