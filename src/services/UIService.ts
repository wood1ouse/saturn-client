import { ReadyState } from 'react-use-websocket';
import { ConnectionStateColors, DrawerTabs } from '../models/ui';
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

  static getConnectionStateColor(state: ReadyState): ConnectionStateColors {
    switch (state) {
      case ReadyState.UNINSTANTIATED:
      case ReadyState.CLOSING:
      case ReadyState.CLOSED:
        return 'error';

      case ReadyState.CONNECTING:
        return 'warning';
      case ReadyState.OPEN:
        return 'success';
      default:
        return assertNever(state);
    }
  }
}
