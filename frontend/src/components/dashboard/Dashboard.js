import { FaUser } from "react-icons/fa";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import ProfileSection from "./ProfileSection";
import LinkManager from "./LinkManager";
import Preview from "./Preview";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const { user, fetchUserProfile } = useAuth();
  const [profile, setProfile] = useState({
    profileImage: "",
    bannerImage: "",
    socialLinks: {
      instagram: "",
      twitter: "",
      facebook: "",
      linkedin: "",
      github: "",
    },
  });
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        if (!user) {
          await fetchUserProfile();
        }
        await Promise.all([fetchProfile(), fetchLinks()]);
      } catch (error) {
        console.error("Dashboard initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [user, fetchUserProfile]);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/profile");
      setProfile(response.data);
    } catch (error) {
      toast.error("Failed to load profile data");
    }
  };

  const fetchLinks = async () => {
    try {
      const response = await api.get("/links");
      setLinks(response.data);
    } catch (error) {
      toast.error("Failed to load links");
    }
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        <div className={styles.mainContent}>
          <div className={styles.leftPanel}>
            <ProfileSection profile={profile} onUpdate={handleProfileUpdate} />
            <LinkManager links={links} setLinks={setLinks} />
          </div>
          <div className={styles.rightPanel}>
            <Preview profile={profile} links={links} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
