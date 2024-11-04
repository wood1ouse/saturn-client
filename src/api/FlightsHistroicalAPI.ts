import axios from 'axios';
import { FeatureCollection, Point } from 'geojson';
import { FlightStateProperties } from '../models/api';

const FLIGHTS_HISTORICAL_SERVICE_ADDR = 'http://localhost:3003';

export class FlightsHistoricalAPI {
  static async getTimestamps(): Promise<number[]> {
    const result = await axios.get<number[]>(`${FLIGHTS_HISTORICAL_SERVICE_ADDR}/timestamps`);

    return result.data;
  }

  static async getFlightPositionsForTime(
    timestamp: number
  ): Promise<FeatureCollection<Point, FlightStateProperties>> {
    const result = await axios.get<FeatureCollection<Point, FlightStateProperties>>(
      `${FLIGHTS_HISTORICAL_SERVICE_ADDR}/locationsByTime`,
      {
        params: {
          timestamp
        }
      }
    );

    return result.data;
  }
}
