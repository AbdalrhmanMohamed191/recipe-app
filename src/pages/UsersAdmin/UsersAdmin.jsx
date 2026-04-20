import React, { useEffect, useState } from "react";
import api from "../../api/api";
// import axios from "axios";

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        "/api/v1/users",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUsers(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      await api.delete(
        `/api/v1/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>👤 Users Management</h1>

      {loading ? (
        <p style={styles.loading}>Loading users...</p>
      ) : users.length === 0 ? (
        <p style={styles.empty}>No users found</p>
      ) : (
        <div style={styles.grid}>
          {users.map((user) => (
            <div key={user._id} style={styles.card}>
              
              {/* Avatar */}
              <div style={styles.avatar}>
                {user.name?.charAt(0)?.toUpperCase()}
              </div>

              {/* Info */}
              <div style={styles.info}>
                <h3 style={styles.name}>{user.name}</h3>
                <p style={styles.text}>📧 {user.email}</p>
                <p style={styles.text}>📱 {user.phone}</p>
              </div>

              {/* Actions */}
              <button
                onClick={() => deleteUser(user._id)}
                style={styles.deleteBtn}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  page: {
    padding: "25px",
    background: "#0f0f0f",
    minHeight: "100vh",
    color: "#fff",
  },

  title: {
    marginBottom: "20px",
    fontSize: "28px",
  },

  loading: {
    color: "#aaa",
  },

  empty: {
    color: "#aaa",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "15px",
  },

  card: {
    background: "#1a1a1a",
    padding: "15px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    transition: "0.3s",
    border: "1px solid #2a2a2a",
  },

  avatar: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    background: "#ff4d4d",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: "18px",
  },

  info: {
    flex: 1,
  },

  name: {
    margin: "5px 0",
  },

  text: {
    margin: "2px 0",
    color: "#bbb",
    fontSize: "14px",
  },

  deleteBtn: {
    background: "linear-gradient(45deg, #ff3b3b, #d60000)",
    color: "#fff",
    border: "none",
    padding: "8px",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "10px",
    transition: "0.2s",
  },
};

export default UsersAdmin;