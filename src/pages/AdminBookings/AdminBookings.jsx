import React, { useEffect, useState } from "react";
import api from "../../api/api";
import socket from "../../socket/socket";



const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    const res = await api.get("/api/v1/book/all", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    setBookings(res.data);
  };

  useEffect(() => {
    fetchBookings();

    // 🔥 live updates
    socket.on("bookingUpdated", (updated) => {
      setBookings((prev) =>
        prev.map((b) => (b._id === updated._id ? updated : b))
      );
    });

    return () => socket.off("bookingUpdated");
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(
      `/api/v1/book/update/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  };

  return (
    <div style={styles.page}>
      <h2>📋 Bookings Admin</h2>

      <div style={styles.grid}>
        {bookings.map((b) => (
          <div key={b._id} style={styles.card}>
            <h3>{b.name}</h3>
            <p>📞 {b.phone}</p>
            <p>📅 {b.date} - ⏰ {b.time}</p>
            <p>👥 Guests: {b.guests}</p>

            <p>
              Status:{" "}
              <b
                style={{
                  color:
                    b.status === "accepted"
                      ? "#22c55e"
                      : b.status === "rejected"
                      ? "#ef4444"
                      : "#f59e0b",
                }}
              >
                {b.status || "pending"}
              </b>
            </p>

            <div style={styles.actions}>
              <button
                onClick={() => updateStatus(b._id, "accepted")}
                style={{ ...styles.btn, background: "#22c55e" }}
              >
                Accept
              </button>

              <button
                onClick={() => updateStatus(b._id, "rejected")}
                style={{ ...styles.btn, background: "#ef4444" }}
              >
                Reject
              </button>

              <button
                onClick={() => updateStatus(b._id, "pending")}
                style={{ ...styles.btn, background: "#f59e0b" }}
              >
                Pending
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: "20px",
    background: "#0f0f0f",
    color: "#fff",
    minHeight: "100vh",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "15px",
    marginTop: "20px",
  },

  card: {
    background: "#1a1a1a",
    padding: "15px",
    borderRadius: "12px",
  },

  actions: {
    display: "flex",
    gap: "8px",
    marginTop: "10px",
    flexWrap: "wrap",
  },

  btn: {
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#000",
    fontWeight: "bold",
  },
};

export default AdminBookings;