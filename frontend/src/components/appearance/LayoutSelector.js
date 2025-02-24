import styles from "./LayoutSelector.module.css";

const LayoutSelector = ({ layout, onUpdate }) => {
  const layouts = [
    {
      id: "list",
      name: "List View",
      description: "Traditional list layout with full-width buttons",
    },
    {
      id: "grid",
      name: "Grid View",
      description: "Grid layout with cards for each link",
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "Clean, minimalist design with subtle animations",
    },
  ];

  return (
    <div className={styles.section}>
      <h2>Layout</h2>
      <div className={styles.layoutGrid}>
        {layouts.map((l) => (
          <div
            key={l.id}
            className={`${styles.layoutCard} ${
              layout === l.id ? styles.selected : ""
            }`}
            onClick={() => onUpdate(l.id)}
          >
            <div className={styles.layoutPreview} data-layout={l.id} />
            <div className={styles.layoutInfo}>
              <h3>{l.name}</h3>
              <p>{l.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayoutSelector;
