import { useState } from "react";
import styles from "./ProfilePreview.module.css";

const ProfilePreview = ({ user }) => {
  return (
    <div className={styles.preview}>
      <div className={styles.profileHeader}>
        {user.bannerImage && (
          <img
            src={user.bannerImage}
            alt="Profile Banner"
            className={styles.bannerImage}
          />
        )}
        <div className={styles.profileInfo}>
          {user.profileImage && (
            <img
              src={user.profileImage}
              alt="Profile"
              className={styles.profileImage}
            />
          )}
          <h1 className={styles.username}>{user.username}</h1>
        </div>
      </div>

      <div className={styles.socialLinks}>
        {user.socialLinks?.twitter && (
          <a
            href={user.socialLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            <div className={styles.socialCircle}></div>
            <span className={styles.socialName}>Twitter</span>
          </a>
        )}
        {user.socialLinks?.instagram && (
          <a
            href={user.socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            <div className={styles.socialCircle}></div>
            <span className={styles.socialName}>Instagram</span>
          </a>
        )}
        {user.socialLinks?.youtube && (
          <a
            href={user.socialLinks.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            <div className={styles.socialCircle}></div>
            <span className={styles.socialName}>YouTube</span>
          </a>
        )}
        {user.socialLinks?.github && (
          <a
            href={user.socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            <div className={styles.socialCircle}></div>
            <span className={styles.socialName}>GitHub</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default ProfilePreview;
