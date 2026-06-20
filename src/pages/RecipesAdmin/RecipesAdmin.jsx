import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { baseUrlHandler } from "../../utils/baseUrlHandler";
import socket from "../../socket/socket";

const emptyForm = {
  title: "",
  ingredients: "",
  instructions: "",
  image: null,
  category: "",
  price: "",
  variants: [],
};

const categories = [
  "beef",
  "chicken",
  "pizza",
  "dessert",
  "seafood",
  "pasta",
  "salad",
  "soup",
  "burger",
  "drinks",
  "crepes",
];

const AdminRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem("token");

  // ================= IMAGE =================
  const getImageUrl = (r) => {
    const img = r.CoverImage;

    if (!img) {
      return "https://via.placeholder.com/300x200";
    }

    if (img.startsWith("http")) {
      return img;
    }

    return `${baseUrlHandler()}/${img.replace(/^\/+/g, "")}`;
  };

  // ================= FETCH =================
  const fetchRecipes = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/v1/recipes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRecipes(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();

    socket.on("recipeCreated", (data) => {
      setRecipes((prev) => {
        const exists = prev.find((r) => r._id === data._id);

        if (exists) return prev;

        return [data, ...prev];
      });
    });

    socket.on("recipeUpdated", (data) => {
      setRecipes((prev) =>
        prev.map((r) => (r._id === data._id ? data : r))
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

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setForm((prev) => ({
        ...prev,
        image: files[0],
      }));

      return;
    }

    // PRICE ONLY NUMBERS
    if (name === "price") {
      const onlyNumbers = value.replace(/[^0-9]/g, "");

      setForm((prev) => ({
        ...prev,
        price: onlyNumbers,
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= VARIANTS =================
  const handleVariant = (index, field, value) => {
    const updated = [...form.variants];

    if (field === "price") {
      value = value.replace(/[^0-9]/g, "");
    }

    updated[index][field] = value;

    setForm((prev) => ({
      ...prev,
      variants: updated,
    }));
  };

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

  const removeVariant = (index) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  // ================= FORM DATA =================
  const prepareForm = () => {
    const data = new FormData();

    data.append("title", form.title);
    data.append("instructions", form.instructions);
    data.append("category", form.category);
    data.append("price", form.price);

    // IMPORTANT FIX
    data.append("ingredients", form.ingredients);

    if (
      form.variants.length &&
      form.variants.some((v) => v.name || v.price)
    ) {
      data.append("variants", JSON.stringify(form.variants));
    }

    if (form.image) {
      data.append("image", form.image);
    }

    return data;
  };

  // ================= CLOSE =================
  const close = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  // ================= CREATE =================
  const create = async () => {
    try {
      setSaving(true);

      await api.post("/api/v1/recipes", prepareForm(), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      close();
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert(err.response?.data?.message || "Error creating recipe");
    } finally {
      setSaving(false);
    }
  };

  // ================= UPDATE =================
  const update = async () => {
    try {
      setSaving(true);

      await api.put(
        `/api/v1/recipes/${editingId}`,
        prepareForm(),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      close();
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert(err.response?.data?.message || "Error updating recipe");
    } finally {
      setSaving(false);
    }
  };

  // ================= DELETE =================
  const deleteItem = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this recipe?"
    );

    if (!confirmDelete) return;

    setRecipes((prev) =>
      prev.filter((r) => r._id !== id)
    );

    try {
      await api.delete(`/api/v1/recipes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      fetchRecipes();
    }
  };

  // ================= EDIT =================
  const startEdit = (r) => {
    setForm({
      title: r.title || "",
      ingredients: (r.ingredients || []).join(", "),
      instructions: r.instructions || "",
      image: null,
      category: r.category || "",
      price: r.price || "",
      variants: r.variants?.length
        ? r.variants
        : [],
    });

    setEditingId(r._id);
    setShowForm(true);
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.title}>
          🍔 Admin Recipes
        </h1>

        <button
          style={styles.addBtn}
          onClick={() => setShowForm(true)}
        >
          + Add Recipe
        </button>
      </div>

      {/* MODAL */}
      {showForm && (
        <div
          style={styles.overlay}
          onClick={close}
        >
          <div
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={styles.modalTitle}>
              {editingId
                ? "Edit Recipe"
                : "Create Recipe"}
            </h2>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              style={styles.input}
            />

            <input
              name="ingredients"
              value={form.ingredients}
              onChange={handleChange}
              placeholder="Ingredients"
              style={styles.input}
            />

            <textarea
              name="instructions"
              value={form.instructions}
              onChange={handleChange}
              placeholder="Instructions"
              style={styles.textarea}
            />

            <input
              type="text"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              style={styles.input}
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="">
                Select category
              </option>

              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <input
              type="file"
              name="image"
              onChange={handleChange}
              style={styles.file}
            />

            {/* VARIANTS */}
            <h3 style={styles.variantTitle}>
              Variants
            </h3>

            {form.variants.map((v, i) => (
              <div
                key={i}
                style={styles.variantRow}
              >
                <input
                  placeholder="Variant Name"
                  value={v.name}
                  onChange={(e) =>
                    handleVariant(
                      i,
                      "name",
                      e.target.value
                    )
                  }
                  style={styles.input}
                />

                <input
                  placeholder="Price"
                  value={v.price}
                  onChange={(e) =>
                    handleVariant(
                      i,
                      "price",
                      e.target.value
                    )
                  }
                  style={styles.input}
                />

                <button
                  style={styles.removeBtn}
                  onClick={() =>
                    removeVariant(i)
                  }
                >
                  ✖
                </button>
              </div>
            ))}

            <button
              style={styles.addVariantBtn}
              onClick={addVariant}
            >
              + Add Variant
            </button>

            {/* ACTIONS */}
            <div style={styles.actions}>
              <button
                style={styles.saveBtn}
                onClick={
                  editingId
                    ? update
                    : create
                }
              >
                {saving
                  ? "Saving..."
                  : "Save"}
              </button>

              <button
                style={styles.cancelBtn}
                onClick={close}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <h2 style={{ color: "#fff" }}>
          Loading...
        </h2>
      ) : (
        <div style={styles.grid}>
          {recipes.map((r) => (
            <div
              key={r._id}
              style={styles.card}
            >
              <img
                src={getImageUrl(r)}
                alt={r.title}
                style={styles.image}
              />

              <div style={styles.cardBody}>
                <h2>{r.title}</h2>

                <div style={styles.category}>
                  {r.category}
                </div>

                <div style={styles.priceBox}>
                  {r.variants?.length ? (
                    r.variants.map(
                      (v, i) => (
                        <div
                          key={i}
                          style={
                            styles.variantLine
                          }
                        >
                          <span>
                            {v.name}
                          </span>

                          <span>
                            {v.price} EGP
                          </span>
                        </div>
                      )
                    )
                  ) : (
                    <div
                      style={
                        styles.variantLine
                      }
                    >
                      <span>Price</span>

                      <span>
                        {r.price} EGP
                      </span>
                    </div>
                  )}
                </div>

                <div style={styles.btnRow}>
                  <button
                    style={styles.editBtn}
                    onClick={() =>
                      startEdit(r)
                    }
                  >
                    Edit
                  </button>

                  <button
                    style={styles.deleteBtn}
                    onClick={() =>
                      deleteItem(r._id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminRecipes;

// ================= STYLES =================

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f172a",
    padding: "30px",
    color: "#fff",
    fontFamily: "sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  title: {
    fontSize: "32px",
    fontWeight: "bold",
  },

  addBtn: {
    background: "#22c55e",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill,minmax(280px,1fr))",
    gap: "25px",
  },

  card: {
    background: "#1e293b",
    borderRadius: "18px",
    overflow: "hidden",
    boxShadow:
      "0 10px 30px rgba(0,0,0,.3)",
  },

  image: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
  },

  cardBody: {
    padding: "18px",
  },

  category: {
    marginTop: "8px",
    color: "#94a3b8",
    textTransform: "capitalize",
  },

  priceBox: {
    marginTop: "15px",
    background: "#0f172a",
    padding: "12px",
    borderRadius: "10px",
  },

  variantLine: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
  },

  btnRow: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },

  editBtn: {
    flex: 1,
    padding: "10px",
    border: "none",
    background: "#3b82f6",
    color: "#fff",
    borderRadius: "10px",
    cursor: "pointer",
  },

  deleteBtn: {
    flex: 1,
    padding: "10px",
    border: "none",
    background: "#ef4444",
    color: "#fff",
    borderRadius: "10px",
    cursor: "pointer",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  modal: {
    width: "500px",
    maxHeight: "90vh",
    overflowY: "auto",
    background: "#1e293b",
    borderRadius: "20px",
    padding: "25px",
  },

  modalTitle: {
    marginBottom: "20px",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    background: "#334155",
    color: "#fff",
  },

  textarea: {
    width: "100%",
    minHeight: "100px",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    resize: "none",
    background: "#334155",
    color: "#fff",
  },

  select: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    background: "#334155",
    color: "#fff",
  },

  file: {
    marginBottom: "15px",
    color: "#fff",
  },

  variantTitle: {
    marginTop: "20px",
    marginBottom: "10px",
  },

  variantRow: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },

  removeBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    height: "44px",
  },

  addVariantBtn: {
    width: "100%",
    marginTop: "10px",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    background: "#8b5cf6",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },

  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "25px",
  },

  saveBtn: {
    flex: 1,
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    background: "#22c55e",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },

  cancelBtn: {
    flex: 1,
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    background: "#64748b",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
};