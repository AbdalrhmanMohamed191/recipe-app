import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import { FaCartPlus } from "react-icons/fa";

import {
  MdFavorite,
  MdOutlineFavoriteBorder,
} from "react-icons/md";

import api from "../../api/api";

import {
  useCart,
} from "../../component/CartContext/CartContext";

import socket from "../../socket/socket";

import {
  baseUrlHandler,
} from "../../utils/baseUrlHandler";

import "./Menue.css";

// ==============================
// CATEGORIES
// ==============================

const categories = [
  "all",
  "beef",
  "chicken",
  "pizza",
  "crepe",
  "dessert",
  "drinks",
  "soup",
  "seafood",
  "pasta",
  "salad",
  "dishes",
];

// ==============================
// MENU CARD
// ==============================

const MenuCard = ({
  item,
  favorite,
  toggleFavorite,
  addToCart,
  navigate,
}) => {
  const [
    selectedVariant,
    setSelectedVariant,
  ] = useState(null);

  // ==============================
  // IMAGE
  // ==============================

  const getImage = (image) => {
    if (!image) {
      return "https://via.placeholder.com/600x400?text=Food";
    }

    if (
      typeof image === "string" &&
      image.startsWith("http")
    ) {
      return image;
    }

    return `${baseUrlHandler()}/${String(
      image
    ).replace(/^\/+/, "")}`;
  };

  // ==============================
  // ADD TO CART
  // ==============================

  const handleAdd = () => {
    const hasVariants =
      item.variants &&
      item.variants.length > 0;

    // لو المنتج له Variants لازم يختار واحد
    if (
      hasVariants &&
      !selectedVariant
    ) {
      alert(
        "choose a variant first 🔥"
      );
      return;
    }

    const price = selectedVariant
      ? Number(selectedVariant.price)
      : Number(item.price);

    addToCart({
      _id: item._id,
      title: item.title,
      price,
      selectedVariant:
        selectedVariant || null,
      CoverImage:
        item.CoverImage,
      restaurantId:
        item.restaurantId,
    });

    // ==============================
    // SUCCESS ALERT
    // ==============================

    alert(
      "Item added to cart successfully! 🛒"
    );
  };

  return (
    <div className="menu-card">

      {/* =========================
          FAVORITE
      ========================= */}

      <div className="fav-icon">
        <button
          type="button"
          className="fav-btn"
          onClick={() =>
            toggleFavorite(item._id)
          }
        >
          {favorite ? (
            <MdFavorite
              color="#e74c3c"
              size={22}
            />
          ) : (
            <MdOutlineFavoriteBorder
              size={22}
            />
          )}
        </button>
      </div>

      {/* =========================
          IMAGE
      ========================= */}

      <div className="image-wrapper">
        <img
          src={getImage(
            item.CoverImage
          )}
          alt={item.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/600x400?text=Food";
          }}
        />
      </div>

      {/* =========================
          CONTENT
      ========================= */}

      <div className="content">

        <h3>
          {item.title}
        </h3>

        <p className="desc">
          {Array.isArray(
            item.ingredients
          )
            ? item.ingredients.join(", ")
            : item.ingredients ||
              "Delicious food waiting for you"}
        </p>

        {/* =========================
            VARIANTS
        ========================= */}

        {item.variants?.length > 0 && (
          <div className="variants">
            {item.variants.map(
              (
                variant,
                index
              ) => (
                <button
                  type="button"
                  key={index}
                  className={
                    selectedVariant?.name ===
                    variant.name
                      ? "variant active"
                      : "variant"
                  }
                  onClick={() =>
                    setSelectedVariant(
                      variant
                    )
                  }
                >
                  {variant.name}
                </button>
              )
            )}
          </div>
        )}

        {/* =========================
            PRICE
        ========================= */}

        <div className="price-box">

          <span className="price">
            {selectedVariant
              ? Number(
                  selectedVariant.price
                )
              : Number(
                  item.price || 0
                )}{" "}
            EGP
          </span>

          {selectedVariant && (
            <small className="selected-size">
              {
                selectedVariant.name
              }
            </small>
          )}

        </div>

        {/* =========================
            BUTTONS
        ========================= */}

        <div className="btn-group">

          <button
            type="button"
            className="add-btn"
            onClick={handleAdd}
          >
            <FaCartPlus />
            Add
          </button>

          <button
            type="button"
            className="view-btn"
            onClick={() =>
              navigate(
                `/recipe/${item._id}`
              )
            }
          >
            View
          </button>

        </div>

      </div>
    </div>
  );
};

// ==============================
// MAIN MENU
// ==============================

const Menue = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const { addToCart } = useCart();

  const [
    recipes,
    setRecipes,
  ] = useState([]);

  const [
    favorites,
    setFavorites,
  ] = useState([]);

  const [
    active,
    setActive,
  ] = useState("all");

  const [
    loading,
    setLoading,
  ] = useState(true);

  // ==============================
  // FETCH RESTAURANT MENU
  // ==============================

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);

        const res =
          await api.get(
            `/api/v1/restaurants/${id}/menu`
          );

        setRecipes(
          Array.isArray(
            res.data
          )
            ? res.data
            : []
        );
      } catch (error) {
        console.error(
          "Menu Error:",
          error
        );

        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();

    // ==============================
    // FAVORITES
    // ==============================

    const savedFavorites =
      JSON.parse(
        localStorage.getItem(
          "favorites"
        )
      ) || [];

    setFavorites(
      savedFavorites
    );

    // ==============================
    // SOCKET
    // ==============================

    socket.off(
      "recipeCreated"
    );

    socket.off(
      "recipeUpdated"
    );

    socket.off(
      "recipeDeleted"
    );

    // ==============================
    // NEW RECIPE
    // ==============================

    socket.on(
      "recipeCreated",
      (recipe) => {
        const recipeRestaurantId =
          recipe.restaurantId?._id ||
          recipe.restaurantId;

        if (
          recipeRestaurantId?.toString() ===
          id?.toString()
        ) {
          setRecipes((prev) => {

            // منع تكرار المنتج
            const exists =
              prev.some(
                (item) =>
                  item._id ===
                  recipe._id
              );

            if (exists) {
              return prev;
            }

            return [
              recipe,
              ...prev,
            ];
          });
        }
      }
    );

    // ==============================
    // UPDATED RECIPE
    // ==============================

    socket.on(
      "recipeUpdated",
      (recipe) => {
        setRecipes(
          (prev) =>
            prev.map(
              (item) =>
                item._id ===
                recipe._id
                  ? recipe
                  : item
            )
        );
      }
    );

    // ==============================
    // DELETED RECIPE
    // ==============================

    socket.on(
      "recipeDeleted",
      (deletedId) => {

        const idToDelete =
          typeof deletedId ===
          "object"
            ? deletedId?._id ||
              deletedId?.id
            : deletedId;

        setRecipes(
          (prev) =>
            prev.filter(
              (item) =>
                item._id !==
                idToDelete
            )
        );
      }
    );

    // ==============================
    // CLEANUP
    // ==============================

    return () => {
      socket.off(
        "recipeCreated"
      );

      socket.off(
        "recipeUpdated"
      );

      socket.off(
        "recipeDeleted"
      );
    };
  }, [id]);

  // ==============================
  // AVAILABLE CATEGORIES
  // ==============================

  const availableCategories =
    useMemo(() => {

      // نجيب الكاتيجوريز الموجودة فعلًا
      const existingCategories =
        recipes
          .map(
            (recipe) =>
              recipe.category
                ?.toString()
                .trim()
                .toLowerCase()
          )
          .filter(Boolean);

      // نشيل التكرار
      const uniqueCategories =
        [
          ...new Set(
            existingCategories
          ),
        ];

      // نحافظ على ترتيب الـ categories
      // الموجود في القائمة الأساسية
      const orderedCategories =
        categories.filter(
          (category) =>
            category === "all" ||
            uniqueCategories.includes(
              category
            )
        );

      return orderedCategories;
    }, [recipes]);

  // ==============================
  // RESET ACTIVE CATEGORY
  // ==============================

  useEffect(() => {

    // لو الكاتيجوري اللي مختارها
    // اختفت بسبب تحديث المنتجات
    // نرجع لـ all

    if (
      active !== "all" &&
      !availableCategories.includes(
        active
      )
    ) {
      setActive("all");
    }

  }, [
    active,
    availableCategories,
  ]);

  // ==============================
  // FILTER
  // ==============================

  const filteredRecipes =
    useMemo(() => {

      if (
        active === "all"
      ) {
        return recipes;
      }

      return recipes.filter(
        (recipe) =>
          (
            recipe.category ||
            ""
          )
            .toString()
            .trim()
            .toLowerCase() ===
          active.toLowerCase()
      );

    }, [
      recipes,
      active,
    ]);

  // ==============================
  // FAVORITE
  // ==============================

  const toggleFavorite = (
    recipeId
  ) => {

    const updatedFavorites =
      favorites.includes(
        recipeId
      )
        ? favorites.filter(
            (favoriteId) =>
              favoriteId !==
              recipeId
          )
        : [
            ...favorites,
            recipeId,
          ];

    setFavorites(
      updatedFavorites
    );

    localStorage.setItem(
      "favorites",
      JSON.stringify(
        updatedFavorites
      )
    );
  };

  // ==============================
  // UI
  // ==============================

  return (
    <div className="menu-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="menu-header">

        <h1>
          🍽 Restaurant Menu
        </h1>

        <p>
          Fresh food delivered fast
        </p>

      </div>

      {/* =========================
          CATEGORIES
      ========================= */}

      <div className="categories">

        {availableCategories.map(
          (category) => (

            <button
              type="button"
              key={category}
              className={
                active ===
                category
                  ? "cat active"
                  : "cat"
              }
              onClick={() =>
                setActive(
                  category
                )
              }
            >
              {category}
            </button>

          )
        )}

      </div>

      {/* =========================
          LOADING
      ========================= */}

      {loading ? (

        <div className="skeleton-grid">

          {[
            1,
            2,
            3,
            4,
            5,
            6,
          ].map(
            (item) => (

              <div
                key={item}
                className="skeleton-card"
              >

                <div className="skeleton-image" />

                <div className="skeleton-line" />

                <div className="skeleton-line short" />

              </div>

            )
          )}

        </div>

      ) : (

        /* =========================
           MENU
        ========================= */

        <div className="menu-grid">

          {filteredRecipes.length ===
          0 ? (

            <div className="empty-menu">

              <h3>
                No items found 😢
              </h3>

              <p>
                This restaurant
                doesn't have
                items in this
                category yet.
              </p>

            </div>

          ) : (

            filteredRecipes.map(
              (item) => (

                <MenuCard
                  key={
                    item._id
                  }
                  item={item}
                  favorite={favorites.includes(
                    item._id
                  )}
                  toggleFavorite={
                    toggleFavorite
                  }
                  addToCart={
                    addToCart
                  }
                  navigate={
                    navigate
                  }
                />

              )
            )

          )}

        </div>

      )}

    </div>
  );
};

export default Menue;
