import { useState } from "react";
import styles from "./BackgroundSettings.module.css";

const BackgroundSettings = ({ backgroundColor, backgroundImage, onUpdate }) => {
  const [localSettings, setLocalSettings] = useState({
    backgroundColor,
    backgroundImage,
  });

  const handleColorChange = (color) => {
    setLocalSettings((prev) => ({ ...prev, backgroundColor: color }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you'd upload this to a server
      // For now, we'll just use a local URL
      const imageUrl = URL.createObjectURL(file);
      setLocalSettings((prev) => ({ ...prev, backgroundImage: imageUrl }));
    }
  };

  const handleSave = () => {
    onUpdate(localSettings);
  };

  const handleRemoveImage = () => {
    setLocalSettings((prev) => ({ ...prev, backgroundImage: "" }));
  };

  return (
    <div className={styles.section}>
      <h2>Background Settings</h2>

      <div className={styles.colorSection}>
        <h3>Background Color</h3>
        <div className={styles.colorPicker}>
          <input
            type="color"
            value={localSettings.backgroundColor}
            onChange={(e) => handleColorChange(e.target.value)}
          />
          <span>{localSettings.backgroundColor}</span>
        </div>
      </div>

      <div className={styles.imageSection}>
        <h3>Background Image</h3>
        <div className={styles.imageUpload}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            id="backgroundImage"
            className={styles.fileInput}
          />
          <label htmlFor="backgroundImage" className={styles.uploadButton}>
            Choose Image
          </label>
          {localSettings.backgroundImage && (
            <button onClick={handleRemoveImage} className={styles.removeButton}>
              Remove Image
            </button>
          )}
        </div>
        {localSettings.backgroundImage && (
          <div className={styles.imagePreview}>
            <img src={localSettings.backgroundImage} alt="Background preview" />
          </div>
        )}
      </div>

      <button onClick={handleSave} className={styles.saveButton}>
        Save Background Settings
      </button>
    </div>
  );
};

export default BackgroundSettings;
