// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { FaCartPlus } from "react-icons/fa";

// import api from "../../api/api";
// import { baseUrlHandler } from "../../utils/baseUrlHandler";
// import { useCart } from "../../component/CartContext/CartContext";

// const RecipeView = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const { addToCart } = useCart();

//   const [recipe, setRecipe] = useState(null);
//   const [selectedVariant, setSelectedVariant] = useState(null);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // ===============================
//   // IMAGE
//   // ===============================

//   const getImageUrl = (data) => {
//     if (!data) {
//       return "https://via.placeholder.com/600x400?text=No+Image";
//     }

//     const img =
//       data.CoverImage ||
//       data.coverImage ||
//       data.image;

//     if (!img) {
//       return "https://via.placeholder.com/600x400?text=No+Image";
//     }

//     if (
//       typeof img === "string" &&
//       img.startsWith("http")
//     ) {
//       return img;
//     }

//     return `${baseUrlHandler()}/${img.replace(/^\/+/, "")}`;
//   };

//   // ===============================
//   // FETCH RECIPE
//   // ===============================

//   useEffect(() => {
//     const fetchRecipe = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const res = await api.get(
//           `/api/v1/recipes/${id}`
//         );

//         const data = res.data.recipe || res.data;

//         setRecipe(data);

//         // لو المنتج مفيهوش variants
//         // مفيش حاجة نختارها
//         setSelectedVariant(null);

//       } catch (err) {
//         console.error(
//           "Recipe Error:",
//           err
//         );

//         setError("Recipe not found");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRecipe();
//   }, [id]);

//   // ===============================
//   // ADD TO CART
//   // ===============================

//   const handleAddToCart = () => {
//     if (!recipe) return;

//     // لو فيه variants لازم يختار واحد
//     if (
//       recipe.variants?.length > 0 &&
//       !selectedVariant
//     ) {
//       alert("اختار الحجم الأول 🔥");
//       return;
//     }

//     const price = selectedVariant
//       ? selectedVariant.price
//       : recipe.price;

//     addToCart({
//       _id: recipe._id,

//       title: recipe.title,

//       price: price,

//       selectedVariant:
//         selectedVariant || null,

//       CoverImage:
//         recipe.CoverImage,

//       restaurantId:
//         recipe.restaurantId,
//     });

//     alert("Added to cart 🛒");
//   };

//   // ===============================
//   // LOADING
//   // ===============================

//   if (loading) {
//     return (
//       <div
//         className="text-center text-white"
//         style={{ paddingTop: "120px" }}
//       >
//         <div
//           className="spinner-border text-warning"
//           role="status"
//         ></div>

//         <p className="mt-3">
//           Loading recipe...
//         </p>
//       </div>
//     );
//   }

//   // ===============================
//   // ERROR
//   // ===============================

//   if (error || !recipe) {
//     return (
//       <div
//         className="text-center text-white"
//         style={{ paddingTop: "120px" }}
//       >
//         <h3 className="text-danger">
//           {error || "Recipe not found"}
//         </h3>

//         <button
//           className="btn btn-outline-light mt-3"
//           onClick={() => navigate(-1)}
//         >
//           ⬅ Back
//         </button>
//       </div>
//     );
//   }

//   // ===============================
//   // CURRENT PRICE
//   // ===============================

//   const currentPrice = selectedVariant
//     ? selectedVariant.price
//     : recipe.price;

//   return (
//     <div
//       className="container py-5 text-white"
//       style={{
//         marginTop: "70px",
//         marginBottom: "50px",
//       }}
//     >
//       {/* ===============================
//           BACK
//       =============================== */}

//       <button
//         className="btn btn-outline-light mb-4"
//         onClick={() => navigate(-1)}
//       >
//         ⬅ Back
//       </button>

//       {/* ===============================
//           CARD
//       =============================== */}

//       <div className="card bg-dark text-white border-0 shadow-lg overflow-hidden">

//         {/* IMAGE */}

//         <img
//           src={getImageUrl(recipe)}
//           className="card-img-top"
//           alt={recipe.title}
//           style={{
//             width: "100%",
//             maxHeight: "500px",
//             objectFit: "cover",
//           }}
//           onError={(e) => {
//             e.currentTarget.src =
//               "https://via.placeholder.com/600x400?text=Image+Error";
//           }}
//         />

//         {/* BODY */}

//         <div className="card-body p-4">

//           {/* TITLE + PRICE */}

//           <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">

//             <div>
//               <h2 className="fw-bold">
//                 {recipe.title}
//               </h2>

//               {recipe.category && (
//                 <span className="badge bg-secondary">
//                   {recipe.category}
//                 </span>
//               )}
//             </div>

//             <div className="text-end">
//               <h3 className="text-warning fw-bold">
//                 {currentPrice} EGP
//               </h3>

//               {selectedVariant && (
//                 <small className="text-secondary">
//                   {selectedVariant.name}
//                 </small>
//               )}
//             </div>

//           </div>

//           <hr className="border-secondary" />

//           {/* ===============================
//               VARIANTS
//           =============================== */}

//           {recipe.variants?.length > 0 && (
//             <div className="mt-4">

//               <h5 className="text-warning mb-3">
//                 Choose Size
//               </h5>

//               <div className="d-flex flex-wrap gap-2">

//                 {recipe.variants.map(
//                   (variant, index) => (
//                     <button
//                       key={index}
//                       type="button"
//                       onClick={() =>
//                         setSelectedVariant(
//                           variant
//                         )
//                       }
//                       className={`btn ${
//                         selectedVariant?.name ===
//                         variant.name
//                           ? "btn-warning"
//                           : "btn-outline-light"
//                       }`}
//                     >
//                       {variant.name}

//                       {" - "}

//                       {variant.price} EGP
//                     </button>
//                   )
//                 )}

//               </div>

//             </div>
//           )}

//           {/* ===============================
//               DETAILS
//           =============================== */}

//           <div className="row mt-5">

//             {/* INGREDIENTS */}

//             <div className="col-md-5">

//               <h5 className="text-warning">
//                 Ingredients
//               </h5>

//               {Array.isArray(
//                 recipe.ingredients
//               ) &&
//               recipe.ingredients.length > 0 ? (
//                 <ul className="mt-3">
//                   {recipe.ingredients.map(
//                     (item, index) => (
//                       <li
//                         key={index}
//                         className="mb-2"
//                       >
//                         {item}
//                       </li>
//                     )
//                   )}
//                 </ul>
//               ) : (
//                 <p className="text-secondary mt-3">
//                   No ingredients listed.
//                 </p>
//               )}

//             </div>

//             {/* INSTRUCTIONS */}

//             <div className="col-md-7">

//               <h5 className="text-warning">
//                 Instructions
//               </h5>

//               <p
//                 className="mt-3"
//                 style={{
//                   whiteSpace: "pre-line",
//                   lineHeight: "1.8",
//                 }}
//               >
//                 {recipe.instructions ||
//                   "No instructions provided."}
//               </p>

//             </div>

//           </div>

//           {/* ===============================
//               ADD TO CART
//           =============================== */}

//           <div className="mt-5 d-flex gap-3 flex-wrap">

//             <button
//               className="btn btn-warning px-4 py-2 fw-bold"
//               onClick={handleAddToCart}
//             >
//               <FaCartPlus className="me-2" />

//               Add To Cart
//             </button>

//             <button
//               className="btn btn-outline-light px-4"
//               onClick={() =>
//                 navigate("/cart")
//               }
//             >
//               Go To Cart 🛒
//             </button>

//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default RecipeView;


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCartPlus, FaArrowLeft, FaShoppingCart } from "react-icons/fa";

import api from "../../api/api";
import { baseUrlHandler } from "../../utils/baseUrlHandler";
import { useCart } from "../../component/CartContext/CartContext";

import "./RecipeView.css";

const RecipeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const [recipe, setRecipe] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // IMAGE
  // =========================================================

  const getImageUrl = (data) => {
    if (!data) {
      return "https://via.placeholder.com/900x600?text=No+Image";
    }

    const img =
      data.CoverImage ||
      data.coverImage ||
      data.image;

    if (!img) {
      return "https://via.placeholder.com/900x600?text=No+Image";
    }

    if (
      typeof img === "string" &&
      img.startsWith("http")
    ) {
      return img;
    }

    return `${baseUrlHandler()}/${img.replace(/^\/+/, "")}`;
  };

  // =========================================================
  // FETCH RECIPE
  // =========================================================

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get(
          `/api/v1/recipes/${id}`
        );

        const data =
          res.data.recipe || res.data;

        setRecipe(data);
        setSelectedVariant(null);
      } catch (err) {
        console.error("Recipe Error:", err);

        setError("Recipe not found");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  // =========================================================
  // ADD TO CART
  // =========================================================

  const handleAddToCart = () => {
    if (!recipe) return;

    if (
      recipe.variants?.length > 0 &&
      !selectedVariant
    ) {
      alert("Choose a size first 🔥");
      return;
    }

    const price = selectedVariant
      ? Number(selectedVariant.price)
      : Number(recipe.price);

    addToCart({
      _id: recipe._id,

      title: recipe.title,

      price,

      selectedVariant:
        selectedVariant || null,

      CoverImage:
        recipe.CoverImage,

      restaurantId:
        recipe.restaurantId,
    });

    alert("Added to cart 🛒");
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="recipe-loading-page">

        <div className="recipe-loader"></div>

        <p>
          Loading recipe...
        </p>

      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error || !recipe) {
    return (
      <div className="recipe-error-page">

        <div className="recipe-error-box">

          <div className="error-icon">
            🍽️
          </div>

          <h2>
            {error || "Recipe not found"}
          </h2>

          <p>
            Sorry, we couldn't find this recipe.
          </p>

          <button
            type="button"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />
            Back
          </button>

        </div>

      </div>
    );
  }

  // =========================================================
  // CURRENT PRICE
  // =========================================================

  const currentPrice = selectedVariant
    ? Number(selectedVariant.price)
    : Number(recipe.price || 0);

  return (
    <div className="recipe-page">

      {/* =====================================================
          BACK
      ====================================================== */}

      <div className="recipe-container">

        <button
          type="button"
          className="recipe-back-btn"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
          <span>Back to Menu</span>
        </button>

        {/* ===================================================
            MAIN CARD
        ==================================================== */}

        <div className="recipe-card">

          {/* =================================================
              IMAGE
          ================================================== */}

          <div className="recipe-image-section">

            <img
              src={getImageUrl(recipe)}
              alt={recipe.title}
              className="recipe-main-image"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/900x600?text=Image+Error";
              }}
            />

            <div className="recipe-image-overlay"></div>

            {recipe.category && (
              <span className="recipe-category">
                {recipe.category}
              </span>
            )}

          </div>

          {/* =================================================
              CONTENT
          ================================================== */}

          <div className="recipe-content">

            {/* =================================================
                TOP
            ================================================== */}

            <div className="recipe-top">

              <div className="recipe-heading">

                <span className="recipe-label">
                  SPECIAL DISH
                </span>

                <h1>
                  {recipe.title}
                </h1>

              </div>

              <div className="recipe-price-box">

                <span className="price-label">
                  Price
                </span>

                <strong>
                  {currentPrice}
                  <small> EGP</small>
                </strong>

                {selectedVariant && (
                  <span className="price-variant">
                    {selectedVariant.name}
                  </span>
                )}

              </div>

            </div>

            {/* =================================================
                DIVIDER
            ================================================== */}

            <div className="recipe-divider"></div>

            {/* =================================================
                VARIANTS
            ================================================== */}

            {recipe.variants?.length > 0 && (
              <section className="recipe-section">

                <div className="section-heading">

                  <span className="section-icon">
                    📏
                  </span>

                  <div>
                    <h3>
                      Choose Your Size
                    </h3>

                    <p>
                      Select the option you prefer
                    </p>
                  </div>

                </div>

                <div className="variants-list">

                  {recipe.variants.map(
                    (variant, index) => {

                      const isSelected =
                        selectedVariant?.name ===
                        variant.name;

                      return (
                        <button
                          type="button"
                          key={index}
                          className={`recipe-variant ${
                            isSelected
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            setSelectedVariant(
                              variant
                            )
                          }
                        >

                          <span className="variant-name">
                            {variant.name}
                          </span>

                          <span className="variant-price">
                            {variant.price} EGP
                          </span>

                        </button>
                      );
                    }
                  )}

                </div>

              </section>
            )}

            {/* =================================================
                DETAILS
            ================================================== */}

            <div className="recipe-details">

              {/* =================================================
                  INGREDIENTS
              ================================================== */}

              <section className="recipe-section ingredients-section">

                <div className="section-heading">

                  <span className="section-icon">
                    🥗
                  </span>

                  <div>
                    <h3>
                      Ingredients
                    </h3>

                    <p>
                      What's inside this dish
                    </p>
                  </div>

                </div>

                {Array.isArray(
                  recipe.ingredients
                ) &&
                recipe.ingredients.length > 0 ? (

                  <ul className="ingredients-list">

                    {recipe.ingredients.map(
                      (item, index) => (
                        <li key={index}>

                          <span className="ingredient-dot">
                            ✓
                          </span>

                          <span>
                            {item}
                          </span>

                        </li>
                      )
                    )}

                  </ul>

                ) : (

                  <p className="no-data">
                    No ingredients listed.
                  </p>

                )}

              </section>

              {/* =================================================
                  INSTRUCTIONS
              ================================================== */}

              <section className="recipe-section instructions-section">

                <div className="section-heading">

                  <span className="section-icon">
                    👨‍🍳
                  </span>

                  <div>
                    <h3>
                      Instructions
                    </h3>

                    <p>
                      How this dish is prepared
                    </p>
                  </div>

                </div>

                <div className="instructions-box">

                  <p>
                    {recipe.instructions ||
                      "No instructions provided."}
                  </p>

                </div>

              </section>

            </div>

            {/* =================================================
                ACTIONS
            ================================================== */}

            <div className="recipe-actions">

              <button
                type="button"
                className="recipe-add-btn"
                onClick={handleAddToCart}
              >
                <FaCartPlus />

                <span>
                  Add To Cart
                </span>
              </button>

              <button
                type="button"
                className="recipe-cart-btn"
                onClick={() =>
                  navigate("/cart")
                }
              >
                <FaShoppingCart />

                <span>
                  Go To Cart
                </span>
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default RecipeView;

