import React, { useEffect, useState } from "react";
import api from "../../api/api";

const RestaurantHome = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await api.get(
          "/api/v1/orders/restaurant-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrders(res.data || []);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

    fetchOrders();

  }, []);

  const pending = orders.filter(
    (o) => o.status === "pending"
  ).length;

  const preparing = orders.filter(
    (o) => o.status === "preparing"
  ).length;

  const delivered = orders.filter(
    (o) => o.status === "delivered"
  ).length;

  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce(
      (total, o) =>
        total + Number(o.totalPrice || 0),
      0
    );

  return (
    <div>

      <h1 className="restaurant-page-title">
        Welcome 👋
      </h1>

      <p className="restaurant-page-subtitle">
        Manage your restaurant from here.
      </p>

      {/* RESTAURANT INFO */}

      <div className="restaurant-welcome">

        <div>
          <span>🍽️</span>

          <div>
            <h2>
              {user?.restaurantId?.name ||
                "My Restaurant"}
            </h2>

            <p>
              Restaurant Owner Dashboard
            </p>
          </div>
        </div>

      </div>

      {/* STATS */}

      <div className="restaurant-stats">

        <div className="stat-card">
          <span>🧾</span>
          <div>
            <p>Total Orders</p>
            <h2>{orders.length}</h2>
          </div>
        </div>

        <div className="stat-card">
          <span>⏳</span>
          <div>
            <p>Pending</p>
            <h2>{pending}</h2>
          </div>
        </div>

        <div className="stat-card">
          <span>👨‍🍳</span>
          <div>
            <p>Preparing</p>
            <h2>{preparing}</h2>
          </div>
        </div>

        <div className="stat-card">
          <span>💰</span>
          <div>
            <p>Revenue</p>
            <h2>{revenue} EGP</h2>
          </div>
        </div>

      </div>

      {/* RECENT ORDERS */}

      <div className="recent-orders">

        <div className="section-header">
          <h2>Recent Orders</h2>
        </div>

        {loading ? (

          <p>Loading...</p>

        ) : orders.length === 0 ? (

          <p className="no-orders">
            No orders yet 😢
          </p>

        ) : (

          orders.slice(0, 5).map((order) => (

            <div
              className="recent-order"
              key={order._id}
            >

              <div>

                <strong>
                  #{order._id.slice(-6).toUpperCase()}
                </strong>

                <p>
                  {order.userId?.name ||
                    order.name ||
                    "Customer"}
                </p>

              </div>

              <div>

                <span className={`order-status ${order.status}`}>
                  {order.status}
                </span>

                <strong>
                  {order.totalPrice} EGP
                </strong>

              </div>

            </div>

          ))

        )}

      </div>

      <style>{`

        .restaurant-page-title {
          margin: 0;
          font-size: 30px;
        }

        .restaurant-page-subtitle {
          color: #888;
          margin-top: 5px;
        }

        .restaurant-welcome {
          margin-top: 25px;
          padding: 25px;
          background: #171717;
          border: 1px solid #292929;
          border-radius: 15px;
        }

        .restaurant-welcome > div {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .restaurant-welcome span {
          font-size: 40px;
        }

        .restaurant-welcome h2 {
          margin: 0;
          color: #ffd700;
        }

        .restaurant-welcome p {
          margin: 5px 0 0;
          color: #888;
        }

        .restaurant-stats {
          margin-top: 25px;
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 18px;
        }

        .stat-card {
          background: #171717;
          border: 1px solid #292929;
          border-radius: 15px;
          padding: 20px;
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .stat-card > span {
          font-size: 30px;
        }

        .stat-card p {
          margin: 0;
          color: #888;
          font-size: 13px;
        }

        .stat-card h2 {
          margin: 5px 0 0;
          color: #ffd700;
        }

        .recent-orders {
          margin-top: 30px;
          background: #171717;
          border: 1px solid #292929;
          border-radius: 15px;
          padding: 20px;
        }

        .section-header {
          margin-bottom: 15px;
        }

        .section-header h2 {
          margin: 0;
        }

        .recent-order {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 5px;
          border-bottom: 1px solid #292929;
        }

        .recent-order p {
          margin: 5px 0 0;
          color: #888;
        }

        .recent-order > div:last-child {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .order-status {
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 11px;
          text-transform: capitalize;
        }

        .order-status.pending {
          background: #332b15;
          color: orange;
        }

        .order-status.preparing {
          background: #142b3a;
          color: #3498db;
        }

        .order-status.delivered {
          background: #143522;
          color: #2ecc71;
        }

        .order-status.cancelled {
          background: #351817;
          color: #e74c3c;
        }

        .no-orders {
          color: #888;
        }

        @media (max-width: 1000px) {

          .restaurant-stats {
            grid-template-columns:
              repeat(2, 1fr);
          }

        }

        @media (max-width: 600px) {

          .restaurant-stats {
            grid-template-columns: 1fr;
          }

          .recent-order {
            align-items: flex-start;
            gap: 10px;
          }

          .recent-order > div:last-child {
            flex-direction: column;
            align-items: flex-end;
          }

        }

      `}</style>

    </div>
  );
};

export default RestaurantHome;