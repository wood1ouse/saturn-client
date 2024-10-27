import "mapbox-gl/dist/mapbox-gl.css";

import Map from "react-map-gl";
import { CssBaseline } from "@mui/material";
import { FlightsLayer } from "./app/layers";

function App() {
	return (
		<>
			<CssBaseline />
			<Map
				mapboxAccessToken='pk.eyJ1Ijoid29vZGxvdXNlIiwiYSI6ImNsbzF5eXVhMzB1YnMya3A3NXQyZDRiOHIifQ.pxl9r8lSBJGi-OUu5dWVoQ'
				initialViewState={{
					longitude: -77.4144,
					latitude: 25.0759,
					zoom: 14,
				}}
				style={{ width: "100vw", height: "100vh" }}
				mapStyle='mapbox://styles/mapbox/dark-v11'
				projection={"globe" as never}
				onLoad={({ target: map }) => {
					map?.loadImage("../../../assets/aircraft.svg", (error, image) => {
						if (error || !image) return;
						map.addImage("aircraft", image);
					});
				}}
			>
				<FlightsLayer />
			</Map>
		</>
	);
}

export default App;
