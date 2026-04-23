import React, { useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

const BookTable = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: 1,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const confirmBooking = async () => {
    setLoading(true);
    setShowModal(false);
    setSuccess("");

    try {
      await api.post("/api/v1/book/create", form);
      setSuccess("🎉 Booking confirmed successfully!");

      setForm({
        name: "",
        phone: "",
        date: "",
        time: "",
        guests: 1,
      });
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.headerText}>
            <h2 style={styles.title}>🍽️ Book a Table</h2>
            <p style={styles.subtitle}>Reserve your seat in seconds</p>
          </div>

          <button
            onClick={() => navigate("/MyBookings")}
            style={styles.myBookingsBtn}
            type="button"
          >
            📋 My Bookings
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmitClick} style={styles.form}>
          <input
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <div style={styles.row}>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              style={styles.input}
              required
            />

            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <input
            type="number"
            name="guests"
            min="1"
            value={form.guests}
            onChange={handleChange}
            style={styles.input}
          />

          <button disabled={loading} style={styles.button}>
            {loading ? "Processing..." : "Reserve Now"}
          </button>

          {success && <p style={styles.success}>{success}</p>}
        </form>
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Confirm Booking</h3>

            <p>
              Table for <b>{form.guests}</b> guests <br />
              on <b>{form.date}</b> at <b>{form.time}</b>
            </p>

            <div style={styles.modalActions}>
              <button
                onClick={() => setShowModal(false)}
                style={styles.cancelBtn}
              >
                Cancel
              </button>

              <button onClick={confirmBooking} style={styles.confirmBtn}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookTable;


const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "radial-gradient(circle at top, #1a1a1a, #0f0f0f)",
    padding: "15px",
  },

  card: {
    width: "100%",
    maxWidth: "500px",
    padding: "25px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
    flexWrap: "wrap",
    gap: "10px",
  },

  headerText: {
    marginTop: "10px",
  },

  title: {
    margin: 0,
    fontSize: "22px",
  },

  subtitle: {
    margin: 0,
    fontSize: "12px",
    opacity: 0.7,
  },

  myBookingsBtn: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #f59e0b",
    background: "transparent",
    color: "#f59e0b",
    fontWeight: "bold",
    cursor: "pointer",
    width: "auto",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "10px",
  },

  input: {
    padding: "12px",
    borderRadius: "10px",
    background: "#111",
    color: "#fff",
    border: "1px solid #333",
    outline: "none",
    width: "100%",
  },

  row: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  button: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(90deg, #f59e0b, #f97316)",
    fontWeight: "bold",
    cursor: "pointer",
  },

  success: {
    color: "#22c55e",
    textAlign: "center",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "15px",
  },

  modal: {
    background: "#1a1a1a",
    padding: "20px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },

  modalActions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
    gap: "10px",
  },

  cancelBtn: {
    padding: "8px 12px",
    background: "#444",
    border: "none",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
    flex: 1,
  },

  confirmBtn: {
    padding: "8px 12px",
    background: "#22c55e",
    border: "none",
    color: "#000",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    flex: 1,
  },
};