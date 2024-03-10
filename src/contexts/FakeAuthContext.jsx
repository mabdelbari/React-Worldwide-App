import { createContext, useReducer } from "react";

const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

const initialState = {
  user: null,
  isAuth: false,
  isAuthLoading: false,
  authError: "",
};

export const AuthContext = createContext();

function reducer(state, { type, payload }) {
  switch (type) {
    case "loading":
      return {
        ...state,
        isAuthLoading: true,
      };
    case "user/login":
      return {
        ...state,
        user: payload,
        isAuth: true,
        isAuthLoading: false,
        authError: "",
      };

    case "user/logout":
      return {
        ...state,
        user: null,
        isAuth: false,
        isAuthLoading: false,
        authError: "",
      };

    case "user/failed":
      return {
        ...state,
        authError: payload,
        isAuthLoading: false,
      };

    default:
      throw new Error("Uknown action");
  }
}

export default function AuthContextProvider({ children }) {
  const [{ user, isAuth, isAuthLoading, authError }, dispatch] = useReducer(
    reducer,
    initialState
  );

  function login(email, password) {
    dispatch({ type: "loading" });

    // Acting as sending a request to api and it takes some time

    if (email && password) {
      setTimeout(() => {
        if (email === FAKE_USER.email && password === FAKE_USER.password) {
          dispatch({ type: "user/login", payload: FAKE_USER });
        } else {
          dispatch({
            type: "user/failed",
            payload: "Incorrect email or password",
          });
        }
      }, 1000);
    } else {
      dispatch({
        type: "user/failed",
        payload: "Please fill out the empty field(s)",
      });
    }
  }

  function logout() {
    dispatch({ type: "user/logout" });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth,
        isAuthLoading,
        authError,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
