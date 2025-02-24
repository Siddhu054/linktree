import { useState } from "react";
import { toast } from "react-toastify";
import {
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";
import api from "../../utils/api";
import styles from "./ProfileSection.module.css";

const ProfileSection = ({ profile, onUpdate }) => {
  const [formData, setFormData] = useState(profile);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await api.post(`/upload/${type}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.url) {
        setFormData((prev) => ({
          ...prev,
          [`${type}Image`]: response.data.url,
        }));
        toast.success(`${type} image uploaded successfully`);
        if (onUpdate) {
          onUpdate({
            ...formData,
            [`${type}Image`]: response.data.url,
          });
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error.response?.data?.message || `Failed to upload ${type} image`
      );
    }
  };

  const handleSocialLinkChange = (platform, value) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const response = await api.put("/profile", {
        socialLinks: formData.socialLinks,
      });

      if (onUpdate) {
        onUpdate(response.data);
      }

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.profileSection}>
      <h2>Profile Settings</h2>

      <div className={styles.imageUploads}>
        <div className={styles.bannerUpload}>
          <label>Banner Image</label>
          <div
            className={styles.bannerPreview}
            style={{ backgroundImage: `url(${formData.bannerImage})` }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "banner")}
            />
          </div>
        </div>

        <div className={styles.profileImageUpload}>
          <label>Profile Picture</label>
          <div
            className={styles.profileImagePreview}
            style={{ backgroundImage: `url(${formData.profileImage})` }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "profile")}
            />
          </div>
        </div>
      </div>

      <div className={styles.socialLinks}>
        <h3>Social Links</h3>
        <div className={styles.socialInputs}>
          <div className={styles.inputGroup}>
            <FaInstagram />
            <input
              type="url"
              placeholder="Instagram URL"
              value={formData.socialLinks.instagram}
              onChange={(e) =>
                handleSocialLinkChange("instagram", e.target.value)
              }
            />
          </div>
          <div className={styles.inputGroup}>
            <FaTwitter />
            <input
              type="url"
              placeholder="Twitter URL"
              value={formData.socialLinks.twitter}
              onChange={(e) =>
                handleSocialLinkChange("twitter", e.target.value)
              }
            />
          </div>
          {/* Add similar input groups for Facebook, LinkedIn, and GitHub */}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className={styles.saveButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default ProfileSection;
