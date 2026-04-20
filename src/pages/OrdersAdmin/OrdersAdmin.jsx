import React, { useEffect, useState } from "react";
// import axios from "axios";
import socket from "../../socket/socket";
import api from "../../api/api";

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================
  // FETCH ORDERS
  // =====================
  const fetchOrders = async () => {
    try {
      const res = await api.get(
        "/api/v1/orders/all",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setOrders(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // SOCKET REALTIME
  // =====================
  useEffect(() => {
    fetchOrders();

    socket.connect();
    socket.emit("joinAdmin");

    // order created
    socket.on("orderCreated", (order) => {
      setOrders((prev) => [order, ...prev]);
    });

    // order updated
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

  // =====================
  // UPDATE STATUS
  // =====================
  const updateStatus = async (id, status) => {
    try {
      await api.put(
        `/api/v1/orders/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  // BADGE
  const getBadge = (status) => {
    switch (status) {
      case "delivered":
        return "bg-success";
      case "preparing":
        return "bg-warning text-dark";
      case "cancelled":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  // LOADING
  if (loading) {
    return <h4 className="text-center mt-5">Loading orders...</h4>;
  }

  // UI
 
  return (
    <div className="container py-5 mt-5">

      <h2 className="mb-4">📦 Orders Management</h2>

      {orders.length === 0 ? (
        <div className="alert alert-info">No orders yet</div>
      ) : (
        <div className="table-responsive">

          <table className="table table-dark table-hover align-middle">

            <thead>
              <tr>
                <th>User</th>
                <th>Phone</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>

                  <td>{order.userId?.name}</td>
                  <td>{order.userId?.phone}</td>

                  <td>
                    {order.items?.map((i) => i.title).join(", ")}
                  </td>

                  <td>{order.totalPrice} EGP</td>

                  <td>
                    <span className={`badge ${getBadge(order.status)}`}>
                      {order.status || "pending"}
                    </span>
                  </td>

                  <td className="d-flex gap-2">

                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() =>
                        updateStatus(order._id, "preparing")
                      }
                    >
                      Preparing
                    </button>

                    <button
                      className="btn btn-sm btn-success"
                      onClick={() =>
                        updateStatus(order._id, "delivered")
                      }
                    >
                      Delivered
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() =>
                        updateStatus(order._id, "cancelled")
                      }
                    >
                      Cancel
                    </button>

                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>
      )}

    </div>
  );
};

export default OrdersAdmin;