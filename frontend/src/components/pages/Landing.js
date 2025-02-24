import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Landing.module.css";

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className={styles.landing}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>One Link for Everything</h1>
          <p>Share all your content with just one link</p>
          {isAuthenticated ? (
            <Link to="/dashboard" className={styles.ctaButton}>
              Go to Dashboard
            </Link>
          ) : (
            <div className={styles.buttonGroup}>
              <Link to="/register" className={styles.ctaButton}>
                Get Started - It's Free
              </Link>
              <Link to="/login" className={styles.secondaryButton}>
                Login
              </Link>
            </div>
          )}
        </div>
      </div>

      <section className={styles.features}>
        <h2>Everything you need</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎨</div>
            <h3>Custom Design</h3>
            <p>Make your profile unique with custom themes and layouts</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📱</div>
            <h3>Mobile Optimized</h3>
            <p>Look great on every device, desktop or mobile</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📊</div>
            <h3>Analytics</h3>
            <p>Track views and clicks with detailed analytics</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔗</div>
            <h3>Link Management</h3>
            <p>Easily manage all your important links in one place</p>
          </div>
        </div>
      </section>

      <section className={styles.howItWorks}>
        <h2>How it works</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>Sign Up</h3>
            <p>Create your free account in seconds</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>Add Your Links</h3>
            <p>Add all your important links and content</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>Share</h3>
            <p>Share your unique link with your audience</p>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <h2>Ready to get started?</h2>
        <p>Join thousands of creators who are sharing their content</p>
        {!isAuthenticated && (
          <Link to="/register" className={styles.ctaButton}>
            Create Your Link Page
          </Link>
        )}
      </section>
    </div>
  );
};

export default Landing;
