import { AppDataSources } from './../models/api';
import { makeAutoObservable } from 'mobx';
import { DrawerTabs } from '../models/ui';
import { AnalyisDialogState, ExpandedState } from '../models/state';
import { PaletteMode } from '@mui/material';

class UIStore {
  theme: PaletteMode = 'dark';

  isDrawerOpened = false;

  drawerTab: DrawerTabs = DrawerTabs.LAYERS;

  analysisDialogState: AnalyisDialogState = {
    open: false,
    source: null
  };

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

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
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

  openAnalysisDialog(source: AppDataSources) {
    this.analysisDialogState = {
      open: true,
      source
    };
  }

  closeAnalysisDialog() {
    this.analysisDialogState = {
      open: false,
      source: null
    };
  }
}

export default new UIStore();
