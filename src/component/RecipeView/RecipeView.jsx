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

