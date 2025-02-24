import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../utils/api";
import styles from "./Appearance.module.css";

const THEMES = [
  { id: "light", name: "Light" },
  { id: "dark", name: "Dark" },
  { id: "custom", name: "Custom" },
];

const BUTTON_STYLES = [
  { id: "filled", name: "Filled" },
  { id: "outline", name: "Outline" },
  { id: "soft", name: "Soft" },
];

const BUTTON_SHAPES = [
  { id: "rounded", name: "Rounded" },
  { id: "square", name: "Square" },
  { id: "pill", name: "Pill" },
];

const LAYOUTS = [
  { id: "list", name: "List" },
  { id: "grid", name: "Grid" },
  { id: "minimal", name: "Minimal" },
];

const FONTS = [
  { id: "inter", name: "Inter" },
  { id: "roboto", name: "Roboto" },
  { id: "poppins", name: "Poppins" },
];

const DEFAULT_SETTINGS = {
  theme: "light",
  backgroundColor: "#ffffff",
  buttonStyle: "filled",
  buttonColor: "#6366f1",
  buttonHoverColor: "#4f46e5",
  textColor: "#ffffff",
  buttonShape: "rounded",
  layout: "list",
  backgroundImage: null,
};

const Appearance = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const response = await api.get("/appearance");
      if (response.data) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...response.data,
        });
      }
    } catch (error) {
      console.error("Failed to load appearance settings:", error);
      toast.error("Failed to load appearance settings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const applyTheme = (theme) => {
    if (!theme) return;

    document.documentElement.setAttribute("data-theme", theme);

    if (theme === "dark") {
      document.body.style.backgroundColor = "#1e293b";
    } else if (theme === "light") {
      document.body.style.backgroundColor = "#f8fafc";
    } else if (theme === "custom" && settings?.backgroundColor) {
      document.body.style.backgroundColor = settings.backgroundColor;
    }
  };

  const handleThemeSelect = (theme) => {
    setSettings((prev) => ({ ...prev, theme }));
    applyTheme(theme);
  };

  const handleButtonStyleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (type, color) => {
    setSettings((prev) => ({ ...prev, [type]: color }));
  };

  const handleLayoutSelect = (layout) => {
    setSettings((prev) => ({ ...prev, layout }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      try {
        const response = await api.post("/upload/background", formData);
        setSettings((prev) => ({
          ...prev,
          backgroundImage: response.data.url,
        }));
      } catch (error) {
        toast.error("Failed to upload image");
      }
    }
  };

  const handleSaveButtonStyle = async () => {
    try {
      setIsSubmitting(true);
      await api.put("/appearance", settings);
      toast.success("Button style updated successfully");
    } catch (error) {
      toast.error("Failed to update button style");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveBackgroundSettings = async () => {
    try {
      setIsSubmitting(true);
      await api.put("/appearance", settings);
      toast.success("Background settings updated successfully");
    } catch (error) {
      toast.error("Failed to update background settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = async () => {
    try {
      setIsSubmitting(true);
      setSettings(DEFAULT_SETTINGS);
      await api.put("/appearance", DEFAULT_SETTINGS);
      applyTheme("light");
      toast.success("Settings reset to defaults");
    } catch (error) {
      toast.error("Failed to reset settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isLoading && settings?.theme) {
      applyTheme(settings.theme);
    }
  }, [settings?.theme, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.appearance}>
      <div className={styles.header}>
        <h1>Appearance</h1>
        <button onClick={handleReset} className={styles.resetButton}>
          Reset to Defaults
        </button>
      </div>

      {/* Theme Selection */}
      <section>
        <h2>Theme</h2>
        <div className={styles.themeGrid}>
          <div
            className={`${styles.themeCard} ${
              settings.theme === "light" ? styles.selected : ""
            }`}
            onClick={() => handleThemeSelect("light")}
          >
            <div className={styles.themePreview} />
            <span>Light Theme</span>
          </div>
          <div
            className={`${styles.themeCard} ${
              settings.theme === "dark" ? styles.selected : ""
            }`}
            onClick={() => handleThemeSelect("dark")}
          >
            <div className={styles.themePreview} />
            <span>Dark Theme</span>
          </div>
          <div
            className={`${styles.themeCard} ${
              settings.theme === "custom" ? styles.selected : ""
            }`}
            onClick={() => handleThemeSelect("custom")}
          >
            <div className={styles.themePreview} />
            <span>Custom Theme</span>
          </div>
        </div>
      </section>

      {/* Button Style */}
      <section>
        <h2>Button Style</h2>
        <h3>Shape</h3>
        <div className={styles.buttonShapes}>
          <button
            className={
              settings.buttonShape === "rounded" ? styles.selected : ""
            }
            onClick={() =>
              handleButtonStyleChange({
                target: { name: "buttonShape", value: "rounded" },
              })
            }
          >
            Rounded
          </button>
          <button
            className={settings.buttonShape === "square" ? styles.selected : ""}
            onClick={() =>
              handleButtonStyleChange({
                target: { name: "buttonShape", value: "square" },
              })
            }
          >
            Square
          </button>
          <button
            className={settings.buttonShape === "pill" ? styles.selected : ""}
            onClick={() =>
              handleButtonStyleChange({
                target: { name: "buttonShape", value: "pill" },
              })
            }
          >
            Pill
          </button>
        </div>

        <div className={styles.colorSection}>
          <div>
            <h3>Button Color</h3>
            <input
              type="color"
              value={settings.buttonColor}
              onChange={(e) => handleColorChange("buttonColor", e.target.value)}
            />
          </div>
          <div>
            <h3>Hover Color</h3>
            <input
              type="color"
              value={settings.buttonHoverColor}
              onChange={(e) =>
                handleColorChange("buttonHoverColor", e.target.value)
              }
            />
          </div>
          <div>
            <h3>Text Color</h3>
            <input
              type="color"
              value={settings.textColor}
              onChange={(e) => handleColorChange("textColor", e.target.value)}
            />
          </div>
        </div>

        <div className={styles.preview}>
          <h3>Preview</h3>
          <button
            className={styles.previewButton}
            style={{
              backgroundColor: settings.buttonColor,
              color: settings.textColor,
              borderRadius:
                settings.buttonShape === "pill"
                  ? "9999px"
                  : settings.buttonShape === "rounded"
                  ? "8px"
                  : "0",
            }}
          >
            Preview Button
          </button>
        </div>

        <button
          className={styles.saveButton}
          onClick={handleSaveButtonStyle}
          disabled={isSubmitting}
        >
          Save Button Style
        </button>
      </section>

      {/* Layout Selection */}
      <section>
        <h2>Layout</h2>
        <div className={styles.layoutGrid}>
          <div
            className={`${styles.layoutCard} ${
              settings.layout === "list" ? styles.selected : ""
            }`}
            onClick={() => handleLayoutSelect("list")}
          >
            <div className={styles.layoutPreview} />
            <div>
              <h3>List View</h3>
              <p>Traditional list layout with full-width buttons</p>
            </div>
          </div>
          <div
            className={`${styles.layoutCard} ${
              settings.layout === "grid" ? styles.selected : ""
            }`}
            onClick={() => handleLayoutSelect("grid")}
          >
            <div className={styles.layoutPreview} />
            <div>
              <h3>Grid View</h3>
              <p>Grid layout with cards for each link</p>
            </div>
          </div>
          <div
            className={`${styles.layoutCard} ${
              settings.layout === "minimal" ? styles.selected : ""
            }`}
            onClick={() => handleLayoutSelect("minimal")}
          >
            <div className={styles.layoutPreview} />
            <div>
              <h3>Minimal</h3>
              <p>Clean, minimalist design with subtle animations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Background Settings */}
      <section>
        <h2>Background Settings</h2>
        <h3>Background Color</h3>
        <div className={styles.colorPicker}>
          <input
            type="color"
            value={settings.backgroundColor}
            onChange={(e) =>
              handleColorChange("backgroundColor", e.target.value)
            }
          />
          <span>{settings.backgroundColor}</span>
        </div>

        <h3>Background Image</h3>
        <div className={styles.imageUpload}>
          <button
            className={styles.uploadButton}
            onClick={() => document.getElementById("backgroundImage").click()}
          >
            Choose Image
          </button>
          <input
            id="backgroundImage"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
        </div>

        <button
          className={styles.saveButton}
          onClick={handleSaveBackgroundSettings}
          disabled={isSubmitting}
        >
          Save Background Settings
        </button>
      </section>
    </div>
  );
};

export default Appearance;
