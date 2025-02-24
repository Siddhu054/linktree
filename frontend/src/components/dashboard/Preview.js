import styles from "./Preview.module.css";

const Preview = ({ profile, links }) => {
  return (
    <div className={styles.preview}>
      <h2>Profile Preview</h2>
      <div className={styles.previewContainer}>
        <div
          className={styles.bannerImage}
          style={{ backgroundImage: `url(${profile.bannerImage})` }}
        />
        <div
          className={styles.profileImage}
          style={{ backgroundImage: `url(${profile.profileImage})` }}
        />

        <div className={styles.socialIcons}>
          {Object.entries(profile.socialLinks).map(([platform, url]) => {
            if (url) {
              return (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIcon}
                >
                  {/* Add social icons here */}
                </a>
              );
            }
            return null;
          })}
        </div>

        <div className={styles.linksList}>
          {links.map((link) => (
            <a
              key={link._id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.previewLink}
            >
              {link.title}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Preview;
