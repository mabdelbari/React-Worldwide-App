import { createContext, useCallback, useReducer } from "react";

// const BASE_URL = "http://localhost:9000";
const BASE_URL = "https://worldwide-server.vercel.app";

export const CitiesContext = createContext();

const initialState = {
  cities: [],
  currentCity: {},
  isLoading: false,
  error: "",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case "loading":
      return { ...state, isLoading: true };

    case "cities/loaded":
      return {
        ...state,
        cities: payload,
        isLoading: false,
        error: "",
      };

    case "city/loaded":
      return {
        ...state,
        currentCity: payload,
        isLoading: false,
        error: "",
      };

    case "city/added":
      return {
        ...state,
        cities: [...state.cities, payload],
        isLoading: false,
        error: "",
      };
    case "city/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== payload),
        isLoading: false,
        error: "",
      };

    case "currentCity/cleared":
      return {
        ...state,
        currentCity: {},
      };

    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: payload,
      };

    default:
      throw new Error("Unkown action");
  }
}

export default function CitiesContextProvider({ children }) {
  const [{ cities, currentCity, isLoading, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const fetchCities = useCallback(async () => {
    dispatch({ type: "loading" });

    try {
      const res = await fetch(`${BASE_URL}/cities`);

      if (!res.ok) throw new Error("Something went wrong with loading cities");

      const data = await res.json();

      dispatch({ type: "cities/loaded", payload: data });
    } catch (err) {
      dispatch({ type: "rejected", payload: err.message });
    }
  }, []);

  const getCity = useCallback(
    async (id) => {
      if (id === currentCity.id) return;

      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities/${id}`);

        if (!res.ok)
          throw new Error("Something went wrong with loading the city");

        const data = await res.json();

        dispatch({ type: "city/loaded", payload: data });
      } catch (err) {
        dispatch({ type: "rejected", payload: err.message });
      }
    },
    [currentCity.id]
  );

  async function addCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok)
        throw new Error("Something went wrong with adding this city");

      const data = await res.json();

      dispatch({ type: "city/added", payload: data });
    } catch (err) {
      dispatch({ type: "rejected", payload: err.message });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      if (!res.ok)
        throw new Error("Something Went Wrong with deleting this city");

      dispatch({ type: "city/deleted", payload: id });
    } catch (err) {
      dispatch({ type: "rejected", payload: err.message });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        error,
        fetchCities,
        currentCity,
        getCity,
        addCity,
        deleteCity,
        dispatch,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}
