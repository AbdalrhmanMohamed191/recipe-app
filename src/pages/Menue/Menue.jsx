
// // // const categories = [
// // //   "all",
// // //   "beef",
// // //   "chicken",
// // //   "pizza",
// // //   "dessert",
// // //   "drinks",
// // //   "soup",
// // //   "seafood",
// // //   "pasta",
// // //   "salad",
// // // ];

// import React, { useEffect, useState } from "react";
// import { FaCartPlus } from "react-icons/fa";
// import { MdFavorite, MdOutlineFavoriteBorder } from "react-icons/md";
// import { useCart } from "../../component/CartContext/CartContext";
// import { useNavigate } from "react-router-dom";
// import api from "../../api/api";
// import { baseUrlHandler } from "../../utils/baseUrlHandler";
// import socket from "../../socket/socket"; 

// // const categories = [
// //   "all", "burger", "pizza", "pasta", "chicken", "drinks", "dessert"
// // ];


// const categories = [
//   "all",
//   "beef",
//   "chicken",
//   "pizza",
//   "crepes",
//   "dessert",
//   "drinks",
//   "soup",
//   "seafood",
//   "pasta",
//   "salad",
// ];

// const Menue = () => {
//   const [recipes, setRecipes] = useState([]);
//   const [favorites, setFavorites] = useState([]);
//   const [active, setActive] = useState("all");
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const { addToCart } = useCart();

//   const getImageUrl = (item) => {
//     const img = item.image || item.coverImage || item.CoverImage;
//     if (!img) return "https://via.placeholder.com/300?text=No+Image";
//     if (typeof img === "string" && img.startsWith("http")) return img;
//     return `${baseUrlHandler()}/${img.replace(/^\/+/, "")}`;
//   };

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/api/v1/recipes");
//       setRecipes(res.data);
//     } catch (err) {
//       console.error("Error fetching menu:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     setFavorites(JSON.parse(localStorage.getItem("favorites")) || []);

//     // 2. الاستماع للتغييرات اللحظية من السوكت
//     socket.on("recipeCreated", (newRecipe) => {
//       setRecipes((prev) => [newRecipe, ...prev]);
//     });

//     socket.on("recipeUpdated", (updatedRecipe) => {
//       setRecipes((prev) =>
//         prev.map((r) => (r._id === updatedRecipe._id ? updatedRecipe : r))
//       );
//     });

//     socket.on("recipeDeleted", (deletedId) => {
//       setRecipes((prev) => prev.filter((r) => r._id !== deletedId));
//     });

//     // 3. تنظيف الـ Listeners عند الخروج من الصفحة
//     return () => {
//       socket.off("recipeCreated");
//       socket.off("recipeUpdated");
//       socket.off("recipeDeleted");
//     };
//   }, []);

//   const toggleFavorite = (id) => {
//     const updated = favorites.includes(id)
//       ? favorites.filter((f) => f !== id)
//       : [...favorites, id];
//     setFavorites(updated);
//     localStorage.setItem("favorites", JSON.stringify(updated));
//   };

//   const filtered =
//     active === "all"
//       ? recipes
//       : recipes.filter(
//           (r) => r.category?.toLowerCase() === active.toLowerCase()
//         );

//   return (
//     <div style={{ background: "#f8f7f4", minHeight: "100vh" }}>
//       {/* HEADER */}
//       <div className="text-center py-5">
//         <h2 style={{ fontFamily: "serif", letterSpacing: "2px", fontSize: "40px", marginTop: "60px" }}>
//           Our Restaurant Menu
//         </h2>
//         <p className="text-muted mb-4 fs-5" style={{ fontFamily: "serif" }}>Fresh ingredients • Premium taste • Made with love</p>
//       </div>

//       {/* CATEGORIES */}
//       <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
//         {categories.map((cat) => (
//           <button
//             key={cat}
//             onClick={() => setActive(cat)}
//             className="btn btn-sm"
//             style={{
//               borderRadius: "30px",
//               padding: "6px 18px",
//               border: "1px solid #c7b8a5",
//               background: active === cat ? "#2f2a24" : "transparent",
//               color: active === cat ? "#fff" : "#2f2a24",
//               transition: "0.3s",
//               fontWeight: "500",
//             }}
//           >
//             {cat.toUpperCase()}
//           </button>
//         ))}
//       </div>

//       {/* GRID */}
//       <div className="container pb-5">
//         {loading ? (
//           <div className="text-center py-5">
//             <div className="spinner-border text-dark" role="status"></div>
//           </div>
//         ) : (
//           <div className="row g-4 justify-content-center align-items-center">
//             {filtered.map((item) => (
//               <div key={item._id} className="col-12 col-sm-6 col-md-4">
//                 <div
//                   style={{
//                     background: "#fff",
//                     borderRadius: "18px",
//                     overflow: "hidden",
//                     boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
//                     position: "relative",
//                     transition: "0.3s",
//                   }}
//                   className="menu-card"
//                 >
//                   <img
//                     src={getImageUrl(item)}
//                     alt={item.title}
//                     style={{ width: "100%", height: "220px", objectFit: "cover" }}
//                     onError={(e) => { e.target.src = "https://via.placeholder.com/300?text=Error+Loading"; }}
//                   />

//                   <div className="p-3">
//                     <h5 style={{ fontFamily: "serif", marginBottom: "5px" }}>{item.title}</h5>
//                     <p className="text-muted small mb-2" style={{ height: "40px", overflow: "hidden" }}>
//                       {Array.isArray(item.ingredients) ? item.ingredients.join(", ") : item.ingredients}
//                     </p>
//                     <div style={{ fontWeight: "600", color: "#2f2a24", marginBottom: "10px" }}>
//                       {item.price} EGP
//                     </div>

//                     <button
//                       onClick={() => addToCart(item)}
//                       style={{
//                         width: "100%", padding: "10px", borderRadius: "10px", border: "none",
//                         background: "#2f2a24", color: "white", fontWeight: "500", letterSpacing: "1px",
//                       }}
//                     >
//                       <FaCartPlus style={{ marginRight: "6px" }} /> Order Now
//                     </button>

//                     <button
//                       onClick={() => navigate(`/recipe/${item._id}`)}
//                       style={{
//                         width: "100%", padding: "8px", marginTop: "8px", borderRadius: "10px",
//                         border: "1px solid #664720", background: "transparent", color: "#2f2a24", fontWeight: "500",
//                       }}
//                     >
//                       View Details
//                     </button>
//                   </div>

//                   <div
//                     onClick={() => toggleFavorite(item._id)}
//                     style={{
//                       position: "absolute", top: "10px", right: "10px",
//                       background: "rgba(255,255,255,0.9)", borderRadius: "50%",
//                       padding: "6px", cursor: "pointer", zIndex: 2
//                     }}
//                   >
//                     {favorites.includes(item._id) ? (
//                       <MdFavorite color="#c0392b" size={22} />
//                     ) : (
//                       <MdOutlineFavoriteBorder size={22} />
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Menue;


import React, { useEffect, useState } from "react";
import { FaCartPlus } from "react-icons/fa";
import { MdFavorite, MdOutlineFavoriteBorder } from "react-icons/md";
import { useCart } from "../../component/CartContext/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { baseUrlHandler } from "../../utils/baseUrlHandler";
import socket from "../../socket/socket";
import "./Menue.css";

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
    if (!img) return "https://via.placeholder.com/300";
    if (img.startsWith("http")) return img;
    return `${baseUrlHandler()}/${img.replace(/^\/+/, "")}`;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/recipes");
      setRecipes(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setFavorites(JSON.parse(localStorage.getItem("favorites")) || []);

    socket.on("recipeCreated", (newRecipe) => {
      setRecipes((prev) => [newRecipe, ...prev]);
    });

    socket.on("recipeUpdated", (updated) => {
      setRecipes((prev) =>
        prev.map((r) => (r._id === updated._id ? updated : r))
      );
    });

    socket.on("recipeDeleted", (id) => {
      setRecipes((prev) => prev.filter((r) => r._id !== id));
    });

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
      : recipes.filter((r) => r.category?.toLowerCase() === active);

  return (
    <div className="menu-page">

      {/* HEADER */}
      <div className="menu-header">
        <h1>Our Restaurant Menu</h1>
        <p>Fresh ingredients • Premium taste • Luxury dining experience</p>
      </div>

      {/* CATEGORIES */}
      <div className="categories">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={active === cat ? "active" : ""}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="menu-grid">
        {loading ? (
          <div className="loader"></div>
        ) : (
          filtered.map((item) => (
            <div key={item._id} className="menu-card">

              <div className="image-wrapper">
                <img src={getImageUrl(item)} alt={item.title} />
              </div>

              <div className="content">
                <h3>{item.title}</h3>

                <p className="desc">
                  {Array.isArray(item.ingredients)
                    ? item.ingredients.join(", ")
                    : item.ingredients}
                </p>

                <div className="price">{item.price} EGP</div>

                <button className="order-btn" onClick={() => addToCart(item)}>
                  <FaCartPlus /> Order Now
                </button>

                <button
                  className="view-btn"
                  onClick={() => navigate(`/recipe/${item._id}`)}
                >
                  View Details
                </button>
              </div>

              <div
                className="fav-icon"
                onClick={() => toggleFavorite(item._id)}
              >
                {favorites.includes(item._id) ? (
                  <MdFavorite color="#c0392b" size={22} />
                ) : (
                  <MdOutlineFavoriteBorder size={22} />
                )}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Menue;

// import React, { useEffect, useState } from "react";
// import { FaCartPlus } from "react-icons/fa";
// import { MdFavorite, MdOutlineFavoriteBorder } from "react-icons/md";
// import { useCart } from "../../component/CartContext/CartContext";
// import { useNavigate } from "react-router-dom";
// import api from "../../api/api";
// import { baseUrlHandler } from "../../utils/baseUrlHandler";
// import socket from "../../socket/socket";

// const categories = [
//   "all",
//   "beef",
//   "chicken",
//   "pizza",
//   "crepes",
//   "dessert",
//   "drinks",
//   "soup",
//   "seafood",
//   "pasta",
//   "salad",
// ];

// const Menue = () => {
//   const [recipes, setRecipes] = useState([]);
//   const [favorites, setFavorites] = useState([]);
//   const [active, setActive] = useState("all");
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();
//   const { addToCart } = useCart();

//   const getImageUrl = (item) => {
//   const img = item.image || item.coverImage || item.CoverImage;

//   if (!img) return "https://via.placeholder.com/400?text=No+Image";

//   // لو Unsplash
//   if (img.includes("images.unsplash.com")) {
//     return `${img}?auto=format&fit=crop&w=800&q=80`;
//   }

//   if (img.startsWith("http")) return img;

//   return `${baseUrlHandler()}/${img.replace(/^\/+/, "")}`;
// };

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/api/v1/recipes");
//       setRecipes(res.data);
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     setFavorites(JSON.parse(localStorage.getItem("favorites")) || []);

//     socket.on("recipeCreated", (data) => setRecipes((p) => [data, ...p]));
//     socket.on("recipeUpdated", (data) =>
//       setRecipes((p) => p.map((r) => (r._id === data._id ? data : r)))
//     );
//     socket.on("recipeDeleted", (id) =>
//       setRecipes((p) => p.filter((r) => r._id !== id))
//     );

//     return () => {
//       socket.off("recipeCreated");
//       socket.off("recipeUpdated");
//       socket.off("recipeDeleted");
//     };
//   }, []);

//   const toggleFavorite = (id) => {
//     const updated = favorites.includes(id)
//       ? favorites.filter((f) => f !== id)
//       : [...favorites, id];

//     setFavorites(updated);
//     localStorage.setItem("favorites", JSON.stringify(updated));
//   };

//   const filtered =
//     active === "all"
//       ? recipes
//       : recipes.filter(
//           (r) => r.category?.toLowerCase() === active.toLowerCase()
//         );

//   return (
//     <div style={styles.page}>

//       {/* HEADER */}
//       <div style={styles.header}>
//         <h1 style={styles.title}>Our Menu</h1>
//         <p style={styles.subtitle}>
//           Fresh ingredients • Premium taste • Crafted with passion
//         </p>
//       </div>

//       {/* CATEGORIES */}
//       <div style={styles.categories}>
//         {categories.map((cat) => (
//           <button
//             key={cat}
//             onClick={() => setActive(cat)}
//             style={{
//               ...styles.catBtn,
//               background: active === cat ? "#2f2a24" : "transparent",
//               color: active === cat ? "#fff" : "#2f2a24",
//             }}
//           >
//             {cat}
//           </button>
//         ))}
//       </div>

//       {/* GRID */}
//       <div className="container pb-5">
//         {loading ? (
//           <div style={styles.loader}></div>
//         ) : (
//           <div style={styles.grid}>
//             {filtered.map((item) => (
//               <div key={item._id} style={styles.card}>
                
//                 <img
//                   src={getImageUrl(item)}
//                   alt=""
//                   style={styles.image}
//                 />

//                 <div style={styles.content}>
//                   <h3 style={styles.foodTitle}>{item.title}</h3>
//                   <p style={styles.desc}>
//                     {Array.isArray(item.ingredients)
//                       ? item.ingredients.join(", ")
//                       : item.ingredients}
//                   </p>

//                   <div style={styles.price}>{item.price} EGP</div>

//                   <button
//                     style={styles.btn}
//                     onClick={() => addToCart(item)}
//                   >
//                     <FaCartPlus /> Order Now
//                   </button>

//                   <button
//                     style={styles.outlineBtn}
//                     onClick={() => navigate(`/recipe/${item._id}`)}
//                   >
//                     View Details
//                   </button>
//                 </div>

//                 <div
//                   onClick={() => toggleFavorite(item._id)}
//                   style={styles.favIcon}
//                 >
//                   {favorites.includes(item._id) ? (
//                     <MdFavorite color="#c0392b" />
//                   ) : (
//                     <MdOutlineFavoriteBorder />
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Menue;

// /* ================= STYLES ================= */

// const styles = {
//   page: {
//     background: "#f8f7f4",
//     minHeight: "100vh",
//   },

//   header: {
//     textAlign: "center",
//     padding: "80px 20px 20px",
//   },

//   title: {
//     fontSize: "42px",
//     fontFamily: "serif",
//     color: "#2f2a24",
//   },

//   subtitle: {
//     color: "#7a6a58",
//     fontSize: "16px",
//     marginTop: "10px",
//   },

//   categories: {
//     display: "flex",
//     flexWrap: "wrap",
//     justifyContent: "center",
//     gap: "10px",
//     marginBottom: "40px",
//   },

//   catBtn: {
//     padding: "8px 18px",
//     borderRadius: "25px",
//     border: "1px solid #c7b8a5",
//     cursor: "pointer",
//     transition: "0.3s",
//     fontWeight: "500",
//   },

//   grid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//     gap: "25px",
//   },

//   card: {
//     background: "#fff",
//     borderRadius: "18px",
//     overflow: "hidden",
//     position: "relative",
//     boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
//   },

//   image: {
//     width: "100%",
//     height: "200px",
//     objectFit: "cover",
//   },

//   content: {
//     padding: "15px",
//   },

//   foodTitle: {
//     fontFamily: "serif",
//     marginBottom: "5px",
//     color: "#2f2a24",
//   },

//   desc: {
//     fontSize: "13px",
//     color: "#777",
//     height: "40px",
//     overflow: "hidden",
//   },

//   price: {
//     marginTop: "8px",
//     fontWeight: "bold",
//     color: "#2f2a24",
//   },

//   btn: {
//     width: "100%",
//     padding: "10px",
//     marginTop: "10px",
//     background: "#2f2a24",
//     color: "#fff",
//     border: "none",
//     borderRadius: "10px",
//     cursor: "pointer",
//   },

//   outlineBtn: {
//     width: "100%",
//     padding: "8px",
//     marginTop: "8px",
//     border: "1px solid #664720",
//     background: "transparent",
//     borderRadius: "10px",
//     cursor: "pointer",
//   },

//   favIcon: {
//     position: "absolute",
//     top: "10px",
//     right: "10px",
//     background: "rgba(255,255,255,0.9)",
//     padding: "6px",
//     borderRadius: "50%",
//     cursor: "pointer",
//   },

//   loader: {
//     width: "40px",
//     height: "40px",
//     border: "4px solid #ddd",
//     borderTop: "4px solid #2f2a24",
//     borderRadius: "50%",
//     margin: "50px auto",
//     animation: "spin 1s linear infinite",
//   },
// };