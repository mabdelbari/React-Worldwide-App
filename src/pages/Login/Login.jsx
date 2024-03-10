import { useEffect, useState } from "react";
import PageNav from "../../components/PageNav/PageNav";
import styles from "./Login.module.css";
import Button from "../../components/Button/Button";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useCities } from "../../hooks/useCities";

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const { login, isAuth, authError, isAuthLoading } = useAuth();

  const { fetchCities } = useCities();

  const [email, setEmail] = useState("jack@example.com");
  const [password, setPassword] = useState("qwerty");

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    login(email, password);
  }

  useEffect(() => {
    if (isAuth) {
      navigate("/app", { replace: true });
      fetchCities();
    }
  }, [isAuth, navigate, fetchCities]);

  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form} onSubmit={handleSubmit}>
        {authError ? (
          <div className={styles.error}>
            <span className={styles.errorIcon}>&#33;</span>
            <span>{authError}</span>
          </div>
        ) : (
          ""
        )}

        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type={"primary"}>
            {isAuthLoading ? "Loading..." : "Login"}
          </Button>
        </div>
      </form>
    </main>
  );
}
