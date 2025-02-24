import styles from "./ThemeSelector.module.css";

const ThemeSelector = ({ theme, onUpdate }) => {
  const themes = [
    { id: "light", name: "Light Theme" },
    { id: "dark", name: "Dark Theme" },
    { id: "custom", name: "Custom Theme" },
  ];

  return (
    <div className={styles.section}>
      <h2>Theme</h2>
      <div className={styles.themeGrid}>
        {themes.map((t) => (
          <div
            key={t.id}
            className={`${styles.themeCard} ${
              theme === t.id ? styles.selected : ""
            }`}
            onClick={() => onUpdate(t.id)}
          >
            <div className={styles.themePreview} data-theme={t.id} />
            <span>{t.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
