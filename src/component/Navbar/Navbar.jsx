import React, { useState, useEffect } from "react";
import img_2 from "../../assets/images-removebg-preview.png";
import "./Navbar.css";
import Modal from "../Modal/Modal";
import InputForm from "../InputForm/InputForm";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../CartContext/CartContext";
import { FaShoppingCart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../../store/userSlice/userSlice";
import socket from "../../socket/socket";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { cart } = useCart();
  const user = useSelector((state) => state.user.user);

  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // يقفل المنيو تلقائي عند تغيير الصفحة
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const closeMenu = () => setOpen(false);

  const openLogin = () => {
    setModalOpen(true);
    setOpen(false);
  };

  const closeModal = () => setModalOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    dispatch(clearUser());

    socket.disconnect();

    navigate("/");
  };

  const handleProtectRoute = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setModalOpen(true);
    }
  };

  return (
    <>
      <header>
        <nav className="navbar">

          {/* LOGO */}
          <div className="logo">
            <img src={img_2} alt="Logo" />
          </div>

          {/* HAMBURGER */}
          <div className="menu-icon" onClick={() => setOpen(!open)}>
            ☰
          </div>

          {/* LINKS */}
          <ul className={`nav-links ${open ? "active" : ""}`}>

            <li>
              <Link to="/" onClick={closeMenu}>Home</Link>
            </li>

            <li>
              <Link
                to="/menue"
                onClick={(e) => {
                  handleProtectRoute(e);
                  closeMenu();
                }}
              >
                Menu
              </Link>
            </li>

            <li>
              <Link to="/about" onClick={closeMenu}>About</Link>
            </li>

            <li>
              <Link to="/contact" onClick={closeMenu}>Contact</Link>
            </li>

            {/* CART */}
            {isLoggedIn && (
              <li className="cart-icon">
                <Link to="/cart" onClick={closeMenu}>
                  <FaShoppingCart />
                  {totalItems > 0 && (
                    <span className="cart-badge">{totalItems}</span>
                  )}
                </Link>
              </li>
            )}

           

            {/* ADMIN */}
            {isLoggedIn && isAdmin && (
              <li>
                <Link to="/admin" onClick={closeMenu}>Admin</Link>
              </li>
            )}

            {/* AUTH */}
            <li>
              <button
                className="auth-btn"
                onClick={() => {
                  isLoggedIn ? handleLogout() : openLogin();
                  closeMenu();
                }}
              >
                {isLoggedIn ? "Logout" : "Login"}
              </button>
            </li>

          </ul>
        </nav>
      </header>

      {/* MODAL */}
      {modalOpen && (
        <Modal closeModal={closeModal}>
          <InputForm closeModal={closeModal} />
        </Modal>
      )}
    </>
  );
};

export default Navbar;