import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../utils/api";
import ThemeSelector from "./ThemeSelector";
import ButtonCustomizer from "./ButtonCustomizer";
import LayoutSelector from "./LayoutSelector";
import BackgroundSettings from "./BackgroundSettings";
import styles from "./Appearance.module.css";

const Appearance = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get("/appearance");
      setSettings(response.data);
    } catch (error) {
      toast.error("Failed to load appearance settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedSettings) => {
    try {
      const response = await api.put("/appearance", {
        appearance: updatedSettings,
      });
      setSettings(response.data);
      toast.success("Appearance settings saved!");
    } catch (error) {
      toast.error("Failed to save appearance settings");
    }
  };

  const handleReset = async () => {
    try {
      const response = await api.post("/appearance/reset");
      setSettings(response.data);
      toast.success("Appearance settings reset to defaults");
    } catch (error) {
      toast.error("Failed to reset appearance settings");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.appearance}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Appearance</h1>
          <button onClick={handleReset} className={styles.resetButton}>
            Reset to Defaults
          </button>
        </div>

        <div className={styles.sections}>
          <ThemeSelector
            theme={settings.theme}
            onUpdate={(theme) => handleSave({ ...settings, theme })}
          />

          <ButtonCustomizer
            buttonStyle={settings.buttonStyle}
            onUpdate={(buttonStyle) => handleSave({ ...settings, buttonStyle })}
          />

          <LayoutSelector
            layout={settings.layout}
            onUpdate={(layout) => handleSave({ ...settings, layout })}
          />

          <BackgroundSettings
            backgroundColor={settings.backgroundColor}
            backgroundImage={settings.backgroundImage}
            onUpdate={(background) =>
              handleSave({ ...settings, ...background })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Appearance;
