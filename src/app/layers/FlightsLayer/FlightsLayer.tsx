import React, { useEffect, useState } from "react";
import { Layer, Source, useMap } from "react-map-gl";
import useWebSocket, { ReadyState } from "react-use-websocket";
import {
	FlightsRawResponse,
	FlightsState,
	FlightStateProperties,
} from "../../../models/api";
import { FeatureCollection, Point } from "geojson";

const WS_URL = "ws://localhost:8080";

export const FlightsLayer: React.FC = () => {
    const { sendJsonMessage, lastJsonMessage, readyState } =
		useWebSocket<FlightsRawResponse>(WS_URL, {
			share: false,
			shouldReconnect: () => true,
		});

	const [flightsState, setFlightsState] = useState<FlightsState | null>(null);

    const { current: map } = useMap();

	useEffect(() => {
		if (map) {
			map.loadImage("/aircraft.png", (error, image) => {
				if (error) throw error;

				if (image && !map.hasImage("custom-icon")) {
					map.addImage("custom-icon", image);
				}
			});
		}
	}, [map]);

	// When WebSocket is open, send a subscribe message
	useEffect(() => {
		if (readyState === ReadyState.OPEN) {
			sendJsonMessage({
				event: "subscribe",
			});
		}
	}, [readyState]);

	// When a new WebSocket message is received, update flight data
	useEffect(() => {
		if (lastJsonMessage) {
			const geojson: FeatureCollection<Point, FlightStateProperties> =
				JSON.parse(lastJsonMessage.geojson);

			setFlightsState({
				timestamp: lastJsonMessage.timestamp,
				geojson,
			});
		}
	}, [lastJsonMessage]);

	return (
		flightsState &&
		flightsState.geojson && (
			<Source id='flight-data' type='geojson' data={flightsState.geojson}>
				<Layer
					id='points'
					type='symbol'
					layout={{
						"icon-image": "custom-icon",
						"icon-rotate": ["get", "true_track"],
						"icon-size": 0.5,
					}}
					paint={{
						"icon-color": "#ffffff",
					}}
				/>
			</Source>
		)
	);
};
