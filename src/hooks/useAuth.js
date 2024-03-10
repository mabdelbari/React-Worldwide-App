import { useContext } from "react";
import { AuthContext } from "../contexts/FakeAuthContext";

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
