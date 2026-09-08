import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import Contact from "./pages/contact/contact.jsx";
import BookTable from "./pages/BookTable/BookTable.jsx";
import MyBookings from "./component/Mybooking/Mybooking.jsx";


import OffersPage from "./pages/OffersPage/OffersPage.jsx";

// Admin
import AdminLayout from "./pages/AdminLayout/AdminLayout.jsx";
import AdminHome from "./pages/AdminHome/AdminHome.jsx";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard.jsx";
import OrdersAdmin from "./pages/OrdersAdmin/OrdersAdmin.jsx";
import RecipesAdmin from "./pages/RecipesAdmin/RecipesAdmin.jsx";
import UsersAdmin from "./pages/UsersAdmin/UsersAdmin.jsx";
import AdminContacts from "./pages/AdminContacts/AdminContacts.jsx";
import AdminBookings from "./pages/AdminBookings/AdminBookings.jsx";
import AdminOffersPage from "./pages/AdminOffersPage/AdminOffersPage.jsx";

import ProtectedRouteAdmin from "./pages/Protected Route/ProtectedRouteAdmin.jsx";

// Layout
import PublicLayout from "./pages/PublicLayout/PublicLayout.jsx";

// Redux
import { setUser, clearUser } from "../store/userSlice/userSlice.js";

// API
import api from "./api/api.js";
import Restaurants from "./pages/Restaurants/Restaurants.jsx";
import AdminRestaurants from "./pages/AdminRestaurants/AdminRestaurants.jsx";
import RestaurantLayout from "./pages/RestaurantLayout/RestaurantLayout.jsx";
import RestaurantHome from "./pages/RestaurantHome/RestaurantHome.jsx";
import RestaurantDashboard from "./pages/RestaurantDashboard/RestaurantDashboard.jsx";
import RestaurantOrders from "./pages/RestaurantOrders/RestaurantOrders.jsx";
import RestaurantRecipes from "./pages/RestaurantRecipes/RestaurantRecipes.jsx";
import RestaurantProfile from "./pages/RestaurantProfile/RestaurantProfile.jsx";
import RestaurantOffer from "./pages/RestaurantOffer/RestaurantOffer.jsx";
import OfferDetails from "./pages/OfferDetails/OfferDetails.jsx";
// import AdminRestaurants from "./pages/AdminRestaurants/AdminRestaurants.jsx";
// import AdminRestaurantMenu from "./pages/AdminRestaurantMenu/AdminRestaurantMenu.jsx";
// import AdminRecipeForm from "./pages/AdminRecipeForm/AdminRecipeForm.jsx";


const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
  const initAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await api.get("/api/v1/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

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

  // ✅ CLEANUP مهم جداً
  return () => {
    socket.off("connect");
    socket.off("disconnect");
    socket.off("recipeCreated");
    socket.off("recipeUpdated");
    socket.off("recipeDeleted");
  };

}, [dispatch]);

  return (
    <>
    <BrowserRouter>
          

      <Routes>

        {/* PUBLIC ROUTES */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/menu/:id" element={<Menue />} />
          <Route path="/recipe/:id" element={<RecipeView />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/booktable" element={<BookTable />} />
          <Route path="/mybookings" element={<MyBookings />} />
          <Route path="/restaurants" element={<Restaurants />} />
         

          {/* ✅ FIXED OFFERS PAGE */}
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/offers/:id" element={<OfferDetails />} />
        </Route>

        {/* ADMIN ROUTES */}
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
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="offers" element={<AdminOffersPage />} />
          <Route path="restaurants" element={<AdminRestaurants />} />
          {/* <Route path="/admin/restaurants/:id" element={<AdminRestaurantMenu />}/>  */}
          {/* <Route path="/admin/restaurants/add" element={<AdminRecipeForm />}/> */}

        </Route>


        {/* RESTAURANT OWNER ROUTES */}
        <Route path="/restaurant" element={<RestaurantLayout />}>
          <Route index element={<RestaurantHome />} />
          <Route path="restaurantdashboard" element={<RestaurantDashboard />} />
          <Route path="restaurantorders" element={<RestaurantOrders />} />
          <Route path="restaurantrecipes" element={<RestaurantRecipes />} />
          <Route path="restaurantprofile" element={<RestaurantProfile />} />
          <Route path="restaurantoffer" element={<RestaurantOffer />} />
          {/* Add more restaurant owner routes here */}
        </Route>


        {/* 404 */}
        <Route path="*" element={<h1>404 Not Found</h1>} />

      </Routes>
    </BrowserRouter>

          </>
  );
};


export default App;