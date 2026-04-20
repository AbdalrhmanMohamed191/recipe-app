import React, { useEffect, useState } from "react";
import api from "../../api/api";
// import axios from "axios";

const AdminHome = () => {
  const [stats, setStats] = useState(null);


  const fetchStats = async () => {
    try {
      const res = await api.get(
        "/api/v1/admin/stats",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStats();

    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!stats)
    return (
      <div style={{ color: "#fff", textAlign: "center", marginTop: "100px" }}>
        Loading dashboard...
      </div>
    );

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>📊 Admin Dashboard</h1>

      <div style={styles.grid}>
        <Card title="Users" value={stats.users} color="#4f46e5" />
        <Card title="Recipes" value={stats.recipes} color="#0ea5e9" />
        <Card title="Orders" value={stats.orders} color="#f59e0b" />
        <Card
          title="Revenue"
          value={`${stats.revenue} EGP`}
          color="#22c55e"
          big
        />
      </div>
    </div>
  );
};

const Card = ({ title, value, color, big }) => {
  return (
    <div
      style={{
        ...styles.card,
        borderLeft: `5px solid ${color}`,
      }}
    >
      <h4 style={styles.cardTitle}>{title}</h4>

      <h2
        style={{
          ...styles.value,
          color: big ? "#22c55e" : "#fff",
        }}
      >
        {value}
      </h2>

      <div
        style={{
          ...styles.bar,
          background: color,
        }}
      />
    </div>
  );
};

const styles = {
  page: {
    padding: "30px",
    color: "#fff",
    minHeight: "100vh",
    background: "#0f0f0f",
  },

  title: {
    marginBottom: "25px",
    fontSize: "28px",
    fontWeight: "bold",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "#1a1a1a",
    padding: "20px",
    borderRadius: "15px",
    position: "relative",
    transition: "0.3s",
    cursor: "pointer",
  },

  cardTitle: {
    fontSize: "16px",
    opacity: 0.7,
  },

  value: {
    fontSize: "28px",
    marginTop: "10px",
  },

  bar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: "4px",
    width: "100%",
    borderBottomLeftRadius: "15px",
    borderBottomRightRadius: "15px",
  },
};

export default AdminHome;