import React, { useEffect, useState } from "react";
import api from "../../api/api";
import "./RestaurantsAdmin.css";

const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    ownerPassword: "",
  });

  const [image, setImage] = useState(null);

  // ================= IMAGE URL =================

  const getImageUrl = (image) => {
    if (!image) return null;

    // لو الصورة رابط كامل
    if (image.startsWith("http")) {
      return image;
    }

    // لو الصورة /images/filename.jpg
    return `${import.meta.env.VITE_BACKEND_BASE_LOCAL}${image}`;
  };

  // ================= GET RESTAURANTS =================

  const fetchRestaurants = async () => {
    try {
      const res = await api.get("/api/v1/restaurants");

      setRestaurants(res.data || []);
    } catch (err) {
      console.log(err);

      alert("Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= CREATE RESTAURANT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();

      // Restaurant
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("address", form.address);
      formData.append("phone", form.phone);

      // Owner
      formData.append("ownerName", form.ownerName);
      formData.append("ownerEmail", form.ownerEmail);
      formData.append("ownerPhone", form.ownerPhone);
      formData.append("ownerPassword", form.ownerPassword);

      // Image
      if (image) {
        formData.append("image", image);
      }

      const res = await api.post(
        "/api/v1/restaurants",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Restaurant created successfully ✅");

      // إضافة المطعم الجديد أول القائمة
      setRestaurants((prev) => [
        res.data.restaurant,
        ...prev,
      ]);

      // Reset form
      setForm({
        name: "",
        description: "",
        address: "",
        phone: "",
        ownerName: "",
        ownerEmail: "",
        ownerPhone: "",
        ownerPassword: "",
      });

      setImage(null);

      setShowForm(false);

    } catch (err) {
      console.log(err);

      alert(
        err?.response?.data?.message ||
        "Something went wrong"
      );
    }
  };

  // ================= DELETE =================

  const deleteRestaurant = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this restaurant?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(
        `/api/v1/restaurants/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRestaurants((prev) =>
        prev.filter(
          (restaurant) =>
            restaurant._id !== id
        )
      );

      alert("Restaurant deleted successfully ✅");

    } catch (err) {
      console.log(err);

      alert(
        err?.response?.data?.message ||
        "Failed to delete restaurant"
      );
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="restaurants-page">

        <h2>🍽️ Restaurants</h2>

        <p>Loading...</p>

      </div>
    );
  }

  // ================= UI =================

  return (
    <div className="restaurants-page">

      {/* ================= HEADER ================= */}

      <div className="restaurants-header">

        <div>
          <h2>🍽️ Restaurants</h2>

          <p>
            Manage restaurants and restaurant owners
          </p>
        </div>

        <button
          className="add-restaurant-btn"
          onClick={() =>
            setShowForm(!showForm)
          }
        >
          {showForm
            ? "✖ Close"
            : "➕ Add Restaurant"}
        </button>

      </div>

      {/* ================= ADD FORM ================= */}

      {showForm && (

        <form
          className="restaurant-form"
          onSubmit={handleSubmit}
        >

          <h3>
            ➕ Create New Restaurant
          </h3>

          {/* RESTAURANT INFORMATION */}

          <h4>
            🍽️ Restaurant Information
          </h4>

          <div className="form-grid">

            <input
              name="name"
              placeholder="Restaurant Name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              name="phone"
              placeholder="Restaurant Phone"
              value={form.phone}
              onChange={handleChange}
            />

            <input
              name="address"
              placeholder="Restaurant Address"
              value={form.address}
              onChange={handleChange}
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImage(
                  e.target.files[0]
                )
              }
            />

          </div>

          <textarea
            name="description"
            placeholder="Restaurant Description"
            value={form.description}
            onChange={handleChange}
          />

          {/* IMAGE PREVIEW */}

          {image && (

            <div className="image-preview">

              <p>
                Image Preview:
              </p>

              <img
                src={URL.createObjectURL(image)}
                alt="Restaurant Preview"
              />

            </div>

          )}

          {/* OWNER */}

          <h4>
            👤 Restaurant Owner
          </h4>

          <div className="form-grid">

            <input
              name="ownerName"
              placeholder="Owner Name"
              value={form.ownerName}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="ownerEmail"
              placeholder="Owner Email"
              value={form.ownerEmail}
              onChange={handleChange}
              required
            />

            <input
              name="ownerPhone"
              placeholder="Owner Phone"
              value={form.ownerPhone}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="ownerPassword"
              placeholder="Owner Password"
              value={form.ownerPassword}
              onChange={handleChange}
              required
            />

          </div>

          {/* CREATE */}

          <button
            type="submit"
            className="create-btn"
          >
            Create Restaurant 🚀
          </button>

        </form>
      )}

      {/* ================= RESTAURANTS ================= */}

      {restaurants.length === 0 ? (

        <div className="empty-restaurants">

          <h3>
            No restaurants yet 🍽️
          </h3>

          <p>
            Create your first restaurant.
          </p>

        </div>

      ) : (

        <div className="restaurants-grid">

          {restaurants.map(
            (restaurant) => (

              <div
                className="restaurant-card"
                key={restaurant._id}
              >

                {/* ================= IMAGE ================= */}

                {restaurant.image ? (

                  <img
                    src={getImageUrl(
                      restaurant.image
                    )}
                    alt={restaurant.name}
                    className="restaurant-image"
                    onError={(e) => {
                      e.target.style.display =
                        "none";

                      e.target.nextElementSibling.style.display =
                        "flex";
                    }}
                  />

                ) : null}

                {/* FALLBACK IMAGE */}

                <div
                  className="no-image"
                  style={{
                    display: restaurant.image
                      ? "none"
                      : "flex",
                  }}
                >
                  🍽️
                </div>

                {/* ================= INFO ================= */}

                <div className="restaurant-info">

                  <h3>
                    {restaurant.name}
                  </h3>

                  <p className="description">
                    {restaurant.description ||
                      "No description"}
                  </p>

                  <p>
                    📍{" "}
                    {restaurant.address ||
                      "No address"}
                  </p>

                  <p>
                    📞{" "}
                    {restaurant.phone ||
                      "No phone"}
                  </p>

                  {/* OWNER */}

                  <div className="owner-box">

                    <strong>
                      👤 Owner
                    </strong>

                    {restaurant.owner ? (

                      <>
                        <p>
                          {restaurant.owner.name}
                        </p>

                        <small>
                          {
                            restaurant.owner
                              .email
                          }
                        </small>

                        {restaurant.owner.phone && (
                          <small>
                            📞{" "}
                            {
                              restaurant.owner
                                .phone
                            }
                          </small>
                        )}

                      </>

                    ) : (

                      <p>
                        No owner
                      </p>

                    )}

                  </div>

                  {/* ACTIONS */}

                  <div className="restaurant-actions">

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteRestaurant(
                          restaurant._id
                        )
                      }
                    >
                      🗑️ Delete
                    </button>

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
};

export default AdminRestaurants;