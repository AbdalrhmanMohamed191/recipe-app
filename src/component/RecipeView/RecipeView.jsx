import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { baseUrlHandler } from "../../utils/baseUrlHandler";

const RecipeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setError("");
        const res = await api.get(`/api/v1/recipes/${id}`);
        // تأكد من أن البيانات تأتي بشكل صحيح حسب هيكلة الـ API الخاص بك
        setRecipe(res.data.recipe || res.data);
      } catch (err) {
        console.error(err);
        setError("Recipe not found");
      }
    };

    fetchRecipe();
  }, [id]);

  // images
  const getImageUrl = (data) => {
    if (!data) return "https://via.placeholder.com/600x400?text=No+Image";
    
    // فحص جميع المسميات المحتملة للحقل
    const img = data.image || data.coverImage || data.CoverImage;

    if (!img) return "https://via.placeholder.com/600x400?text=No+Image";

    // إذا كان الرابط كاملاً يبدأ بـ http
    if (typeof img === "string" && img.startsWith("http")) {
      return img;
    }

    // إذا كان مساراً نسبياً، نستخدم baseUrlHandler مع إزالة السلاش المتكرر
    return `${baseUrlHandler()}/${img.replace(/^\/+/, "")}`;
  };

  if (error) {
    return (
      <div className="text-center text-danger mt-5">
        {error}
        <br />
        <button
          className="btn btn-outline-light mt-3"
          onClick={() => navigate(-1)}
        >
          ⬅ Back
        </button>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="text-center text-white mt-5">
        <div className="spinner-border text-warning" role="status"></div>
        <p className="mt-2">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container py-5 text-white mt-5 mb-5">
      {/* Back Button */}
      <button
        className="btn btn-outline-light mb-4 shadow-sm"
        onClick={() => navigate(-1)}
      >
        ⬅ Back
      </button>

      <div className="card bg-dark text-white shadow-lg border-0 overflow-hidden">
        {/* Image */}
        <img
          src={getImageUrl(recipe)}
          className="card-img-top"
          style={{ maxHeight: "500px", objectFit: "cover" }}
          alt={recipe.title}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/600x400?text=Image+Error";
          }}
        />

        <div className="card-body p-4">
          {/* Title & Category */}
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h2 className="card-title mb-1">{recipe.title}</h2>
              <span className="badge bg-secondary mb-3">{recipe.category}</span>
            </div>
            <div className="text-end">
              <h4 className="text-success fw-bold">{recipe.price} EGP</h4>
            </div>
          </div>

          <hr className="border-secondary" />

          {/* Ingredients */}
          <div className="row mt-4">
            <div className="col-md-5">
              <h5 className="text-warning">
                <i className="bi bi-list-check me-2"></i>Ingredients
              </h5>
              <ul className="mt-3">
                {recipe.ingredients?.length > 0 ? (
                  recipe.ingredients.map((item, index) => (
                    <li key={index} className="mb-2">{item}</li>
                  ))
                ) : (
                  <li className="text-muted">No ingredients listed.</li>
                )}
              </ul>
            </div>

            {/* Instructions */}
            <div className="col-md-7">
              <h5 className="text-warning">
                <i className="bi bi-journal-text me-2"></i>Instructions
              </h5>
              <p className="mt-3 text-light" style={{ whiteSpace: "pre-line", lineHeight: "1.8" }}>
                {recipe.instructions || "No instructions provided."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeView;