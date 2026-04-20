import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { baseUrlHandler } from "../../utils/baseUrlHandler";
import socket from "../../socket/socket"; 

const AdminRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    image: null,
    price: "",
    category: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem("token");

  // ================= دالة معالجة عرض الصور =================
  const getImageUrl = (recipe) => {
    const img = recipe.CoverImage || recipe.image || recipe.coverImage;
    if (!img) return "https://via.placeholder.com/150?text=No+Image";
    if (typeof img === "string" && img.startsWith("http")) return img;
    if (typeof img === "string") {
      return `${baseUrlHandler()}/${img.replace(/^\/+/, "")}`;
    }
    if (img instanceof File) {
      return URL.createObjectURL(img);
    }
    return "https://via.placeholder.com/150?text=No+Image";
  };

  // جلب البيانات عند أول تحميل للصفحة
  const fetchRecipes = async () => {
    try {
      const res = await api.get("/api/v1/recipes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecipes(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  // ================= الاستماع للتغييرات (Socket.io) =================
  useEffect(() => {
    fetchRecipes();

    // استقبال وصفة جديدة
    socket.on("recipeCreated", (newRecipe) => {
      setRecipes((prev) => [newRecipe, ...prev]);
    });

    // استقبال تحديث وصفة
    socket.on("recipeUpdated", (updatedRecipe) => {
      setRecipes((prev) =>
        prev.map((r) => (r._id === updatedRecipe._id ? updatedRecipe : r))
      );
    });

    // استقبال حذف وصفة
    socket.on("recipeDeleted", (deletedId) => {
      setRecipes((prev) => prev.filter((r) => r._id !== deletedId));
    });

    // تنظيف المستمعات عند مغادرة الصفحة
    return () => {
      socket.off("recipeCreated");
      socket.off("recipeUpdated");
      socket.off("recipeDeleted");
    };
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({
      title: "",
      ingredients: "",
      instructions: "",
      image: null,
      price: "",
      category: "",
    });
  };

  const prepareFormData = () => {
    const data = new FormData();
    Object.keys(form).forEach((key) => {
      if (key === "ingredients" && typeof form.ingredients === "string") {
        form.ingredients
          .split(",")
          .forEach((i) => data.append("ingredients", i.trim()));
      } else if (form[key] !== null && form[key] !== "") {
        data.append(key, form[key]);
      }
    });
    return data;
  };

  // ================= العمليات (الطلبات للسيرفر) =================

  const createRecipe = async () => {
    try {
      setLoading(true);
      const data = prepareFormData();
      await api.post("/api/v1/recipes", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      closeForm(); // التحديث سيحدث تلقائياً عبر السوكت
    } catch (err) {
      alert("Error creating recipe");
    } finally {
      setLoading(false);
    }
  };

  const updateRecipe = async () => {
    try {
      setLoading(true);
      const data = prepareFormData();
      await api.put(`/api/v1/recipes/${editingId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      closeForm(); // التحديث سيحدث تلقائياً عبر السوكت
    } catch (err) {
      alert("Error updating recipe");
    } finally {
      setLoading(false);
    }
  };

  const deleteRecipe = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/api/v1/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // التحديث سيحدث تلقائياً عبر السوكت
    } catch (err) {
      alert("Delete failed");
    }
  };

  const startEdit = (r) => {
    setForm({
      title: r.title || "",
      ingredients: r.ingredients?.join(", ") || "",
      instructions: r.instructions || "",
      image: null,
      price: r.price || "",
      category: r.category || "",
    });
    setEditingId(r._id);
    setShowForm(true);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2>🍔 Admin Dashboard</h2>
        <button style={styles.addBtn} onClick={() => setShowForm(true)}>
          + Add Recipe
        </button>
      </div>

      {showForm && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>{editingId ? "Update Recipe" : "Create Recipe"}</h3>
            <input name="title" value={form.title} placeholder="Title" onChange={handleChange} style={styles.input} />
            <input name="ingredients" value={form.ingredients} placeholder="Ingredients (comma separated)" onChange={handleChange} style={styles.input} />
            <input name="instructions" value={form.instructions} placeholder="Instructions" onChange={handleChange} style={styles.input} />
            <input name="price" type="number" value={form.price} placeholder="Price" onChange={handleChange} style={styles.input} />
            
            <select name="category" value={form.category} onChange={handleChange} style={styles.input}>
              <option value="">Select Category</option>
              <option value="burger">Burger 🍔</option>
              <option value="pizza">Pizza 🍕</option>
              <option value="pasta">Pasta 🍝</option>
              <option value="chicken">Chicken 🍗</option>
              <option value="drinks">Drinks 🥤</option>
              <option value="dessert">Dessert 🍰</option>
            </select>

            <input type="file" name="image" onChange={handleChange} style={styles.input} />

            <div style={styles.actions}>
              <button 
                disabled={loading} 
                style={{...styles.save, opacity: loading ? 0.6 : 1}} 
                onClick={editingId ? updateRecipe : createRecipe}
              >
                {loading ? "Saving..." : editingId ? "Update" : "Create"}
              </button>
              <button style={styles.cancel} onClick={closeForm}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.grid}>
        {recipes.map((r) => (
          <div key={r._id || Math.random()} style={styles.card}>
            <img 
              src={getImageUrl(r)} 
              style={styles.img} 
              alt={r.title} 
              onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=Error+Loading"; }}
            />
            <div style={styles.cardBody}>
              <h3>{r.title}</h3>
              <p>{r.price} EGP</p>
              <p style={{ color: "#aaa", fontSize: "0.85rem" }}>{r.category}</p>
              <div style={styles.cardBtns}>
                <button style={styles.edit} onClick={() => startEdit(r)}>Edit</button>
                <button style={styles.delete} onClick={() => deleteRecipe(r._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminRecipes;

const styles = {
  page: { padding: 30, background: "#0f0f0f", minHeight: "100vh", color: "#fff", fontFamily: "sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  addBtn: { background: "#FFD700", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontWeight: "bold" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 },
  card: { background: "#1c1c1c", borderRadius: 12, overflow: "hidden", border: "1px solid #333" },
  img: { width: "100%", height: 180, objectFit: "cover" },
  cardBody: { padding: 15 },
  cardBtns: { display: "flex", gap: 10, marginTop: 15 },
  edit: { flex: 1, background: "#FFD700", border: "none", padding: 8, borderRadius: 6, cursor: "pointer", fontWeight: "bold" },
  delete: { flex: 1, background: "#ff4444", border: "none", padding: 8, borderRadius: 6, color: "#fff", cursor: "pointer", fontWeight: "bold" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modal: { background: "#1c1c1c", padding: 25, borderRadius: 12, width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 12 },
  input: { padding: 12, borderRadius: 8, background: "#111", color: "#fff", border: "1px solid #444", outline: "none" },
  actions: { display: "flex", gap: 10, marginTop: 10 },
  save: { flex: 1, background: "#28a745", border: "none", padding: 12, color: "#fff", borderRadius: 8, cursor: "pointer", fontWeight: "bold" },
  cancel: { flex: 1, background: "#555", border: "none", padding: 12, color: "#fff", borderRadius: 8, cursor: "pointer", fontWeight: "bold" },
};