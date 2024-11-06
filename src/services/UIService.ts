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
        case DrawerTabs.ANALYSIS:
          return 'Analysis Tool'
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

  static formatTableValue(value: string | number | boolean | null): string {
    if (typeof value === 'object') return 'N/A';
    if (typeof value === 'boolean') {
      return value === true ? 'Positive' : 'Negative';
    }
    return value.toString();
  }
}
