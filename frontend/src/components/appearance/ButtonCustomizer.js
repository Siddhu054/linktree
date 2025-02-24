import { useState } from "react";
import styles from "./ButtonCustomizer.module.css";

const ButtonCustomizer = ({ buttonStyle, onUpdate }) => {
  const [localStyle, setLocalStyle] = useState(buttonStyle);

  const handleChange = (field, value) => {
    const updated = { ...localStyle, [field]: value };
    setLocalStyle(updated);
  };

  const handleSave = () => {
    onUpdate(localStyle);
  };

  const shapes = [
    { id: "rounded", name: "Rounded" },
    { id: "square", name: "Square" },
    { id: "pill", name: "Pill" },
  ];

  return (
    <div className={styles.section}>
      <h2>Button Style</h2>

      <div className={styles.shapeSelector}>
        <h3>Shape</h3>
        <div className={styles.shapes}>
          {shapes.map((shape) => (
            <button
              key={shape.id}
              className={`${styles.shapeButton} ${
                localStyle.shape === shape.id ? styles.selected : ""
              }`}
              onClick={() => handleChange("shape", shape.id)}
              data-shape={shape.id}
            >
              {shape.name}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.colorPickers}>
        <div className={styles.colorField}>
          <label>Button Color</label>
          <input
            type="color"
            value={localStyle.color}
            onChange={(e) => handleChange("color", e.target.value)}
          />
        </div>

        <div className={styles.colorField}>
          <label>Hover Color</label>
          <input
            type="color"
            value={localStyle.hoverColor}
            onChange={(e) => handleChange("hoverColor", e.target.value)}
          />
        </div>

        <div className={styles.colorField}>
          <label>Text Color</label>
          <input
            type="color"
            value={localStyle.textColor}
            onChange={(e) => handleChange("textColor", e.target.value)}
          />
        </div>
      </div>

      <button onClick={handleSave} className={styles.saveButton}>
        Save Button Style
      </button>

      <div className={styles.preview}>
        <h3>Preview</h3>
        <button
          className={styles.previewButton}
          style={{
            backgroundColor: localStyle.color,
            color: localStyle.textColor,
            borderRadius:
              localStyle.shape === "pill"
                ? "9999px"
                : localStyle.shape === "rounded"
                ? "8px"
                : "0",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = localStyle.hoverColor;
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = localStyle.color;
          }}
        >
          Preview Button
        </button>
      </div>
    </div>
  );
};

export default ButtonCustomizer;
