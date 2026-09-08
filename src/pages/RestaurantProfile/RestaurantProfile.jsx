import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { baseUrlHandler } from "../../utils/baseUrlHandler";

const RestaurantProfile = () => {
  const [restaurant, setRestaurant] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";

    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://")
    ) {
      return imagePath;
    }

    const baseUrl = baseUrlHandler();

    if (imagePath.startsWith("/")) {
      return `${baseUrl}${imagePath}`;
    }

    return `${baseUrl}/${imagePath}`;
  };

  // =====================================================
  // GET RESTAURANT
  // =====================================================

  const fetchRestaurant = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("You are not logged in");
        return;
      }

      const res = await api.get(
        "/api/v1/restaurants/my-restaurant",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data;

      console.log("MY RESTAURANT:", data);

      setRestaurant(data);

      setForm({
        name: data.name || "",
        description: data.description || "",
        address: data.address || "",
        phone: data.phone || "",
      });

      if (data.image) {
        setPreview(getImageUrl(data.image));
      } else {
        setPreview("");
      }

      setImage(null);
    } catch (err) {
      console.log("GET RESTAURANT ERROR:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load restaurant"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurant();
  }, []);

  // =====================================================
  // INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  };

  // =====================================================
  // IMAGE
  // =====================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image");
      return;
    }

    setImage(file);

    const imageUrl = URL.createObjectURL(file);

    setPreview(imageUrl);

    setSuccess("");
    setError("");
  };

  // =====================================================
  // UPDATE
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You are not logged in");
        setSaving(false);
        return;
      }

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("address", form.address);
      formData.append("phone", form.phone);

      if (image) {
        formData.append("image", image);
      }

      const res = await api.put(
        "/api/v1/restaurants/my-restaurant",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("UPDATED RESTAURANT:", res.data);

      const updatedRestaurant = res.data.restaurant;

      setRestaurant(updatedRestaurant);

      setForm({
        name: updatedRestaurant.name || "",
        description: updatedRestaurant.description || "",
        address: updatedRestaurant.address || "",
        phone: updatedRestaurant.phone || "",
      });

      if (updatedRestaurant.image) {
        setPreview(getImageUrl(updatedRestaurant.image));
      } else {
        setPreview("");
      }

      setImage(null);

      setSuccess("Restaurant updated successfully");
    } catch (err) {
      console.log("UPDATE RESTAURANT ERROR:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to update restaurant"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="rp-page">
        <div className="rp-loading">
          <div className="rp-spinner"></div>

          <h3>Loading Restaurant</h3>

          <p>Please wait a moment...</p>
        </div>

        <style>{`

          .rp-page {
            min-height: 100vh;
            background: #080808;
            color: #fff;
          }

          .rp-loading {
            min-height: 80vh;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

          .rp-loading h3 {
            margin: 20px 0 5px;
            font-size: 22px;
          }

          .rp-loading p {
            margin: 0;
            color: #777;
          }

          .rp-spinner {
            width: 48px;
            height: 48px;

            border: 3px solid #292929;
            border-top-color: #f6c945;

            border-radius: 50%;

            animation: rpSpin .8s linear infinite;
          }

          @keyframes rpSpin {
            to {
              transform: rotate(360deg);
            }
          }

        `}</style>
      </div>
    );
  }

  // =====================================================
  // NO RESTAURANT
  // =====================================================

  if (!restaurant) {
    return (
      <div className="rp-page">
        <div className="rp-empty">
          <div className="rp-empty-icon">🍽️</div>

          <h2>No Restaurant Found</h2>

          <p>
            Your account is not assigned to a restaurant.
          </p>
        </div>

        <style>{`

          .rp-page {
            min-height: 100vh;
            background: #080808;
            color: #fff;
          }

          .rp-empty {
            min-height: 80vh;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            text-align: center;
          }

          .rp-empty-icon {
            width: 100px;
            height: 100px;

            display: flex;
            align-items: center;
            justify-content: center;

            border-radius: 30px;

            background: #151515;
            border: 1px solid #292929;

            font-size: 48px;

            margin-bottom: 25px;
          }

          .rp-empty h2 {
            margin: 0 0 8px;
          }

          .rp-empty p {
            color: #777;
          }

        `}</style>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="rp-page">

      {/* BACKGROUND */}

      <div className="rp-glow rp-glow-one"></div>
      <div className="rp-glow rp-glow-two"></div>

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="rp-header">

        <div>
          <div className="rp-eyebrow">
            RESTAURANT MANAGEMENT
          </div>

          <h1>Restaurant Profile</h1>

          <p>
            Manage your restaurant identity,
            information and account details.
          </p>
        </div>

        <div className="rp-header-status">
          <span className="rp-status-dot"></span>
          Active Restaurant
        </div>

      </header>

      {/* =================================================
          MESSAGES
      ================================================= */}

      {error && (
        <div className="rp-message rp-error">
          <span>!</span>
          {error}
        </div>
      )}

      {success && (
        <div className="rp-message rp-success">
          <span>✓</span>
          {success}
        </div>
      )}

      {/* =================================================
          HERO
      ================================================= */}

      <section className="rp-hero-card">

        <div className="rp-hero-image">

          <div className="rp-image-ring">

            {preview ? (
              <img
                src={preview}
                alt={restaurant.name || "Restaurant"}
                onError={(e) => {
                  e.currentTarget.style.display = "none";

                  const fallback =
                    e.currentTarget.parentElement.querySelector(
                      ".rp-image-fallback"
                    );

                  if (fallback) {
                    fallback.style.display = "flex";
                  }
                }}
              />
            ) : null}

            <div
              className="rp-image-fallback"
              style={{
                display: preview ? "none" : "flex",
              }}
            >
              🍽️
            </div>

          </div>

          <div className="rp-image-badge">
            <span>●</span>
            Open
          </div>

        </div>

        <div className="rp-hero-info">

          <span className="rp-small-label">
            YOUR RESTAURANT
          </span>

          <h2>
            {restaurant.name || "My Restaurant"}
          </h2>

          <p>
            {restaurant.description ||
              "Your restaurant description will appear here."}
          </p>

          <div className="rp-hero-meta">

            <div>
              <span>📍</span>

              <strong>
                {restaurant.address || "No address"}
              </strong>
            </div>

            <div>
              <span>☎</span>

              <strong>
                {restaurant.phone || "No phone"}
              </strong>
            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          MAIN GRID
      ================================================= */}

      <div className="rp-main-grid">

        {/* FORM */}

        <form
          className="rp-form-card"
          onSubmit={handleSubmit}
        >

          <div className="rp-card-heading">

            <div className="rp-heading-icon">
              ✦
            </div>

            <div>
              <h2>Restaurant Information</h2>

              <p>
                Update your public restaurant details.
              </p>
            </div>

          </div>

          {/* NAME */}

          <div className="rp-form-group">

            <label>Restaurant Name</label>

            <div className="rp-input-wrapper">

              <span>🏪</span>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Restaurant Name"
                required
              />

            </div>

          </div>

          {/* DESCRIPTION */}

          <div className="rp-form-group">

            <label>Description</label>

            <div className="rp-input-wrapper rp-textarea-wrapper">

              <span>✎</span>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Tell customers about your restaurant..."
                rows="5"
              />

            </div>

          </div>

          {/* ADDRESS */}

          <div className="rp-form-group">

            <label>Address</label>

            <div className="rp-input-wrapper">

              <span>📍</span>

              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Restaurant Address"
              />

            </div>

          </div>

          {/* PHONE */}

          <div className="rp-form-group">

            <label>Phone</label>

            <div className="rp-input-wrapper">

              <span>☎</span>

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Restaurant Phone"
              />

            </div>

          </div>

          {/* IMAGE */}

          <div className="rp-form-group">

            <label>Restaurant Image</label>

            <label className="rp-upload">

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

              <div className="rp-upload-icon">
                ↑
              </div>

              <div>

                <strong>
                  {image
                    ? image.name
                    : "Choose a new image"}
                </strong>

                <small>
                  PNG, JPG or WEBP
                </small>

              </div>

            </label>

          </div>

          {/* BUTTON */}

          <button
            type="submit"
            className="rp-save-btn"
            disabled={saving}
          >

            {saving ? (
              <>
                <span className="rp-button-spinner"></span>
                Saving Changes...
              </>
            ) : (
              <>
                Save Changes
                <span>→</span>
              </>
            )}

          </button>

        </form>

        {/* =================================================
            ACCOUNT CARD
        ================================================= */}

        <aside className="rp-account-card">

          <div className="rp-account-top">

            <div className="rp-account-avatar">
              {restaurant.owner?.name
                ?.charAt(0)
                ?.toUpperCase() || "O"}
            </div>

            <div>

              <span className="rp-small-label">
                ACCOUNT OWNER
              </span>

              <h2>
                {restaurant.owner?.name || "N/A"}
              </h2>

            </div>

          </div>

          <div className="rp-owner-badge">
            <span>✓</span>
            Restaurant Owner
          </div>

          <div className="rp-divider"></div>

          <div className="rp-account-list">

            <div className="rp-account-item">

              <div className="rp-info-icon">
                ✉
              </div>

              <div>
                <small>Email</small>

                <strong>
                  {restaurant.owner?.email || "N/A"}
                </strong>
              </div>

            </div>

            <div className="rp-account-item">

              <div className="rp-info-icon">
                ☎
              </div>

              <div>
                <small>Phone</small>

                <strong>
                  {restaurant.owner?.phone || "N/A"}
                </strong>
              </div>

            </div>

            <div className="rp-account-item">

              <div className="rp-info-icon">
                🔐
              </div>

              <div>
                <small>Role</small>

                <strong>
                  {restaurant.owner?.role ||
                    "restaurantOwner"}
                </strong>
              </div>

            </div>

          </div>

          <div className="rp-security-box">

            <div className="rp-security-icon">
              ✓
            </div>

            <div>
              <strong>Account Verified</strong>

              <p>
                Your restaurant account is active.
              </p>
            </div>

          </div>

        </aside>

      </div>

      {/* =================================================
          BOTTOM CARD
      ================================================= */}

      <section className="rp-bottom-card">

        <div className="rp-bottom-icon">
          ✦
        </div>

        <div>
          <h3>
            Keep your restaurant information updated
          </h3>

          <p>
            Accurate information helps customers find
            and trust your restaurant.
          </p>
        </div>

        <div className="rp-bottom-line"></div>

        <div className="rp-last-update">
          <small>STATUS</small>
          <strong>ONLINE</strong>
        </div>

      </section>

      {/* =================================================
          CSS
      ================================================= */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        /* =================================================
           PAGE
        ================================================= */

        .rp-page {
          position: relative;

          width: 100%;
          min-height: 100vh;

          padding: 35px 30px 45px;

          background:
            radial-gradient(
              circle at 85% 10%,
              rgba(246, 201, 69, 0.07),
              transparent 30%
            ),
            radial-gradient(
              circle at 5% 70%,
              rgba(246, 201, 69, 0.04),
              transparent 28%
            ),
            #080808;

          color: #fff;

          overflow: hidden;
        }

        /* =================================================
           COMMON CONTAINER
        ================================================= */

        .rp-header,
        .rp-message,
        .rp-hero-card,
        .rp-main-grid,
        .rp-bottom-card {

          width: 100%;
          max-width: 1550px;

          margin-left: auto;
          margin-right: auto;
        }

        /* =================================================
           GLOW
        ================================================= */

        .rp-glow {
          position: fixed;

          width: 350px;
          height: 350px;

          border-radius: 50%;

          background:
            rgba(246, 201, 69, 0.035);

          filter: blur(100px);

          pointer-events: none;
        }

        .rp-glow-one {
          top: 0;
          right: -150px;
        }

        .rp-glow-two {
          bottom: -150px;
          left: -150px;
        }

        /* =================================================
           HEADER
        ================================================= */

        .rp-header {
          position: relative;
          z-index: 2;

          margin-bottom: 28px;

          display: flex;
          align-items: flex-end;
          justify-content: space-between;

          gap: 30px;
        }

        .rp-eyebrow,
        .rp-small-label {
          color: #c6a12e;

          font-size: 11px;
          font-weight: 800;

          letter-spacing: 2px;
        }

        .rp-header h1 {
          margin: 7px 0 8px;

          font-size: clamp(32px, 4vw, 48px);

          line-height: 1;

          letter-spacing: -1.5px;
        }

        .rp-header p {
          margin: 0;

          color: #777;

          font-size: 15px;
        }

        .rp-header-status {
          display: flex;
          align-items: center;
          gap: 9px;

          padding: 10px 16px;

          background: rgba(255,255,255,.03);

          border: 1px solid #292929;

          border-radius: 30px;

          color: #ddd;

          font-size: 13px;
          font-weight: 600;

          white-space: nowrap;
        }

        .rp-status-dot {
          width: 8px;
          height: 8px;

          border-radius: 50%;

          background: #4ade80;

          box-shadow:
            0 0 12px rgba(74,222,128,.7);
        }

        /* =================================================
           MESSAGES
        ================================================= */

        .rp-message {
          position: relative;
          z-index: 3;

          margin-bottom: 20px;

          padding: 14px 18px;

          border-radius: 12px;

          display: flex;
          align-items: center;
          gap: 12px;

          font-size: 14px;
          font-weight: 600;
        }

        .rp-message span {
          width: 25px;
          height: 25px;

          flex-shrink: 0;

          border-radius: 50%;

          display: flex;
          align-items: center;
          justify-content: center;

          font-weight: 900;
        }

        .rp-error {
          background: rgba(255,70,70,.08);

          border: 1px solid rgba(255,70,70,.2);

          color: #ff7777;
        }

        .rp-error span {
          background: rgba(255,70,70,.15);
        }

        .rp-success {
          background: rgba(74,222,128,.07);

          border: 1px solid rgba(74,222,128,.18);

          color: #63e890;
        }

        .rp-success span {
          background: rgba(74,222,128,.15);
        }

        /* =================================================
           HERO
        ================================================= */

        .rp-hero-card {
          position: relative;
          z-index: 2;

          min-height: 270px;

          margin-bottom: 25px;

          padding: 35px 40px;

          display: flex;
          align-items: center;

          gap: 50px;

          background:
            linear-gradient(
              135deg,
              rgba(255,255,255,.055),
              rgba(255,255,255,.018)
            );

          border: 1px solid #292929;

          border-radius: 26px;

          box-shadow:
            0 25px 70px rgba(0,0,0,.35);

          overflow: hidden;
        }

        .rp-hero-card::before {
          content: "";

          position: absolute;
          inset: 0;

          background:
            linear-gradient(
              110deg,
              transparent 40%,
              rgba(246,201,69,.045),
              transparent 70%
            );

          pointer-events: none;
        }

        .rp-hero-image {
          position: relative;

          flex-shrink: 0;
        }

        .rp-image-ring {
          width: 190px;
          height: 190px;

          padding: 6px;

          border-radius: 50%;

          background:
            linear-gradient(
              135deg,
              #ffe47a,
              #b98d16,
              #ffe47a
            );

          box-shadow:
            0 0 0 8px rgba(246,201,69,.05),
            0 20px 50px rgba(0,0,0,.5);

          overflow: hidden;
        }

        .rp-image-ring img,
        .rp-image-fallback {
          width: 100%;
          height: 100%;

          border-radius: 50%;

          object-fit: cover;

          background: #171717;
        }

        .rp-image-fallback {
          align-items: center;
          justify-content: center;

          font-size: 65px;
        }

        .rp-image-badge {
          position: absolute;

          bottom: -4px;
          right: -12px;

          padding: 8px 13px;

          background: #101010;

          border: 1px solid #343434;

          border-radius: 30px;

          font-size: 12px;
          font-weight: 700;

          box-shadow:
            0 8px 20px rgba(0,0,0,.4);
        }

        .rp-image-badge span {
          color: #4ade80;

          margin-right: 5px;
        }

        .rp-hero-info {
          position: relative;
          z-index: 2;

          min-width: 0;
        }

        .rp-hero-info h2 {
          margin: 8px 0 10px;

          font-size: clamp(30px, 4vw, 45px);

          letter-spacing: -1px;

          word-break: break-word;
        }

        .rp-hero-info > p {
          max-width: 800px;

          margin: 0;

          color: #8b8b8b;

          line-height: 1.7;

          font-size: 15px;
        }

        .rp-hero-meta {
          display: flex;

          flex-wrap: wrap;

          gap: 12px;

          margin-top: 25px;
        }

        .rp-hero-meta div {
          display: flex;
          align-items: center;

          gap: 9px;

          padding: 9px 13px;

          background: rgba(255,255,255,.035);

          border: 1px solid #2b2b2b;

          border-radius: 9px;

          color: #aaa;

          font-size: 13px;
        }

        .rp-hero-meta span {
          color: #f6c945;
        }

        .rp-hero-meta strong {
          color: #ddd;

          font-weight: 500;
        }

        /* =================================================
           MAIN GRID
        ================================================= */

        .rp-main-grid {
          position: relative;
          z-index: 2;

          display: grid;

          grid-template-columns:
            minmax(0, 1.65fr)
            minmax(330px, .75fr);

          gap: 25px;
        }

        .rp-form-card,
        .rp-account-card,
        .rp-bottom-card {

          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.045),
              rgba(255,255,255,.015)
            );

          border: 1px solid #282828;

          border-radius: 22px;

          box-shadow:
            0 20px 60px rgba(0,0,0,.25);
        }

        .rp-form-card {
          padding: 32px;
        }

        /* =================================================
           CARD HEADING
        ================================================= */

        .rp-card-heading {
          display: flex;
          align-items: center;

          gap: 15px;

          padding-bottom: 25px;

          margin-bottom: 28px;

          border-bottom: 1px solid #242424;
        }

        .rp-heading-icon {
          width: 45px;
          height: 45px;

          flex-shrink: 0;

          border-radius: 13px;

          display: flex;
          align-items: center;
          justify-content: center;

          background:
            linear-gradient(
              135deg,
              rgba(246,201,69,.18),
              rgba(246,201,69,.04)
            );

          border: 1px solid rgba(246,201,69,.25);

          color: #f6c945;

          font-size: 20px;
        }

        .rp-card-heading h2 {
          margin: 0 0 5px;

          font-size: 20px;
        }

        .rp-card-heading p {
          margin: 0;

          color: #6f6f6f;

          font-size: 13px;
        }

        /* =================================================
           FORM
        ================================================= */

        .rp-form-group {
          margin-bottom: 21px;
        }

        .rp-form-group > label {
          display: block;

          margin-bottom: 9px;

          color: #d5d5d5;

          font-size: 13px;
          font-weight: 700;
        }

        .rp-input-wrapper {
          min-height: 50px;

          display: flex;
          align-items: center;

          gap: 12px;

          padding: 0 15px;

          background: #111;

          border: 1px solid #292929;

          border-radius: 11px;

          transition: .25s;
        }

        .rp-input-wrapper > span {
          flex-shrink: 0;

          color: #777;

          font-size: 15px;
        }

        .rp-input-wrapper:focus-within {
          border-color: rgba(246,201,69,.65);

          box-shadow:
            0 0 0 3px rgba(246,201,69,.06),
            0 8px 25px rgba(0,0,0,.2);
        }

        .rp-input-wrapper input,
        .rp-input-wrapper textarea {
          width: 100%;

          background: transparent;

          border: none;

          outline: none;

          color: #eee;

          font-family: inherit;

          font-size: 14px;
        }

        .rp-input-wrapper input {
          height: 48px;
        }

        .rp-input-wrapper input::placeholder,
        .rp-input-wrapper textarea::placeholder {
          color: #4f4f4f;
        }

        .rp-textarea-wrapper {
          align-items: flex-start;

          padding-top: 14px;
        }

        .rp-input-wrapper textarea {
          min-height: 105px;

          resize: vertical;

          line-height: 1.6;
        }

        /* =================================================
           UPLOAD
        ================================================= */

        .rp-upload {
          min-height: 80px;

          display: flex;
          align-items: center;

          gap: 15px;

          padding: 15px;

          background: #111;

          border: 1px dashed #383838;

          border-radius: 12px;

          cursor: pointer;

          transition: .25s;
        }

        .rp-upload:hover {
          border-color: #c6a12e;

          background:
            rgba(246,201,69,.025);
        }

        .rp-upload input {
          display: none;
        }

        .rp-upload-icon {
          width: 45px;
          height: 45px;

          flex-shrink: 0;

          border-radius: 11px;

          display: flex;
          align-items: center;
          justify-content: center;

          background:
            rgba(246,201,69,.08);

          color: #f6c945;

          font-size: 22px;
          font-weight: 700;
        }

        .rp-upload strong {
          display: block;

          color: #ddd;

          font-size: 13px;

          max-width: 500px;

          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;
        }

        .rp-upload small {
          display: block;

          margin-top: 5px;

          color: #5d5d5d;

          font-size: 11px;
        }

        /* =================================================
           BUTTON
        ================================================= */

        .rp-save-btn {
          width: 100%;
          height: 52px;

          margin-top: 8px;

          border: none;

          border-radius: 11px;

          background:
            linear-gradient(
              135deg,
              #ffe477,
              #e8b92e
            );

          color: #101010;

          font-size: 14px;
          font-weight: 800;

          cursor: pointer;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 12px;

          transition: .25s;

          box-shadow:
            0 10px 25px rgba(246,201,69,.08);
        }

        .rp-save-btn:hover {
          transform: translateY(-2px);

          box-shadow:
            0 14px 35px rgba(246,201,69,.16);
        }

        .rp-save-btn:active {
          transform: translateY(0);
        }

        .rp-save-btn:disabled {
          opacity: .55;

          cursor: not-allowed;

          transform: none;
        }

        .rp-button-spinner {
          width: 18px;
          height: 18px;

          border: 2px solid rgba(0,0,0,.2);

          border-top-color: #111;

          border-radius: 50%;

          animation:
            rpSpin .7s linear infinite;
        }

        /* =================================================
           ACCOUNT
        ================================================= */

        .rp-account-card {
          padding: 30px;
        }

        .rp-account-top {
          display: flex;
          align-items: center;

          gap: 15px;
        }

        .rp-account-avatar {
          width: 55px;
          height: 55px;

          flex-shrink: 0;

          border-radius: 16px;

          display: flex;
          align-items: center;
          justify-content: center;

          background:
            linear-gradient(
              135deg,
              #f7d65c,
              #a87912
            );

          color: #111;

          font-size: 22px;
          font-weight: 900;
        }

        .rp-account-top h2 {
          margin: 5px 0 0;

          font-size: 20px;

          word-break: break-word;
        }

        .rp-owner-badge {
          display: inline-flex;

          align-items: center;

          gap: 7px;

          margin-top: 20px;

          padding: 7px 12px;

          border-radius: 30px;

          background:
            rgba(246,201,69,.07);

          border:
            1px solid rgba(246,201,69,.16);

          color: #e5bf48;

          font-size: 11px;
          font-weight: 700;
        }

        .rp-owner-badge span {
          width: 17px;
          height: 17px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background:
            rgba(246,201,69,.15);
        }

        .rp-divider {
          height: 1px;

          background: #272727;

          margin: 27px 0;
        }

        .rp-account-list {
          display: flex;

          flex-direction: column;

          gap: 15px;
        }

        .rp-account-item {
          display: flex;

          align-items: center;

          gap: 13px;

          padding: 13px;

          background:
            rgba(255,255,255,.025);

          border: 1px solid #242424;

          border-radius: 12px;

          min-width: 0;
        }

        .rp-info-icon {
          width: 38px;
          height: 38px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 10px;

          background: #181818;

          color: #c6a12e;

          font-size: 15px;
        }

        .rp-account-item small {
          display: block;

          color: #5f5f5f;

          font-size: 10px;
          font-weight: 700;

          text-transform: uppercase;

          letter-spacing: .8px;

          margin-bottom: 4px;
        }

        .rp-account-item strong {
          display: block;

          color: #ddd;

          font-size: 13px;

          word-break: break-word;
        }

        .rp-security-box {
          display: flex;

          align-items: center;

          gap: 12px;

          margin-top: 25px;

          padding: 14px;

          background:
            rgba(74,222,128,.045);

          border:
            1px solid rgba(74,222,128,.12);

          border-radius: 12px;
        }

        .rp-security-icon {
          width: 35px;
          height: 35px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 10px;

          background:
            rgba(74,222,128,.1);

          color: #4ade80;

          font-weight: 900;
        }

        .rp-security-box strong {
          display: block;

          color: #ddd;

          font-size: 12px;
        }

        .rp-security-box p {
          margin: 4px 0 0;

          color: #666;

          font-size: 11px;
        }

        /* =================================================
           BOTTOM
        ================================================= */

        .rp-bottom-card {
          position: relative;
          z-index: 2;

          margin-top: 25px;

          padding: 20px 25px;

          display: flex;

          align-items: center;

          gap: 15px;
        }

        .rp-bottom-icon {
          width: 42px;
          height: 42px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 12px;

          background:
            rgba(246,201,69,.08);

          color: #f6c945;
        }

        .rp-bottom-card h3 {
          margin: 0 0 4px;

          font-size: 13px;
        }

        .rp-bottom-card p {
          margin: 0;

          color: #666;

          font-size: 11px;
        }

        .rp-bottom-line {
          flex: 1;

          height: 1px;

          background: #252525;

          margin-left: 15px;
        }

        .rp-last-update {
          text-align: right;

          flex-shrink: 0;
        }

        .rp-last-update small {
          display: block;

          color: #555;

          font-size: 9px;

          letter-spacing: 1px;
        }

        .rp-last-update strong {
          color: #4ade80;

          font-size: 11px;
        }

        /* =================================================
           TABLET
        ================================================= */

        @media (max-width: 1100px) {

          .rp-page {
            padding: 30px 22px 40px;
          }

          .rp-main-grid {
            grid-template-columns: 1fr;
          }

          .rp-account-card {
            order: 2;
          }

        }

        /* =================================================
           MOBILE
        ================================================= */

        @media (max-width: 650px) {

          .rp-page {
            padding: 22px 14px 35px;
          }

          .rp-header {
            align-items: flex-start;

            flex-direction: column;

            gap: 18px;
          }

          .rp-header h1 {
            font-size: 34px;
          }

          .rp-header-status {
            font-size: 11px;
          }

          .rp-hero-card {
            padding: 25px 20px;

            flex-direction: column;

            text-align: center;

            gap: 25px;
          }

          .rp-image-ring {
            width: 165px;
            height: 165px;
          }

          .rp-hero-info > p {
            font-size: 13px;
          }

          .rp-hero-meta {
            justify-content: center;
          }

          .rp-hero-meta div {
            width: 100%;

            justify-content: center;
          }

          .rp-form-card,
          .rp-account-card {
            padding: 22px 18px;
          }

          .rp-card-heading {
            align-items: flex-start;
          }

          .rp-card-heading h2 {
            font-size: 18px;
          }

          .rp-bottom-card {
            flex-wrap: wrap;
          }

          .rp-bottom-line {
            display: none;
          }

          .rp-last-update {
            width: 100%;

            text-align: left;
          }

        }

        /* =================================================
           VERY SMALL MOBILE
        ================================================= */

        @media (max-width: 400px) {

          .rp-page {
            padding: 18px 10px 30px;
          }

          .rp-hero-card {
            padding: 22px 15px;
          }

          .rp-form-card,
          .rp-account-card {
            padding: 18px 14px;
          }

          .rp-image-ring {
            width: 145px;
            height: 145px;
          }

          .rp-hero-info h2 {
            font-size: 28px;
          }

        }

      `}</style>

    </div>
  );
};

export default RestaurantProfile;