import { AppDataSources } from '../models/api';
import { assertNever } from '../utils/common';

export class AnalysisService {
  static getDialogTitleBySource(source: AppDataSources): string {
    switch (source) {
      case AppDataSources.OPEN_SKY_NETWORK:
        return 'OpenSkyNetwork Data Analysis';
      case AppDataSources.OPEN_WEATHER:
        return 'OpenWeather API Data Analysis';
      default:
        return assertNever(source);
    }
  }
}
