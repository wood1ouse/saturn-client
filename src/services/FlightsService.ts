import { FlightStateProperties } from '../models/api';
import { assertNever } from '../utils/common';

export class FlightsService {
  static getFlightsPropertiesTableLabel(property: keyof FlightStateProperties): string {
    switch (property) {
      case 'icao':
        return 'ICAO';
      case 'callsign':
        return 'Callsign';
      case 'origin_country':
        return 'Origin Country';
      case 'time_position':
        return 'Time of Position';
      case 'last_contact':
        return 'Last Contact';
      case 'baro_altitude':
        return 'Barometric Altitude';
      case 'on_ground':
        return 'On Ground';
      case 'velocity':
        return 'Velocity';
      case 'true_track':
        return 'True Track';
      case 'vertical_rate':
        return 'Vertical Rate';
      case 'sensors':
        return 'Sensors';
      case 'geo_altitude':
        return 'Geometric Altitude';
      case 'squawk':
        return 'Squawk';
      case 'spi':
        return 'SPI (Special Position Indicator)';
      case 'position_source':
        return 'Position Source';
      case 'category':
        return 'Category';
      default:
        return assertNever(property);
    }
  }
}
