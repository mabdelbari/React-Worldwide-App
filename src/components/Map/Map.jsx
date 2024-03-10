import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useCities } from "../../hooks/useCities";
import useGeolocation from "../../hooks/useGeolocation";
import useUrlPosition from "../../hooks/useUrlPosition";
import { flagemojiToPNG } from "../../utils";

import Button from "../Button/Button";

import styles from "./Map.module.css";
import User from "../User/User";

export default function Map() {
  const navigate = useNavigate();
  const { cities, dispatch } = useCities();

  const {
    position: geolocationPosition,
    isLoading: isPositionLoading,
    getPosition,
  } = useGeolocation({ lat: 40, lng: 0 });

  const [mapPosition, setMapPosition] = useState([
    geolocationPosition.lat,
    geolocationPosition.lng,
  ]);

  const [cityLat, cityLng] = useUrlPosition();

  function clearCurrentCity() {
    dispatch({ type: "currentCity/cleared" });
  }

  useEffect(() => {
    if (cityLat && cityLng) setMapPosition([cityLat, cityLng]);
  }, [cityLat, cityLng]);

  useEffect(() => {
    if (geolocationPosition)
      setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
  }, [geolocationPosition]);

  return (
    <div className={styles.mapContainer}>
      <User />

      <Button
        type={"position"}
        onClick={() => {
          getPosition();
          clearCurrentCity();
          navigate("cities");
        }}
      >
        {isPositionLoading ? "Loading..." : "locate my position"}
      </Button>

      <MapContainer
        center={mapPosition}
        zoom={7}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            key={city.id}
            position={[city.position.lat, city.position.lng]}
          >
            <Popup>
              {city.emoji && <span>{flagemojiToPNG(city.emoji)}</span>}
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}

        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();

  map.flyTo(position, 10);

  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}
