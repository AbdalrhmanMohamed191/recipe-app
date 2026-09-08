import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { baseUrlHandler } from "../../utils/baseUrlHandler";
import { useNavigate } from "react-router-dom";
import "./Restaurants.css";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fallbackImg =
    "https://via.placeholder.com/800x500?text=Restaurant";

  const getImageUrl = (image) => {
    if (!image) return fallbackImg;

    if (image.startsWith("http")) {
      return image;
    }

    return `${baseUrlHandler()}${image}`;
  };

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await api.get("/api/v1/restaurants");
        setRestaurants(res.data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleOpenMenu = (id) => {
    navigate(`/menu/${id}`);
  };

  return (
    <div className="restaurants-page">

      {/* ================= HEADER ================= */}

      <div className="restaurants-header">

        <div>
          <span className="restaurants-label">
            EXPLORE
          </span>

          <h1>
            Find Your{" "}
            <span>Favorite Restaurant</span>
          </h1>

          <p>
            Choose from our restaurants and discover
            something delicious today.
          </p>
        </div>

      </div>


      {/* ================= CONTENT ================= */}

      <section className="restaurants-content">

        <div className="restaurants-section-title">

          <div>
            <h2>Restaurants</h2>

            <p>
              Delicious food is waiting for you
            </p>
          </div>

          {!loading && restaurants.length > 0 && (
            <span className="restaurant-number">
              {restaurants.length} places
            </span>
          )}

        </div>


        {/* ================= LOADING ================= */}

        {loading ? (

          <div className="restaurants-grid">

            {Array.from({ length: 6 }).map((_, index) => (
              <div
                className="restaurant-card skeleton-card"
                key={index}
              >

                <div className="skeleton-img"></div>

                <div className="skeleton-body">

                  <div className="skeleton-title"></div>

                  <div className="skeleton-text"></div>

                  <div className="skeleton-text small"></div>

                  <div className="skeleton-button"></div>

                </div>

              </div>
            ))}

          </div>

        ) : restaurants.length === 0 ? (

          /* ================= EMPTY ================= */

          <div className="restaurants-empty">

            <div className="empty-icon">
              🍽️
            </div>

            <h3>
              No restaurants found
            </h3>

            <p>
              There are no restaurants available right now.
            </p>

          </div>

        ) : (

          /* ================= RESTAURANTS ================= */

          <div className="restaurants-grid">

            {restaurants.map((restaurant) => (

              <div
                className="restaurant-card"
                key={restaurant._id}
              >

                {/* IMAGE */}

                <div className="restaurant-image">

                  <img
                    src={getImageUrl(restaurant.image)}
                    alt={restaurant.name}
                    onError={(e) => {
                      e.currentTarget.src = fallbackImg;
                    }}
                  />

                  <div className="image-overlay"></div>

                  <div className="open-badge">
                    <span></span>
                    Open
                  </div>

                </div>


                {/* BODY */}

                <div className="restaurant-body">

                  <h3>
                    {restaurant.name}
                  </h3>

                  <p>
                    {restaurant.description ||
                      "Delicious food waiting for you 🍔"}
                  </p>


                  <div className="card-bottom">

                    <div className="restaurant-category">
                      🍴 Restaurant
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleOpenMenu(restaurant._id)
                      }
                    >
                      View Menu
                      <span>→</span>
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
};

export default Restaurants;