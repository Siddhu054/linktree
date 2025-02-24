import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./Settings.module.css";

const Settings = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });

  return (
    <div className={styles.settings}>
      <div className={styles.container}>
        <h1>Settings</h1>
        <div className={styles.section}>
          <h2>Profile Settings</h2>
          <form>
            <div className={styles.formGroup}>
              <label>Username</label>
              <input
                type="text"
                value={profile.username}
                onChange={(e) =>
                  setProfile({ ...profile, username: e.target.value })
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
              />
            </div>
            <button type="submit" className={styles.saveButton}>
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
