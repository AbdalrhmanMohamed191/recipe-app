import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `nav-link ${isActive(path) ? "active" : ""}`;

  return (
    <div className="layout">

      {/* TOP BAR (mobile) */}
      <div className="topbar">
        <h2>⚙️ Admin Panel</h2>
        <FaBars onClick={() => setOpen(true)} />
      </div>

      {/* OVERLAY */}
      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      {/* SIDEBAR */}
      <aside className={`sidebar ${open ? "open" : ""}`}>

        <div className="sidebar-header">
          <h2>⚙️ Admin</h2>
          <FaTimes className="close" onClick={() => setOpen(false)} />
        </div>

        <nav>
          <Link to="/admin" className={linkClass("/admin")}>🏠 Home</Link>
          <Link to="/admin/dashboard" className={linkClass("/admin/dashboard")}>📊 Dashboard</Link>
          <Link to="/admin/orders" className={linkClass("/admin/orders")}>🧾 Orders</Link>
          <Link to="/admin/offers" className={linkClass("/admin/AdminOffers")}>🎁 Offers</Link>
          <Link to="/admin/bookings" className={linkClass("/admin/AdminBookings")}>📅 Bookings</Link>
          <Link to="/admin/recipes" className={linkClass("/admin/recipes")}>🍔 Recipes</Link>
          <Link to="/admin/users" className={linkClass("/admin/users")}>👤 Users</Link>
          <Link to="/admin/contacts" className={linkClass("/admin/AdminContacts")}>📞 Contact</Link>
        </nav>

        <button className="logout" onClick={logout}>
          🚪 Logout
        </button>
      </aside>

      {/* CONTENT */}
      <main className="content">
        <Outlet />
      </main>

      {/* STYLE */}
      <style>{`
        .layout {
          display: flex;
          min-height: 100vh;
          background: #0b0b0b;
          color: white;
        }

        /* TOPBAR */
        .topbar {
          display: none;
        }

        /* SIDEBAR */
        .sidebar {
          width: 260px;
          background: rgba(20,20,20,0.9);
          backdrop-filter: blur(10px);
          border-right: 1px solid #2a2a2a;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: 0.3s;
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          color: #FFD700;
        }

        .close {
          display: none;
          cursor: pointer;
        }

        /* NAV LINKS */
        .nav-link {
          display: block;
          padding: 12px;
          margin-bottom: 10px;
          border-radius: 10px;
          text-decoration: none;
          color: #ccc;
          transition: 0.25s;
          position: relative;
        }

        .nav-link:hover {
          background: #1f1f1f;
          transform: translateX(4px);
          color: white;
        }

        .nav-link.active {
          background: #FFD700;
          color: black;
          font-weight: bold;
        }

        /* ACTIVE BAR */
        .nav-link.active::before {
          content: "";
          position: absolute;
          left: 0;
          top: 10px;
          bottom: 10px;
          width: 4px;
          background: black;
          border-radius: 10px;
        }

        /* LOGOUT */
        .logout {
          margin-top: 20px;
          background: #ff2e2e;
          color: white;
          padding: 12px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: 0.2s;
        }

        .logout:hover {
          background: #ff0000;
          transform: scale(1.02);
        }

        /* CONTENT */
        .content {
          flex: 1;
          padding: 25px;
        }

        /* OVERLAY */
        .overlay {
          display: none;
        }

        /* MOBILE */
        @media (max-width: 768px) {

          .layout {
            flex-direction: column;
          }

          .topbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            background: #121212;
            border-bottom: 1px solid #2a2a2a;
          }

          .sidebar {
            position: fixed;
            left: -100%;
            top: 0;
            height: 100%;
            z-index: 1000;
            width: 260px;
          }

          .sidebar.open {
            left: 0;
          }

          .close {
            display: block;
          }

          .overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.6);
            z-index: 999;
          }

          .content {
            padding-top: 80px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
