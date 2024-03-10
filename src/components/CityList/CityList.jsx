import Spinner from "../Spinner/Spinner";
import CityItem from "../CityItem/CityItem";
import styles from "./CityList.module.css";
import Message from "../Message/Message";
import { useCities } from "../../hooks/useCities";

export default function CityList() {
  const { cities, isLoading, error } = useCities();

  if (isLoading) return <Spinner />;

  if (error) return <Message message={error} />;

  if (!cities.length)
    return (
      <Message
        message={"Add your first city by clicking on a city on the map"}
      />
    );

  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}
