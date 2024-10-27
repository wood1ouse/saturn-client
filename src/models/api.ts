import { Point } from "geojson";

import { FeatureCollection } from "geojson";

export interface FlightStateProperties {
	icao: string;
	callsign: string | null;
	origin_country: string;
	time_position: number | null;
	last_contact: number | null;
	baro_altitude: number | null;
	on_ground: boolean;
	velocity: number | null;
	true_track: number | null;
	vertical_rate: number | null;
	sensors: number[] | null;
	geo_altitude: number | null;
	squawk: string | null;
	spi: boolean;
	position_source: number;
	category: number;
}

export interface FlightsState {
	timestamp: number;
	geojson: FeatureCollection<Point, FlightStateProperties>;
}

export interface FlightsRawResponse extends Omit<FlightsState, "geojson"> {
	geojson: string;
}
