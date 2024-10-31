import { DrawerTabs } from '../models/ui';
import { assertNever } from '../utils/common';

export class UIService {
  static getTabLabel(tab: DrawerTabs): string {
    switch (tab) {
      case DrawerTabs.LAYERS:
        return 'Layers';
      case DrawerTabs.HISTORICAL:
        return 'Manage Historical Data';
      default:
        return assertNever(tab);
    }
  }
}
