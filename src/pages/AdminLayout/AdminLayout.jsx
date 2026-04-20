import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const linkStyle = (path) => ({
    display: "block",
    padding: "10px 12px",
    marginBottom: "10px",
    borderRadius: "8px",
    textDecoration: "none",
    color: location.pathname === path ? "#000" : "#ddd",
    background: location.pathname === path ? "#FFD700" : "transparent",
    fontWeight: "500",
    transition: "0.2s",
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh" , width: "100%", background: "#0f0f0f", color: "#fff" }}>

      {/* Sidebar */}
      <div
        style={{
          width: "240px",
          background: "#181818",
          padding: "25px 15px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRight: "1px solid #2a2a2a",
        }}
      >
        <div>
          <h2 style={{ marginBottom: "30px", textAlign: "center", color: "#FFD700" }}>
            ⚙️ Admin Panel
          </h2>

          <Link to="/admin" style={linkStyle("/admin")}>
            🏠 Home
          </Link>

          <Link to="/admin/dashboard" style={linkStyle("/admin/dashboard")}>
            📊 Dashboard
          </Link>

          <Link to="/admin/orders" style={linkStyle("/admin/orders")}>
            🧾 Orders
          </Link>

          <Link to="/admin/recipes" style={linkStyle("/admin/recipes")}>
            🍔 Recipes
          </Link>

          <Link to="/admin/users" style={linkStyle("/admin/users")}>
            👤 Users
          </Link>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          style={{
            marginTop: "20px",
            background: "#ff3b3b",
            color: "#fff",
            padding: "12px",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "0.2s",

          }}
          onMouseOver={(e) => (e.target.style.background = "#ff1f1f")}
          onMouseOut={(e) => (e.target.style.background = "#ff3b3b")}
        >
          🚪 Logout
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "25px" }}>
        <Outlet />
      </div>

    </div>
  );
};

export default AdminLayout;