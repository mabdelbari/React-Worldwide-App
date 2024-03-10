import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import CitiesContextProvider from "./contexts/CitiesContext.jsx";
import AuthContextProvider from "./contexts/FakeAuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <CitiesContextProvider>
        <App />
      </CitiesContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
