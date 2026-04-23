// import React, { useEffect, useState } from "react";
// import api from "../../api/api";

// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
// } from "recharts";

// const COLORS = ["#6366f1", "#0ea5e9", "#f59e0b", "#22c55e"];

// const AdminDashboard = () => {
//   const [stats, setStats] = useState(null);

//   const fetchStats = async () => {
//     try {
//       const res = await api.get("/api/v1/admin/stats", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       setStats(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   if (!stats)
//     return (
//       <div style={styles.loading}>
//         Loading dashboard...
//       </div>
//     );

//   const pieData = [
//     { name: "Users", value: stats.users },
//     { name: "Recipes", value: stats.recipes },
//     { name: "Orders", value: stats.orders },
//     { name: "Revenue", value: stats.revenue },
//   ];

//   return (
//     <div style={styles.page}>
//       <h1 style={styles.title}>📊 Admin Dashboard</h1>

//       {/* CARDS */}
//       <div style={styles.cards}>
//         <Card title="Users" value={stats.users} color="#6366f1" />
//         <Card title="Recipes" value={stats.recipes} color="#0ea5e9" />
//         <Card title="Orders" value={stats.orders} color="#f59e0b" />
//         <Card title="Revenue" value={`${stats.revenue} EGP`} color="#22c55e" />
//       </div>

//       {/* LINE CHART */}
//       <div style={styles.chartBox}>
//         <h3 style={styles.chartTitle}>Revenue & Orders Trend</h3>

//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={stats.chartData || []}>
//             <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />

//             <Line
//               type="monotone"
//               dataKey="orders"
//               stroke="#f59e0b"
//               strokeWidth={3}
//             />
//             <Line
//               type="monotone"
//               dataKey="revenue"
//               stroke="#22c55e"
//               strokeWidth={3}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>

//       <div style={styles.grid2}>
//         {/* BAR */}
//         <div style={styles.chartBox}>
//           <h3 style={styles.chartTitle}>Overview</h3>

//           <ResponsiveContainer width="100%" height={260}>
//             <BarChart data={pieData}>
//               <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />

//               <Bar dataKey="value">
//                 {pieData.map((_, i) => (
//                   <Cell key={i} fill={COLORS[i]} />
//                 ))}
//               </Bar>
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* PIE */}
//         <div style={styles.chartBox}>
//           <h3 style={styles.chartTitle}>Distribution</h3>

//           <ResponsiveContainer width="100%" height={260}>
//             <PieChart>
//               <Pie
//                 data={pieData}
//                 dataKey="value"
//                 outerRadius={90}
//                 label
//               >
//                 {pieData.map((_, i) => (
//                   <Cell key={i} fill={COLORS[i]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ================= CARD ================= */
// const Card = ({ title, value, color }) => (
//   <div style={{ ...styles.card, borderColor: color }}>
//     <div style={styles.cardGlow}></div>
//     <h4 style={styles.cardTitle}>{title}</h4>
//     <h2 style={styles.cardValue}>{value}</h2>
//   </div>
// );

// /* ================= STYLES ================= */
// const styles = {
//   page: {
//     padding: "30px",
//     minHeight: "100vh",
//     background: "linear-gradient(135deg,#0f0f0f,#111827)",
//     color: "#fff",
//   },

//   loading: {
//     textAlign: "center",
//     marginTop: "100px",
//     color: "#fff",
//     fontSize: "18px",
//   },

//   title: {
//     fontSize: "30px",
//     fontWeight: "700",
//     marginBottom: "25px",
//   },

//   cards: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//     gap: "20px",
//   },

//   card: {
//     position: "relative",
//     padding: "20px",
//     borderRadius: "15px",
//     background: "rgba(255,255,255,0.05)",
//     backdropFilter: "blur(10px)",
//     border: "1px solid rgba(255,255,255,0.1)",
//     transition: "0.3s",
//     overflow: "hidden",
//   },

//   cardGlow: {
//     position: "absolute",
//     top: "-50%",
//     left: "-50%",
//     width: "200%",
//     height: "200%",
//     background:
//       "radial-gradient(circle, rgba(255,255,255,0.1), transparent)",
//     transform: "rotate(25deg)",
//   },

//   cardTitle: {
//     opacity: 0.7,
//     fontSize: "14px",
//   },

//   cardValue: {
//     fontSize: "28px",
//     marginTop: "10px",
//   },

//   chartBox: {
//     marginTop: "25px",
//     background: "rgba(255,255,255,0.05)",
//     backdropFilter: "blur(10px)",
//     borderRadius: "15px",
//     padding: "20px",
//     border: "1px solid rgba(255,255,255,0.1)",
//   },

//   chartTitle: {
//     marginBottom: "10px",
//   },

//   grid2: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
//     gap: "20px",
//     marginTop: "20px",
//   },
// };

// export default AdminDashboard; 


import React, { useEffect, useState } from "react";
import api from "../../api/api";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#6366f1", "#0ea5e9", "#f59e0b", "#22c55e"];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await api.get("/api/v1/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (!stats)
    return (
      <div style={{ color: "#fff", textAlign: "center", marginTop: 100 }}>
        Loading dashboard...
      </div>
    );

  const pieData = [
    { name: "Users", value: stats.users },
    { name: "Recipes", value: stats.recipes },
    { name: "Orders", value: stats.orders },
    { name: "Revenue", value: stats.revenue },
  ];

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>📊 Admin Dashboard</h1>

      {/* CARDS */}
      <div style={styles.cards}>
        <Card title="Users" value={stats.users} color="#6366f1" />
        <Card title="Recipes" value={stats.recipes} color="#0ea5e9" />
        <Card title="Orders" value={stats.orders} color="#f59e0b" />
        <Card title="Revenue" value={`${stats.revenue} EGP`} color="#22c55e" />
      </div>

      {/* LINE CHART */}
      <div style={styles.chartBox}>
        <h3 style={styles.chartTitle}>Revenue & Orders Trend</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.chartData || []}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="orders"
              stroke="#f59e0b"
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#22c55e"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* BAR + PIE */}
      <div style={styles.grid2}>
        <div style={styles.chartBox}>
          <h3 style={styles.chartTitle}>Overview</h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={pieData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />

              <Bar dataKey="value">
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.chartBox}>
          <h3 style={styles.chartTitle}>Distribution</h3>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={90} label>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

/* ================= UI ================= */

const Card = ({ title, value, color }) => (
  <div style={{ ...styles.card, borderColor: color }}>
    <h4 style={styles.cardTitle}>{title}</h4>
    <h2 style={styles.cardValue}>{value}</h2>
  </div>
);

const styles = {
  page: {
    padding: 30,
    minHeight: "100vh",
    background: "linear-gradient(135deg,#0f0f0f,#111827)",
    color: "#fff",
  },
  title: { fontSize: 30, marginBottom: 25 },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
    gap: 20,
  },
  card: {
    padding: 20,
    borderRadius: 15,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  cardTitle: { opacity: 0.7 },
  cardValue: { fontSize: 26, marginTop: 10 },
  chartBox: {
    marginTop: 25,
    background: "rgba(255,255,255,0.05)",
    borderRadius: 15,
    padding: 20,
  },
  chartTitle: { marginBottom: 10 },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
    gap: 20,
    marginTop: 20,
  },
};

export default AdminDashboard;