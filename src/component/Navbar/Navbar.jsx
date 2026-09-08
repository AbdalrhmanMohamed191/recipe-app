import React, { useState, useEffect } from "react";
import "./Navbar.css";

import Modal from "../Modal/Modal";
import InputForm from "../InputForm/InputForm";

import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useCart } from "../CartContext/CartContext";
import { FaShoppingCart } from "react-icons/fa";

import {
  useSelector,
  useDispatch,
} from "react-redux";

import { clearUser } from "../../../store/userSlice/userSlice";
import socket from "../../socket/socket";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { cart } = useCart();

  const user = useSelector(
    (state) => state.user.user
  );

  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  /* ===============================
     CLOSE MENU ON ROUTE CHANGE
  =============================== */

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  /* ===============================
     CLOSE MOBILE MENU
  =============================== */

  const closeMenu = () => {
    setOpen(false);
  };

  /* ===============================
     OPEN LOGIN
  =============================== */

  const openLogin = () => {
    setModalOpen(true);
    setOpen(false);
  };

  /* ===============================
     CLOSE MODAL
  =============================== */

  const closeModal = () => {
    setModalOpen(false);
  };

  /* ===============================
     LOGOUT
  =============================== */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    dispatch(clearUser());

    socket.disconnect();

    navigate("/");
  };

  /* ===============================
     TOGGLE MOBILE MENU
  =============================== */

  const toggleMenu = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="site-header">

        {/* =====================================================
            NAVBAR
        ===================================================== */}

        <nav className="navbar">

          {/* ================= LOGO ================= */}
          <Link
            to="/"
            className="logo"
            onClick={closeMenu}
          >
            <img
              src="/faa43b98-1cf0-4ef4-9150-a3674c569bc7-removebg-preview.png"
              alt="FAMY Logo"
              className="logo-img"
            />

            <span className="logo-text">
              <span className="logo-main">FA</span>
              <span className="logo-name">MY</span>
            </span>
          </Link>

          {/* =================================================
              HAMBURGER
          ================================================= */}

          <button
            type="button"
            className={`menu-icon ${
              open ? "open" : ""
            }`}
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* =================================================
              NAVIGATION LINKS
          ================================================= */}

          <ul
            className={`nav-links ${
              open ? "active" : ""
            }`}
          >

            {/* HOME */}
            <li>
              <Link
                to="/"
                onClick={closeMenu}
              >
                Home
              </Link>
            </li>

            {/* RESTAURANTS */}
            <li>
              <Link
                to="/restaurants"
                onClick={closeMenu}
              >
                Restaurants
              </Link>
            </li>

            {/* ABOUT */}
            <li>
              <Link
                to="/about"
                onClick={closeMenu}
              >
                About
              </Link>
            </li>

            {/* CONTACT */}
            <li>
              <Link
                to="/contact"
                onClick={closeMenu}
              >
                Contact
              </Link>
            </li>

            {/* =================================================
                CART
            ================================================= */}

            {isLoggedIn && (
              <li className="cart-icon">

                <Link
                  to="/cart"
                  onClick={closeMenu}
                  aria-label="Shopping cart"
                >
                  <FaShoppingCart />

                  {totalItems > 0 && (
                    <span className="cart-badge">
                      {totalItems}
                    </span>
                  )}
                </Link>

              </li>
            )}

            {/* =================================================
                ADMIN
            ================================================= */}

            {isLoggedIn && isAdmin && (
              <li>
                <Link
                  to="/admin"
                  className="panel-link"
                  onClick={closeMenu}
                >
                  Admin
                </Link>
              </li>
            )}

            {/* =================================================
                RESTAURANT OWNER
            ================================================= */}

            {user?.role === "restaurantOwner" && (
              <li>

                <Link
                  to="/restaurant"
                  className="restaurant-panel-btn"
                  onClick={closeMenu}
                >
                  <span className="restaurant-icon">
                    🍽️
                  </span>

                  <span>
                    Restaurant Panel
                  </span>
                </Link>

              </li>
            )}

            {/* =================================================
                AUTH
            ================================================= */}

            <li>

              <button
                type="button"
                className="auth-btn"
                onClick={() => {
                  if (isLoggedIn) {
                    handleLogout();
                  } else {
                    openLogin();
                  }

                  closeMenu();
                }}
              >
                {isLoggedIn
                  ? "Logout"
                  : "Login"}
              </button>

            </li>

          </ul>

        </nav>

      </header>

      {/* =====================================================
          LOGIN MODAL
      ===================================================== */}

      {modalOpen && (
        <Modal closeModal={closeModal}>
          <InputForm
            closeModal={closeModal}
          />
        </Modal>
      )}

    </>
  );
};

export default Navbar;