// import React, { useEffect, useState } from "react";
// import api from "../../api/api";
// import socket from "../../socket/socket";
// import { baseUrlHandler } from "../../utils/baseUrlHandler";

// const emptyForm = {
//   title: "",
//   ingredients: "",
//   instructions: "",
//   category: "",
//   price: "",
//   image: null,
//   variants: [],
//   restaurantId: "",
// };

// const AdminRecipes = () => {
//   const [recipes, setRecipes] = useState([]);

//   const [form, setForm] = useState(emptyForm);

//   const [editingId, setEditingId] = useState(null);

//   const [showForm, setShowForm] = useState(false);

//   const [showImport, setShowImport] = useState(false);

//   const [importText, setImportText] = useState("");

//   const [importLoading, setImportLoading] = useState(false);

//   const [loading, setLoading] = useState(false);

//   const token = localStorage.getItem("token");

//   // ================= IMAGE =================

//   const getImageUrl = (r) => {
//     const img = r.CoverImage;

//     if (!img) {
//       return "https://via.placeholder.com/300x200";
//     }

//     if (img.startsWith("http")) {
//       return img;
//     }

//     return `${baseUrlHandler()}/${img.replace(/^\/+/, "")}`;
//   };

//   // ================= FETCH =================

//   const fetchRecipes = async () => {
//     try {
//       setLoading(true);

//       const res = await api.get("/api/v1/recipes", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setRecipes(res.data);
//     } catch (err) {
//       console.log(err?.response?.data || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= SOCKET =================

//   useEffect(() => {
//     fetchRecipes();

//     const handleRecipeCreated = (data) => {
//       setRecipes((prev) => {
//         const exists = prev.some((r) => r._id === data._id);

//         if (exists) {
//           return prev;
//         }

//         return [data, ...prev];
//       });
//     };

//     const handleRecipeUpdated = (data) => {
//       setRecipes((prev) =>
//         prev.map((r) => (r._id === data._id ? data : r))
//       );
//     };

//     const handleRecipeDeleted = (id) => {
//       setRecipes((prev) =>
//         prev.filter((r) => r._id !== id)
//       );
//     };

//     socket.on("recipeCreated", handleRecipeCreated);
//     socket.on("recipeUpdated", handleRecipeUpdated);
//     socket.on("recipeDeleted", handleRecipeDeleted);

//     return () => {
//       socket.off("recipeCreated", handleRecipeCreated);
//       socket.off("recipeUpdated", handleRecipeUpdated);
//       socket.off("recipeDeleted", handleRecipeDeleted);
//     };
//   }, []);

//   // ================= INPUT =================

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     if (name === "image") {
//       setForm((prev) => ({
//         ...prev,
//         image: files?.[0] || null,
//       }));

//       return;
//     }

//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // ================= VARIANTS =================

//   const addVariant = () => {
//     setForm((prev) => ({
//       ...prev,
//       variants: [
//         ...prev.variants,
//         {
//           name: "",
//           price: "",
//         },
//       ],
//     }));
//   };

//   const updateVariant = (index, field, value) => {
//     const copy = [...form.variants];

//     copy[index] = {
//       ...copy[index],
//       [field]: value,
//     };

//     setForm((prev) => ({
//       ...prev,
//       variants: copy,
//     }));
//   };

//   // ================= FORM DATA =================

//   const prepareData = () => {
//     const data = new FormData();

//     data.append("title", form.title);
//     data.append("instructions", form.instructions);
//     data.append("category", form.category);
//     data.append("price", form.price);
//     data.append("restaurantId", form.restaurantId);
//     data.append("ingredients", form.ingredients);

//     if (form.variants.length > 0) {
//       data.append(
//         "variants",
//         JSON.stringify(form.variants)
//       );
//     }

//     if (form.image) {
//       data.append("image", form.image);
//     }

//     return data;
//   };

//   // ================= CREATE =================

//   const createRecipe = async () => {
//     try {
//       await api.post(
//         "/api/v1/recipes",
//         prepareData(),
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setShowForm(false);
//       setEditingId(null);
//       setForm(emptyForm);

//       await fetchRecipes();
//     } catch (err) {
//       console.log(
//         err?.response?.data || err.message
//       );

//       alert(
//         err?.response?.data?.message ||
//           "Failed to create recipe"
//       );
//     }
//   };

//   // ================= UPDATE =================

//   const updateRecipe = async () => {
//     try {
//       await api.put(
//         `/api/v1/recipes/${editingId}`,
//         prepareData(),
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setShowForm(false);
//       setEditingId(null);
//       setForm(emptyForm);

//       await fetchRecipes();
//     } catch (err) {
//       console.log(
//         err?.response?.data || err.message
//       );

//       alert(
//         err?.response?.data?.message ||
//           "Failed to update recipe"
//       );
//     }
//   };

//   // ================= DELETE =================

//   const deleteRecipe = async (id) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this recipe?"
//     );

//     if (!confirmDelete) {
//       return;
//     }

//     try {
//       await api.delete(
//         `/api/v1/recipes/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setRecipes((prev) =>
//         prev.filter((r) => r._id !== id)
//       );
//     } catch (err) {
//       console.log(
//         err?.response?.data || err.message
//       );

//       alert(
//         err?.response?.data?.message ||
//           "Failed to delete recipe"
//       );
//     }
//   };

//   // ================= EDIT =================

//   const startEdit = (recipe) => {
//     setForm({
//       title: recipe.title || "",

//       ingredients:
//         recipe.ingredients?.join(", ") || "",

//       instructions:
//         recipe.instructions || "",

//       category:
//         recipe.category || "",

//       price:
//         recipe.price ?? "",

//       image: null,

//       restaurantId:
//         recipe.restaurantId?._id ||
//         recipe.restaurantId ||
//         "",

//       variants:
//         recipe.variants || [],
//     });

//     setEditingId(recipe._id);

//     setShowForm(true);
//   };

//   // ================= IMPORT =================

//   const importMenu = async () => {
//     if (!importText.trim()) {
//       alert("Please paste the menu JSON first.");
//       return;
//     }

//     let parsedRecipes;

//     try {
//       parsedRecipes = JSON.parse(importText);
//     } catch (error) {
//       alert(
//         "Invalid JSON format. Please check the menu data."
//       );
//       return;
//     }

//     if (!Array.isArray(parsedRecipes)) {
//       alert(
//         "The imported data must be an array of recipes."
//       );
//       return;
//     }

//     if (parsedRecipes.length === 0) {
//       alert("No recipes found.");
//       return;
//     }

//     try {
//       setImportLoading(true);

//       await api.post(
//         "/api/v1/recipes/bulk",
//         {
//           recipes: parsedRecipes,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       alert(
//         `${parsedRecipes.length} recipes imported successfully!`
//       );

//       setImportText("");

//       setShowImport(false);

//       await fetchRecipes();
//     } catch (err) {
//       console.log(
//         err?.response?.data || err.message
//       );

//       alert(
//         err?.response?.data?.message ||
//           "Failed to import menu"
//       );
//     } finally {
//       setImportLoading(false);
//     }
//   };

//   // ================= SAMPLE JSON =================

//   const loadExample = () => {
//     setImportText(
//       JSON.stringify(
//         [
//           {
//             title: "Chicken Burger",
//             ingredients:
//               "Chicken, Cheese, Lettuce, Sauce",
//             instructions:
//               "Chicken burger with cheese and sauce",
//             category: "burger",
//             price: 120,
//             restaurantId:
//               "PUT_RESTAURANT_ID_HERE",
//             variants: [],
//           },
//           {
//             title: "Chicken Crepe",
//             ingredients:
//               "Chicken, Cheese, Sauce",
//             instructions:
//               "Chicken crepe with cheese and sauce",
//             category: "crepe",
//             price: 100,
//             restaurantId:
//               "PUT_RESTAURANT_ID_HERE",
//             variants: [],
//           },
//         ],
//         null,
//         2
//       )
//     );
//   };

//   // ================= CLOSE FORM =================

//   const closeForm = () => {
//     setShowForm(false);
//     setEditingId(null);
//     setForm(emptyForm);
//   };

//   // ================= RENDER =================

//   return (
//     <div style={styles.page}>
//       {/* ================= HEADER ================= */}

//       <div style={styles.header}>
//         <h2 style={styles.title}>
//           🍔 Admin Recipes
//         </h2>

//         <div style={styles.headerButtons}>
//           <button
//             style={styles.importBtn}
//             onClick={() => setShowImport(true)}
//           >
//             📥 Import Menu
//           </button>

//           <button
//             style={styles.addBtn}
//             onClick={() => {
//               setEditingId(null);
//               setForm(emptyForm);
//               setShowForm(true);
//             }}
//           >
//             + Add Recipe
//           </button>
//         </div>
//       </div>

//       {/* ================= LOADING ================= */}

//       {loading && (
//         <div style={styles.loading}>
//           Loading recipes...
//         </div>
//       )}

//       {/* ================= TABLE ================= */}

//       {!loading && (
//         <table style={styles.table}>
//           <thead>
//             <tr>
//               <th style={styles.th}>Image</th>
//               <th style={styles.th}>Title</th>
//               <th style={styles.th}>Category</th>
//               <th style={styles.th}>Restaurant</th>
//               <th style={styles.th}>Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {recipes.map((recipe) => (
//               <tr key={recipe._id}>
//                 <td style={styles.td}>
//                   <img
//                     src={getImageUrl(recipe)}
//                     alt={recipe.title}
//                     style={styles.img}
//                   />
//                 </td>

//                 <td style={styles.td}>
//                   {recipe.title}
//                 </td>

//                 <td style={styles.td}>
//                   {recipe.category || "-"}
//                 </td>

//                 <td style={styles.td}>
//                   {recipe.restaurantId?.name ||
//                     recipe.restaurantId ||
//                     "-"}
//                 </td>

//                 <td style={styles.td}>
//                   <button
//                     style={styles.editBtn}
//                     onClick={() =>
//                       startEdit(recipe)
//                     }
//                   >
//                     Edit
//                   </button>

//                   <button
//                     style={styles.deleteBtn}
//                     onClick={() =>
//                       deleteRecipe(recipe._id)
//                     }
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}

//             {recipes.length === 0 && (
//               <tr>
//                 <td
//                   colSpan="5"
//                   style={styles.empty}
//                 >
//                   No recipes found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       )}

//       {/* ================================================= */}
//       {/* ADD / EDIT MODAL */}
//       {/* ================================================= */}

//       {showForm && (
//         <div style={styles.overlay}>
//           <div style={styles.modal}>
//             <h3 style={styles.modalTitle}>
//               {editingId
//                 ? "Edit Recipe"
//                 : "Add Recipe"}
//             </h3>

//             <input
//               name="title"
//               value={form.title}
//               onChange={handleChange}
//               placeholder="Title"
//               style={styles.input}
//             />

//             <input
//               name="ingredients"
//               value={form.ingredients}
//               onChange={handleChange}
//               placeholder="Ingredients"
//               style={styles.input}
//             />

//             <input
//               name="instructions"
//               value={form.instructions}
//               onChange={handleChange}
//               placeholder="Instructions"
//               style={styles.input}
//             />

//             <input
//               name="category"
//               value={form.category}
//               onChange={handleChange}
//               placeholder="Category"
//               style={styles.input}
//             />

//             <input
//               name="price"
//               type="number"
//               value={form.price}
//               onChange={handleChange}
//               placeholder="Price"
//               style={styles.input}
//             />

//             <input
//               name="restaurantId"
//               value={form.restaurantId}
//               onChange={handleChange}
//               placeholder="Restaurant ID"
//               style={styles.input}
//             />

//             <input
//               type="file"
//               name="image"
//               accept="image/*"
//               onChange={handleChange}
//               style={styles.fileInput}
//             />

//             <hr style={styles.hr} />

//             <h4>Variants</h4>

//             {form.variants.map((variant, index) => (
//               <div
//                 key={index}
//                 style={styles.variantRow}
//               >
//                 <input
//                   placeholder="Name"
//                   value={variant.name}
//                   onChange={(e) =>
//                     updateVariant(
//                       index,
//                       "name",
//                       e.target.value
//                     )
//                   }
//                   style={styles.smallInput}
//                 />

//                 <input
//                   placeholder="Price"
//                   type="number"
//                   value={variant.price}
//                   onChange={(e) =>
//                     updateVariant(
//                       index,
//                       "price",
//                       e.target.value
//                     )
//                   }
//                   style={styles.smallInput}
//                 />
//               </div>
//             ))}

//             <button
//               style={styles.addVariantBtn}
//               onClick={addVariant}
//             >
//               + Add Variant
//             </button>

//             <button
//               style={styles.saveBtn}
//               onClick={
//                 editingId
//                   ? updateRecipe
//                   : createRecipe
//               }
//             >
//               {editingId
//                 ? "Update Recipe"
//                 : "Save Recipe"}
//             </button>

//             <button
//               style={styles.cancelBtn}
//               onClick={closeForm}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//       {/* ================================================= */}
//       {/* IMPORT MENU MODAL */}
//       {/* ================================================= */}

//       {showImport && (
//         <div style={styles.overlay}>
//           <div style={styles.importModal}>
//             <div style={styles.importHeader}>
//               <div>
//                 <h3 style={styles.modalTitle}>
//                   📥 Import Restaurant Menu
//                 </h3>

//                 <p style={styles.helpText}>
//                   Import multiple recipes at once.
//                   Images are not required.
//                 </p>
//               </div>

//               <button
//                 style={styles.closeBtn}
//                 onClick={() => {
//                   setShowImport(false);
//                   setImportText("");
//                 }}
//               >
//                 ✕
//               </button>
//             </div>

//             <div style={styles.infoBox}>
//               <strong>
//                 Required fields:
//               </strong>

//               <div style={styles.codeText}>
//                 title, instructions, category,
//                 price, restaurantId
//               </div>

//               <p style={styles.helpText}>
//                 You can leave ingredients and
//                 variants empty.
//               </p>
//             </div>

//             <textarea
//               value={importText}
//               onChange={(e) =>
//                 setImportText(e.target.value)
//               }
//               placeholder={`Paste your menu JSON here...

// Example:
// [
//   {
//     "title": "Chicken Burger",
//     "ingredients": "Chicken, Cheese, Sauce",
//     "instructions": "Chicken burger with cheese",
//     "category": "burger",
//     "price": 120,
//     "restaurantId": "YOUR_RESTAURANT_ID",
//     "variants": []
//   }
// ]`}
//               style={styles.textarea}
//             />

//             <div style={styles.importActions}>
//               <button
//                 style={styles.exampleBtn}
//                 onClick={loadExample}
//               >
//                 Load Example
//               </button>

//               <button
//                 style={styles.cancelBtnSmall}
//                 onClick={() => {
//                   setShowImport(false);
//                   setImportText("");
//                 }}
//               >
//                 Cancel
//               </button>

//               <button
//                 style={styles.importSaveBtn}
//                 onClick={importMenu}
//                 disabled={importLoading}
//               >
//                 {importLoading
//                   ? "Importing..."
//                   : "📥 Import Menu"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminRecipes;

// // =================================================
// // STYLES
// // =================================================

// const styles = {
//   page: {
//     minHeight: "100vh",
//     background: "#0f172a",
//     color: "#fff",
//     padding: "25px",
//     fontFamily: "sans-serif",
//   },

//   header: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: "20px",
//     gap: "15px",
//     flexWrap: "wrap",
//   },

//   title: {
//     fontSize: "28px",
//     fontWeight: "bold",
//     margin: 0,
//   },

//   headerButtons: {
//     display: "flex",
//     gap: "10px",
//     alignItems: "center",
//   },

//   addBtn: {
//     background: "#22c55e",
//     border: "none",
//     padding: "10px 18px",
//     borderRadius: "10px",
//     color: "#fff",
//     cursor: "pointer",
//     fontWeight: "bold",
//   },

//   importBtn: {
//     background: "#8b5cf6",
//     border: "none",
//     padding: "10px 18px",
//     borderRadius: "10px",
//     color: "#fff",
//     cursor: "pointer",
//     fontWeight: "bold",
//   },

//   loading: {
//     padding: "30px",
//     textAlign: "center",
//     fontSize: "18px",
//   },

//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//     background: "#1e293b",
//   },

//   th: {
//     padding: "12px",
//     background: "#111827",
//     textAlign: "left",
//   },

//   td: {
//     padding: "12px",
//     borderBottom: "1px solid #334155",
//   },

//   img: {
//     width: "60px",
//     height: "60px",
//     objectFit: "cover",
//     borderRadius: "8px",
//   },

//   editBtn: {
//     background: "#3b82f6",
//     border: "none",
//     padding: "6px 10px",
//     borderRadius: "8px",
//     color: "#fff",
//     marginRight: "6px",
//     cursor: "pointer",
//   },

//   deleteBtn: {
//     background: "#ef4444",
//     border: "none",
//     padding: "6px 10px",
//     borderRadius: "8px",
//     color: "#fff",
//     cursor: "pointer",
//   },

//   empty: {
//     textAlign: "center",
//     padding: "30px",
//     color: "#94a3b8",
//   },

//   overlay: {
//     position: "fixed",
//     inset: 0,
//     background: "rgba(0,0,0,0.7)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 9999,
//     padding: "20px",
//   },

//   modal: {
//     width: "500px",
//     maxWidth: "100%",
//     maxHeight: "90vh",
//     overflowY: "auto",
//     background: "#1e293b",
//     padding: "20px",
//     borderRadius: "16px",
//   },

//   importModal: {
//     width: "800px",
//     maxWidth: "100%",
//     maxHeight: "90vh",
//     overflowY: "auto",
//     background: "#1e293b",
//     padding: "25px",
//     borderRadius: "16px",
//   },

//   importHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     gap: "15px",
//     marginBottom: "15px",
//   },

//   modalTitle: {
//     marginTop: 0,
//     marginBottom: "8px",
//   },

//   closeBtn: {
//     background: "#ef4444",
//     border: "none",
//     color: "#fff",
//     width: "34px",
//     height: "34px",
//     borderRadius: "8px",
//     cursor: "pointer",
//     fontWeight: "bold",
//   },

//   helpText: {
//     color: "#94a3b8",
//     fontSize: "14px",
//     margin: "5px 0",
//   },

//   infoBox: {
//     background: "#0f172a",
//     border: "1px solid #334155",
//     borderRadius: "10px",
//     padding: "12px",
//     marginBottom: "15px",
//   },

//   codeText: {
//     marginTop: "8px",
//     color: "#a78bfa",
//     fontFamily: "monospace",
//     fontSize: "14px",
//   },

//   textarea: {
//     width: "100%",
//     minHeight: "350px",
//     resize: "vertical",
//     padding: "14px",
//     boxSizing: "border-box",
//     borderRadius: "10px",
//     border: "1px solid #475569",
//     background: "#0f172a",
//     color: "#fff",
//     fontFamily: "monospace",
//     fontSize: "13px",
//     outline: "none",
//   },

//   input: {
//     width: "100%",
//     padding: "10px",
//     marginBottom: "10px",
//     borderRadius: "8px",
//     background: "#334155",
//     color: "#fff",
//     border: "none",
//     boxSizing: "border-box",
//   },

//   fileInput: {
//     width: "100%",
//     marginTop: "5px",
//     color: "#fff",
//   },

//   smallInput: {
//     flex: 1,
//     padding: "8px",
//     background: "#334155",
//     color: "#fff",
//     borderRadius: "8px",
//     border: "none",
//   },

//   variantRow: {
//     display: "flex",
//     gap: "10px",
//     marginBottom: "8px",
//   },

//   addVariantBtn: {
//     background: "#8b5cf6",
//     border: "none",
//     padding: "8px 12px",
//     color: "#fff",
//     borderRadius: "8px",
//     marginTop: "5px",
//     cursor: "pointer",
//   },

//   saveBtn: {
//     width: "100%",
//     marginTop: "15px",
//     padding: "10px",
//     background: "#22c55e",
//     border: "none",
//     color: "#fff",
//     borderRadius: "10px",
//     cursor: "pointer",
//     fontWeight: "bold",
//   },

//   cancelBtn: {
//     width: "100%",
//     marginTop: "8px",
//     padding: "10px",
//     background: "#64748b",
//     border: "none",
//     color: "#fff",
//     borderRadius: "10px",
//     cursor: "pointer",
//   },

//   hr: {
//     border: "none",
//     borderTop: "1px solid #334155",
//     margin: "20px 0",
//   },

//   importActions: {
//     display: "flex",
//     gap: "10px",
//     marginTop: "15px",
//     flexWrap: "wrap",
//   },

//   exampleBtn: {
//     background: "#334155",
//     border: "none",
//     padding: "10px 15px",
//     color: "#fff",
//     borderRadius: "8px",
//     cursor: "pointer",
//   },

//   cancelBtnSmall: {
//     background: "#64748b",
//     border: "none",
//     padding: "10px 15px",
//     color: "#fff",
//     borderRadius: "8px",
//     cursor: "pointer",
//   },

//   importSaveBtn: {
//     background: "#8b5cf6",
//     border: "none",
//     padding: "10px 18px",
//     color: "#fff",
//     borderRadius: "8px",
//     cursor: "pointer",
//     fontWeight: "bold",
//     marginLeft: "auto",
//   },
// };






import React, { useEffect, useMemo, useState } from "react";

import api from "../../api/api";
import socket from "../../socket/socket";
import { baseUrlHandler } from "../../utils/baseUrlHandler";

const emptyForm = {
  title: "",
  ingredients: "",
  instructions: "",
  category: "",
  price: "",
  image: null,
  variants: [],
  restaurantId: "",
};

const AdminRecipes = () => {
  const [recipes, setRecipes] = useState([]);

  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);

  const [showForm, setShowForm] = useState(false);

  const [showImport, setShowImport] = useState(false);

  const [importText, setImportText] = useState("");

  const [importPreview, setImportPreview] = useState([]);

  const [importLoading, setImportLoading] = useState(false);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("all");

  const token = localStorage.getItem("token");

  // =====================================================
  // IMAGE
  // =====================================================

  const getImageUrl = (recipe) => {
    const img = recipe.CoverImage;

    if (!img) {
      return "https://via.placeholder.com/300x200?text=No+Image";
    }

    if (img.startsWith("http")) {
      return img;
    }

    return `${baseUrlHandler()}/${img.replace(/^\/+/, "")}`;
  };

  // =====================================================
  // FETCH RECIPES
  // =====================================================

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
      console.log(
        err?.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SOCKET
  // =====================================================

  useEffect(() => {
    fetchRecipes();

    const handleRecipeCreated = (data) => {
      setRecipes((prev) => {
        const exists = prev.some(
          (recipe) => recipe._id === data._id
        );

        if (exists) {
          return prev;
        }

        return [data, ...prev];
      });
    };

    const handleRecipeUpdated = (data) => {
      setRecipes((prev) =>
        prev.map((recipe) =>
          recipe._id === data._id
            ? data
            : recipe
        )
      );
    };

    const handleRecipeDeleted = (id) => {
      setRecipes((prev) =>
        prev.filter(
          (recipe) => recipe._id !== id
        )
      );
    };

    socket.on(
      "recipeCreated",
      handleRecipeCreated
    );

    socket.on(
      "recipeUpdated",
      handleRecipeUpdated
    );

    socket.on(
      "recipeDeleted",
      handleRecipeDeleted
    );

    return () => {
      socket.off(
        "recipeCreated",
        handleRecipeCreated
      );

      socket.off(
        "recipeUpdated",
        handleRecipeUpdated
      );

      socket.off(
        "recipeDeleted",
        handleRecipeDeleted
      );
    };
  }, []);

  // =====================================================
  // INPUT
  // =====================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      files,
    } = e.target;

    if (name === "image") {
      setForm((prev) => ({
        ...prev,
        image: files?.[0] || null,
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // VARIANTS
  // =====================================================

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

  const updateVariant = (
    index,
    field,
    value
  ) => {
    const copy = [...form.variants];

    copy[index] = {
      ...copy[index],
      [field]: value,
    };

    setForm((prev) => ({
      ...prev,
      variants: copy,
    }));
  };

  const removeVariant = (index) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter(
        (_, i) => i !== index
      ),
    }));
  };

  // =====================================================
  // FORM DATA
  // =====================================================

  const prepareData = () => {
    const data = new FormData();

    data.append("title", form.title);

    data.append(
      "instructions",
      form.instructions
    );

    data.append(
      "category",
      form.category
    );

    data.append(
      "price",
      form.price
    );

    data.append(
      "restaurantId",
      form.restaurantId
    );

    data.append(
      "ingredients",
      form.ingredients
    );

    if (form.variants.length > 0) {
      data.append(
        "variants",
        JSON.stringify(
          form.variants
        )
      );
    }

    if (form.image) {
      data.append(
        "image",
        form.image
      );
    }

    return data;
  };

  // =====================================================
  // CREATE
  // =====================================================

  const createRecipe = async () => {
    try {
      await api.post(
        "/api/v1/recipes",
        prepareData(),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      closeForm();

      await fetchRecipes();
    } catch (err) {
      console.log(
        err?.response?.data || err.message
      );

      alert(
        err?.response?.data?.message ||
          "Failed to create recipe"
      );
    }
  };

  // =====================================================
  // UPDATE
  // =====================================================

  const updateRecipe = async () => {
    try {
      await api.put(
        `/api/v1/recipes/${editingId}`,
        prepareData(),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      closeForm();

      await fetchRecipes();
    } catch (err) {
      console.log(
        err?.response?.data || err.message
      );

      alert(
        err?.response?.data?.message ||
          "Failed to update recipe"
      );
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const deleteRecipe = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this recipe?"
      );

    if (!confirmDelete) {
      return;
    }

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
    } catch (err) {
      console.log(
        err?.response?.data || err.message
      );

      alert(
        err?.response?.data?.message ||
          "Failed to delete recipe"
      );
    }
  };

  // =====================================================
  // EDIT
  // =====================================================

  const startEdit = (recipe) => {
    setForm({
      title: recipe.title || "",

      ingredients:
        recipe.ingredients?.join(", ") ||
        "",

      instructions:
        recipe.instructions || "",

      category:
        recipe.category || "",

      price:
        recipe.price ?? "",

      image: null,

      restaurantId:
        recipe.restaurantId?._id ||
        recipe.restaurantId ||
        "",

      variants:
        recipe.variants || [],
    });

    setEditingId(recipe._id);

    setShowForm(true);
  };

  // =====================================================
  // CLOSE FORM
  // =====================================================

  const closeForm = () => {
    setShowForm(false);

    setEditingId(null);

    setForm(emptyForm);
  };

  // =====================================================
  // IMPORT JSON
  // =====================================================

  const importMenu = async () => {
    if (!importText.trim()) {
      alert(
        "Please paste the menu JSON first."
      );

      return;
    }

    let parsedRecipes;

    try {
      parsedRecipes =
        JSON.parse(importText);
    } catch {
      alert(
        "Invalid JSON format. Please check the menu data."
      );

      return;
    }

    if (!Array.isArray(parsedRecipes)) {
      alert(
        "The imported data must be an array of recipes."
      );

      return;
    }

    if (parsedRecipes.length === 0) {
      alert(
        "No recipes found."
      );

      return;
    }

    setImportPreview(
      parsedRecipes
    );
  };

  // =====================================================
  // CONFIRM IMPORT
  // =====================================================

  const confirmImport = async () => {
    try {
      setImportLoading(true);

      await api.post(
        "/api/v1/recipes/bulk",
        {
          recipes: importPreview,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        `${importPreview.length} recipes imported successfully!`
      );

      setImportText("");

      setImportPreview([]);

      setShowImport(false);

      await fetchRecipes();
    } catch (err) {
      console.log(
        err?.response?.data || err.message
      );

      alert(
        err?.response?.data?.message ||
          "Failed to import menu"
      );
    } finally {
      setImportLoading(false);
    }
  };

  // =====================================================
  // EXAMPLE JSON
  // =====================================================

  const loadExample = () => {
    const example = [
      {
        title: "Chicken Burger",
        ingredients:
          "Chicken, Cheese, Lettuce, Sauce",
        instructions:
          "Chicken burger with cheese and sauce",
        category: "burger",
        price: 120,
        restaurantId:
          "PUT_RESTAURANT_ID_HERE",
        variants: [],
      },
      {
        title: "Chicken Crepe",
        ingredients:
          "Chicken, Cheese, Sauce",
        instructions:
          "Chicken crepe with cheese and sauce",
        category: "crepe",
        price: 100,
        restaurantId:
          "PUT_RESTAURANT_ID_HERE",
        variants: [],
      },
    ];

    setImportText(
      JSON.stringify(
        example,
        null,
        2
      )
    );

    setImportPreview([]);
  };

  // =====================================================
  // FILTER DATA
  // =====================================================

  const categories = useMemo(() => {
    const unique = recipes
      .map(
        (recipe) =>
          recipe.category
      )
      .filter(Boolean);

    return [
      ...new Set(unique),
    ];
  }, [recipes]);

  const filteredRecipes = useMemo(() => {
    const searchValue =
      search
        .trim()
        .toLowerCase();

    return recipes.filter(
      (recipe) => {
        const title =
          recipe.title
            ?.toLowerCase() || "";

        const restaurant =
          recipe.restaurantId?.name
            ?.toLowerCase() || "";

        const category =
          recipe.category
            ?.toLowerCase() || "";

        const matchesSearch =
          !searchValue ||
          title.includes(searchValue) ||
          restaurant.includes(searchValue);

        const matchesCategory =
          categoryFilter === "all" ||
          category ===
            categoryFilter.toLowerCase();

        return (
          matchesSearch &&
          matchesCategory
        );
      }
    );
  }, [
    recipes,
    search,
    categoryFilter,
  ]);

  // =====================================================
  // STATS
  // =====================================================

  const totalRecipes =
    recipes.length;

  const recipesWithImages =
    recipes.filter(
      (recipe) =>
        recipe.CoverImage
    ).length;

  const recipesWithoutImages =
    recipes.length -
    recipesWithImages;

  const totalCategories =
    categories.length;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div style={styles.page}>

      {/* ============================================= */}
      {/* HEADER */}
      {/* ============================================= */}

      <div style={styles.header}>

        <div>
          <div style={styles.breadcrumb}>
            Admin / Recipes
          </div>

          <h1 style={styles.title}>
            Recipe Management
          </h1>

          <p style={styles.subtitle}>
            Manage restaurant menus,
            recipes and products from one place.
          </p>
        </div>

        <div style={styles.headerButtons}>

          <button
            style={styles.importBtn}
            onClick={() => {
              setImportPreview([]);
              setShowImport(true);
            }}
          >
            <span style={styles.buttonIcon}>
              ↓
            </span>

            Import Menu
          </button>

          <button
            style={styles.addBtn}
            onClick={() => {
              setEditingId(null);
              setForm(emptyForm);
              setShowForm(true);
            }}
          >
            <span style={styles.buttonIcon}>
              +
            </span>

            Add Recipe
          </button>

        </div>
      </div>

      {/* ============================================= */}
      {/* STATS */}
      {/* ============================================= */}

      <div style={styles.statsGrid}>

        <div style={styles.statCard}>
          <div
            style={{
              ...styles.statIcon,
              background:
                "rgba(59,130,246,.15)",
              color: "#60a5fa",
            }}
          >
            🍔
          </div>

          <div>
            <div style={styles.statLabel}>
              Total Recipes
            </div>

            <div style={styles.statValue}>
              {totalRecipes}
            </div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div
            style={{
              ...styles.statIcon,
              background:
                "rgba(34,197,94,.15)",
              color: "#4ade80",
            }}
          >
            ✓
          </div>

          <div>
            <div style={styles.statLabel}>
              With Images
            </div>

            <div style={styles.statValue}>
              {recipesWithImages}
            </div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div
            style={{
              ...styles.statIcon,
              background:
                "rgba(245,158,11,.15)",
              color: "#fbbf24",
            }}
          >
            🖼
          </div>

          <div>
            <div style={styles.statLabel}>
              Need Images
            </div>

            <div style={styles.statValue}>
              {recipesWithoutImages}
            </div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div
            style={{
              ...styles.statIcon,
              background:
                "rgba(139,92,246,.15)",
              color: "#a78bfa",
            }}
          >
            #
          </div>

          <div>
            <div style={styles.statLabel}>
              Categories
            </div>

            <div style={styles.statValue}>
              {totalCategories}
            </div>
          </div>
        </div>

      </div>

      {/* ============================================= */}
      {/* CONTENT CARD */}
      {/* ============================================= */}

      <div style={styles.contentCard}>

        {/* TOOLBAR */}

        <div style={styles.toolbar}>

          <div style={styles.searchWrapper}>
            <span style={styles.searchIcon}>
              ⌕
            </span>

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search recipes or restaurants..."
              style={styles.searchInput}
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(
                e.target.value
              )
            }
            style={styles.filterSelect}
          >
            <option value="all">
              All Categories
            </option>

            {categories.map(
              (category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              )
            )}
          </select>

          <div style={styles.resultCount}>
            {filteredRecipes.length}{" "}
            recipes
          </div>

        </div>

        {/* TABLE */}

        {loading ? (
          <div style={styles.loadingBox}>
            <div style={styles.spinner}>
              ⟳
            </div>

            <div>
              Loading recipes...
            </div>
          </div>
        ) : (
          <div style={styles.tableWrapper}>

            <table style={styles.table}>

              <thead>
                <tr>

                  <th style={styles.th}>
                    Product
                  </th>

                  <th style={styles.th}>
                    Category
                  </th>

                  <th style={styles.th}>
                    Restaurant
                  </th>

                  <th style={styles.th}>
                    Price
                  </th>

                  <th style={styles.th}>
                    Image
                  </th>

                  <th
                    style={{
                      ...styles.th,
                      textAlign:
                        "right",
                    }}
                  >
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredRecipes.map(
                  (recipe) => (
                    <tr
                      key={recipe._id}
                      style={styles.tr}
                    >

                      {/* PRODUCT */}

                      <td style={styles.td}>

                        <div
                          style={
                            styles.productCell
                          }
                        >

                          <img
                            src={getImageUrl(
                              recipe
                            )}
                            alt={
                              recipe.title
                            }
                            style={
                              styles.productImage
                            }
                          />

                          <div>

                            <div
                              style={
                                styles.productTitle
                              }
                            >
                              {recipe.title}
                            </div>

                            <div
                              style={
                                styles.productId
                              }
                            >
                              ID:{" "}
                              {recipe._id
                                ?.slice(
                                  -8
                                )}
                            </div>

                          </div>

                        </div>

                      </td>

                      {/* CATEGORY */}

                      <td style={styles.td}>

                        {recipe.category ? (
                          <span
                            style={
                              styles.categoryBadge
                            }
                          >
                            {
                              recipe.category
                            }
                          </span>
                        ) : (
                          <span
                            style={
                              styles.muted
                            }
                          >
                            —
                          </span>
                        )}

                      </td>

                      {/* RESTAURANT */}

                      <td style={styles.td}>

                        <div
                          style={
                            styles.restaurantName
                          }
                        >
                          {recipe
                            .restaurantId
                            ?.name ||
                            recipe
                              .restaurantId ||
                            "—"}
                        </div>

                      </td>

                      {/* PRICE */}

                      <td style={styles.td}>

                        <span
                          style={
                            styles.price
                          }
                        >
                          {recipe.price ??
                            0}{" "}
                          EGP
                        </span>

                      </td>

                      {/* IMAGE */}

                      <td style={styles.td}>

                        {recipe.CoverImage ? (
                          <span
                            style={
                              styles.imageStatus
                            }
                          >
                            ✓ Uploaded
                          </span>
                        ) : (
                          <span
                            style={
                              styles.noImageStatus
                            }
                          >
                            No image
                          </span>
                        )}

                      </td>

                      {/* ACTIONS */}

                      <td
                        style={{
                          ...styles.td,
                          textAlign:
                            "right",
                        }}
                      >

                        <button
                          style={
                            styles.editBtn
                          }
                          onClick={() =>
                            startEdit(
                              recipe
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          style={
                            styles.deleteBtn
                          }
                          onClick={() =>
                            deleteRecipe(
                              recipe._id
                            )
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>
                  )
                )}

                {filteredRecipes.length ===
                  0 && (
                  <tr>
                    <td
                      colSpan="6"
                      style={
                        styles.empty
                      }
                    >
                      <div
                        style={
                          styles.emptyIcon
                        }
                      >
                        🍽️
                      </div>

                      <div
                        style={
                          styles.emptyTitle
                        }
                      >
                        No recipes found
                      </div>

                      <div
                        style={
                          styles.emptyText
                        }
                      >
                        Try changing your
                        search or filter.
                      </div>
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* ============================================= */}
      {/* ADD / EDIT MODAL */}
      {/* ============================================= */}

      {showForm && (
        <div style={styles.overlay}>

          <div style={styles.modal}>

            <div
              style={styles.modalHeader}
            >

              <div>
                <div
                  style={
                    styles.modalEyebrow
                  }
                >
                  RECIPE
                </div>

                <h2
                  style={
                    styles.modalTitle
                  }
                >
                  {editingId
                    ? "Edit Recipe"
                    : "Add Recipe"}
                </h2>
              </div>

              <button
                style={
                  styles.modalClose
                }
                onClick={closeForm}
              >
                ×
              </button>

            </div>

            <div style={styles.formGrid}>

              <div
                style={
                  styles.fullWidth
                }
              >
                <label
                  style={
                    styles.label
                  }
                >
                  Title
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={
                    handleChange
                  }
                  placeholder="e.g. Chicken Burger"
                  style={
                    styles.input
                  }
                />
              </div>

              <div>
                <label
                  style={
                    styles.label
                  }
                >
                  Category
                </label>

                <input
                  name="category"
                  value={
                    form.category
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="burger, crepe..."
                  style={
                    styles.input
                  }
                />
              </div>

              <div>
                <label
                  style={
                    styles.label
                  }
                >
                  Price
                </label>

                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={
                    handleChange
                  }
                  placeholder="0"
                  style={
                    styles.input
                  }
                />
              </div>

              <div
                style={
                  styles.fullWidth
                }
              >
                <label
                  style={
                    styles.label
                  }
                >
                  Restaurant ID
                </label>

                <input
                  name="restaurantId"
                  value={
                    form.restaurantId
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Restaurant ID"
                  style={
                    styles.input
                  }
                />
              </div>

              <div
                style={
                  styles.fullWidth
                }
              >
                <label
                  style={
                    styles.label
                  }
                >
                  Ingredients
                </label>

                <input
                  name="ingredients"
                  value={
                    form.ingredients
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Chicken, Cheese, Sauce"
                  style={
                    styles.input
                  }
                />
              </div>

              <div
                style={
                  styles.fullWidth
                }
              >
                <label
                  style={
                    styles.label
                  }
                >
                  Instructions
                </label>

                <textarea
                  name="instructions"
                  value={
                    form.instructions
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Describe the recipe..."
                  style={
                    styles.formTextarea
                  }
                />
              </div>

              <div
                style={
                  styles.fullWidth
                }
              >
                <label
                  style={
                    styles.label
                  }
                >
                  Product Image
                </label>

                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={
                    handleChange
                  }
                  style={
                    styles.fileInput
                  }
                />
              </div>

            </div>

            {/* VARIANTS */}

            <div
              style={
                styles.variantSection
              }
            >

              <div
                style={
                  styles.variantHeader
                }
              >

                <div>
                  <div
                    style={
                      styles.variantTitle
                    }
                  >
                    Variants
                  </div>

                  <div
                    style={
                      styles.variantHint
                    }
                  >
                    Optional sizes or options
                  </div>
                </div>

                <button
                  style={
                    styles.addVariantBtn
                  }
                  onClick={
                    addVariant
                  }
                >
                  + Add Variant
                </button>

              </div>

              {form.variants.length ===
                0 && (
                <div
                  style={
                    styles.noVariants
                  }
                >
                  No variants added.
                </div>
              )}

              {form.variants.map(
                (
                  variant,
                  index
                ) => (
                  <div
                    key={index}
                    style={
                      styles.variantRow
                    }
                  >

                    <input
                      placeholder="Name"
                      value={
                        variant.name
                      }
                      onChange={(
                        e
                      ) =>
                        updateVariant(
                          index,
                          "name",
                          e.target
                            .value
                        )
                      }
                      style={
                        styles.smallInput
                      }
                    />

                    <input
                      placeholder="Price"
                      type="number"
                      value={
                        variant.price
                      }
                      onChange={(
                        e
                      ) =>
                        updateVariant(
                          index,
                          "price",
                          e.target
                            .value
                        )
                      }
                      style={
                        styles.smallInput
                      }
                    />

                    <button
                      style={
                        styles.removeVariant
                      }
                      onClick={() =>
                        removeVariant(
                          index
                        )
                      }
                    >
                      ×
                    </button>

                  </div>
                )
              )}

            </div>

            <div
              style={
                styles.modalActions
              }
            >

              <button
                style={
                  styles.cancelBtn
                }
                onClick={
                  closeForm
                }
              >
                Cancel
              </button>

              <button
                style={
                  styles.saveBtn
                }
                onClick={
                  editingId
                    ? updateRecipe
                    : createRecipe
                }
              >
                {editingId
                  ? "Update Recipe"
                  : "Save Recipe"}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ============================================= */}
      {/* IMPORT MODAL */}
      {/* ============================================= */}

      {showImport && (
        <div style={styles.overlay}>

          <div
            style={
              styles.importModal
            }
          >

            <div
              style={
                styles.modalHeader
              }
            >

              <div>
                <div
                  style={
                    styles.modalEyebrow
                  }
                >
                  BULK IMPORT
                </div>

                <h2
                  style={
                    styles.modalTitle
                  }
                >
                  Import Restaurant Menu
                </h2>

                <p
                  style={
                    styles.modalDescription
                  }
                >
                  Add multiple recipes at
                  once. Images are optional
                  and can be added later by
                  the restaurant owner.
                </p>
              </div>

              <button
                style={
                  styles.modalClose
                }
                onClick={() => {
                  setShowImport(false);
                  setImportText("");
                  setImportPreview([]);
                }}
              >
                ×
              </button>

            </div>

            {/* IMPORT INFO */}

            <div
              style={
                styles.importInfo
              }
            >

              <div
                style={
                  styles.importInfoIcon
                }
              >
                💡
              </div>

              <div>
                <div
                  style={
                    styles.importInfoTitle
                  }
                >
                  How it works
                </div>

                <div
                  style={
                    styles.importInfoText
                  }
                >
                  Paste your menu JSON below,
                  preview the recipes, then
                  confirm the import.
                </div>
              </div>

            </div>

            {/* TEXTAREA */}

            <textarea
              value={importText}
              onChange={(e) => {
                setImportText(
                  e.target.value
                );

                setImportPreview([]);
              }}
              placeholder={`Paste your menu JSON here...

Example:

[
  {
    "title": "Chicken Burger",
    "ingredients": "Chicken, Cheese, Sauce",
    "instructions": "Chicken burger with cheese",
    "category": "burger",
    "price": 120,
    "restaurantId": "YOUR_RESTAURANT_ID",
    "variants": []
  }
]`}
              style={
                styles.importTextarea
              }
            />

            {/* PREVIEW */}

            {importPreview.length >
              0 && (
              <div
                style={
                  styles.previewSection
                }
              >

                <div
                  style={
                    styles.previewHeader
                  }
                >

                  <div>
                    <div
                      style={
                        styles.previewTitle
                      }
                    >
                      Preview
                    </div>

                    <div
                      style={
                        styles.previewCount
                      }
                    >
                      {
                        importPreview.length
                      }{" "}
                      recipes ready to import
                    </div>
                  </div>

                  <span
                    style={
                      styles.readyBadge
                    }
                  >
                    READY
                  </span>

                </div>

                <div
                  style={
                    styles.previewList
                  }
                >

                  {importPreview
                    .slice(0, 6)
                    .map(
                      (
                        recipe,
                        index
                      ) => (
                        <div
                          key={index}
                          style={
                            styles.previewItem
                          }
                        >

                          <div
                            style={
                              styles.previewNumber
                            }
                          >
                            {index + 1}
                          </div>

                          <div
                            style={
                              styles.previewItemInfo
                            }
                          >
                            <div
                              style={
                                styles.previewItemTitle
                              }
                            >
                              {
                                recipe.title ||
                                "Untitled"
                              }
                            </div>

                            <div
                              style={
                                styles.previewItemMeta
                              }
                            >
                              {
                                recipe.category ||
                                "No category"
                              }
                              {" • "}
                              {
                                recipe.price ??
                                0
                              }{" "}
                              EGP
                            </div>
                          </div>

                        </div>
                      )
                    )}

                  {importPreview.length >
                    6 && (
                    <div
                      style={
                        styles.moreItems
                      }
                    >
                      +
                      {importPreview.length -
                        6}{" "}
                      more recipes
                    </div>
                  )}

                </div>

              </div>
            )}

            {/* IMPORT ACTIONS */}

            <div
              style={
                styles.importBottom
              }
            >

              <button
                style={
                  styles.exampleBtn
                }
                onClick={
                  loadExample
                }
              >
                Load Example
              </button>

              <div
                style={
                  styles.importRightActions
                }
              >

                <button
                  style={
                    styles.cancelBtn
                  }
                  onClick={() => {
                    setShowImport(false);
                    setImportText("");
                    setImportPreview([]);
                  }}
                >
                  Cancel
                </button>

                {importPreview.length ===
                0 ? (
                  <button
                    style={
                      styles.previewBtn
                    }
                    onClick={
                      importMenu
                    }
                  >
                    Preview Menu
                  </button>
                ) : (
                  <button
                    style={
                      styles.confirmImportBtn
                    }
                    onClick={
                      confirmImport
                    }
                    disabled={
                      importLoading
                    }
                  >
                    {importLoading
                      ? "Importing..."
                      : `Import ${importPreview.length} Recipes`}
                  </button>
                )}

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminRecipes;

// =====================================================
// STYLES
// =====================================================

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #0b1120 0%, #111827 55%, #0f172a 100%)",
    color: "#fff",
    padding: "30px",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    boxSizing: "border-box",
  },

  // HEADER

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "20px",
    marginBottom: "28px",
    flexWrap: "wrap",
  },

  breadcrumb: {
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "8px",
    letterSpacing: "0.5px",
  },

  title: {
    margin: 0,
    fontSize: "32px",
    fontWeight: "800",
    letterSpacing: "-0.8px",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#94a3b8",
    fontSize: "14px",
  },

  headerButtons: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  buttonIcon: {
    fontSize: "18px",
    fontWeight: "700",
    marginRight: "6px",
  },

  addBtn: {
    background:
      "linear-gradient(135deg, #22c55e, #16a34a)",
    border: "none",
    padding: "12px 18px",
    borderRadius: "11px",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "700",
    boxShadow:
      "0 8px 20px rgba(34,197,94,.18)",
  },

  importBtn: {
    background:
      "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    border: "none",
    padding: "12px 18px",
    borderRadius: "11px",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "700",
    boxShadow:
      "0 8px 20px rgba(139,92,246,.18)",
  },

  // STATS

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "15px",
    marginBottom: "22px",
  },

  statCard: {
    background:
      "rgba(30,41,59,.72)",
    border:
      "1px solid rgba(148,163,184,.10)",
    borderRadius: "16px",
    padding: "18px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    boxShadow:
      "0 10px 30px rgba(0,0,0,.12)",
  },

  statIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },

  statLabel: {
    color: "#94a3b8",
    fontSize: "12px",
    marginBottom: "4px",
    fontWeight: "600",
  },

  statValue: {
    fontSize: "23px",
    fontWeight: "800",
  },

  // CONTENT

  contentCard: {
    background:
      "rgba(15,23,42,.72)",
    border:
      "1px solid rgba(148,163,184,.10)",
    borderRadius: "18px",
    overflow: "hidden",
    boxShadow:
      "0 15px 45px rgba(0,0,0,.16)",
  },

  toolbar: {
    padding: "17px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderBottom:
      "1px solid rgba(148,163,184,.10)",
    flexWrap: "wrap",
  },

  searchWrapper: {
    flex: 1,
    minWidth: "250px",
    position: "relative",
  },

  searchIcon: {
    position: "absolute",
    left: "13px",
    top: "50%",
    transform:
      "translateY(-50%)",
    color: "#64748b",
    fontSize: "22px",
  },

  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    padding:
      "11px 14px 11px 40px",
    background: "#111827",
    border:
      "1px solid #273449",
    color: "#fff",
    borderRadius: "10px",
    outline: "none",
    fontSize: "14px",
  },

  filterSelect: {
    padding: "11px 14px",
    background: "#111827",
    border:
      "1px solid #273449",
    color: "#e2e8f0",
    borderRadius: "10px",
    outline: "none",
    minWidth: "160px",
  },

  resultCount: {
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "600",
    padding: "0 5px",
  },

  // TABLE

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "900px",
  },

  th: {
    padding: "14px 18px",
    background:
      "rgba(17,24,39,.85)",
    color: "#64748b",
    textAlign: "left",
    fontSize: "11px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.7px",
  },

  tr: {
    transition:
      "background .2s ease",
  },

  td: {
    padding: "14px 18px",
    borderTop:
      "1px solid rgba(148,163,184,.07)",
    verticalAlign: "middle",
  },

  productCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  productImage: {
    width: "52px",
    height: "52px",
    borderRadius: "11px",
    objectFit: "cover",
    background: "#111827",
    border:
      "1px solid rgba(255,255,255,.08)",
  },

  productTitle: {
    fontWeight: "700",
    fontSize: "14px",
    color: "#f8fafc",
    marginBottom: "4px",
  },

  productId: {
    color: "#475569",
    fontSize: "11px",
    fontFamily:
      "monospace",
  },

  categoryBadge: {
    display: "inline-block",
    padding:
      "5px 9px",
    borderRadius: "7px",
    background:
      "rgba(139,92,246,.12)",
    color: "#c4b5fd",
    fontSize: "11px",
    fontWeight: "700",
  },

  restaurantName: {
    color: "#cbd5e1",
    fontSize: "13px",
    fontWeight: "600",
  },

  price: {
    color: "#4ade80",
    fontWeight: "800",
    fontSize: "13px",
  },

  imageStatus: {
    display: "inline-block",
    padding:
      "5px 9px",
    borderRadius: "7px",
    background:
      "rgba(34,197,94,.10)",
    color: "#4ade80",
    fontSize: "11px",
    fontWeight: "700",
  },

  noImageStatus: {
    display: "inline-block",
    padding:
      "5px 9px",
    borderRadius: "7px",
    background:
      "rgba(245,158,11,.10)",
    color: "#fbbf24",
    fontSize: "11px",
    fontWeight: "700",
  },

  muted: {
    color: "#475569",
  },

  editBtn: {
    background:
      "rgba(59,130,246,.12)",
    border:
      "1px solid rgba(59,130,246,.20)",
    padding:
      "7px 11px",
    borderRadius: "8px",
    color: "#60a5fa",
    marginRight: "6px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "12px",
  },

  deleteBtn: {
    background:
      "rgba(239,68,68,.10)",
    border:
      "1px solid rgba(239,68,68,.18)",
    padding:
      "7px 11px",
    borderRadius: "8px",
    color: "#f87171",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "12px",
  },

  // LOADING

  loadingBox: {
    minHeight: "300px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: "10px",
    color: "#94a3b8",
  },

  spinner: {
    fontSize: "30px",
    color: "#8b5cf6",
  },

  // EMPTY

  empty: {
    textAlign: "center",
    padding: "70px 20px",
  },

  emptyIcon: {
    fontSize: "42px",
    marginBottom: "10px",
  },

  emptyTitle: {
    fontSize: "17px",
    fontWeight: "700",
    marginBottom: "5px",
  },

  emptyText: {
    color: "#64748b",
    fontSize: "13px",
  },

  // OVERLAY

  overlay: {
    position: "fixed",
    inset: 0,
    background:
      "rgba(2,6,23,.78)",
    backdropFilter:
      "blur(8px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    padding: "20px",
  },

  // MODAL

  modal: {
    width: "650px",
    maxWidth: "100%",
    maxHeight: "92vh",
    overflowY: "auto",
    background:
      "linear-gradient(145deg, #172033, #111827)",
    border:
      "1px solid rgba(148,163,184,.13)",
    padding: "25px",
    borderRadius: "20px",
    boxShadow:
      "0 30px 80px rgba(0,0,0,.45)",
    boxSizing: "border-box",
  },

  importModal: {
    width: "850px",
    maxWidth: "100%",
    maxHeight: "92vh",
    overflowY: "auto",
    background:
      "linear-gradient(145deg, #172033, #111827)",
    border:
      "1px solid rgba(148,163,184,.13)",
    padding: "25px",
    borderRadius: "20px",
    boxShadow:
      "0 30px 80px rgba(0,0,0,.45)",
    boxSizing: "border-box",
  },

  modalHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "22px",
  },

  modalEyebrow: {
    color: "#8b5cf6",
    fontSize: "10px",
    fontWeight: "900",
    letterSpacing: "1.5px",
    marginBottom: "5px",
  },

  modalTitle: {
    margin: 0,
    fontSize: "23px",
    fontWeight: "800",
  },

  modalDescription: {
    color: "#94a3b8",
    fontSize: "13px",
    lineHeight: 1.6,
    margin:
      "8px 0 0",
    maxWidth: "600px",
  },

  modalClose: {
    width: "34px",
    height: "34px",
    borderRadius: "9px",
    border: "none",
    background:
      "rgba(148,163,184,.10)",
    color: "#94a3b8",
    fontSize: "23px",
    cursor: "pointer",
    flexShrink: 0,
  },

  // FORM

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: "15px",
  },

  fullWidth: {
    gridColumn:
      "1 / -1",
  },

  label: {
    display: "block",
    color: "#cbd5e1",
    fontSize: "12px",
    fontWeight: "700",
    marginBottom: "7px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 12px",
    background: "#0f172a",
    border:
      "1px solid #273449",
    color: "#fff",
    borderRadius: "9px",
    outline: "none",
    fontSize: "13px",
  },

  formTextarea: {
    width: "100%",
    minHeight: "90px",
    resize: "vertical",
    boxSizing: "border-box",
    padding: "11px 12px",
    background: "#0f172a",
    border:
      "1px solid #273449",
    color: "#fff",
    borderRadius: "9px",
    outline: "none",
    fontSize: "13px",
    fontFamily: "inherit",
  },

  fileInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px",
    background: "#0f172a",
    border:
      "1px dashed #475569",
    color: "#94a3b8",
    borderRadius: "9px",
    fontSize: "12px",
  },

  // VARIANTS

  variantSection: {
    marginTop: "22px",
    paddingTop: "20px",
    borderTop:
      "1px solid rgba(148,163,184,.10)",
  },

  variantHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },

  variantTitle: {
    fontWeight: "800",
    fontSize: "14px",
  },

  variantHint: {
    color: "#64748b",
    fontSize: "11px",
    marginTop: "3px",
  },

  addVariantBtn: {
    background:
      "rgba(139,92,246,.13)",
    border:
      "1px solid rgba(139,92,246,.20)",
    padding: "8px 11px",
    color: "#c4b5fd",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "12px",
  },

  noVariants: {
    padding: "14px",
    borderRadius: "9px",
    background:
      "rgba(15,23,42,.7)",
    color: "#64748b",
    textAlign: "center",
    fontSize: "12px",
  },

  variantRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "8px",
  },

  smallInput: {
    flex: 1,
    minWidth: 0,
    padding: "9px 10px",
    background: "#0f172a",
    color: "#fff",
    borderRadius: "8px",
    border:
      "1px solid #273449",
    outline: "none",
  },

  removeVariant: {
    width: "36px",
    border: "none",
    borderRadius: "8px",
    background:
      "rgba(239,68,68,.10)",
    color: "#f87171",
    cursor: "pointer",
    fontSize: "20px",
  },

  modalActions: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
    marginTop: "25px",
  },

  cancelBtn: {
    padding: "10px 16px",
    background:
      "rgba(100,116,139,.15)",
    border:
      "1px solid rgba(148,163,184,.12)",
    color: "#cbd5e1",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: "700",
  },

  saveBtn: {
    padding: "10px 20px",
    background:
      "linear-gradient(135deg, #22c55e, #16a34a)",
    border: "none",
    color: "#fff",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: "800",
  },

  // IMPORT

  importInfo: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
    padding: "13px",
    background:
      "rgba(139,92,246,.08)",
    border:
      "1px solid rgba(139,92,246,.15)",
    borderRadius: "11px",
    marginBottom: "15px",
  },

  importInfoIcon: {
    fontSize: "18px",
  },

  importInfoTitle: {
    fontSize: "12px",
    fontWeight: "800",
    marginBottom: "3px",
  },

  importInfoText: {
    color: "#94a3b8",
    fontSize: "12px",
    lineHeight: 1.5,
  },

  importTextarea: {
    width: "100%",
    minHeight: "280px",
    resize: "vertical",
    padding: "14px",
    boxSizing: "border-box",
    borderRadius: "11px",
    border:
      "1px solid #273449",
    background: "#0b1120",
    color: "#e2e8f0",
    fontFamily:
      "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: "12px",
    lineHeight: 1.6,
    outline: "none",
  },

  // PREVIEW

  previewSection: {
    marginTop: "15px",
    background:
      "rgba(15,23,42,.8)",
    border:
      "1px solid rgba(148,163,184,.10)",
    borderRadius: "12px",
    overflow: "hidden",
  },

  previewHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    padding: "13px 15px",
    borderBottom:
      "1px solid rgba(148,163,184,.08)",
  },

  previewTitle: {
    fontWeight: "800",
    fontSize: "13px",
  },

  previewCount: {
    color: "#64748b",
    fontSize: "11px",
    marginTop: "3px",
  },

  readyBadge: {
    padding:
      "5px 8px",
    borderRadius: "6px",
    background:
      "rgba(34,197,94,.10)",
    color: "#4ade80",
    fontSize: "10px",
    fontWeight: "900",
  },

  previewList: {
    padding: "8px",
  },

  previewItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "9px",
    borderRadius: "8px",
  },

  previewNumber: {
    width: "25px",
    height: "25px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "7px",
    background:
      "rgba(139,92,246,.10)",
    color: "#a78bfa",
    fontSize: "10px",
    fontWeight: "800",
  },

  previewItemInfo: {
    minWidth: 0,
  },

  previewItemTitle: {
    fontSize: "12px",
    fontWeight: "700",
  },

  previewItemMeta: {
    color: "#64748b",
    fontSize: "10px",
    marginTop: "2px",
  },

  moreItems: {
    textAlign: "center",
    color: "#64748b",
    fontSize: "11px",
    padding: "10px",
  },

  importBottom: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    gap: "10px",
    marginTop: "18px",
    flexWrap: "wrap",
  },

  importRightActions: {
    display: "flex",
    gap: "8px",
  },

  exampleBtn: {
    padding: "10px 14px",
    background:
      "rgba(51,65,85,.6)",
    border:
      "1px solid rgba(148,163,184,.10)",
    color: "#cbd5e1",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "12px",
  },

  previewBtn: {
    padding: "10px 16px",
    background:
      "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    border: "none",
    color: "#fff",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: "800",
    fontSize: "12px",
  },

  confirmImportBtn: {
    padding: "10px 16px",
    background:
      "linear-gradient(135deg, #22c55e, #16a34a)",
    border: "none",
    color: "#fff",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: "800",
    fontSize: "12px",
  },
};


