import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/api";

import {
  FaUsers,
  FaUtensils,
  FaShoppingBag,
  FaMoneyBillWave,
  FaStore,
  FaChartLine,
  FaCalendarDay,
  FaArrowUp,
  FaReceipt,
  FaSpinner,
} from "react-icons/fa";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// import { baseUrlHandler } from "../../utils/baseUrlHandler";


const AdminDashboard = () => {
  // =====================================================
  // STATES
  // =====================================================

  const [stats, setStats] = useState(null);

  const [restaurantStats, setRestaurantStats] = useState([]);

  const [restaurantTotalStats, setRestaurantTotalStats] =
    useState([]);

  const [loading, setLoading] = useState(true);

  const [restaurantLoading, setRestaurantLoading] =
    useState(true);

  const [restaurantTotalLoading, setRestaurantTotalLoading] =
    useState(true);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const baseUrlHandler = (image) => {
  if (!image) return "";

  // لو الصورة بالفعل URL كامل
  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  // لو راجعة من Mongo بالشكل:
  // /images/restaurant.jpg
  return `http://localhost:5000${image}`;
};

  // =====================================================
  // GET GENERAL ADMIN STATS
  // =====================================================

  const fetchStats = async () => {
    try {
      const response = await api.get(
        "/api/v1/admin/stats"
      );

      setStats(response.data);
    } catch (error) {
      console.error(
        "ADMIN STATS ERROR:",
        error
      );

      setStats({
        users: 0,
        recipes: 0,
        orders: 0,
        revenue: 0,
        chartData: [],
      });
    }
  };

  // =====================================================
  // GET RESTAURANT DAILY STATS
  // =====================================================

  const fetchRestaurantStats = async (
    date = selectedDate
  ) => {
    try {
      setRestaurantLoading(true);

      const response = await api.get(
        `/api/v1/admin/restaurants/daily-stats?date=${date}`
      );

      const data =
        Array.isArray(response.data)
          ? response.data
          : Array.isArray(
              response.data?.restaurants
            )
          ? response.data.restaurants
          : Array.isArray(response.data?.data)
          ? response.data.data
          : [];

      setRestaurantStats(data);
    } catch (error) {
      console.error(
        "RESTAURANT DAILY STATS ERROR:",
        error
      );

      console.error(
        "RESPONSE:",
        error.response?.data
      );

      setRestaurantStats([]);
    } finally {
      setRestaurantLoading(false);
    }
  };

  // =====================================================
  // GET RESTAURANT TOTAL STATS
  // =====================================================

  const fetchRestaurantTotalStats = async () => {
    try {
      setRestaurantTotalLoading(true);

      const response = await api.get(
        "/api/v1/admin/restaurants/total-stats"
      );

     

      const data =
        Array.isArray(response.data)
          ? response.data
          : Array.isArray(
              response.data?.restaurants
            )
          ? response.data.restaurants
          : Array.isArray(response.data?.data)
          ? response.data.data
          : [];

      setRestaurantTotalStats(data);
    } catch (error) {
      console.error(
        "RESTAURANT TOTAL STATS ERROR:",
        error
      );

      console.error(
        "RESPONSE:",
        error.response?.data
      );

      setRestaurantTotalStats([]);
    } finally {
      setRestaurantTotalLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);

      await Promise.all([
        fetchStats(),
        fetchRestaurantStats(),
        fetchRestaurantTotalStats(),
      ]);

      setLoading(false);
    };

    loadDashboard();
  }, []);

  // =====================================================
  // DATE CHANGE
  // =====================================================

  const handleDateChange = (e) => {
    const date = e.target.value;

    setSelectedDate(date);

    fetchRestaurantStats(date);
  };

  // =====================================================
  // TOTAL DAILY ORDERS
  // =====================================================

  const totalRestaurantOrders = useMemo(() => {
    return restaurantStats.reduce(
      (total, restaurant) =>
        total +
        Number(
          restaurant.orders ??
            restaurant.orderCount ??
            0
        ),
      0
    );
  }, [restaurantStats]);

  // =====================================================
  // TOTAL DAILY REVENUE
  // =====================================================

  const totalRestaurantRevenue = useMemo(() => {
    return restaurantStats.reduce(
      (total, restaurant) =>
        total +
        Number(
          restaurant.revenue ??
            restaurant.totalRevenue ??
            0
        ),
      0
    );
  }, [restaurantStats]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="admin-dashboard-loading">
        <div className="admin-loading-spinner">
          <FaSpinner />
        </div>

        <h3>
          Loading dashboard...
        </h3>

        <p>
          Please wait while we load the
          statistics.
        </p>
      </div>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <>
      <div className="admin-dashboard">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="admin-dashboard-header">

          <div>
            <div className="admin-dashboard-badge">
              <FaChartLine />
              Admin Analytics
            </div>

            <h1>
              Dashboard Overview
            </h1>

            <p>
              Monitor all restaurants,
              orders and revenue from one
              place.
            </p>
          </div>

          {/* DATE PICKER */}

          <div className="admin-date-picker">

            <FaCalendarDay />

            <div>
              <span>
                Statistics Date
              </span>

              <input
                type="date"
                value={selectedDate}
                onChange={
                  handleDateChange
                }
              />
            </div>

          </div>

        </div>

        {/* =====================================================
            MAIN STAT CARDS
        ===================================================== */}

        <div className="admin-stat-grid">

          <DashboardCard
            title="Total Users"
            value={Number(
              stats?.users || 0
            ).toLocaleString()}
            icon={<FaUsers />}
            type="purple"
          />

          <DashboardCard
            title="Total Recipes"
            value={Number(
              stats?.recipes || 0
            ).toLocaleString()}
            icon={<FaUtensils />}
            type="blue"
          />

          <DashboardCard
            title="Total Orders"
            value={Number(
              stats?.orders || 0
            ).toLocaleString()}
            icon={<FaShoppingBag />}
            type="orange"
          />

          <DashboardCard
            title="Total Revenue"
            value={`${Number(
              stats?.revenue || 0
            ).toLocaleString()} EGP`}
            icon={<FaMoneyBillWave />}
            type="green"
          />

        </div>

        {/* =====================================================
            RESTAURANTS TOTAL REVENUE
        ===================================================== */}

        <div className="restaurant-total-section">

          <div className="restaurant-total-header">

            <div>
              <h2>
                Restaurant Total Revenue
              </h2>

              <p>
                Complete revenue and orders
                for each restaurant
              </p>
            </div>

            <div className="restaurant-total-badge">
              <FaStore />
              All Time
            </div>

          </div>

          {restaurantTotalLoading ? (
            <div className="restaurant-total-loading">

              <FaSpinner />

              <span>
                Loading restaurant revenue...
              </span>

            </div>
          ) : restaurantTotalStats.length === 0 ? (
            <div className="restaurant-total-empty">

              <FaStore />

              <h3>
                No restaurant data
              </h3>

              <p>
                There are no delivered orders
                yet.
              </p>

            </div>
          ) : (
            <div className="restaurant-total-grid">

              {restaurantTotalStats.map(
                (restaurant, index) => {

                  const orders =
                    Number(
                      restaurant.orders || 0
                    );

                  const revenue =
                    Number(
                      restaurant.restaurantRevenue ??
                        restaurant.totalRevenue ??
                        0
                    );

                  const average =
                    orders > 0
                      ? revenue / orders
                      : 0;

                  return (
                    <div
                      className="restaurant-total-card"
                      key={
                        restaurant.restaurantId ||
                        restaurant._id ||
                        index
                      }
                    >

                      {/* TOP */}

                      <div className="restaurant-total-card-top">

                        <div className="restaurant-total-avatar">

                         {restaurant.image ? (
                                <img
                                  src={baseUrlHandler(restaurant.image)}
                                  alt={restaurant.name || "Restaurant"}
                                  onError={(e) => {
                                    console.log(
                                      "IMAGE ERROR:",
                                      e.currentTarget.src
                                    );

                                    e.currentTarget.style.display = "none";

                                    e.currentTarget.parentElement.classList.add(
                                      "image-error"
                                    );
                                  }}
                                />
                              ) : (
                                <FaStore />
                              )}

                        </div>

                        <div className="restaurant-total-name">

                          <h3>
                            {restaurant.name ||
                              restaurant.restaurantName ||
                              "Unknown Restaurant"}
                          </h3>

                          <span>
                            Lifetime Performance
                          </span>

                        </div>

                      </div>

                      {/* REVENUE */}

                      <div className="restaurant-total-revenue">

                        <span>
                          Restaurant Revenue
                        </span>

                        <strong>
                          {revenue.toLocaleString(
                            "en-EG",
                            {
                              maximumFractionDigits: 2,
                            }
                          )}
                        </strong>

                        <small>
                          EGP
                        </small>

                      </div>

                      {/* DIVIDER */}

                      <div className="restaurant-total-divider" />

                      {/* INFO */}

                      <div className="restaurant-total-info">

                        <div>

                          <FaShoppingBag />

                          <span>
                            Orders
                          </span>

                          <strong>
                            {orders.toLocaleString()}
                          </strong>

                        </div>

                        <div>

                          <FaMoneyBillWave />

                          <span>
                            Avg. Order
                          </span>

                          <strong>
                            {average.toLocaleString(
                              "en-EG",
                              {
                                maximumFractionDigits: 2,
                              }
                            )}{" "}
                            EGP
                          </strong>

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

        </div>

        {/* =====================================================
            DAILY PERFORMANCE TITLE
        ===================================================== */}

        <div className="admin-section-title">

          <div>
            <h2>
              Restaurant Performance
            </h2>

            <p>
              Orders and revenue for{" "}

              <strong>
                {new Date(
                  selectedDate
                ).toLocaleDateString(
                  "en-EG",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </strong>
            </p>
          </div>

          {/* DAILY SUMMARY */}

          <div className="admin-day-summary">

            <div>
              <FaReceipt />

              <span>
                Orders
              </span>

              <strong>
                {totalRestaurantOrders}
              </strong>
            </div>

            <div>
              <FaMoneyBillWave />

              <span>
                Revenue
              </span>

              <strong>
                {totalRestaurantRevenue.toLocaleString(
                  "en-EG",
                  {
                    maximumFractionDigits: 2,
                  }
                )}{" "}
                EGP
              </strong>
            </div>

          </div>

        </div>

        {/* =====================================================
            DAILY RESTAURANTS TABLE
        ===================================================== */}

        <div className="restaurant-performance-card">

          <div className="restaurant-table-header">

            <div>
              <h3>
                All Restaurants
              </h3>

              <p>
                Daily performance overview
              </p>
            </div>

            <div className="restaurant-count">
              <FaStore />
              {restaurantStats.length} Restaurants
            </div>

          </div>

          {restaurantLoading ? (
            <div className="restaurant-table-loading">

              <div className="table-spinner">
                <FaSpinner />
              </div>

              <span>
                Loading restaurant statistics...
              </span>

            </div>
          ) : restaurantStats.length === 0 ? (
            <div className="restaurant-empty">

              <div className="restaurant-empty-icon">
                <FaStore />
              </div>

              <h3>
                No restaurant data
              </h3>

              <p>
                There are no orders for the
                selected date.
              </p>

            </div>
          ) : (
            <div className="restaurant-table-wrapper">

              <table className="restaurant-table">

                <thead>

                  <tr>

                    <th>
                      #
                    </th>

                    <th>
                      Restaurant
                    </th>

                    <th>
                      Orders
                    </th>

                    <th>
                      Revenue
                    </th>

                    <th>
                      Average Order
                    </th>

                    <th>
                      Performance
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {restaurantStats.map(
                    (
                      restaurant,
                      index
                    ) => {

                      const orders =
                        Number(
                          restaurant.orders ??
                            restaurant.orderCount ??
                            0
                        );

                      const revenue =
                        Number(
                          restaurant.revenue ??
                            restaurant.totalRevenue ??
                            0
                        );

                      const averageOrder =
                        orders > 0
                          ? revenue / orders
                          : 0;

                      return (
                        <tr
                          key={
                            restaurant.restaurantId ||
                            restaurant._id ||
                            index
                          }
                        >

                          {/* NUMBER */}

                          <td>

                            <div className="restaurant-number">
                              {index + 1}
                            </div>

                          </td>

                          {/* RESTAURANT */}

                          <td>

                            <div className="restaurant-name-cell">

                              <div className="restaurant-avatar">

                          {restaurant.image ? (
                                      <img
                                        src={baseUrlHandler(restaurant.image)}
                                        alt={
                                          restaurant.name ||
                                          "Restaurant"
                                        }
                                        onError={(e) => {
                                          e.currentTarget.style.display = "none";
                                          e.currentTarget.parentElement.classList.add(
                                            "image-error"
                                          );
                                        }}
                                      />
                                    ) : (
                                      <FaStore />
                                    )}

                              </div>

                              <div>

                                <strong>
                                  {
                                    restaurant.restaurantName ||
                                      restaurant.name ||
                                      restaurant.restaurant?.name ||
                                      "Unknown Restaurant"
                                  }
                                </strong>

                                {restaurant.restaurantId && (
                                  <span>
                                    ID:{" "}
                                    {String(
                                      restaurant.restaurantId
                                    ).slice(
                                      -8
                                    )}
                                  </span>
                                )}

                              </div>

                            </div>

                          </td>

                          {/* ORDERS */}

                          <td>

                            <div className="restaurant-orders">

                              <FaShoppingBag />

                              <strong>
                                {orders}
                              </strong>

                              <span>
                                orders
                              </span>

                            </div>

                          </td>

                          {/* REVENUE */}

                          <td>

                            <div className="restaurant-revenue">

                              <strong>
                                {revenue.toLocaleString(
                                  "en-EG",
                                  {
                                    maximumFractionDigits: 2,
                                  }
                                )}
                              </strong>

                              <span>
                                EGP
                              </span>

                            </div>

                          </td>

                          {/* AVERAGE */}

                          <td>

                            <div className="restaurant-average">

                              {averageOrder.toLocaleString(
                                "en-EG",
                                {
                                  maximumFractionDigits: 2,
                                }
                              )}{" "}
                              EGP

                            </div>

                          </td>

                          {/* PERFORMANCE */}

                          <td>

                            <div
                              className={`restaurant-performance ${
                                orders > 0
                                  ? "has-orders"
                                  : "no-orders"
                              }`}
                            >

                              {orders > 0 ? (
                                <>
                                  <FaArrowUp />
                                  Active
                                </>
                              ) : (
                                <>
                                  No Orders
                                </>
                              )}

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>

        {/* =====================================================
            REVENUE CHART
        ===================================================== */}

        <div className="admin-chart-card">

          <div className="admin-chart-header">

            <div>

              <h3>
                Revenue & Orders Trend
              </h3>

              <p>
                Overall platform performance
              </p>

            </div>

          </div>

          <ResponsiveContainer
            width="100%"
            height={330}
          >

            <LineChart
              data={
                stats?.chartData || []
              }
            >

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
              />

              <XAxis
                dataKey="name"
                tick={{
                  fill: "#6b7280",
                  fontSize: 12,
                }}
              />

              <YAxis
                tick={{
                  fill: "#6b7280",
                  fontSize: 12,
                }}
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="orders"
                name="Orders"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{
                  r: 4,
                }}
              />

              <Line
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{
                  r: 4,
                }}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* =====================================================
          CSS
      ===================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .admin-dashboard {
          min-height: 100vh;
          width: 100%;
          padding: 30px;
          background: #f6f7fb;
          color: #1f2937;
        }

        /* =====================================================
           HEADER
        ===================================================== */

        .admin-dashboard-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 25px;
          margin-bottom: 30px;
        }

        .admin-dashboard-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 11px;
          border-radius: 9px;
          background: #eef2ff;
          color: #6366f1;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .4px;
          margin-bottom: 10px;
        }

        .admin-dashboard-header h1 {
          margin: 0;
          color: #111827;
          font-size: 30px;
          font-weight: 800;
        }

        .admin-dashboard-header p {
          margin: 7px 0 0;
          color: #7b8491;
          font-size: 14px;
        }

        /* =====================================================
           DATE
        ===================================================== */

        .admin-date-picker {
          min-width: 230px;
          padding: 11px 14px;
          border-radius: 14px;
          background: #fff;
          border: 1px solid #e7e9ee;
          display: flex;
          align-items: center;
          gap: 11px;
          box-shadow:
            0 5px 20px rgba(0,0,0,.035);
        }

        .admin-date-picker > svg {
          color: #6366f1;
          font-size: 18px;
        }

        .admin-date-picker span {
          display: block;
          color: #9299a3;
          font-size: 10px;
          margin-bottom: 3px;
        }

        .admin-date-picker input {
          border: none;
          outline: none;
          background: transparent;
          color: #20252d;
          font-size: 13px;
          font-weight: 700;
        }

        /* =====================================================
           STAT GRID
        ===================================================== */

        .admin-stat-grid {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 18px;
          margin-bottom: 35px;
        }

        .dashboard-card {
          position: relative;
          overflow: hidden;
          background: #fff;
          border: 1px solid #e9ebef;
          border-radius: 18px;
          padding: 21px;
          box-shadow:
            0 6px 24px rgba(0,0,0,.04);
        }

        .dashboard-card::after {
          content: "";
          position: absolute;
          width: 80px;
          height: 80px;
          right: -25px;
          bottom: -25px;
          border-radius: 50%;
          opacity: .07;
          background: currentColor;
        }

        .dashboard-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
        }

        .dashboard-card-icon {
          width: 46px;
          height: 46px;
          border-radius: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .dashboard-card-icon.purple {
          background: #eef2ff;
          color: #6366f1;
        }

        .dashboard-card-icon.blue {
          background: #e9f7ff;
          color: #0ea5e9;
        }

        .dashboard-card-icon.orange {
          background: #fff6df;
          color: #f59e0b;
        }

        .dashboard-card-icon.green {
          background: #eaf9ef;
          color: #22c55e;
        }

        .dashboard-card-label {
          margin: 0 0 6px;
          color: #8b929c;
          font-size: 12px;
          font-weight: 600;
        }

        .dashboard-card-value {
          margin: 0;
          color: #171b22;
          font-size: 25px;
          font-weight: 800;
        }

        /* =====================================================
           RESTAURANT TOTAL SECTION
        ===================================================== */

        .restaurant-total-section {
          margin-bottom: 32px;
        }

        .restaurant-total-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 16px;
        }

        .restaurant-total-header h2 {
          margin: 0;
          color: #171b22;
          font-size: 21px;
          font-weight: 800;
        }

        .restaurant-total-header p {
          margin: 5px 0 0;
          color: #8a929c;
          font-size: 12px;
        }

        .restaurant-total-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 12px;
          border-radius: 10px;
          background: #eef2ff;
          color: #6366f1;
          font-size: 11px;
          font-weight: 800;
        }

        /* =====================================================
           TOTAL CARDS GRID
        ===================================================== */

        .restaurant-total-grid {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .restaurant-total-card {
          position: relative;
          overflow: hidden;
          background: #fff;
          border: 1px solid #e7e9ee;
          border-radius: 20px;
          padding: 20px;
          box-shadow:
            0 7px 25px rgba(0,0,0,.035);
          transition:
            transform .2s ease,
            box-shadow .2s ease;
        }

        .restaurant-total-card:hover {
          transform: translateY(-3px);
          box-shadow:
            0 12px 32px rgba(0,0,0,.07);
        }

        .restaurant-total-card::after {
          content: "";
          position: absolute;
          width: 120px;
          height: 120px;
          right: -55px;
          top: -55px;
          border-radius: 50%;
          background: #22c55e;
          opacity: .035;
          pointer-events: none;
        }

        /* =====================================================
           TOTAL CARD TOP
        ===================================================== */

        .restaurant-total-card-top {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .restaurant-total-avatar {
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          border-radius: 14px;
          background: #fff0e8;
          color: #ff6b00;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          overflow: hidden;
        }

        .restaurant-total-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .restaurant-total-name {
          min-width: 0;
        }

        .restaurant-total-name h3 {
          margin: 0;
          color: #20252d;
          font-size: 15px;
          font-weight: 800;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .restaurant-total-name span {
          display: block;
          margin-top: 3px;
          color: #9aa1a9;
          font-size: 10px;
        }

        /* =====================================================
           TOTAL REVENUE
        ===================================================== */

        .restaurant-total-revenue {
          margin-top: 23px;
        }

        .restaurant-total-revenue span {
          display: block;
          color: #8b929c;
          font-size: 11px;
          font-weight: 600;
          margin-bottom: 7px;
        }

        .restaurant-total-revenue strong {
          color: #16a34a;
          font-size: 28px;
          font-weight: 900;
          line-height: 1;
        }

        .restaurant-total-revenue small {
          margin-left: 5px;
          color: #8e969f;
          font-size: 10px;
          font-weight: 700;
        }

        /* =====================================================
           TOTAL DIVIDER
        ===================================================== */

        .restaurant-total-divider {
          height: 1px;
          margin: 19px 0;
          background: #eef0f3;
        }

        /* =====================================================
           TOTAL INFO
        ===================================================== */

        .restaurant-total-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .restaurant-total-info > div {
          display: grid;
          grid-template-columns: auto 1fr;
          column-gap: 7px;
          align-items: center;
        }

        .restaurant-total-info svg {
          grid-row: span 2;
          color: #6366f1;
          font-size: 13px;
        }

        .restaurant-total-info span {
          color: #9299a3;
          font-size: 9px;
        }

        .restaurant-total-info strong {
          color: #252a32;
          font-size: 12px;
          font-weight: 800;
        }

        /* =====================================================
           TOTAL LOADING
        ===================================================== */

        .restaurant-total-loading {
          min-height: 180px;
          background: #fff;
          border: 1px solid #e7e9ee;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #8d949d;
          font-size: 12px;
        }

        .restaurant-total-loading svg {
          color: #6366f1;
          font-size: 20px;
          animation:
            dashboardSpin .8s linear infinite;
        }

        /* =====================================================
           TOTAL EMPTY
        ===================================================== */

        .restaurant-total-empty {
          min-height: 180px;
          background: #fff;
          border: 1px solid #e7e9ee;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .restaurant-total-empty > svg {
          color: #6366f1;
          font-size: 25px;
          margin-bottom: 10px;
        }

        .restaurant-total-empty h3 {
          margin: 0 0 5px;
          color: #252a32;
          font-size: 15px;
        }

        .restaurant-total-empty p {
          margin: 0;
          color: #9299a3;
          font-size: 11px;
        }

        /* =====================================================
           DAILY SECTION
        ===================================================== */

        .admin-section-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 18px;
        }

        .admin-section-title h2 {
          margin: 0;
          color: #171b22;
          font-size: 21px;
          font-weight: 800;
        }

        .admin-section-title p {
          margin: 5px 0 0;
          color: #8a929c;
          font-size: 12px;
        }

        .admin-section-title strong {
          color: #6366f1;
        }

        /* =====================================================
           DAY SUMMARY
        ===================================================== */

        .admin-day-summary {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .admin-day-summary > div {
          min-width: 145px;
          padding: 10px 13px;
          background: #fff;
          border: 1px solid #e8eaee;
          border-radius: 12px;
          display: grid;
          grid-template-columns: auto 1fr;
          column-gap: 8px;
          box-shadow:
            0 4px 15px rgba(0,0,0,.025);
        }

        .admin-day-summary svg {
          grid-row: span 2;
          align-self: center;
          color: #6366f1;
        }

        .admin-day-summary span {
          color: #8b929c;
          font-size: 10px;
        }

        .admin-day-summary strong {
          color: #1f2937;
          font-size: 14px;
        }

        /* =====================================================
           TABLE CARD
        ===================================================== */

        .restaurant-performance-card {
          background: #fff;
          border: 1px solid #e7e9ee;
          border-radius: 20px;
          overflow: hidden;
          box-shadow:
            0 7px 25px rgba(0,0,0,.035);
          margin-bottom: 25px;
        }

        .restaurant-table-header {
          padding: 20px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          border-bottom: 1px solid #eef0f3;
        }

        .restaurant-table-header h3 {
          margin: 0;
          color: #20252d;
          font-size: 17px;
          font-weight: 800;
        }

        .restaurant-table-header p {
          margin: 4px 0 0;
          color: #9299a3;
          font-size: 11px;
        }

        .restaurant-count {
          padding: 8px 11px;
          border-radius: 9px;
          background: #f4f5ff;
          color: #6366f1;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* =====================================================
           TABLE
        ===================================================== */

        .restaurant-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .restaurant-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }

        .restaurant-table th {
          padding: 13px 20px;
          background: #fafbfc;
          color: #8a929d;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: .5px;
          font-weight: 800;
          text-align: left;
          border-bottom: 1px solid #eef0f3;
        }

        .restaurant-table td {
          padding: 16px 20px;
          border-bottom: 1px solid #f0f1f3;
          vertical-align: middle;
        }

        .restaurant-table tbody tr {
          transition: .2s ease;
        }

        .restaurant-table tbody tr:hover {
          background: #fafbff;
        }

        .restaurant-table tbody tr:last-child td {
          border-bottom: none;
        }

        /* =====================================================
           NUMBER
        ===================================================== */

        .restaurant-number {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: #f2f3f6;
          color: #7b8490;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
        }

        /* =====================================================
           RESTAURANT NAME
        ===================================================== */

        .restaurant-name-cell {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .restaurant-avatar {
          width: 40px;
          height: 40px;
          border-radius: 11px;
          background: #fff0e8;
          color: #ff6b00;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
        }

        .restaurant-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .restaurant-name-cell strong {
          display: block;
          color: #20252d;
          font-size: 13px;
          font-weight: 800;
        }

        .restaurant-name-cell span {
          display: block;
          margin-top: 3px;
          color: #9aa1a9;
          font-size: 9px;
        }

        /* =====================================================
           ORDERS
        ===================================================== */

        .restaurant-orders {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .restaurant-orders svg {
          color: #f59e0b;
          font-size: 13px;
        }

        .restaurant-orders strong {
          color: #252a32;
          font-size: 15px;
        }

        .restaurant-orders span {
          color: #9aa1a9;
          font-size: 10px;
        }

        /* =====================================================
           REVENUE
        ===================================================== */

        .restaurant-revenue strong {
          color: #16a34a;
          font-size: 15px;
          font-weight: 800;
        }

        .restaurant-revenue span {
          margin-left: 4px;
          color: #8e969f;
          font-size: 10px;
        }

        /* =====================================================
           AVERAGE
        ===================================================== */

        .restaurant-average {
          color: #59616c;
          font-size: 12px;
          font-weight: 700;
        }

        /* =====================================================
           PERFORMANCE
        ===================================================== */

        .restaurant-performance {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 10px;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 800;
        }

        .restaurant-performance.has-orders {
          color: #16a34a;
          background: #ebf9ef;
        }

        .restaurant-performance.no-orders {
          color: #8b929b;
          background: #f2f3f5;
        }

        /* =====================================================
           TABLE EMPTY
        ===================================================== */

        .restaurant-empty {
          text-align: center;
          padding: 65px 20px;
        }

        .restaurant-empty-icon {
          width: 65px;
          height: 65px;
          margin: 0 auto 15px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f4ff;
          color: #6366f1;
          font-size: 23px;
        }

        .restaurant-empty h3 {
          margin: 0 0 6px;
          color: #252a32;
          font-size: 16px;
        }

        .restaurant-empty p {
          margin: 0;
          color: #9299a3;
          font-size: 12px;
        }

        /* =====================================================
           TABLE LOADING
        ===================================================== */

        .restaurant-table-loading {
          min-height: 250px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #8d949d;
          font-size: 12px;
        }

        .table-spinner,
        .admin-loading-spinner {
          color: #6366f1;
          font-size: 25px;
          animation:
            dashboardSpin .8s linear infinite;
        }

        @keyframes dashboardSpin {
          to {
            transform: rotate(360deg);
          }
        }

        /* =====================================================
           CHART
        ===================================================== */

        .admin-chart-card {
          background: #fff;
          border: 1px solid #e7e9ee;
          border-radius: 20px;
          padding: 22px;
          box-shadow:
            0 7px 25px rgba(0,0,0,.035);
        }

        .admin-chart-header {
          margin-bottom: 10px;
        }

        .admin-chart-header h3 {
          margin: 0;
          color: #20252d;
          font-size: 17px;
          font-weight: 800;
        }

        .admin-chart-header p {
          margin: 4px 0 0;
          color: #9299a3;
          font-size: 11px;
        }

        /* =====================================================
           FULL LOADING
        ===================================================== */

        .admin-dashboard-loading {
          min-height: 100vh;
          background: #f6f7fb;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .admin-dashboard-loading h3 {
          margin: 15px 0 5px;
          color: #252a32;
          font-size: 17px;
        }

        .admin-dashboard-loading p {
          margin: 0;
          color: #9299a3;
          font-size: 12px;
        }

        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 1100px) {

          .admin-stat-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .restaurant-total-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .admin-section-title {
            align-items: flex-start;
            flex-direction: column;
          }

        }

        @media (max-width: 768px) {

          .admin-dashboard {
            padding: 20px 15px;
          }

          .admin-dashboard-header {
            align-items: stretch;
            flex-direction: column;
          }

          .admin-date-picker {
            width: 100%;
          }

          .admin-day-summary {
            width: 100%;
          }

          .admin-day-summary > div {
            flex: 1;
          }

        }

        @media (max-width: 600px) {

          .restaurant-total-grid {
            grid-template-columns: 1fr;
          }

          .restaurant-total-header {
            align-items: flex-start;
            flex-direction: column;
          }

        }

        @media (max-width: 520px) {

          .admin-stat-grid {
            grid-template-columns: 1fr;
          }

          .admin-dashboard-header h1 {
            font-size: 25px;
          }

          .admin-day-summary {
            flex-direction: column;
            align-items: stretch;
          }

          .admin-day-summary > div {
            width: 100%;
          }

          .restaurant-table-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .restaurant-total-revenue strong {
            font-size: 25px;
          }

        }

      `}</style>
    </>
  );
};

// =========================================================
// DASHBOARD CARD
// =========================================================

const DashboardCard = ({
  title,
  value,
  icon,
  type,
}) => {
  return (
    <div
      className="dashboard-card"
      style={{
        color:
          type === "purple"
            ? "#6366f1"
            : type === "blue"
            ? "#0ea5e9"
            : type === "orange"
            ? "#f59e0b"
            : "#22c55e",
      }}
    >

      <div className="dashboard-card-top">

        <div>

          <p className="dashboard-card-label">
            {title}
          </p>

          <h2 className="dashboard-card-value">
            {value}
          </h2>

        </div>

        <div
          className={`dashboard-card-icon ${type}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;