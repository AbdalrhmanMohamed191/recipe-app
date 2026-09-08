import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const RestaurantLayout = () => {
  const [open, setOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  const isActive = (path) => {
    if (path === "/restaurant") {
      return location.pathname === "/restaurant";
    }

    return location.pathname.startsWith(path);
  };

  const linkClass = (path) =>
    `restaurant-link ${isActive(path) ? "active" : ""}`;

  return (
    <div className="restaurant-layout">

      {/* MOBILE TOPBAR */}
      <div className="restaurant-topbar">
        <h2>🍽️ Restaurant Panel</h2>

        <FaBars
          className="menu-icon"
          onClick={() => setOpen(true)}
        />
      </div>

      {/* OVERLAY */}
      {open && (
        <div
          className="restaurant-overlay"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`restaurant-sidebar ${
          open ? "restaurant-sidebar-open" : ""
        }`}
      >

        <div>

          {/* HEADER */}
          <div className="restaurant-header">

            <h2>🍽️</h2>

            <div>
              <h3>Restaurant</h3>
              <span>Panel</span>
            </div>

            <FaTimes
              className="restaurant-close"
              onClick={() => setOpen(false)}
            />

          </div>

          {/* RESTAURANT INFO */}
          <div className="restaurant-user">

            <div className="restaurant-avatar">
              🍔
            </div>

            <div>
              <strong>
                {user?.name || "Restaurant Owner"}
              </strong>

              <small>
                Restaurant Owner
              </small>
            </div>

          </div>

          {/* NAVIGATION */}
          <nav className="restaurant-nav">


            <Link
              to="/restaurant"
              className={linkClass("/restaurant")}
              onClick={() => setOpen(false)}
            >
              🏠 Home
            </Link>

            <Link
              to="/restaurant/restaurantdashboard"
              className={linkClass("/restaurant/restaurantdashboard")}
              onClick={() => setOpen(false)}
            >
              📊 Dashboard
            </Link>

            <Link
              to="/restaurant/restaurantorders"
              className={linkClass("/restaurant/restaurantorders")}
              onClick={() => setOpen(false)}
            >
              🧾 Orders
            </Link>

            <Link
              to="/restaurant/restaurantrecipes"
              className={linkClass("/restaurant/restaurantrecipes")}
              onClick={() => setOpen(false)}
            >
              🍔 Menue
            </Link>

            <Link
              to="/restaurant/restaurantoffer"
              className={linkClass("/restaurant/restaurantoffer")}
              onClick={() => setOpen(false)}
            >
             🔥 Offers
            </Link>

            <Link
              to="/restaurant/restaurantprofile"
              className={linkClass("/restaurant/restaurantprofile")}
              onClick={() => setOpen(false)}
            >
              ⚙️ Restaurant
            </Link>

          </nav>

        </div>

        {/* LOGOUT */}
        <button
          className="restaurant-logout"
          onClick={logout}
        >
          🚪 Logout
        </button>

      </aside>

      {/* CONTENT */}
      <main className="restaurant-content">
        <Outlet />
      </main>

      {/* CSS */}
      <style>{`

        * {
          box-sizing: border-box;
        }

        .restaurant-layout {
          min-height: 100vh;
          display: flex;
          background: #0b0b0b;
          color: white;
        }

        /* ================= SIDEBAR ================= */

        .restaurant-sidebar {
          width: 270px;
          min-height: 100vh;
          padding: 22px 18px;
          background: #151515;
          border-right: 1px solid #292929;

          display: flex;
          flex-direction: column;
          justify-content: space-between;

          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;

          z-index: 1000;
        }

        /* HEADER */

        .restaurant-header {
          display: flex;
          align-items: center;
          gap: 12px;

          padding: 10px;
          margin-bottom: 25px;

          color: #ffcc00;
        }

        .restaurant-header h2 {
          font-size: 32px;
          margin: 0;
        }

        .restaurant-header h3 {
          margin: 0;
          font-size: 18px;
          color: white;
        }

        .restaurant-header span {
          font-size: 12px;
          color: #888;
        }

        .restaurant-close {
          display: none;
          margin-left: auto;
          cursor: pointer;
        }

        /* USER */

        .restaurant-user {
          display: flex;
          align-items: center;
          gap: 12px;

          padding: 13px;
          margin-bottom: 25px;

          background: #1f1f1f;
          border-radius: 12px;
        }

        .restaurant-avatar {
          width: 42px;
          height: 42px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: #ffcc00;
          border-radius: 50%;

          font-size: 21px;
        }

        .restaurant-user strong {
          display: block;
          font-size: 14px;
        }

        .restaurant-user small {
          display: block;
          margin-top: 3px;
          color: #888;
          font-size: 11px;
        }

        /* NAV */

        .restaurant-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .restaurant-link {
          display: block;

          padding: 13px 14px;

          color: #bbb;
          text-decoration: none;

          border-radius: 10px;

          transition: 0.25s;
        }

        .restaurant-link:hover {
          background: #222;
          color: white;
          transform: translateX(4px);
        }

        .restaurant-link.active {
          background: #ffcc00;
          color: #111;
          font-weight: 700;
        }

        /* LOGOUT */

        .restaurant-logout {
          width: 100%;

          padding: 12px;

          border: none;
          border-radius: 10px;

          background: #e53935;
          color: white;

          font-weight: 600;

          cursor: pointer;

          transition: 0.25s;
        }

        .restaurant-logout:hover {
          background: #ff2424;
          transform: translateY(-2px);
        }

        /* CONTENT */

        .restaurant-content {
          flex: 1;
          margin-left: 270px;
          min-height: 100vh;
          padding: 30px;
        }

        /* TOPBAR */

        .restaurant-topbar {
          display: none;
        }

        /* OVERLAY */

        .restaurant-overlay {
          display: none;
        }

        /* ================= MOBILE ================= */

        @media (max-width: 768px) {

          .restaurant-topbar {
            display: flex;

            position: fixed;
            top: 0;
            left: 0;
            right: 0;

            height: 65px;

            align-items: center;
            justify-content: space-between;

            padding: 0 18px;

            background: #151515;
            border-bottom: 1px solid #292929;

            z-index: 900;
          }

          .restaurant-topbar h2 {
            font-size: 17px;
            margin: 0;
          }

          .menu-icon {
            font-size: 22px;
            cursor: pointer;
          }

          .restaurant-sidebar {
            left: -100%;
            width: 270px;

            transition: 0.3s;
          }

          .restaurant-sidebar-open {
            left: 0;
          }

          .restaurant-close {
            display: block;
          }

          .restaurant-overlay {
            display: block;

            position: fixed;
            inset: 0;

            background: rgba(0,0,0,0.65);

            z-index: 950;
          }

          .restaurant-content {
            margin-left: 0;
            padding: 90px 18px 25px;
          }

        }

      `}</style>

    </div>
  );
};

export default RestaurantLayout;