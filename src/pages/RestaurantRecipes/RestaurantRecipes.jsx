import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { baseUrlHandler } from "../../utils/baseUrlHandler";
import "./RestaurantRecipes.css";

const RestaurantRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);

  const [image, setImage] = useState(null);

  const [form, setForm] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    price: "",
    category: "",
    variants: [],
  });

  const token = localStorage.getItem("token");

  // ==========================================
  // IMAGE URL
  // ==========================================

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";

    // لو الصورة URL كامل
    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://")
    ) {
      return imagePath;
    }

    const baseUrl = baseUrlHandler();

    // لو path يبدأ بـ /
    if (imagePath.startsWith("/")) {
      return `${baseUrl}${imagePath}`;
    }

    // لو الباك بيرجع اسم الملف فقط
    return `${baseUrl}/${imagePath}`;
  };

  // ==========================================
  // GET MY MENU
  // ==========================================

  const fetchRecipes = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        "/api/v1/recipes/my-menu",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("MY RECIPES:", res.data);

      setRecipes(res.data);
    } catch (err) {
      console.log("GET MY MENU ERROR:", err);

      alert(
        err?.response?.data?.message ||
          "Failed to load recipes"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // VARIANTS
  // ==========================================

  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          name: "",
          price: "",
        },
      ],
    }));
  };

  const updateVariant = (index, field, value) => {
    setForm((prev) => {
      const updatedVariants = [...prev.variants];

      updatedVariants[index] = {
        ...updatedVariants[index],
        [field]: value,
      };

      return {
        ...prev,
        variants: updatedVariants,
      };
    });
  };

  const removeVariant = (index) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter(
        (_, i) => i !== index
      ),
    }));
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setForm({
      title: "",
      ingredients: "",
      instructions: "",
      price: "",
      category: "",
      variants: [],
    });

    setImage(null);
    setEditingRecipe(null);
    setShowForm(false);
  };

  // ==========================================
  // ADD / UPDATE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append(
        "title",
        form.title
      );

      formData.append("ingredients", form.ingredients);

      formData.append(
        "instructions",
        form.instructions
      );

      formData.append(
        "price",
        Number(form.price) || 0
      );

      formData.append(
        "category",
        form.category
      );

      formData.append(
        "variants",
        JSON.stringify(
          form.variants.map((variant) => ({
            name: variant.name,
            price: Number(variant.price) || 0,
          }))
        )
      );

      // الصورة اختيارية
      if (image) {
        formData.append(
          "image",
          image
        );
      }

      // ========================================
      // UPDATE
      // ========================================

      if (editingRecipe) {
        await api.put(
          `/api/v1/recipes/${editingRecipe._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        alert(
          "Recipe updated successfully ✅"
        );
      }

      // ========================================
      // CREATE
      // ========================================

      else {
        await api.post(
          "/api/v1/recipes",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        alert(
          "Recipe created successfully ✅"
        );
      }

      resetForm();

      await fetchRecipes();
    } catch (err) {
      console.log(
        "RECIPE SAVE ERROR:",
        err
      );

      alert(
        err?.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);

    setForm({
      title: recipe.title || "",

      ingredients:
        recipe.ingredients?.join(", ") || "",

      instructions:
        recipe.instructions || "",

      price:
        recipe.price || "",

      category:
        recipe.category || "",

      variants:
        recipe.variants || [],
    });

    setImage(null);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this recipe?"
      );

    if (!confirmDelete) return;

    try {
      await api.delete(
        `/api/v1/recipes/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRecipes((prev) =>
        prev.filter(
          (recipe) =>
            recipe._id !== id
        )
      );

      alert(
        "Recipe deleted successfully 🗑️"
      );
    } catch (err) {
      console.log(
        "DELETE RECIPE ERROR:",
        err
      );

      alert(
        err?.response?.data?.message ||
          "Failed to delete recipe"
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="restaurant-recipes-page">

        <div className="recipes-loading">

          <div className="loading-spinner"></div>

          <p>
            Loading your menu...
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="restaurant-recipes-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="recipes-header">

        <div>

          <h1>
            🍔 My Recipes
          </h1>

          <p>
            Manage your restaurant menu
          </p>

        </div>

        <button
          type="button"
          className="add-recipe-btn"
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
        >
          {showForm
            ? "✖ Close"
            : "➕ Add Recipe"}
        </button>

      </div>

      {/* ======================================
          FORM
      ====================================== */}

      {showForm && (
        <form
          className="recipe-form"
          onSubmit={handleSubmit}
        >

          <div className="form-title">

            <h2>
              {editingRecipe
                ? "✏️ Edit Recipe"
                : "➕ Add New Recipe"}
            </h2>

            <span>
              {editingRecipe
                ? "Update your recipe information"
                : "Add a new item to your menu"}
            </span>

          </div>

          {/* BASIC INFO */}

          <div className="form-grid">

            {/* RECIPE NAME */}

            <div className="form-group">

              <label>
                Recipe Name
              </label>

              <input
                type="text"
                name="title"
                placeholder="Example: Zinger Burger"
                value={form.title}
                onChange={handleChange}
                required
              />

            </div>

            {/* PRICE */}

            <div className="form-group">

              <label>
                Price
              </label>

              <input
                type="number"
                name="price"
                placeholder="120"
                value={form.price}
                onChange={handleChange}
                min="0"
                required
              />

            </div>

            {/* CATEGORY */}

            <div className="form-group">

              <label>
                Category
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >

                <option value="">
                  Select Category
                </option>

                <option value="beef">
                  🥩 Beef
                </option>

                <option value="chicken">
                  🍗 Chicken
                </option>

                <option value="pizza">
                  🍕 Pizza
                </option>

                <option value="burger">
                  🍔 Burger
                </option>

                <option value="pasta">
                  🍝 Pasta
                </option>

                <option value="seafood">
                  🦐 Seafood
                </option>

                <option value="salad">
                  🥗 Salad
                </option>

                <option value="soup">
                  🍲 Soup
                </option>

                <option value="dessert">
                  🍰 Dessert
                </option>

                <option value="drinks">
                  🥤 Drinks
                </option>

                <option value="crepe">
                  🥞 Crepe
                </option>

                <option value="dishes">
                  🍽️ Dishes
                </option>

              </select>

            </div>

            {/* IMAGE */}

            <div className="form-group">

              <label>
                Recipe Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file =
                    e.target.files?.[0];

                  if (file) {
                    setImage(file);
                  }
                }}
              />

              <small>
                {editingRecipe
                  ? "Choose a new image only if you want to replace the current image."
                  : "Upload an image for your recipe."}
              </small>

            </div>

          </div>

          {/* INGREDIENTS */}

          <div className="form-group">

            <label>
              Ingredients
            </label>

            <input
              type="text"
              name="ingredients"
              placeholder="Chicken, Cheese, Lettuce, Sauce"
              value={form.ingredients}
              onChange={handleChange}
              required
            />

            <small>
              Separate ingredients with commas
            </small>

          </div>

          {/* INSTRUCTIONS */}

          <div className="form-group">

            <label>
              Instructions
            </label>

            <textarea
              name="instructions"
              placeholder="Write recipe instructions..."
              value={form.instructions}
              onChange={handleChange}
              rows="4"
              required
            />

          </div>

          {/* VARIANTS */}

          <div className="variants-section">

            <div className="variants-header">

              <div>

                <h3>
                  📏 Variants
                </h3>

                <span>
                  Optional sizes and prices
                </span>

              </div>

              <button
                type="button"
                className="add-variant-btn"
                onClick={addVariant}
              >
                ➕ Add Variant
              </button>

            </div>

            {form.variants.length === 0 && (
              <p className="no-variants">
                No variants added
              </p>
            )}

            {form.variants.map(
              (variant, index) => (

                <div
                  className="variant-row"
                  key={index}
                >

                  <input
                    type="text"
                    placeholder="Small / Large / XL"
                    value={variant.name}
                    onChange={(e) =>
                      updateVariant(
                        index,
                        "name",
                        e.target.value
                      )
                    }
                    required
                  />

                  <input
                    type="number"
                    placeholder="Price"
                    value={variant.price}
                    onChange={(e) =>
                      updateVariant(
                        index,
                        "price",
                        e.target.value
                      )
                    }
                    min="0"
                    required
                  />

                  <button
                    type="button"
                    className="remove-variant-btn"
                    onClick={() =>
                      removeVariant(index)
                    }
                  >
                    🗑️
                  </button>

                </div>

              )
            )}

          </div>

          {/* FORM ACTIONS */}

          <div className="form-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={resetForm}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-recipe-btn"
            >
              {editingRecipe
                ? "💾 Update Recipe"
                : "🚀 Create Recipe"}
            </button>

          </div>

        </form>
      )}

      {/* ======================================
          RECIPES
      ====================================== */}

      {recipes.length === 0 ? (

        <div className="empty-recipes">

          <div className="empty-icon">
            🍔
          </div>

          <h2>
            Your menu is empty
          </h2>

          <p>
            Start adding recipes to your
            restaurant menu.
          </p>

          <button
            type="button"
            className="add-recipe-btn"
            onClick={() =>
              setShowForm(true)
            }
          >
            ➕ Add First Recipe
          </button>

        </div>

      ) : (

        <div className="recipes-grid">

          {recipes.map((recipe) => {

            const recipeImage =
              getImageUrl(
                recipe.CoverImage
              );

            return (
              <div
                className="recipe-card"
                key={recipe._id}
              >

                {/* ==================================
                    IMAGE
                ================================== */}

                <div className="recipe-image">

                  {recipeImage ? (

                    <img
                      src={recipeImage}
                      alt={recipe.title}
                      onError={(e) => {
                        console.log(
                          "RECIPE IMAGE ERROR:",
                          recipe.CoverImage
                        );

                        e.currentTarget.style.display =
                          "none";

                        const fallback =
                          e.currentTarget.parentElement.querySelector(
                            ".no-recipe-image"
                          );

                        if (fallback) {
                          fallback.style.display =
                            "flex";
                        }
                      }}
                    />

                  ) : null}

                  <div
                    className="no-recipe-image"
                    style={{
                      display: recipeImage
                        ? "none"
                        : "flex",
                    }}
                  >
                    🍔
                  </div>

                </div>

                {/* ==================================
                    INFO
                ================================== */}

                <div className="recipe-info">

                  <div className="recipe-title-row">

                    <h3>
                      {recipe.title}
                    </h3>

                    {recipe.category && (
                      <span className="category">
                        {recipe.category}
                      </span>
                    )}

                  </div>

                  {/* PRICE */}

            <div className="recipe-price">

              {recipe.variants?.length > 0 ? (

                <span>
                  From{" "}
                  {Math.min(
                    ...recipe.variants.map(
                      (variant) => Number(variant.price)
                    )
                  )}{" "}
                  EGP
                </span>

              ) : (

                <span>
                  {recipe.price !== undefined &&
                  recipe.price !== null &&
                  recipe.price !== ""
                    ? Number(recipe.price)
                    : "—"}{" "}
                  EGP
                </span>

              )}

            </div>
                  {/* INGREDIENTS */}

                  {recipe.ingredients?.length > 0 && (

                    <p className="ingredients">

                      {recipe.ingredients}

                    </p>

                  )}

                  {/* VARIANTS */}

                  {recipe.variants?.length > 0 && (

                    <div className="recipe-variants">

                      {recipe.variants.map(
                        (variant, index) => (

                          <span key={index}>

                            {variant.name}:{" "}
                            {variant.price} EGP

                          </span>

                        )
                      )}

                    </div>

                  )}

                  {/* ACTIONS */}

                  <div className="recipe-actions">

                    <button
                      type="button"
                      className="edit-recipe-btn"
                      onClick={() =>
                        handleEdit(recipe)
                      }
                    >
                      ✏️ Edit
                    </button>

                    <button
                      type="button"
                      className="delete-recipe-btn"
                      onClick={() =>
                        handleDelete(
                          recipe._id
                        )
                      }
                    >
                      🗑️ Delete
                    </button>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      )}

    </div>
  );
};

export default RestaurantRecipes;