import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./DashboardNav.module.css";

const DashboardNav = () => {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/">LinkTree</Link>
        </div>
        <div className={styles.nav}>
          <Link
            to="/dashboard"
            className={location.pathname === "/dashboard" ? styles.active : ""}
          >
            Dashboard
          </Link>
          <Link
            to="/analytics"
            className={location.pathname === "/analytics" ? styles.active : ""}
          >
            Analytics
          </Link>
          <Link
            to="/appearance"
            className={location.pathname === "/appearance" ? styles.active : ""}
          >
            Appearance
          </Link>
          <Link
            to="/settings"
            className={location.pathname === "/settings" ? styles.active : ""}
          >
            Settings
          </Link>
          <button onClick={logout} className={styles.logout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNav;
