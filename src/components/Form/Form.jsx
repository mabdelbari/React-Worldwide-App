// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUrlPosition from "../../hooks/useUrlPosition";
import { convertToEmoji, flagemojiToPNG } from "../../utils";
import DatePicker from "react-datepicker";

import Button from "../Button/Button";
import Message from "../Message/Message";
import Spinner from "../Spinner/Spinner";

import "react-datepicker/dist/react-datepicker.css";
import styles from "./Form.module.css";
import { useCities } from "../../hooks/useCities";

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const navigate = useNavigate();

  const { addCity, isLoading } = useCities();

  const [mapLat, mapLng] = useUrlPosition();

  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [emoji, setEmoji] = useState("");

  const [isGeocodingLoading, setIsGeocodingLoading] = useState(false);
  const [geocodingError, setGeocodingError] = useState("");

  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");

  async function getCityData(lat, lng) {
    try {
      setIsGeocodingLoading(true);

      const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);

      if (!res.ok) throw new Error("Something went wrong");

      const data = await res.json();

      if (!data.countryCode)
        throw new Error(
          "That doesn't seem to be a city. Click somewhere else 😉"
        );

      setCountry(data.countryName);
      setCityName(data.city || data.locality || "");
      setEmoji(flagemojiToPNG(convertToEmoji(data.countryCode)));
      setGeocodingError("");
    } catch (err) {
      setGeocodingError(err.message);
    } finally {
      setIsGeocodingLoading(false);
    }
  }

  useEffect(() => {
    if (!mapLat && !mapLng) return;
    getCityData(mapLat, mapLng);
  }, [mapLat, mapLng]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      emoji: convertToEmoji(emoji.props.src.substr(-6, 2)),
      date,
      notes,
      position: {
        lat: mapLat,
        lng: mapLng,
      },
    };

    await addCity(newCity);

    navigate("/app/cities");
  }

  if (isGeocodingLoading) return <Spinner />;

  if (!mapLat && !mapLng)
    return <Message message={"Start by clicking somewhere on the map"} />;

  if (geocodingError) return <Message message={geocodingError} />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat={"dd/MM/yyyy"}
          // showIcon
          // toggleCalendarOnIconClick
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <Button
          type="back"
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
        >
          &larr; Back
        </Button>
      </div>
    </form>
  );
}

export default Form;
