
// // const categories = [
// //   "all",
// //   "beef",
// //   "chicken",
// //   "pizza",
// //   "dessert",
// //   "drinks",
// //   "soup",
// //   "seafood",
// //   "pasta",
// //   "salad",
// // ];

import React, { useEffect, useState } from "react";
import { FaCartPlus } from "react-icons/fa";
import { MdFavorite, MdOutlineFavoriteBorder } from "react-icons/md";
import { useCart } from "../../component/CartContext/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { baseUrlHandler } from "../../utils/baseUrlHandler";
import socket from "../../socket/socket"; // 1. استيراد السوكت

// const categories = [
//   "all", "burger", "pizza", "pasta", "chicken", "drinks", "dessert"
// ];


const categories = [
  "all",
  "beef",
  "chicken",
  "pizza",
  "crepes",
  "dessert",
  "drinks",
  "soup",
  "seafood",
  "pasta",
  "salad",
];

const Menue = () => {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [active, setActive] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const getImageUrl = (item) => {
    const img = item.image || item.coverImage || item.CoverImage;
    if (!img) return "https://via.placeholder.com/300?text=No+Image";
    if (typeof img === "string" && img.startsWith("http")) return img;
    return `${baseUrlHandler()}/${img.replace(/^\/+/, "")}`;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/recipes");
      setRecipes(res.data);
    } catch (err) {
      console.error("Error fetching menu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setFavorites(JSON.parse(localStorage.getItem("favorites")) || []);

    // 2. الاستماع للتغييرات اللحظية من السوكت
    socket.on("recipeCreated", (newRecipe) => {
      setRecipes((prev) => [newRecipe, ...prev]);
    });

    socket.on("recipeUpdated", (updatedRecipe) => {
      setRecipes((prev) =>
        prev.map((r) => (r._id === updatedRecipe._id ? updatedRecipe : r))
      );
    });

    socket.on("recipeDeleted", (deletedId) => {
      setRecipes((prev) => prev.filter((r) => r._id !== deletedId));
    });

    // 3. تنظيف الـ Listeners عند الخروج من الصفحة
    return () => {
      socket.off("recipeCreated");
      socket.off("recipeUpdated");
      socket.off("recipeDeleted");
    };
  }, []);

  const toggleFavorite = (id) => {
    const updated = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const filtered =
    active === "all"
      ? recipes
      : recipes.filter(
          (r) => r.category?.toLowerCase() === active.toLowerCase()
        );

  return (
    <div style={{ background: "#f8f7f4", minHeight: "100vh" }}>
      {/* HEADER */}
      <div className="text-center py-5">
        <h2 style={{ fontFamily: "serif", letterSpacing: "2px", fontSize: "40px", marginTop: "60px" }}>
          Our Restaurant Menu
        </h2>
        <p className="text-muted mb-4 fs-5" style={{ fontFamily: "serif" }}>Fresh ingredients • Premium taste • Made with love</p>
      </div>

      {/* CATEGORIES */}
      <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className="btn btn-sm"
            style={{
              borderRadius: "30px",
              padding: "6px 18px",
              border: "1px solid #c7b8a5",
              background: active === cat ? "#2f2a24" : "transparent",
              color: active === cat ? "#fff" : "#2f2a24",
              transition: "0.3s",
              fontWeight: "500",
            }}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="container pb-5">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-dark" role="status"></div>
          </div>
        ) : (
          <div className="row g-4 justify-content-center align-items-center">
            {filtered.map((item) => (
              <div key={item._id} className="col-12 col-sm-6 col-md-4">
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "18px",
                    overflow: "hidden",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
                    position: "relative",
                    transition: "0.3s",
                  }}
                  className="menu-card"
                >
                  <img
                    src={getImageUrl(item)}
                    alt={item.title}
                    style={{ width: "100%", height: "220px", objectFit: "cover" }}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/300?text=Error+Loading"; }}
                  />

                  <div className="p-3">
                    <h5 style={{ fontFamily: "serif", marginBottom: "5px" }}>{item.title}</h5>
                    <p className="text-muted small mb-2" style={{ height: "40px", overflow: "hidden" }}>
                      {Array.isArray(item.ingredients) ? item.ingredients.join(", ") : item.ingredients}
                    </p>
                    <div style={{ fontWeight: "600", color: "#2f2a24", marginBottom: "10px" }}>
                      {item.price} EGP
                    </div>

                    <button
                      onClick={() => addToCart(item)}
                      style={{
                        width: "100%", padding: "10px", borderRadius: "10px", border: "none",
                        background: "#2f2a24", color: "white", fontWeight: "500", letterSpacing: "1px",
                      }}
                    >
                      <FaCartPlus style={{ marginRight: "6px" }} /> Order Now
                    </button>

                    <button
                      onClick={() => navigate(`/recipe/${item._id}`)}
                      style={{
                        width: "100%", padding: "8px", marginTop: "8px", borderRadius: "10px",
                        border: "1px solid #664720", background: "transparent", color: "#2f2a24", fontWeight: "500",
                      }}
                    >
                      View Details
                    </button>
                  </div>

                  <div
                    onClick={() => toggleFavorite(item._id)}
                    style={{
                      position: "absolute", top: "10px", right: "10px",
                      background: "rgba(255,255,255,0.9)", borderRadius: "50%",
                      padding: "6px", cursor: "pointer", zIndex: 2
                    }}
                  >
                    {favorites.includes(item._id) ? (
                      <MdFavorite color="#c0392b" size={22} />
                    ) : (
                      <MdOutlineFavoriteBorder size={22} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menue;