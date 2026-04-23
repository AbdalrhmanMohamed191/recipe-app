import React, { useEffect, useState } from "react";
import socket from "../../socket/socket";
import "./MyOrder.css";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // FETCH
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
      navigate("/");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await api.get("/api/v1/orders/myorders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(res.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // CONNECT SOCKET 
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    socket.connect();
    socket.emit("joinUser", user._id);

    socket.on("orderCreated", (order) => {
      const orderUserId =
        typeof order.userId === "object"
          ? order.userId._id
          : order.userId;

      if (orderUserId === user._id) {
        setOrders((prev) => [order, ...prev]);
      }
    });

    socket.on("orderUpdated", (updated) => {
      setOrders((prev) =>
        prev.map((o) => (o._id === updated._id ? updated : o))
      );
    });

    return () => {
      socket.off("orderCreated");
      socket.off("orderUpdated");
      socket.disconnect();
    };
  }, []);

  // STATUS 
  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "pending";
      case "preparing":
        return "preparing";
      case "delivered":
        return "delivered";
      case "cancelled":
        return "cancelled";
      default:
        return "";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "⏳ Pending";
      case "preparing":
        return "👨‍🍳 Preparing";
      case "delivered":
        return "✅ Delivered";
      case "cancelled":
        return "❌ Cancelled";
      default:
        return status;
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="orders-container">
        <h2 className="title">My Orders</h2>
        <p className="empty">Loading... ⏳</p>
      </div>
    );
  }

  // UI 
  return (
    <div className="orders-container">
      <h2 className="title">My Orders</h2>

      {orders.length === 0 ? (
        <div className="empty-box">
          <p>No orders yet 😢</p>
          <button onClick={() => navigate("/menue")} className="btn-primary btn outline">
            Order Now 🍔
          </button>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((o) => (
            <div className="order-card" key={o._id}>
              {/* HEADER */}
              <div className="order-header">
                <span className="order-id">
                  #{o._id.slice(-6).toUpperCase()}
                </span>

                <span className={`status ${getStatusClass(o.status)}`}>
                  {getStatusText(o.status)}
                </span>
              </div>

              {/* BODY */}
              <div className="order-body">
                <p>
                  <b>Date:</b> {o.createdAt?.slice(0, 10)}
                </p>

                <p>
                  <b>Items:</b>{" "}
                  {o.items?.map((i) => i.title).join(", ")}
                </p>

                <p>
                  <b>Delivery:</b> {o.deliveryFee || 0} EGP
                </p>

                <p>
                  <b>Discount:</b> {o.discount || 0} EGP
                </p>

                <p className="total">
                  Total: {o.totalPrice} EGP
                </p>

                <p className="address">
                  📍 {o.address?.street}, {o.address?.city}
                </p>
              </div>

            
            

              {/* PROGRESS */}
              <div className="progress-bar">
                <div className={`progress ${o.status}`}></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
