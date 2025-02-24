import { useState, useEffect } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import api from "../../utils/api";
import styles from "./Analytics.module.css";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("7days");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get(`/analytics/data?range=${timeRange}`);
      setAnalyticsData(response.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading analytics...</div>;
  }

  return (
    <div className={styles.analytics}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1>Analytics Overview</h1>
          <p>Track your link performance and visitor insights</p>
        </div>
        <div className={styles.timeRangeSelector}>
          <button
            className={timeRange === "7days" ? styles.active : ""}
            onClick={() => setTimeRange("7days")}
          >
            7 Days
          </button>
          <button
            className={timeRange === "30days" ? styles.active : ""}
            onClick={() => setTimeRange("30days")}
          >
            30 Days
          </button>
          <button
            className={timeRange === "90days" ? styles.active : ""}
            onClick={() => setTimeRange("90days")}
          >
            90 Days
          </button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Views</h3>
          <p>{analyticsData?.totalViews || 0}</p>
          <span className={styles.statLabel}>Unique page views</span>
        </div>
        <div className={styles.statCard}>
          <h3>Total Clicks</h3>
          <p>{analyticsData?.totalClicks || 0}</p>
          <span className={styles.statLabel}>Link clicks</span>
        </div>
        <div className={styles.statCard}>
          <h3>Click Rate</h3>
          <p>{analyticsData?.clickRate || "0%"}</p>
          <span className={styles.statLabel}>Average CTR</span>
        </div>
        <div className={styles.statCard}>
          <h3>Unique Visitors</h3>
          <p>{analyticsData?.uniqueVisitors || 0}</p>
          <span className={styles.statLabel}>Total visitors</span>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3>Views Over Time</h3>
          <div className={styles.chartContainer}>
            <Line
              data={{
                labels: analyticsData?.viewsOverTime?.map((d) => d.date) || [],
                datasets: [
                  {
                    label: "Page Views",
                    data:
                      analyticsData?.viewsOverTime?.map((d) => d.count) || [],
                    borderColor: "#6366f1",
                    tension: 0.4,
                    fill: true,
                    backgroundColor: "rgba(99, 102, 241, 0.1)",
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: "rgba(0, 0, 0, 0.05)",
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3>Device Distribution</h3>
          <div className={styles.chartContainer}>
            <Doughnut
              data={{
                labels: ["Mobile", "Desktop", "Tablet"],
                datasets: [
                  {
                    data: [
                      analyticsData?.devices?.mobile || 0,
                      analyticsData?.devices?.desktop || 0,
                      analyticsData?.devices?.tablet || 0,
                    ],
                    backgroundColor: ["#6366f1", "#4f46e5", "#818cf8"],
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3>Top Countries</h3>
          <div className={styles.chartContainer}>
            <Bar
              data={{
                labels:
                  analyticsData?.topCountries?.map((c) => c.country) || [],
                datasets: [
                  {
                    label: "Visitors",
                    data:
                      analyticsData?.topCountries?.map((c) => c.count) || [],
                    backgroundColor: "#6366f1",
                  },
                ],
              }}
              options={{
                indexAxis: "y",
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
