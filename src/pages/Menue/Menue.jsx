// import React, { useEffect, useState } from "react";
// import { FaCartPlus } from "react-icons/fa";
// import { MdFavorite, MdOutlineFavoriteBorder } from "react-icons/md";
// import { useCart } from "../../component/CartContext/CartContext";
// import { useNavigate } from "react-router-dom";
// import api from "../../api/api";
// import { baseUrlHandler } from "../../utils/baseUrlHandler";
// import socket from "../../socket/socket";
// import "./Menue.css";

// const categories = [
//   "all","beef","chicken","pizza","crepes","dessert","drinks","soup","seafood","pasta","salad",
// ];

// const Menue = () => {
//   const [recipes, setRecipes] = useState([]);
//   const [favorites, setFavorites] = useState([]);
//   const [active, setActive] = useState("all");
//   const [loading, setLoading] = useState(true);

//   const [selectedVariants, setSelectedVariants] = useState({});

//   const navigate = useNavigate();
//   const { addToCart } = useCart();

//   const getImageUrl = (item) => {
//     const img = item.CoverImage;
//     if (!img) return "https://via.placeholder.com/300";
//     if (img.startsWith("http")) return img;
//     return `${baseUrlHandler()}/${img.replace(/^\/+/, "")}`;
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const res = await api.get("/api/v1/recipes");
//         setRecipes(res.data);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//     setFavorites(JSON.parse(localStorage.getItem("favorites")) || []);

//     socket.on("recipeCreated", (r) => setRecipes((p) => [r, ...p]));
//     socket.on("recipeUpdated", (r) =>
//       setRecipes((p) => p.map((i) => (i._id === r._id ? r : i)))
//     );
//     socket.on("recipeDeleted", (id) =>
//       setRecipes((p) => p.filter((i) => i._id !== id))
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
//       : recipes.filter((r) => r.category?.toLowerCase() === active);

//   const handleSelectVariant = (productId, variant) => {
//     setSelectedVariants((prev) => ({
//       ...prev,
//       [productId]: variant,
//     }));
//   };

//   // 🔥 FIXED LOGIC
//   const handleAddToCart = (item) => {
//     const hasVariants = item.variants && item.variants.length > 0;
//     const selected = selectedVariants[item._id];

//     if (hasVariants && !selected) {
//       return alert("Please select size first 🔥");
//     }

//     addToCart({
//       _id: item._id,
//       title: item.title,
//       selectedVariant: selected || null,
//       price: selected ? selected.price : item.price,
//     });
//   };

//   return (
//     <div className="menu-page">

//       <div className="menu-header">
//         <h1>🍽 Our Menu</h1>
//         <p>Fresh • Fast • Premium Taste</p>
//       </div>

//       <div className="categories">
//         {categories.map((cat) => (
//           <button
//             key={cat}
//             onClick={() => setActive(cat)}
//             className={active === cat ? "cat active" : "cat"}
//           >
//             {cat}
//           </button>
//         ))}
//       </div>

//       <div className="menu-grid">

//         {loading ? (
//           <div className="loader"></div>
//         ) : (

//           filtered.map((item) => {
//             const selected = selectedVariants[item._id];

//             return (
//               <div key={item._id} className="menu-card">

//                 <div className="image-wrapper">
//                   <img src={getImageUrl(item)} alt={item.title} />
//                 </div>

//                 <div className="content">

//                   <h3>{item.title}</h3>

//                   <p className="desc">
//                     {Array.isArray(item.ingredients)
//                       ? item.ingredients.join(", ")
//                       : item.ingredients}
//                   </p>

//                   {/* VARIANTS */}
//                   {item.variants?.length > 0 && (
//                     <div className="variants">
//                       {item.variants.map((v, i) => (
//                         <button
//                           key={i}
//                           className={
//                             selected?.name === v.name
//                               ? "variant active"
//                               : "variant"
//                           }
//                           onClick={() =>
//                             handleSelectVariant(item._id, v)
//                           }
//                         >
//                           {v.name}
//                         </button>
//                       ))}
//                     </div>
//                   )}

//                   {/* PRICE */}
//                   <div className="price-box">

//                     {!item.variants || item.variants.length === 0 ? (
//                       <span className="price">
//                         {item.price} EGP
//                       </span>
//                     ) : selected ? (
//                       <>
//                         <span className="price">
//                           {selected.price} EGP
//                         </span>
//                         <br />
//                         <small>{selected.name}</small>
//                       </>
//                     ) : (
//                       <span className="hint">
//                         Select size
//                       </span>
//                     )}

//                   </div>

//                   {/* BUTTONS */}
//                   <div className="btn-group">

//                     <button
//                       className="add-btn"
//                       onClick={() => handleAddToCart(item)}
//                     >
//                       <FaCartPlus /> Add
//                     </button>

//                     <button
//                       className="view-btn"
//                       onClick={() =>
//                         navigate(`/recipe/${item._id}`)
//                       }
//                     >
//                       View
//                     </button>

//                   </div>

//                 </div>

//                 <div
//                   className="fav-icon"
//                   onClick={() => toggleFavorite(item._id)}
//                 >
//                   {favorites.includes(item._id) ? (
//                     <MdFavorite color="#e74c3c" size={22} />
//                   ) : (
//                     <MdOutlineFavoriteBorder size={22} />
//                   )}
//                 </div>

//               </div>
//             );
//           })
//         )}

//       </div>
//     </div>
//   );
// };

// export default Menue;




import React, { useEffect, useMemo, useState } from "react";
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

const MenuCard = React.memo(
  ({
    item,
    favorite,
    toggleFavorite,
    navigate,
    addToCart,
    getImageUrl,
  }) => {
    const [selectedVariant, setSelectedVariant] = useState(null);

    const handleAddToCart = () => {
      const hasVariants =
        item.variants && item.variants.length > 0;

      if (hasVariants && !selectedVariant) {
        return alert("Please select size first 🔥");
      }

      addToCart({
        _id: item._id,
        title: item.title,
        selectedVariant: selectedVariant || null,
        price: selectedVariant
          ? selectedVariant.price
          : item.price,
        CoverImage: item.CoverImage,
      });
    };

    return (
      <div className="menu-card">

        <div className="fav-icon">
          <button
            onClick={() => toggleFavorite(item._id)}
            className="fav-btn"
          >
            {favorite ? (
              <MdFavorite color="#e74c3c" size={22} />
            ) : (
              <MdOutlineFavoriteBorder size={22} />
            )}
          </button>
        </div>

        <div className="image-wrapper">
          <img
            src={getImageUrl(item)}
            alt={item.title}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="content">

          <h3>{item.title}</h3>

          <p className="desc">
            {Array.isArray(item.ingredients)
              ? item.ingredients.join(", ")
              : item.ingredients}
          </p>

          {item.variants?.length > 0 && (
            <div className="variants">

              {item.variants.map((variant, index) => (
                <button
                  key={index}
                  className={
                    selectedVariant?.name === variant.name
                      ? "variant active"
                      : "variant"
                  }
                  onClick={() =>
                    setSelectedVariant(variant)
                  }
                >
                  {variant.name}
                </button>
              ))}

            </div>
          )}

          <div className="price-box">

            {!item.variants ||
            item.variants.length === 0 ? (
              <span className="price">
                {item.price} EGP
              </span>
            ) : selectedVariant ? (
              <>
                <span className="price">
                  {selectedVariant.price} EGP
                </span>

                <small className="selected-size">
                  {selectedVariant.name}
                </small>
              </>
            ) : (
              <span className="hint">
                Select size
              </span>
            )}

          </div>

          <div className="btn-group">

            <button
              className="add-btn"
              onClick={handleAddToCart}
            >
              <FaCartPlus />
              Add
            </button>

            <button
              className="view-btn"
              onClick={() =>
                navigate(`/recipe/${item._id}`)
              }
            >
              View
            </button>

          </div>

        </div>

      </div>
    );
  }
);

const Menue = () => {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [active, setActive] = useState("all");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { addToCart } = useCart();

  const getImageUrl = (item) => {
    const img = item.CoverImage;

    if (!img) {
      return "https://via.placeholder.com/600x400";
    }

    if (img.startsWith("http")) {
      return `${img}?auto=format&fit=crop&w=600&q=80`;
    }

    return `${baseUrlHandler()}/${img.replace(
      /^\/+/,
      ""
    )}`;
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);

        const res = await api.get("/api/v1/recipes");

        setRecipes(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();

    const favs =
      JSON.parse(localStorage.getItem("favorites")) || [];

    setFavorites(favs);

    socket.off("recipeCreated");
    socket.off("recipeUpdated");
    socket.off("recipeDeleted");

    socket.on("recipeCreated", (recipe) => {
      setRecipes((prev) => [recipe, ...prev]);
    });

    socket.on("recipeUpdated", (recipe) => {
      setRecipes((prev) =>
        prev.map((item) =>
          item._id === recipe._id ? recipe : item
        )
      );
    });

    socket.on("recipeDeleted", (id) => {
      setRecipes((prev) =>
        prev.filter((item) => item._id !== id)
      );
    });

    return () => {
      socket.off("recipeCreated");
      socket.off("recipeUpdated");
      socket.off("recipeDeleted");
    };
  }, []);

  const filteredRecipes = useMemo(() => {
    return active === "all"
      ? recipes
      : recipes.filter(
          (recipe) =>
            recipe.category?.toLowerCase() === active
        );
  }, [recipes, active]);

  const toggleFavorite = (id) => {
    const updated = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];

    setFavorites(updated);

    localStorage.setItem(
      "favorites",
      JSON.stringify(updated)
    );
  };

  return (
    <div className="menu-page">

      <div className="menu-header">
        <h1>🍽 Our Menu</h1>
        <p>Fresh • Fast • Premium Taste</p>
      </div>

      <div className="categories">

        {categories.map((cat) => (
          <button
            key={cat}
            className={
              active === cat ? "cat active" : "cat"
            }
            onClick={() => setActive(cat)}
          >
            {cat}
          </button>
        ))}

      </div>

      {loading ? (

        <div className="skeleton-grid">

          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="skeleton-card"
            >
              <div className="skeleton-image"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line short"></div>
            </div>
          ))}

        </div>

      ) : (

        <div className="menu-grid">

          {filteredRecipes.map((item) => (
            <MenuCard
              key={item._id}
              item={item}
              favorite={favorites.includes(item._id)}
              toggleFavorite={toggleFavorite}
              navigate={navigate}
              addToCart={addToCart}
              getImageUrl={getImageUrl}
            />
          ))}

        </div>

      )}

    </div>
  );
};

export default Menue;