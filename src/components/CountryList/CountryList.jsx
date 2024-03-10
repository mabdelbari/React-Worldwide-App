import { useCities } from "../../hooks/useCities";

import Spinner from "../Spinner/Spinner";
import Message from "../Message/Message";
import CountryItem from "../CountryItem/CountryItem";
import styles from "./CountryList.module.css";

export default function CountryList() {
  const { cities, isLoading, error } = useCities();

  if (isLoading) return <Spinner />;

  if (error) return <Message message={error} />;

  if (!cities.length)
    return (
      <Message
        message={"Add your first city by clicking on a city on the map"}
      />
    );

  const countries = cities.reduce(
    (arr, city) => {
      if (!arr.map((el) => el.country).includes(city.country))
        return [...arr, { country: city.country, emoji: city.emoji }];
      else return arr;
    },

    []
  );
  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.country} />
      ))}
    </ul>
  );
}
