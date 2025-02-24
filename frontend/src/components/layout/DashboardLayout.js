import DashboardNav from "./DashboardNav";
import styles from "./DashboardLayout.module.css";

const DashboardLayout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <DashboardNav />
      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default DashboardLayout;
