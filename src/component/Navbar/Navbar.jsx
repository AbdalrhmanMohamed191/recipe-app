// import React, { useState } from "react";
// import img_2 from "../../assets/images-removebg-preview.png";
// import "./Navbar.css";
// import Modal from "../Modal/Modal";
// import InputForm from "../InputForm/InputForm";
// import { Link, useNavigate } from "react-router-dom";
// import { useCart } from "../CartContext/CartContext";
// import { FaShoppingCart } from "react-icons/fa";
// import { useSelector, useDispatch } from "react-redux";
// import { clearUser } from "../../../store/userSlice/userSlice";
// import socket from "../../socket/socket";

// const Navbar = () => {
//   const [open, setOpen] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);

//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { cart } = useCart();
//   const user = useSelector((state) => state.user.user);

//   const isLoggedIn = !!user;
//   const isAdmin = user?.role === "admin";

//   const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

//   const openLogin = () => {
//     setModalOpen(true);
//     setOpen(false);
//   };

//   const closeModal = () => setModalOpen(false);

//   const handleLogout = () => {
    
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     dispatch(clearUser());
//     // socket.disconnect();
//       socket.disconnect();
//     navigate("/");
    
//   };

//   const handleProtectRoute = (e) => {
//     if (!isLoggedIn) {
//       e.preventDefault();
//       setModalOpen(true);
//     } else {
//       setOpen(false);
//     }
//   };

//   return (
//     <>
//       <header>
//         <nav className="navbar">

//           <div className="logo">
//             <img src={img_2} alt="Logo" />
//           </div>

//           <div className="menu-icon" onClick={() => setOpen(!open)}>
//             ☰
//           </div>

//           <ul className={`nav-links ${open ? "active" : ""}`}>

//             <li><Link to="/">Home</Link></li>

//             <li>
//               <Link to="/menue" onClick={handleProtectRoute}>
//                 Menue
//               </Link>
//             </li>

//             <li><Link to="/about">About</Link></li>
//             <li><Link to="/contact">Contact</Link></li>

//             {isLoggedIn && (
//               <li className="cart-icon">
//                 <Link to="/cart">
//                   <FaShoppingCart />
//                   {totalItems > 0 && (
//                     <span className="cart-badge">{totalItems}</span>
//                   )}
//                 </Link>
//               </li>
//             )}
//               {isLoggedIn && (
//                     <li>
//                       <Link to="/myorders">My Orders</Link>
//                     </li>
//             )}

//             {isAdmin && (
//               <li><Link to="/admin">Admin</Link></li>
//             )}

//             <li onClick={isLoggedIn ? handleLogout : openLogin}>
//               {isLoggedIn ? "Logout" : "Login"}
//             </li>

//           </ul>
//         </nav>
//       </header>

//       {modalOpen && (
//         <Modal closeModal={closeModal}>
//           <InputForm closeModal={closeModal} />
//         </Modal>
//       )}
//     </>
//   );
// };

// export default Navbar;



import React, { useState } from "react";
import img_2 from "../../assets/images-removebg-preview.png";
import "./Navbar.css";
import Modal from "../Modal/Modal";
import InputForm from "../InputForm/InputForm";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../CartContext/CartContext";
import { FaShoppingCart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../../store/userSlice/userSlice";
import socket from "../../socket/socket";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cart } = useCart();
  const user = useSelector((state) => state.user.user);

  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

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
    } else {
      setOpen(false);
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

          {/* MENU ICON */}
          <div className="menu-icon" onClick={() => setOpen(!open)}>
            ☰
          </div>

          {/* NAV LINKS */}
          <ul className={`nav-links ${open ? "active" : ""}`}>

            {/* MAIN LINKS */}
            <li><Link to="/">Home</Link></li>

            <li>
              <Link to="/menue" onClick={handleProtectRoute}>
                Menu
              </Link>
            </li>

            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>

            {/* USER SECTION */}
            {isLoggedIn && (
              <>
                {/* CART */}
                <li className="cart-icon">
                  <Link to="/cart">
                    <FaShoppingCart />
                    {totalItems > 0 && (
                      <span className="cart-badge">{totalItems}</span>
                    )}
                  </Link>
                </li>

                {/* MY ORDERS */}
                <li>
                  <Link to="/myorders">My Orders</Link>
                </li>

                {/* ADMIN */}
                {isAdmin && (
                  <li>
                    <Link to="/admin">Admin</Link>
                  </li>
                )}
              </>
            )}

            {/* AUTH BUTTON */}
            <li>
              <button
                className="auth-btn"
                onClick={isLoggedIn ? handleLogout : openLogin}
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