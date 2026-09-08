import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const RestaurantDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // =====================================================
  // TOKEN
  // =====================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =====================================================
  // FETCH DASHBOARD
  // =====================================================

  const fetchDashboard = async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const token = getToken();

      if (!token) {
        throw new Error("You are not logged in");
      }

      const res = await api.get(
        "/api/v1/restaurants/dashboard/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(res.data?.stats || null);
    } catch (err) {
      console.error(
        "RESTAURANT DASHBOARD ERROR:",
        err
      );

      alert(
        err?.response?.data?.message ||
          err.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =====================================================
  // LOAD
  // =====================================================

  useEffect(() => {
    fetchDashboard();
  }, []);

  // =====================================================
  // HELPERS
  // =====================================================

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString("en-EG");
  };

  const formatNumber = (value) => {
    return Number(value || 0).toLocaleString("en-EG");
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Pending";

      case "preparing":
        return "Preparing";

      case "delivered":
        return "Delivered";

      case "cancelled":
        return "Cancelled";

      default:
        return status || "Unknown";
    }
  };

  const formatDate = (date) => {
    if (!date) return "Unknown date";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "Unknown date";
    }

    return parsed.toLocaleString("en-EG", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // =====================================================
  // CHART DATA
  // =====================================================

  const chartData = useMemo(() => {
    if (!stats?.chartData) return [];

    return stats.chartData.map((item) => ({
      name: item.name,
      orders: Number(item.orders || 0),
      revenue: Number(item.revenue || 0),
    }));
  }, [stats]);

  // =====================================================
  // BEST SALES
  // =====================================================

  const bestSales = useMemo(() => {
    if (!stats?.bestSales) return [];

    return stats.bestSales.map((item, index) => ({
      ...item,
      rank: index + 1,
      title: item.title || "Unknown Product",
      totalQuantity: Number(item.totalQuantity || 0),
      totalRevenue: Number(item.totalRevenue || 0),
    }));
  }, [stats]);

  // =====================================================
  // RECENT ORDERS
  // =====================================================

  const recentOrders = stats?.recentOrders || [];

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="restaurant-dashboard-page">
        <div className="dashboard-loading">
          <div className="dashboard-spinner"></div>

          <h3>Loading your dashboard...</h3>

          <p>
            Getting your restaurant data ready
          </p>
        </div>

        <style>{dashboardCSS}</style>
      </div>
    );
  }

  // =====================================================
  // NO DATA
  // =====================================================

  if (!stats) {
    return (
      <div className="restaurant-dashboard-page">
        <div className="dashboard-error">
          <div className="error-icon">⚠️</div>

          <h2>Couldn't load dashboard</h2>

          <p>
            Something went wrong while loading
            your restaurant statistics.
          </p>

          <button
            type="button"
            onClick={() => fetchDashboard()}
          >
            🔄 Try Again
          </button>
        </div>

        <style>{dashboardCSS}</style>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="restaurant-dashboard-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="dashboard-top">
        <div className="dashboard-heading">

          <div className="heading-badge">
            Restaurant Overview
          </div>

          <h1>Dashboard</h1>

          <p>
            Monitor your restaurant performance,
            orders and revenue.
          </p>

        </div>

        <div className="dashboard-tools">

          <div className="today-box">
            <span>TODAY</span>

            <strong>
              {new Date().toLocaleDateString(
                "en-EG",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }
              )}
            </strong>
          </div>

          <button
            type="button"
            className="refresh-dashboard-btn"
            onClick={() => fetchDashboard(true)}
            disabled={refreshing}
          >
            {refreshing ? (
              <>
                <span className="mini-spinner"></span>
                Refreshing
              </>
            ) : (
              <>↻ Refresh</>
            )}
          </button>

        </div>
      </div>

      {/* =================================================
          MAIN KPI CARDS
      ================================================= */}

      <div className="dashboard-stats">

        {/* TOTAL ORDERS */}

        <div className="dashboard-stat-card">

          <div className="stat-card-top">

            <div className="stat-icon purple">
              🧾
            </div>

            <span className="stat-label">
              TOTAL ORDERS
            </span>

          </div>

          <div className="stat-number">
            {formatNumber(stats.totalOrders)}
          </div>

          <div className="stat-bottom">
            <span>
              All customer orders
            </span>
          </div>

        </div>

        {/* REVENUE */}

        <div className="dashboard-stat-card revenue">

          <div className="stat-card-top">

            <div className="stat-icon green">
              $
            </div>

            <span className="stat-label">
              TOTAL REVENUE
            </span>

          </div>

          <div className="stat-number">
            {formatMoney(stats.totalRevenue)}{" "}
            <small>EGP</small>
          </div>

          <div className="stat-bottom">
            <span className="positive">
              ● Delivered orders
            </span>
          </div>

        </div>

        {/* PENDING */}

        <div className="dashboard-stat-card pending">

          <div className="stat-card-top">

            <div className="stat-icon orange">
              !
            </div>

            <span className="stat-label">
              PENDING
            </span>

          </div>

          <div className="stat-number">
            {formatNumber(stats.pendingOrders)}
          </div>

          <div className="stat-bottom">
            <span className="warning-text">
              ● Needs attention
            </span>
          </div>

        </div>

        {/* PREPARING */}

        <div className="dashboard-stat-card preparing">

          <div className="stat-card-top">

            <div className="stat-icon blue">
              👨‍🍳
            </div>

            <span className="stat-label">
              PREPARING
            </span>

          </div>

          <div className="stat-number">
            {formatNumber(stats.preparingOrders)}
          </div>

          <div className="stat-bottom">
            <span className="blue-text">
              ● In kitchen
            </span>
          </div>

        </div>

      </div>

      {/* =================================================
          SECONDARY STATS
      ================================================= */}

      <div className="secondary-stats">

        <div className="mini-stat">

          <div className="mini-stat-icon">
            ✓
          </div>

          <div>
            <span>Delivered</span>

            <strong>
              {formatNumber(stats.deliveredOrders)}
            </strong>
          </div>

        </div>

        <div className="mini-stat">

          <div className="mini-stat-icon red">
            ×
          </div>

          <div>
            <span>Cancelled</span>

            <strong>
              {formatNumber(stats.cancelledOrders)}
            </strong>
          </div>

        </div>

        <div className="mini-stat">

          <div className="mini-stat-icon yellow">
            🍔
          </div>

          <div>
            <span>Menu Items</span>

            <strong>
              {formatNumber(stats.recipesCount)}
            </strong>
          </div>

        </div>

        <div className="mini-stat">

          <div className="mini-stat-icon cyan">
            %
          </div>

          <div>
            <span>Completion Rate</span>

            <strong>
              {stats.totalOrders > 0
                ? Math.round(
                    (stats.deliveredOrders /
                      stats.totalOrders) *
                      100
                  )
                : 0}
              %
            </strong>
          </div>

        </div>

      </div>

      {/* =================================================
          CHARTS
      ================================================= */}

      <div className="charts-grid">

        {/* REVENUE */}

        <div className="dashboard-panel large-panel">

          <div className="panel-header">

            <div>
              <h2>Revenue Overview</h2>

              <p>
                Revenue generated over the last
                7 days
              </p>
            </div>

            <div className="panel-indicator green-indicator">
              <span></span>
              Revenue
            </div>

          </div>

          <div className="chart-container">

            {chartData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <AreaChart data={chartData}>

                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#22c55e"
                        stopOpacity={0.35}
                      />

                      <stop
                        offset="100%"
                        stopColor="#22c55e"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#252525"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="name"
                    stroke="#666"
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    stroke="#666"
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "#181818",
                      border: "1px solid #333",
                      borderRadius: 10,
                      color: "#fff",
                    }}
                    formatter={(value) => [
                      `${formatMoney(value)} EGP`,
                      "Revenue",
                    ]}
                  />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#22c55e"
                    strokeWidth={3}
                    fill="url(#revenueGradient)"
                  />

                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-chart-data">
                No revenue data available
              </div>
            )}

          </div>
        </div>

        {/* ORDERS */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>
              <h2>Orders Activity</h2>

              <p>
                Orders during the last 7 days
              </p>
            </div>

            <div className="panel-indicator yellow-indicator">
              <span></span>
              Orders
            </div>

          </div>

          <div className="chart-container">

            {chartData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart data={chartData}>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#252525"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="name"
                    stroke="#666"
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    stroke="#666"
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "#181818",
                      border: "1px solid #333",
                      borderRadius: 10,
                      color: "#fff",
                    }}
                    formatter={(value) => [
                      value,
                      "Orders",
                    ]}
                  />

                  <Bar
                    dataKey="orders"
                    fill="#ffcc00"
                    radius={[5, 5, 0, 0]}
                  />

                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-chart-data">
                No order data available
              </div>
            )}

          </div>
        </div>

      </div>

      {/* =================================================
          BOTTOM AREA
      ================================================= */}

      <div className="bottom-grid">

        {/* RECENT ORDERS */}

        <div className="dashboard-panel recent-panel">

          <div className="panel-header">

            <div>
              <h2>Recent Orders</h2>

              <p>
                Latest orders from customers
              </p>
            </div>

            <span className="orders-count">
              {recentOrders.length}
            </span>

          </div>

          {recentOrders.length === 0 ? (

            <div className="empty-dashboard">

              <div>🧾</div>

              <h3>No orders yet</h3>

              <p>
                Customer orders will appear
                here.
              </p>

            </div>

          ) : (

            <div className="recent-orders-list">

              {recentOrders.map(
                (order, index) => (

                  <div
                    className="recent-order"
                    key={
                      order._id || index
                    }
                  >

                    <div className="order-main">

                      <div className="order-avatar">
                        {(
                          order.name ||
                          "C"
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>

                        <strong>
                          {order.name ||
                            "Customer"}
                        </strong>

                        <span>
                          #
                          {order._id
                            ?.slice(-6)
                            .toUpperCase()}
                        </span>

                      </div>

                    </div>

                    <div className="order-middle">

                      <strong>
                        {order.items?.length ||
                          0}{" "}
                        item
                        {(order.items?.length ||
                          0) !== 1
                          ? "s"
                          : ""}
                      </strong>

                      <span>
                        {formatDate(
                          order.createdAt
                        )}
                      </span>

                    </div>

                    <div className="order-right">

                      <strong>
                        {formatMoney(
                          order.totalPrice
                        )}{" "}
                        EGP
                      </strong>

                      <span
                        className={`status-badge ${order.status}`}
                      >
                        {getStatusLabel(
                          order.status
                        )}
                      </span>

                    </div>

                  </div>

                )
              )}

            </div>
          )}

        </div>

        {/* ORDER STATUS */}

        <div className="dashboard-panel status-panel">

          <div className="panel-header">

            <div>
              <h2>Order Status</h2>

              <p>
                Current order distribution
              </p>
            </div>
          </div>

          <div className="status-summary">

            <StatusRow
              title="Pending"
              value={stats.pendingOrders}
              total={stats.totalOrders}
              className="progress-orange"
            />

            <StatusRow
              title="Preparing"
              value={stats.preparingOrders}
              total={stats.totalOrders}
              className="progress-blue"
            />

            <StatusRow
              title="Delivered"
              value={stats.deliveredOrders}
              total={stats.totalOrders}
              className="progress-green"
            />

            <StatusRow
              title="Cancelled"
              value={stats.cancelledOrders}
              total={stats.totalOrders}
              className="progress-red"
            />

          </div>

          {/* COMPLETION */}

          <div className="completion-box">

            <div
              className="completion-circle"
              style={{
                background: `conic-gradient(
                  #22c55e ${
                    stats.totalOrders > 0
                      ? (stats.deliveredOrders /
                          stats.totalOrders) *
                        360
                      : 0
                  }deg,
                  #292929 ${
                    stats.totalOrders > 0
                      ? (stats.deliveredOrders /
                          stats.totalOrders) *
                        360
                      : 0
                  }deg
                )`,
              }}
            >

              <div>

                <strong>
                  {stats.totalOrders > 0
                    ? Math.round(
                        (stats.deliveredOrders /
                          stats.totalOrders) *
                          100
                      )
                    : 0}
                  %
                </strong>

                <span>
                  Complete
                </span>

              </div>

            </div>

            <div>

              <h3>
                Order completion
              </h3>

              <p>
                Percentage of all orders
                successfully delivered.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          BEST SELLING PRODUCTS
      ================================================= */}

      <div className="dashboard-panel best-sales-panel">

        <div className="panel-header">

          <div>
            <h2>Best Selling Products</h2>

            <p>
              Top 5 products based on delivered
              orders
            </p>
          </div>

          <div className="best-sales-badge">
            🏆 Top Sellers
          </div>

        </div>

        {bestSales.length === 0 ? (

          <div className="empty-best-sales">

            <div className="best-empty-icon">
              🍔
            </div>

            <h3>
              No sales data yet
            </h3>

            <p>
              Best selling products will appear
              after delivered orders are placed.
            </p>

          </div>

        ) : (

          <div className="best-sales-list">

            {bestSales.map((product) => (

              <div
                className="best-sale-item"
                key={
                  product._id ||
                  product.rank
                }
              >

                {/* RANK */}

                <div
                  className={`product-rank rank-${product.rank}`}
                >
                  {product.rank}
                </div>

                {/* PRODUCT ICON */}

                <div className="product-sales-icon">
                  🍔
                </div>

                {/* PRODUCT INFO */}

                <div className="best-product-info">

                  <strong>
                    {product.title}
                  </strong>

                  <span>
                    {formatNumber(
                      product.totalQuantity
                    )}{" "}
                    sold
                  </span>

                </div>

                {/* SALES BAR */}

                <div className="sales-bar-wrapper">

                  <div className="sales-bar">

                    <span
                      style={{
                        width: `${
                          bestSales[0]
                            ?.totalQuantity > 0
                            ? Math.min(
                                100,
                                (product.totalQuantity /
                                  bestSales[0]
                                    .totalQuantity) *
                                  100
                              )
                            : 0
                        }%`,
                      }}
                    ></span>

                  </div>

                </div>

                {/* REVENUE */}

                <div className="best-product-revenue">

                  <strong>
                    {formatMoney(
                      product.totalRevenue
                    )}{" "}
                    EGP
                  </strong>

                  <span>
                    Revenue
                  </span>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

      <style>{dashboardCSS}</style>

    </div>
  );
};

// =====================================================
// STATUS ROW
// =====================================================

const StatusRow = ({
  title,
  value,
  total,
  className,
}) => {

  const percentage =
    total > 0
      ? Math.min(
          100,
          (value / total) * 100
        )
      : 0;

  return (
    <div className="status-summary-item">

      <div className="summary-top">

        <span>{title}</span>

        <strong>{value}</strong>

      </div>

      <div className="progress">

        <span
          className={className}
          style={{
            width: `${percentage}%`,
          }}
        ></span>

      </div>

    </div>
  );
};

// =====================================================
// CSS
// =====================================================

const dashboardCSS = `

* {
  box-sizing: border-box;
}

.restaurant-dashboard-page {
  width: 100%;
  min-height: 100vh;
  padding: 28px 32px 50px;
  color: #ffffff;
  background:
    radial-gradient(
      circle at top right,
      rgba(255, 204, 0, 0.045),
      transparent 30%
    );
  overflow-x: hidden;
}

/* =====================================================
   LOADING
===================================================== */

.dashboard-loading {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.dashboard-spinner {
  width: 45px;
  height: 45px;
  border: 4px solid #252525;
  border-top-color: #ffcc00;
  border-radius: 50%;
  animation: dashboardSpin 0.8s linear infinite;
  margin-bottom: 18px;
}

.dashboard-loading h3 {
  margin: 0 0 7px;
}

.dashboard-loading p {
  margin: 0;
  color: #777;
}

@keyframes dashboardSpin {
  to {
    transform: rotate(360deg);
  }
}

/* =====================================================
   ERROR
===================================================== */

.dashboard-error {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.error-icon {
  font-size: 55px;
  margin-bottom: 10px;
}

.dashboard-error h2 {
  margin: 0 0 8px;
}

.dashboard-error p {
  color: #777;
  margin: 0 0 20px;
}

.dashboard-error button {
  border: none;
  background: #ffcc00;
  color: #111;
  padding: 11px 20px;
  border-radius: 9px;
  font-weight: 700;
  cursor: pointer;
}

/* =====================================================
   HEADER
===================================================== */

.dashboard-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 30px;
  margin-bottom: 30px;
}

.heading-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  margin-bottom: 10px;
  border: 1px solid rgba(255, 204, 0, 0.2);
  border-radius: 20px;
  background: rgba(255, 204, 0, 0.07);
  color: #ffcc00;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.dashboard-heading h1 {
  margin: 0;
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -1px;
}

.dashboard-heading p {
  margin: 7px 0 0;
  color: #777;
  font-size: 14px;
}

.dashboard-tools {
  display: flex;
  align-items: center;
  gap: 10px;
}

.today-box {
  display: flex;
  flex-direction: column;
  padding: 9px 14px;
  min-width: 130px;
  border: 1px solid #292929;
  border-radius: 10px;
  background: #151515;
}

.today-box span {
  color: #666;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1px;
}

.today-box strong {
  margin-top: 3px;
  font-size: 12px;
}

.refresh-dashboard-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 105px;
  border: 1px solid rgba(255, 204, 0, 0.35);
  background: rgba(255, 204, 0, 0.08);
  color: #ffcc00;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  transition: 0.2s;
}

.refresh-dashboard-btn:hover {
  background: rgba(255, 204, 0, 0.14);
  transform: translateY(-1px);
}

.refresh-dashboard-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.mini-spinner {
  width: 13px;
  height: 13px;
  border: 2px solid rgba(255,255,255,0.2);
  border-top-color: #ffcc00;
  border-radius: 50%;
  animation: dashboardSpin 0.7s linear infinite;
}

/* =====================================================
   KPI
===================================================== */

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 15px;
  margin-bottom: 15px;
}

.dashboard-stat-card {
  position: relative;
  min-width: 0;
  padding: 19px;
  background: linear-gradient(145deg, #181818, #121212);
  border: 1px solid #292929;
  border-radius: 14px;
  overflow: hidden;
  transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
}

.dashboard-stat-card::after {
  content: "";
  position: absolute;
  width: 100px;
  height: 100px;
  right: -50px;
  bottom: -50px;
  border-radius: 50%;
  background: rgba(255,255,255,0.02);
}

.dashboard-stat-card:hover {
  transform: translateY(-3px);
  border-color: #3a3a3a;
  box-shadow: 0 12px 30px rgba(0,0,0,0.2);
}

.dashboard-stat-card.revenue {
  border-color: rgba(34,197,94,0.2);
}

.dashboard-stat-card.pending {
  border-color: rgba(245,158,11,0.2);
}

.dashboard-stat-card.preparing {
  border-color: rgba(14,165,233,0.2);
}

.stat-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.stat-icon {
  width: 39px;
  height: 39px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 17px;
  font-weight: 800;
}

.stat-icon.purple {
  background: rgba(139,92,246,0.12);
  color: #8b5cf6;
}

.stat-icon.green {
  background: rgba(34,197,94,0.12);
  color: #22c55e;
}

.stat-icon.orange {
  background: rgba(245,158,11,0.12);
  color: #f59e0b;
}

.stat-icon.blue {
  background: rgba(14,165,233,0.12);
  color: #0ea5e9;
}

.stat-label {
  color: #666;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.8px;
}

.stat-number {
  margin-top: 17px;
  font-size: 27px;
  line-height: 1;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.stat-number small {
  color: #666;
  font-size: 11px;
  font-weight: 600;
}

.stat-bottom {
  margin-top: 13px;
  color: #666;
  font-size: 10px;
}

.positive {
  color: #22c55e;
}

.warning-text {
  color: #f59e0b;
}

.blue-text {
  color: #0ea5e9;
}

/* =====================================================
   SECONDARY
===================================================== */

.secondary-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 15px;
  margin-bottom: 22px;
}

.mini-stat {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: #151515;
  border: 1px solid #292929;
  border-radius: 12px;
}

.mini-stat-icon {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  background: rgba(34,197,94,0.1);
  color: #22c55e;
  font-weight: 800;
}

.mini-stat-icon.red {
  background: rgba(231,76,60,0.1);
  color: #e74c3c;
}

.mini-stat-icon.yellow {
  background: rgba(255,204,0,0.1);
  color: #ffcc00;
}

.mini-stat-icon.cyan {
  background: rgba(14,165,233,0.1);
  color: #0ea5e9;
}

.mini-stat span {
  display: block;
  color: #666;
  font-size: 10px;
}

.mini-stat strong {
  display: block;
  margin-top: 3px;
  font-size: 17px;
}

/* =====================================================
   PANELS
===================================================== */

.dashboard-panel {
  min-width: 0;
  background: linear-gradient(145deg, #181818, #131313);
  border: 1px solid #292929;
  border-radius: 15px;
  padding: 20px;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 18px;
}

.panel-header h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
}

.panel-header p {
  margin: 5px 0 0;
  color: #666;
  font-size: 11px;
}

.panel-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #777;
  font-size: 10px;
}

.panel-indicator span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.green-indicator span {
  background: #22c55e;
}

.yellow-indicator span {
  background: #ffcc00;
}

/* =====================================================
   CHARTS
===================================================== */

.charts-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr);
  gap: 15px;
  margin-bottom: 15px;
}

.chart-container {
  width: 100%;
  height: 285px;
}

.no-chart-data {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  font-size: 13px;
}

/* =====================================================
   BOTTOM
===================================================== */

.bottom-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr);
  gap: 15px;
  margin-bottom: 15px;
}

.orders-count {
  min-width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(255,204,0,0.1);
  color: #ffcc00;
  font-size: 11px;
  font-weight: 700;
}

/* =====================================================
   RECENT ORDERS
===================================================== */

.recent-orders-list {
  display: flex;
  flex-direction: column;
}

.recent-order {
  display: grid;
  grid-template-columns:
    minmax(180px, 1.5fr)
    minmax(100px, 1fr)
    minmax(130px, 0.8fr);
  align-items: center;
  gap: 15px;
  padding: 14px 0;
  border-top: 1px solid #242424;
}

.order-main {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.order-avatar {
  width: 35px;
  height: 35px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: linear-gradient(135deg, #292929, #202020);
  color: #ffcc00;
  font-size: 12px;
  font-weight: 800;
}

.order-main strong {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
}

.order-main span {
  display: block;
  margin-top: 3px;
  color: #555;
  font-size: 9px;
}

.order-middle strong {
  display: block;
  font-size: 11px;
}

.order-middle span {
  display: block;
  margin-top: 3px;
  color: #555;
  font-size: 9px;
}

.order-right {
  text-align: right;
}

.order-right strong {
  display: block;
  font-size: 12px;
}

.status-badge {
  display: inline-flex;
  margin-top: 5px;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 8px;
  font-weight: 700;
  text-transform: capitalize;
}

.status-badge.pending {
  background: rgba(245,158,11,0.12);
  color: #f59e0b;
}

.status-badge.preparing {
  background: rgba(14,165,233,0.12);
  color: #0ea5e9;
}

.status-badge.delivered {
  background: rgba(34,197,94,0.12);
  color: #22c55e;
}

.status-badge.cancelled {
  background: rgba(231,76,60,0.12);
  color: #e74c3c;
}

/* =====================================================
   EMPTY
===================================================== */

.empty-dashboard {
  min-height: 230px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.empty-dashboard > div {
  font-size: 40px;
  margin-bottom: 8px;
}

.empty-dashboard h3 {
  margin: 0 0 5px;
  font-size: 15px;
}

.empty-dashboard p {
  margin: 0;
  color: #666;
  font-size: 11px;
}

/* =====================================================
   STATUS
===================================================== */

.status-summary {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.status-summary-item {
  width: 100%;
}

.summary-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 7px;
}

.summary-top span {
  color: #888;
  font-size: 11px;
}

.summary-top strong {
  font-size: 11px;
}

.progress {
  width: 100%;
  height: 6px;
  overflow: hidden;
  border-radius: 20px;
  background: #242424;
}

.progress span {
  display: block;
  height: 100%;
  border-radius: 20px;
  transition: width 0.5s ease;
}

.progress-orange {
  background: #f59e0b;
}

.progress-blue {
  background: #0ea5e9;
}

.progress-green {
  background: #22c55e;
}

.progress-red {
  background: #e74c3c;
}

/* =====================================================
   COMPLETION
===================================================== */

.completion-box {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #292929;
}

.completion-circle {
  width: 78px;
  height: 78px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.completion-circle > div {
  width: 62px;
  height: 62px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #151515;
}

.completion-circle strong {
  font-size: 16px;
}

.completion-circle span {
  color: #666;
  font-size: 7px;
}

.completion-box h3 {
  margin: 0 0 5px;
  font-size: 12px;
}

.completion-box p {
  margin: 0;
  color: #666;
  font-size: 9px;
  line-height: 1.5;
}

/* =====================================================
   BEST SALES
===================================================== */

.best-sales-panel {
  margin-top: 15px;
}

.best-sales-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 11px;
  border: 1px solid rgba(255,204,0,0.2);
  border-radius: 20px;
  background: rgba(255,204,0,0.07);
  color: #ffcc00;
  font-size: 10px;
  font-weight: 700;
}

.best-sales-list {
  display: flex;
  flex-direction: column;
}

.best-sale-item {
  display: grid;
  grid-template-columns:
    35px
    42px
    minmax(160px, 1fr)
    minmax(120px, 1.3fr)
    minmax(120px, 0.8fr);

  align-items: center;

  gap: 15px;

  padding: 15px 0;

  border-top: 1px solid #242424;
}

.product-rank {
  width: 30px;
  height: 30px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 9px;

  background: #242424;

  color: #888;

  font-size: 12px;
  font-weight: 800;
}

.rank-1 {
  background: rgba(255,204,0,0.14);
  color: #ffcc00;
}

.rank-2 {
  background: rgba(192,192,192,0.1);
  color: #c0c0c0;
}

.rank-3 {
  background: rgba(205,127,50,0.1);
  color: #cd7f32;
}

.product-sales-icon {
  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 11px;

  background:
    linear-gradient(
      135deg,
      #242424,
      #1c1c1c
    );

  font-size: 19px;
}

.best-product-info {
  min-width: 0;
}

.best-product-info strong {
  display: block;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

  font-size: 12px;
}

.best-product-info span {
  display: block;

  margin-top: 4px;

  color: #666;

  font-size: 10px;
}

.sales-bar-wrapper {
  width: 100%;
}

.sales-bar {
  width: 100%;
  height: 7px;

  overflow: hidden;

  border-radius: 20px;

  background: #242424;
}

.sales-bar span {
  display: block;

  height: 100%;

  border-radius: 20px;

  background:
    linear-gradient(
      90deg,
      #ffcc00,
      #f59e0b
    );

  transition: width 0.5s ease;
}

.best-product-revenue {
  text-align: right;
}

.best-product-revenue strong {
  display: block;

  color: #22c55e;

  font-size: 12px;
}

.best-product-revenue span {
  display: block;

  margin-top: 4px;

  color: #555;

  font-size: 9px;
}

.empty-best-sales {
  min-height: 220px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  text-align: center;
}

.best-empty-icon {
  width: 60px;
  height: 60px;

  display: flex;

  align-items: center;
  justify-content: center;

  margin-bottom: 12px;

  border-radius: 16px;

  background:
    rgba(255,204,0,0.08);

  font-size: 28px;
}

.empty-best-sales h3 {
  margin: 0 0 6px;

  font-size: 15px;
}

.empty-best-sales p {
  max-width: 400px;

  margin: 0;

  color: #666;

  font-size: 11px;

  line-height: 1.6;
}

/* =====================================================
   RESPONSIVE
===================================================== */

@media (max-width: 1200px) {

  .dashboard-stats {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .secondary-stats {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .charts-grid,
  .bottom-grid {
    grid-template-columns: 1fr;
  }

}

@media (max-width: 900px) {

  .best-sale-item {
    grid-template-columns:
      35px
      42px
      minmax(150px, 1fr)
      minmax(100px, 1fr);
  }

  .sales-bar-wrapper {
    display: none;
  }

}

@media (max-width: 800px) {

  .restaurant-dashboard-page {
    padding: 20px 15px 40px;
  }

  .dashboard-top {
    align-items: flex-start;
    flex-direction: column;
    gap: 15px;
  }

  .dashboard-heading h1 {
    font-size: 28px;
  }

  .dashboard-tools {
    width: 100%;
  }

  .today-box {
    flex: 1;
  }

  .refresh-dashboard-btn {
    flex: 1;
  }

}

@media (max-width: 600px) {

  .dashboard-stats {
    grid-template-columns: 1fr;
  }

  .secondary-stats {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .dashboard-stat-card {
    padding: 17px;
  }

  .chart-container {
    height: 240px;
  }

  .dashboard-panel {
    padding: 16px;
  }

  .recent-order {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .order-right {
    text-align: left;
  }

  .order-right .status-badge {
    margin-top: 4px;
  }

  .best-sale-item {
    grid-template-columns:
      35px
      42px
      minmax(0, 1fr)
      auto;

    gap: 10px;
  }

  .best-product-revenue {
    text-align: right;
  }

}

@media (max-width: 400px) {

  .secondary-stats {
    grid-template-columns: 1fr;
  }

  .dashboard-tools {
    flex-direction: column;
  }

  .today-box,
  .refresh-dashboard-btn {
    width: 100%;
  }

  .best-sale-item {
    grid-template-columns:
      32px
      40px
      1fr;
  }

  .best-product-revenue {
    grid-column: 3;
    text-align: left;
  }

}

`;

export default RestaurantDashboard;