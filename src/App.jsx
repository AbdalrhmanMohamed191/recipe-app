import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import axios from "axios";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";

import socket from "./socket/socket.js";

// Public Pages
import Home from "./pages/Home/Home.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import About from "./pages/About/About.jsx";
import Menue from "./pages/Menue/Menue.jsx";
import RecipeView from "./component/RecipeView/RecipeView.jsx";
import MyOrders from "./pages/My Orders/MyOrders.jsx";

// Admin
import AdminLayout from "./pages/AdminLayout/AdminLayout.jsx";
import AdminHome from "./pages/AdminHome/AdminHome.jsx";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard.jsx";
import OrdersAdmin from "./pages/OrdersAdmin/OrdersAdmin.jsx";
import RecipesAdmin from "./pages/RecipesAdmin/RecipesAdmin.jsx";
import UsersAdmin from "./pages/UsersAdmin/UsersAdmin.jsx";
import ProtectedRouteAdmin from "./pages/Protected Route/ProtectedRouteAdmin.jsx";

// Redux
  import { setUser, clearUser } from "../store/userSlice/userSlice.js";

// layout
import PublicLayout from "./pages/PublicLayout/PublicLayout.jsx";
import api from "./api/api.js";


const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await api.get(
          "/api/v1/users/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const user = res.data.user || res.data;

        dispatch(setUser(user));
        localStorage.setItem("user", JSON.stringify(user));

        const decoded = jwtDecode(token);

        if (!socket.connected) socket.connect();

        socket.emit("join", {
          userId: decoded.userId,
          role: decoded.role,
        });

      } catch (err) {
        console.log(err);
        dispatch(clearUser());
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    };

    initAuth();

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/menue" element={<Menue />} />
          <Route path="/recipe/:id" element={<RecipeView />} />
          <Route path="/myorders" element={<MyOrders />} />
          
        </Route>

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRouteAdmin>
              <AdminLayout />
            </ProtectedRouteAdmin>
          }
        >
          <Route index element={<AdminHome />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<OrdersAdmin />} />
          <Route path="recipes" element={<RecipesAdmin />} />
          <Route path="users" element={<UsersAdmin />} />
        </Route>

        
        <Route path="*" element={<h1>404 Not Found</h1>} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;