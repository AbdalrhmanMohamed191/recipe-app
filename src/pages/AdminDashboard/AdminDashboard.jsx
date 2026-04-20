import React, { useEffect, useState } from "react";
import api from "../../api/api";
// import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    recipes: 0,
    orders: 0,
    totalRevenue: 0,
    deliveryRevenue: 0,
  });

  const [loading, setLoading] = useState(true);

  // =====================
  // FETCH STATS
  // =====================
  const fetchStats = async () => {
    try {
      const res = await api.get(
        "/api/v1/admin/stats",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          
        },
      );

      setStats(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);


  // LOADING
  if (loading)
    return <h4 className="text-center mt-5">Loading dashboard...</h4>;

 
  // UI 
  return (
    <div className="container py-5 mt-5">

      <h2 className="mb-4">📊 Admin Dashboard</h2>

      <div className="row g-3">

        {/* USERS */}
        <div className="col-md-3">
          <div className="card bg-dark text-white text-center p-3">
            <h5>Users</h5>
            <h3>{stats.users}</h3>
          </div>
        </div>

        {/* RECIPES */}
        <div className="col-md-3">
          <div className="card bg-dark text-white text-center p-3">
            <h5>Recipes</h5>
            <h3>{stats.recipes}</h3>
          </div>
        </div>

        {/* ORDERS */}
        <div className="col-md-3">
          <div className="card bg-dark text-white text-center p-3">
            <h5>Orders</h5>
            <h3>{stats.orders}</h3>
          </div>
        </div>

        {/* TOTAL REVENUE */}
        <div className="col-md-3">
          <div className="card bg-success text-white text-center p-3">
            <h5>Total Revenue</h5>
            <h3>{stats.revenue} EGP</h3>
          </div>
        </div>

        {/* DELIVERY REVENUE */}
        <div className="col-md-3">
          <div className="card bg-primary text-white text-center p-3">
            <h5>Delivery Fees</h5>
            <h3>{stats.deliveryFee} EGP</h3>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;