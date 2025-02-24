import { useState } from "react";
import styles from "./Links.module.css";

const Links = () => {
  const [links, setLinks] = useState([]);

  return (
    <div className={styles.links}>
      <div className={styles.container}>
        <h1>Manage Links</h1>
        <button className={styles.addButton}>Add New Link</button>
        <div className={styles.linksList}>
          {links.length === 0 ? (
            <p>No links added yet. Add your first link!</p>
          ) : (
            links.map((link) => (
              <div key={link._id} className={styles.linkItem}>
                {link.title}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Links;
