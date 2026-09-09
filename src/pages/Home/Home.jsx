import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "../../App.css";
import "./Home.css";

import heroImg from "../../assets/3bc6ea5d-b7ae-47dd-8210-f5fce83e5570.png";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Modal from "../../component/Modal/Modal";
import InputForm from "../../component/InputForm/InputForm";

import api from "../../api/api";
import { toast } from "react-hot-toast";

import {
  FaArrowRight,
  FaMotorcycle,
  FaStore,
  FaHeart,
  FaStar,
  FaFire,
  FaMapMarkerAlt,
  FaUtensils,
  FaTags,
  FaSearch,
  FaClock,
  FaChevronRight,
  FaBolt,
  FaCheckCircle,
} from "react-icons/fa";

const FALLBACK_RESTAURANT_IMAGE =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=85";

const FALLBACK_OFFER_IMAGE =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=85";

function Home() {
  const container = useRef(null);
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);
  const isLoggedIn = !!user;

  const [modalOpen, setModalOpen] = useState(false);

  // =========================================================
  // SEARCH
  // =========================================================

  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  // =========================================================
  // RESTAURANTS
  // =========================================================

  const [restaurants, setRestaurants] = useState([]);
  const [restaurantsLoading, setRestaurantsLoading] =
    useState(true);

  // =========================================================
  // OFFERS
  // =========================================================

  const [offers, setOffers] = useState([]);
  const [offersLoading, setOffersLoading] =
    useState(true);

  // =========================================================
  // IMAGE URL
  // =========================================================

  const getImageUrl = (image) => {
    if (!image) return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    const baseURL = api.defaults?.baseURL || "";

    try {
      const url = new URL(baseURL);

      if (image.startsWith("/")) {
        return `${url.origin}${image}`;
      }

      return `${url.origin}/${image}`;
    } catch {
      return image;
    }
  };

  // =========================================================
  // NAVIGATION
  // =========================================================

  const openRestaurantMenu = (restaurantId) => {
    if (!restaurantId) {
      toast.error("Restaurant not found");
      return;
    }

    navigate(`/menu/${restaurantId}`);
  };

  const handleExplore = () => {
    if (!isLoggedIn) {
      setModalOpen(true);
      return;
    }

    navigate("/restaurants");
  };

  // =========================================================
  // FETCH RESTAURANTS
  // =========================================================

  const fetchRestaurants = async () => {
    try {
      setRestaurantsLoading(true);

      const response = await api.get(
        "/api/v1/restaurants"
      );

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.restaurants || [];

      setRestaurants(data);
      console.log("RESTAURANTS IMAGES:", restaurants.map((restaurant) => restaurant.image));
    } catch (error) {
      console.error(
        "HOME RESTAURANTS ERROR:",
        error
      );
      

      setRestaurants([]);

      toast.error(
        error.response?.data?.message ||
          "Failed to load restaurants"
      );
    } finally {
      setRestaurantsLoading(false);
    }
  };

  // =========================================================
  // FETCH OFFERS
  // =========================================================

  const fetchOffers = async () => {
    try {
      setOffersLoading(true);

      const response = await api.get(
        "/api/v1/offers"
      );

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.offers || [];

      setOffers(data);
      console.log("OFFERS IMAGES:", data.map((offer) => offer.image));
    } catch (error) {
      console.error(
        "HOME OFFERS ERROR:",
        error
      );

      setOffers([]);
    } finally {
      setOffersLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchRestaurants();
    fetchOffers();
  }, []);

  // =========================================================
  // NORMALIZE SEARCH
  // =========================================================

  const normalizeSearch = (text = "") => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
  };

  // =========================================================
  // SEARCH RESULTS
  // SEARCH BY RESTAURANT NAME ONLY
  // =========================================================

  const filteredRestaurants = useMemo(() => {
    const value = normalizeSearch(search);

    // Don't show results for empty search
    if (!value) {
      return [];
    }

    if(!value) {
      return [];
    }

    return restaurants
      .filter((restaurant) => {
        const restaurantName = normalizeSearch(
          restaurant.name
        );

        return restaurantName.includes(value);
      })
      .slice(0, 5);
  }, [search, restaurants]);

  // =========================================================
  // SEARCH SUBMIT
  // SEARCH BY NAME ONLY
  // =========================================================

  const handleSearch = async (e) => {
    e.preventDefault();

    const value = normalizeSearch(search);

    // Empty search
    if (!value) {
      toast.error("Search for a restaurant first");
      return;
    }

    // One character is not enough
    if (!value) {
    toast.error("Search for a restaurant first");
    return;
  }

    try {
      setSearchLoading(true);

      const restaurant = restaurants.find(
        (item) => {
          const restaurantName =
            normalizeSearch(item.name);

          return restaurantName.includes(value);
        }
      );

      if (!restaurant) {
        toast.error("No restaurant found");
        return;
      }

      setSearch("");

      openRestaurantMenu(restaurant._id);
    } finally {
      setSearchLoading(false);
    }
  };

  // =========================================================
  // POPULAR RESTAURANTS
  // =========================================================

  const popularRestaurants = useMemo(() => {
    return restaurants.slice(0, 4);
  }, [restaurants]);

  // =========================================================
  // ACTIVE OFFERS
  // =========================================================

  const activeOffers = useMemo(() => {
    const now = new Date();

    return offers.filter((offer) => {
      if (offer.isActive === false) {
        return false;
      }

      if (
        offer.startDate &&
        new Date(offer.startDate) > now
      ) {
        return false;
      }

      if (
        offer.endDate &&
        new Date(offer.endDate) < now
      ) {
        return false;
      }

      return true;
    });
  }, [offers]);

  // =========================================================
  // GSAP
  // =========================================================

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      tl.from(".hero-badge", {
        y: 20,
        opacity: 0,
        duration: 0.5,
      })
        .from(
          ".hero-title",
          {
            y: 35,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.25"
        )
        .from(
          ".hero-description",
          {
            y: 20,
            opacity: 0,
            duration: 0.5,
          },
          "-=0.35"
        )
        .from(
          ".hero-search-wrapper",
          {
            y: 20,
            opacity: 0,
            duration: 0.5,
          },
          "-=0.25"
        )
        .from(
          ".hero-actions",
          {
            y: 20,
            opacity: 0,
            duration: 0.5,
          },
          "-=0.25"
        )
        .from(
          ".hero-stats",
          {
            y: 15,
            opacity: 0,
            duration: 0.45,
          },
          "-=0.25"
        )
        .from(
          ".hero-food-visual",
          {
            x: 70,
            opacity: 0,
            scale: 0.88,
            duration: 0.9,
            ease: "back.out(1.4)",
          },
          "-=0.8"
        );
    },
    {
      scope: container,
    }
  );

  return (
    <div
      ref={container}
      className="famy-home"
    >
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="famy-hero">
        <div className="hero-grid"></div>

        <div className="hero-orb hero-orb-one"></div>
        <div className="hero-orb hero-orb-two"></div>

        <div className="hero-content">
          {/* BADGE */}

          <div className="hero-badge">
            <span className="hero-badge-icon">
              <FaFire />
            </span>

            <span>
              ALL YOUR FAVORITE RESTAURANTS
            </span>
          </div>

          {/* TITLE */}

          <h1 className="hero-title">
            Good Food.
            <br />

            <span>Good Mood.</span>
          </h1>

          {/* DESCRIPTION */}

          <p className="hero-description">
            Discover the best restaurants around you,
            explore delicious food and enjoy exclusive
            offers — all in one place with FAMY.
          </p>

          {/* =================================================
              SEARCH
          ================================================= */}

          <div className="hero-search-wrapper">
            <form
              className="hero-search"
              onSubmit={handleSearch}
            >
              <div className="search-leading">
                <FaSearch />
              </div>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search restaurants..."
                autoComplete="off"
              />

              {/* CLEAR */}

              {search && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}

              {/* SEARCH BUTTON */}

              <button
                type="submit"
                className="search-button"
                disabled={searchLoading}
              >
                {searchLoading ? (
                  <span className="search-spinner"></span>
                ) : (
                  <FaArrowRight />
                )}
              </button>
            </form>

            {/* =================================================
                LIVE SEARCH RESULTS
            ================================================= */}

            {search &&
              search.trim().length >= 1 &&
              filteredRestaurants.length > 0 && (
                <div className="search-results">
                  {filteredRestaurants.map(
                    (restaurant) => {
                      const image = getImageUrl(
                        restaurant.image
                      );

                      return (
                        <div
                          className="search-result"
                          key={restaurant._id}
                          onClick={() => {
                            setSearch("");

                            openRestaurantMenu(
                              restaurant._id
                            );
                          }}
                        >
                          {/* IMAGE */}

                          <div className="search-result-img">
                            <img
                              src={
                                image ||
                                FALLBACK_RESTAURANT_IMAGE
                              }
                              alt={
                                restaurant.name ||
                                "Restaurant"
                              }
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.src =
                                  FALLBACK_RESTAURANT_IMAGE;
                              }}
                            />
                          </div>

                          {/* INFO */}

                          <div className="search-result-text">
                            <strong>
                              {restaurant.name}
                            </strong>

                            {/* العنوان هنا للعرض فقط
                                وليس داخل البحث */}

                            <span>
                              <FaMapMarkerAlt />

                              {restaurant.address ||
                                "Available on FAMY"}
                            </span>
                          </div>

                          <FaChevronRight />
                        </div>
                      );
                    }
                  )}
                </div>
              )}

            {/* =================================================
                NO RESULTS
            ================================================= */}

            {search &&
              search.trim().length >= 2 &&
              !restaurantsLoading &&
              filteredRestaurants.length === 0 && (
                <div className="search-empty">
                  <FaSearch />

                  <span>
                    No restaurants found
                  </span>
                </div>
              )}
          </div>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="hero-actions">
            <button
              className="hero-primary-btn"
              onClick={handleExplore}
            >
              <FaUtensils />

              <span>
                Explore Restaurants
              </span>

              <FaArrowRight />
            </button>

            <button
              className="hero-secondary-btn"
              onClick={() =>
                navigate("/offers")
              }
            >
              <FaTags />

              <span>
                View Offers
              </span>
            </button>
          </div>

          {/* =================================================
              STATS
          ================================================= */}

          <div className="hero-stats">
            <div className="hero-stat">
              <strong>
                {restaurants.length > 0
                  ? `${restaurants.length}+`
                  : "500+"}
              </strong>

              <span>
                Restaurants
              </span>
            </div>

            <div className="hero-stat">
              <strong>10K+</strong>

              <span>
                Happy Customers
              </span>
            </div>

            <div className="hero-stat">
              <strong>6.9</strong>

              <span>
                Average Rating
              </span>
            </div>
          </div>
        </div>

        {/* =====================================================
            HERO FOOD
        ===================================================== */}

        <div className="hero-food-visual">
          <div className="food-glow"></div>

          <div className="food-circle"></div>
          <div className="food-ring food-ring-1"></div>
          <div className="food-ring food-ring-2"></div>

          <div className="food-small-dot dot-1"></div>
          <div className="food-small-dot dot-2"></div>
          <div className="food-small-dot dot-3"></div>

          <img
            src={heroImg}
            alt="FAMY Food"
          />

          {/* RATING */}

          <div className="floating-card floating-rating">
            <div className="floating-icon">
              <FaStar />
            </div>

            <div>
              <strong>6.9</strong>

              <span>
                Top Rated
              </span>
            </div>
          </div>

          {/* DELIVERY */}

          <div className="floating-card floating-delivery">
            <div className="floating-icon">
              <FaMotorcycle />
            </div>

            <div>
              <strong>Fast</strong>

              <span>
                Delivery
              </span>
            </div>
          </div>

          {/* BADGE */}

          <div className="food-floating-badge">
            <FaCheckCircle />

            <span>
              Fresh & Delicious
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section className="features-wrapper">
        <div className="features-section">
          <div className="feature-card">
            <div className="feature-icon">
              <FaStore />
            </div>

            <div className="feature-info">
              <h3>
                Multiple Restaurants
              </h3>

              <p>
                Everything in one place
              </p>
            </div>

            <FaChevronRight className="feature-arrow" />
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaMotorcycle />
            </div>

            <div className="feature-info">
              <h3>
                Fast Delivery
              </h3>

              <p>
                Your food, right on time
              </p>
            </div>

            <FaChevronRight className="feature-arrow" />
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaFire />
            </div>

            <div className="feature-info">
              <h3>
                Exclusive Offers
              </h3>

              <p>
                Save more every day
              </p>
            </div>

            <FaChevronRight className="feature-arrow" />
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaHeart />
            </div>

            <div className="feature-info">
              <h3>
                Your Favorites
              </h3>

              <p>
                Keep what you love
              </p>
            </div>

            <FaChevronRight className="feature-arrow" />
          </div>
        </div>
      </section>

      {/* =====================================================
          RESTAURANTS
      ===================================================== */}

      <section className="home-section">
        <div className="section-heading">
          <div>
            <span>
              DISCOVER
            </span>

            <h2>
              Popular Restaurants
            </h2>

            <p>
              Find your next favorite place to eat.
            </p>
          </div>

          <button
            className="section-link"
            onClick={handleExplore}
          >
            View All

            <FaArrowRight />
          </button>
        </div>

        {/* LOADING */}

        {restaurantsLoading && (
          <div className="restaurants-grid">
            {[1, 2, 3, 4].map((item) => (
              <div
                className="restaurant-skeleton"
                key={item}
              >
                <div className="skeleton-image"></div>

                <div className="skeleton-content">
                  <span className="sk-title"></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY */}

        {!restaurantsLoading &&
          restaurants.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">
                <FaStore />
              </div>

              <h3>
                No restaurants yet
              </h3>

              <p>
                Restaurants will appear here once
                they are added to FAMY.
              </p>

              <button
                className="hero-primary-btn"
                onClick={fetchRestaurants}
              >
                Refresh

                <FaArrowRight />
              </button>
            </div>
          )}

        {/* RESTAURANT CARDS */}

        {!restaurantsLoading &&
          popularRestaurants.length > 0 && (
            <div className="restaurants-grid">
              {popularRestaurants.map(
                (restaurant) => {
                  const image =
                    getImageUrl(
                      restaurant.image
                    );

                  return (
                    <article
                      className="restaurant-card"
                      key={restaurant._id}
                      onClick={() =>
                        openRestaurantMenu(
                          restaurant._id
                        )
                      }
                    >
                      <div className="restaurant-image">
                        <img
                          src={
                            image ||
                            FALLBACK_RESTAURANT_IMAGE
                          }
                          alt={
                            restaurant.name ||
                            "Restaurant"
                          }
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src =
                              FALLBACK_RESTAURANT_IMAGE;
                          }}
                        />

                        <div className="restaurant-overlay"></div>

                        <span className="restaurant-open">
                          <span></span>
                          Open
                        </span>

                        <span className="restaurant-card-arrow">
                          <FaArrowRight />
                        </span>
                      </div>

                      <div className="restaurant-content">
                        <div className="restaurant-top">
                          <h3>
                            {restaurant.name}
                          </h3>

                          <div className="rating">
                            <FaStar />
                            <span>4.9</span>
                          </div>
                        </div>

                        <p>
                          {restaurant.description ||
                            "Delicious food & great taste"}
                        </p>

                        <div className="restaurant-footer">
                          <span>
                            <FaMapMarkerAlt />

                            {restaurant.address ||
                              "Available on FAMY"}
                          </span>

                          <span>
                            <FaClock />
                            Fast
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )}

        {/* EXPLORE ALL */}

        {!restaurantsLoading &&
          restaurants.length > 4 && (
            <div className="section-bottom-action">
              <button
                className="hero-secondary-btn"
                onClick={handleExplore}
              >
                <FaStore />

                Explore All Restaurants

                <FaArrowRight />
              </button>
            </div>
          )}
      </section>

      {/* =====================================================
          OFFERS
      ===================================================== */}

      <section className="home-section offers-section">
        <div className="section-heading">
          <div>
            <span>
              FAMY DEALS
            </span>

            <h2>
              Special Offers
            </h2>

            <p>
              Save more with exclusive restaurant deals.
            </p>
          </div>

          {activeOffers.length > 3 && (
            <button
              className="section-link"
              onClick={() =>
                navigate("/offers")
              }
            >
              View All

              <FaArrowRight />
            </button>
          )}
        </div>

        {/* LOADING */}

        {offersLoading && (
          <div className="offers-grid">
            {[1, 2, 3].map((item) => (
              <div
                className="offer-skeleton"
                key={item}
              >
                <div className="offer-skeleton-image"></div>

                <div className="skeleton-content">
                  <span className="sk-title"></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY */}

        {!offersLoading &&
          activeOffers.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">
                <FaTags />
              </div>

              <h3>
                No special offers right now
              </h3>

              <p>
                New offers will appear here as soon
                as restaurants publish them.
              </p>
            </div>
          )}

        {/* OFFERS */}

        {!offersLoading &&
          activeOffers.length > 0 && (
            <div className="offers-grid">
              {activeOffers
                .slice(0, 3)
                .map((offer) => {
                  const restaurant =
                    offer.restaurantId;

                  const offerImage =
                    getImageUrl(
                      offer.image
                    );

                  const restaurantImage =
                    getImageUrl(
                      restaurant?.image
                    );

                  return (
                    <article
                      className="offer-card"
                      key={offer._id}
                      onClick={() =>
                        navigate(
                          `/offers/${offer._id}`
                        )
                      }
                    >
                      <div className="offer-image">
                        <img
                          src={
                            offerImage ||
                            restaurantImage ||
                            FALLBACK_OFFER_IMAGE
                          }
                          alt={
                            offer.title ||
                            "Special Offer"
                          }
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src =
                              FALLBACK_OFFER_IMAGE;
                          }}
                        />

                        <div className="offer-overlay"></div>

                        {offer.discount && (
                          <span className="discount-badge">
                            <FaFire />

                            {offer.discount}% OFF
                          </span>
                        )}

                        <span className="offer-view">
                          View Deal
                          <FaArrowRight />
                        </span>
                      </div>

                      <div className="offer-content">
                        <div className="offer-restaurant">
                          <div className="offer-restaurant-img">
                            <img
                              src={
                                restaurantImage ||
                                FALLBACK_RESTAURANT_IMAGE
                              }
                              alt={
                                restaurant?.name ||
                                "Restaurant"
                              }
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.src =
                                  FALLBACK_RESTAURANT_IMAGE;
                              }}
                            />
                          </div>

                          <span>
                            {restaurant?.name ||
                              "FAMY Restaurant"}
                          </span>
                        </div>

                        <h3>
                          {offer.title ||
                            "Special Offer"}
                        </h3>

                        <p>
                          {offer.description ||
                            "Special offer available now"}
                        </p>

                        <div className="offer-footer">
                          <span>
                            <FaBolt />
                            Limited Deal
                          </span>

                          <FaArrowRight />
                        </div>
                      </div>
                    </article>
                  );
                })}
            </div>
          )}
      </section>

      {/* =====================================================
          PROMO
      ===================================================== */}

      <section className="promo-section">
        <div className="promo-background"></div>

        <div className="promo-content">
          <span className="promo-label">
            FAMY OFFERS
          </span>

          <h2>
            Delicious Food.
            <br />

            <strong>
              Better Prices.
            </strong>
          </h2>

          <p>
            Discover exclusive deals and enjoy
            amazing food without paying more.
          </p>

          <button
            onClick={() =>
              navigate("/offers")
            }
          >
            Explore Offers

            <FaArrowRight />
          </button>
        </div>

        <div className="promo-image">
          <img
            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=90"
            alt="FAMY Pizza"
            loading="lazy"
          />

          <div className="promo-image-badge">
            <FaFire />

            <span>
              Hot Deals
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          MODAL
      ===================================================== */}

      {modalOpen && (
        <Modal
          closeModal={() =>
            setModalOpen(false)
          }
        >
          <InputForm
            closeModal={() =>
              setModalOpen(false)
            }
          />
        </Modal>
      )}
    </div>
  );
}

export default Home;



// import React, {
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";

// import "../../App.css";
// import "./Home.css";

// import heroImg from "../../assets/3bc6ea5d-b7ae-47dd-8210-f5fce83e5570.png";

// import gsap from "gsap";
// import { useGSAP } from "@gsap/react";

// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// import Modal from "../../component/Modal/Modal";
// import InputForm from "../../component/InputForm/InputForm";

// import api from "../../api/api";
// import { toast } from "react-hot-toast";

// import {
//   FaArrowRight,
//   FaMotorcycle,
//   FaStore,
//   FaHeart,
//   FaStar,
//   FaFire,
//   FaMapMarkerAlt,
//   FaUtensils,
//   FaTags,
//   FaSearch,
//   FaClock,
//   FaChevronRight,
//   FaBolt,
//   FaCheckCircle,
//   FaThLarge,
//   FaPizzaSlice,
//   FaHamburger,
//   FaCoffee,
// } from "react-icons/fa";

// /* =========================================================
//    FALLBACK IMAGES
// ========================================================= */

// const FALLBACK_RESTAURANT_IMAGE =
//   "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85";

// const FALLBACK_OFFER_IMAGE =
//   "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=85";

// const PROMO_IMAGE =
//   "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=90";

// /* =========================================================
//    HOME
// ========================================================= */

// function Home() {
//   const container = useRef(null);
//   const navigate = useNavigate();

//   const user = useSelector((state) => state.user.user);
//   const isLoggedIn = !!user;

//   const [modalOpen, setModalOpen] = useState(false);

//   /* =======================================================
//      SEARCH
//   ======================================================= */

//   const [search, setSearch] = useState("");
//   const [searchLoading, setSearchLoading] = useState(false);

//   /* =======================================================
//      RESTAURANTS
//   ======================================================= */

//   const [restaurants, setRestaurants] = useState([]);
//   const [restaurantsLoading, setRestaurantsLoading] =
//     useState(true);

//   /* =======================================================
//      OFFERS
//   ======================================================= */

//   const [offers, setOffers] = useState([]);
//   const [offersLoading, setOffersLoading] =
//     useState(true);

//   /* =======================================================
//      IMAGE URL
//   ======================================================= */

//   const getImageUrl = (image) => {
//     if (!image) return "";

//     if (
//       image.startsWith("http://") ||
//       image.startsWith("https://")
//     ) {
//       return image;
//     }

//     const baseURL = api.defaults?.baseURL || "";

//     try {
//       const url = new URL(baseURL);

//       if (image.startsWith("/")) {
//         return `${url.origin}${image}`;
//       }

//       return `${url.origin}/${image}`;
//     } catch {
//       return image;
//     }
//   };

//   /* =======================================================
//      NORMALIZE SEARCH
//   ======================================================= */

//   const normalizeSearch = (text = "") => {
//     return text
//       .toString()
//       .toLowerCase()
//       .trim()
//       .replace(/\s+/g, " ");
//   };

//   /* =======================================================
//      NAVIGATION
//   ======================================================= */

//   const openRestaurantMenu = (restaurantId) => {
//     if (!restaurantId) {
//       toast.error("Restaurant not found");
//       return;
//     }

//     navigate(`/menu/${restaurantId}`);
//   };

//   const handleExplore = () => {
//     if (!isLoggedIn) {
//       setModalOpen(true);
//       return;
//     }

//     navigate("/restaurants");
//   };

//   /* =======================================================
//      FETCH RESTAURANTS
//   ======================================================= */

//   const fetchRestaurants = async () => {
//     try {
//       setRestaurantsLoading(true);

//       const response = await api.get(
//         "/api/v1/restaurants"
//       );

//       const data = Array.isArray(response.data)
//         ? response.data
//         : response.data?.restaurants || [];

//       setRestaurants(data);
//     } catch (error) {
//       console.error(
//         "HOME RESTAURANTS ERROR:",
//         error
//       );

//       setRestaurants([]);

//       toast.error(
//         error.response?.data?.message ||
//           "Failed to load restaurants"
//       );
//     } finally {
//       setRestaurantsLoading(false);
//     }
//   };

//   /* =======================================================
//      FETCH OFFERS
//   ======================================================= */

//   const fetchOffers = async () => {
//     try {
//       setOffersLoading(true);

//       const response = await api.get(
//         "/api/v1/offers"
//       );

//       const data = Array.isArray(response.data)
//         ? response.data
//         : response.data?.offers || [];

//       setOffers(data);
//     } catch (error) {
//       console.error(
//         "HOME OFFERS ERROR:",
//         error
//       );

//       setOffers([]);
//     } finally {
//       setOffersLoading(false);
//     }
//   };

//   /* =======================================================
//      INITIAL LOAD
//   ======================================================= */

//   useEffect(() => {
//     fetchRestaurants();
//     fetchOffers();
//   }, []);

//   /* =======================================================
//      SEARCH RESULTS
//      NAME ONLY
// ========================================================= */

//   const filteredRestaurants = useMemo(() => {
//     const value = normalizeSearch(search);

//     if (!value) {
//       return [];
//     }

//     return restaurants
//       .filter((restaurant) => {
//         const restaurantName =
//           normalizeSearch(restaurant.name);

//         return restaurantName.includes(value);
//       })
//       .slice(0, 6);
//   }, [search, restaurants]);

//   /* =======================================================
//      SEARCH SUBMIT
//   ======================================================= */

//   const handleSearch = async (e) => {
//     e.preventDefault();

//     const value = normalizeSearch(search);

//     if (!value) {
//       toast.error("Search for a restaurant first");
//       return;
//     }

//     try {
//       setSearchLoading(true);

//       const restaurant = restaurants.find(
//         (item) => {
//           const restaurantName =
//             normalizeSearch(item.name);

//           return restaurantName.includes(value);
//         }
//       );

//       if (!restaurant) {
//         toast.error("No restaurant found");
//         return;
//       }

//       setSearch("");

//       openRestaurantMenu(restaurant._id);
//     } finally {
//       setSearchLoading(false);
//     }
//   };

//   /* =======================================================
//      POPULAR RESTAURANTS
//   ======================================================= */

//   const popularRestaurants = useMemo(() => {
//     return restaurants.slice(0, 4);
//   }, [restaurants]);

//   /* =======================================================
//      ACTIVE OFFERS
//   ======================================================= */

//   const activeOffers = useMemo(() => {
//     const now = new Date();

//     return offers.filter((offer) => {
//       if (offer.isActive === false) {
//         return false;
//       }

//       if (
//         offer.startDate &&
//         new Date(offer.startDate) > now
//       ) {
//         return false;
//       }

//       if (
//         offer.endDate &&
//         new Date(offer.endDate) < now
//       ) {
//         return false;
//       }

//       return true;
//     });
//   }, [offers]);

//   /* =======================================================
//      GSAP
//   ======================================================= */

//   useGSAP(
//     () => {
//       const tl = gsap.timeline({
//         defaults: {
//           ease: "power3.out",
//         },
//       });

//       tl.from(".hero-top-badge", {
//         y: 20,
//         opacity: 0,
//         duration: 0.45,
//       })
//         .from(
//           ".hero-title",
//           {
//             y: 35,
//             opacity: 0,
//             duration: 0.7,
//           },
//           "-=0.2"
//         )
//         .from(
//           ".hero-description",
//           {
//             y: 20,
//             opacity: 0,
//             duration: 0.5,
//           },
//           "-=0.35"
//         )
//         .from(
//           ".hero-search-wrapper",
//           {
//             y: 20,
//             opacity: 0,
//             duration: 0.5,
//           },
//           "-=0.3"
//         )
//         .from(
//           ".hero-actions",
//           {
//             y: 20,
//             opacity: 0,
//             duration: 0.45,
//           },
//           "-=0.25"
//         )
//         .from(
//           ".hero-food-visual",
//           {
//             x: 90,
//             opacity: 0,
//             scale: 0.9,
//             duration: 0.9,
//             ease: "back.out(1.5)",
//           },
//           "-=0.75"
//         )
//         .from(
//           ".hero-benefits",
//           {
//             y: 30,
//             opacity: 0,
//             duration: 0.6,
//           },
//           "-=0.3"
//         );
//     },
//     {
//       scope: container,
//     }
//   );

//   /* =======================================================
//      RENDER
//   ======================================================= */

//   return (
//     <div
//       ref={container}
//       className="famy-home"
//     >
//       {/* ===================================================
//           HERO
//       =================================================== */}

//       <section className="famy-hero">
//         <div className="hero-background-grid"></div>

//         <div className="hero-glow hero-glow-one"></div>
//         <div className="hero-glow hero-glow-two"></div>

//         {/* ================================================
//             HERO CONTENT
//         ================================================ */}

//         <div className="hero-content">
//           <div className="hero-top-badge">
//             <span>
//               <FaFire />
//             </span>

//             <p>
//               ALL RESTAURANTS IN ONE PLACE
//             </p>
//           </div>

//           <h1 className="hero-title">
//             All Restaurants
//             <br />

//             In{" "}
//             <span>One Place</span>

//             <b>✦</b>
//           </h1>

//           <p className="hero-description">
//             Discover the best restaurants near you,
//             explore your favorite food and enjoy
//             exclusive offers — all in one place with
//             FAMY.
//           </p>

//           {/* ==============================================
//               SEARCH
//           ============================================== */}

//           <div className="hero-search-wrapper">
//             <form
//               className="hero-search"
//               onSubmit={handleSearch}
//             >
//               <div className="search-location">
//                 <FaMapMarkerAlt />

//                 <span>
//                   Egypt
//                 </span>
//               </div>

//               <div className="search-divider"></div>

//               <div className="search-leading">
//                 <FaSearch />
//               </div>

//               <input
//                 type="text"
//                 value={search}
//                 onChange={(e) =>
//                   setSearch(e.target.value)
//                 }
//                 placeholder="Search for restaurants..."
//                 autoComplete="off"
//               />

//               {search && (
//                 <button
//                   type="button"
//                   className="search-clear"
//                   onClick={() => setSearch("")}
//                   aria-label="Clear search"
//                 >
//                   ×
//                 </button>
//               )}

//               <button
//                 type="submit"
//                 className="search-button"
//                 disabled={searchLoading}
//               >
//                 {searchLoading ? (
//                   <span className="search-spinner"></span>
//                 ) : (
//                   <FaSearch />
//                 )}
//               </button>
//             </form>

//             {/* ============================================
//                 SEARCH RESULTS
//             ============================================ */}

//             {search &&
//               filteredRestaurants.length > 0 && (
//                 <div className="search-results">
//                   {filteredRestaurants.map(
//                     (restaurant) => {
//                       const image =
//                         getImageUrl(
//                           restaurant.image
//                         );

//                       return (
//                         <div
//                           className="search-result"
//                           key={restaurant._id}
//                           onClick={() => {
//                             setSearch("");

//                             openRestaurantMenu(
//                               restaurant._id
//                             );
//                           }}
//                         >
//                           <div className="search-result-img">
//                             <img
//                               src={
//                                 image ||
//                                 FALLBACK_RESTAURANT_IMAGE
//                               }
//                               alt={
//                                 restaurant.name ||
//                                 "Restaurant"
//                               }
//                               onError={(e) => {
//                                 e.currentTarget.src =
//                                   FALLBACK_RESTAURANT_IMAGE;
//                               }}
//                             />
//                           </div>

//                           <div className="search-result-text">
//                             <strong>
//                               {restaurant.name}
//                             </strong>

//                             <span>
//                               <FaMapMarkerAlt />

//                               {restaurant.address ||
//                                 "Available on FAMY"}
//                             </span>
//                           </div>

//                           <FaChevronRight />
//                         </div>
//                       );
//                     }
//                   )}
//                 </div>
//               )}

//             {search &&
//               !restaurantsLoading &&
//               filteredRestaurants.length === 0 && (
//                 <div className="search-empty">
//                   <FaSearch />

//                   <span>
//                     No restaurants found
//                   </span>
//                 </div>
//               )}
//           </div>

//           {/* ==============================================
//               ACTIONS
//           ============================================== */}

//           <div className="hero-actions">
//             <button
//               className="hero-primary-btn"
//               onClick={handleExplore}
//             >
//               <FaUtensils />

//               <span>
//                 Explore Restaurants
//               </span>

//               <FaArrowRight />
//             </button>

//             <button
//               className="hero-secondary-btn"
//               onClick={() =>
//                 navigate("/offers")
//               }
//             >
//               <FaTags />

//               <span>
//                 View Offers
//               </span>
//             </button>
//           </div>
//         </div>

//         {/* ================================================
//             FOOD VISUAL
//         ================================================ */}

//         <div className="hero-food-visual">
//           <div className="food-glow"></div>

//           <div className="food-circle"></div>

//           <div className="food-ring food-ring-one"></div>
//           <div className="food-ring food-ring-two"></div>

//           <div className="food-dot food-dot-one"></div>
//           <div className="food-dot food-dot-two"></div>
//           <div className="food-dot food-dot-three"></div>

//           <div className="hero-food-backdrop"></div>

//           <img
//             src={heroImg}
//             alt="FAMY Food"
//           />

//           <div className="food-floating-rating">
//             <div className="floating-rating-icon">
//               <FaStar />
//             </div>

//             <div>
//               <strong>
//                 4.9
//               </strong>

//               <span>
//                 Top Rated
//               </span>
//             </div>
//           </div>

//           <div className="food-floating-delivery">
//             <div className="floating-delivery-icon">
//               <FaMotorcycle />
//             </div>

//             <div>
//               <strong>
//                 Fast
//               </strong>

//               <span>
//                 Delivery
//               </span>
//             </div>
//           </div>

//           <div className="food-floating-badge">
//             <FaCheckCircle />

//             <span>
//               Fresh & Delicious
//             </span>
//           </div>
//         </div>

//         {/* ================================================
//             BENEFITS
//         ================================================ */}

//         <div className="hero-benefits">
//           <div className="benefit-item">
//             <div className="benefit-icon">
//               <FaStore />
//             </div>

//             <div>
//               <strong>
//                 Multiple Restaurants
//               </strong>

//               <span>
//                 All in one place
//               </span>
//             </div>
//           </div>

//           <div className="benefit-item">
//             <div className="benefit-icon">
//               <FaMotorcycle />
//             </div>

//             <div>
//               <strong>
//                 Fast Delivery
//               </strong>

//               <span>
//                 Get it quickly
//               </span>
//             </div>
//           </div>

//           <div className="benefit-item">
//             <div className="benefit-icon">
//               <FaTags />
//             </div>

//             <div>
//               <strong>
//                 Best Offers
//               </strong>

//               <span>
//                 Save more
//               </span>
//             </div>
//           </div>

//           <div className="benefit-item">
//             <div className="benefit-icon">
//               <FaHeart />
//             </div>

//             <div>
//               <strong>
//                 Your Favorites
//               </strong>

//               <span>
//                 Keep what you love
//               </span>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ===================================================
//           QUICK CATEGORIES
//       =================================================== */}

//       <section className="quick-categories">
//         <div className="category-pill active">
//           <FaThLarge />
//           <span>
//             All
//           </span>
//         </div>

//         <div className="category-pill">
//           <FaHamburger />
//           <span>
//             Burger
//           </span>
//         </div>

//         <div className="category-pill">
//           <FaPizzaSlice />
//           <span>
//             Pizza
//           </span>
//         </div>

//         <div className="category-pill">
//           <FaUtensils />
//           <span>
//             Meals
//           </span>
//         </div>

//         <div className="category-pill">
//           <FaCoffee />
//           <span>
//             Coffee
//           </span>
//         </div>

//         <div className="category-pill">
//           <FaFire />
//           <span>
//             Popular
//           </span>
//         </div>
//       </section>

//       {/* ===================================================
//           RESTAURANTS
//       =================================================== */}

//       <section className="home-section">
//         <div className="section-heading">
//           <div>
//             <span className="section-kicker">
//               DISCOVER
//             </span>

//             <h2>
//               Popular Restaurants
//             </h2>

//             <p>
//               Find your next favorite place to eat.
//             </p>
//           </div>

//           <button
//             className="section-link"
//             onClick={handleExplore}
//           >
//             View All

//             <FaArrowRight />
//           </button>
//         </div>

//         {/* LOADING */}

//         {restaurantsLoading && (
//           <div className="restaurants-grid">
//             {[1, 2, 3, 4].map((item) => (
//               <div
//                 className="restaurant-skeleton"
//                 key={item}
//               >
//                 <div className="skeleton-image"></div>

//                 <div className="skeleton-content">
//                   <span className="sk-title"></span>
//                   <span></span>
//                   <span></span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* EMPTY */}

//         {!restaurantsLoading &&
//           restaurants.length === 0 && (
//             <div className="empty-state">
//               <div className="empty-state-icon">
//                 <FaStore />
//               </div>

//               <h3>
//                 No restaurants yet
//               </h3>

//               <p>
//                 Restaurants will appear here once
//                 they are added to FAMY.
//               </p>

//               <button
//                 className="hero-primary-btn"
//                 onClick={fetchRestaurants}
//               >
//                 Refresh

//                 <FaArrowRight />
//               </button>
//             </div>
//           )}

//         {/* CARDS */}

//         {!restaurantsLoading &&
//           popularRestaurants.length > 0 && (
//             <div className="restaurants-grid">
//               {popularRestaurants.map(
//                 (restaurant) => {
//                   const image =
//                     getImageUrl(
//                       restaurant.image
//                     );

//                   return (
//                     <article
//                       className="restaurant-card"
//                       key={restaurant._id}
//                       onClick={() =>
//                         openRestaurantMenu(
//                           restaurant._id
//                         )
//                       }
//                     >
//                       <div className="restaurant-image">
//                         <img
//                           src={
//                             image ||
//                             FALLBACK_RESTAURANT_IMAGE
//                           }
//                           alt={
//                             restaurant.name ||
//                             "Restaurant"
//                           }
//                           loading="lazy"
//                           onError={(e) => {
//                             e.currentTarget.src =
//                               FALLBACK_RESTAURANT_IMAGE;
//                           }}
//                         />

//                         <div className="restaurant-overlay"></div>

//                         <span className="restaurant-open">
//                           <span></span>
//                           Open
//                         </span>

//                         <span className="restaurant-card-arrow">
//                           <FaArrowRight />
//                         </span>
//                       </div>

//                       <div className="restaurant-content">
//                         <div className="restaurant-top">
//                           <h3>
//                             {restaurant.name}
//                           </h3>

//                           <div className="rating">
//                             <FaStar />

//                             <span>
//                               4.9
//                             </span>
//                           </div>
//                         </div>

//                         <p>
//                           {restaurant.description ||
//                             "Delicious food & great taste"}
//                         </p>

//                         <div className="restaurant-footer">
//                           <span>
//                             <FaMapMarkerAlt />

//                             {restaurant.address ||
//                               "Available on FAMY"}
//                           </span>

//                           <span>
//                             <FaClock />

//                             Fast
//                           </span>
//                         </div>
//                       </div>
//                     </article>
//                   );
//                 }
//               )}
//             </div>
//           )}

//         {/* EXPLORE ALL */}

//         {!restaurantsLoading &&
//           restaurants.length > 4 && (
//             <div className="section-bottom-action">
//               <button
//                 className="hero-secondary-btn"
//                 onClick={handleExplore}
//               >
//                 <FaStore />

//                 Explore All Restaurants

//                 <FaArrowRight />
//               </button>
//             </div>
//           )}
//       </section>

//       {/* ===================================================
//           OFFERS
//       =================================================== */}

//       <section className="home-section offers-section">
//         <div className="section-heading">
//           <div>
//             <span className="section-kicker">
//               FAMY DEALS
//             </span>

//             <h2>
//               Special Offers
//             </h2>

//             <p>
//               Save more with exclusive restaurant deals.
//             </p>
//           </div>

//           {activeOffers.length > 3 && (
//             <button
//               className="section-link"
//               onClick={() =>
//                 navigate("/offers")
//               }
//             >
//               View All

//               <FaArrowRight />
//             </button>
//           )}
//         </div>

//         {/* LOADING */}

//         {offersLoading && (
//           <div className="offers-grid">
//             {[1, 2, 3].map((item) => (
//               <div
//                 className="offer-skeleton"
//                 key={item}
//               >
//                 <div className="offer-skeleton-image"></div>

//                 <div className="skeleton-content">
//                   <span className="sk-title"></span>
//                   <span></span>
//                   <span></span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* EMPTY */}

//         {!offersLoading &&
//           activeOffers.length === 0 && (
//             <div className="empty-state">
//               <div className="empty-state-icon">
//                 <FaTags />
//               </div>

//               <h3>
//                 No special offers right now
//               </h3>

//               <p>
//                 New offers will appear here as soon
//                 as restaurants publish them.
//               </p>
//             </div>
//           )}

//         {/* OFFERS */}

//         {!offersLoading &&
//           activeOffers.length > 0 && (
//             <div className="offers-grid">
//               {activeOffers
//                 .slice(0, 3)
//                 .map((offer) => {
//                   const restaurant =
//                     offer.restaurantId;

//                   const offerImage =
//                     getImageUrl(
//                       offer.image
//                     );

//                   const restaurantImage =
//                     getImageUrl(
//                       restaurant?.image
//                     );

//                   return (
//                     <article
//                       className="offer-card"
//                       key={offer._id}
//                       onClick={() =>
//                         navigate(
//                           `/offers/${offer._id}`
//                         )
//                       }
//                     >
//                       <div className="offer-image">
//                         <img
//                           src={
//                             offerImage ||
//                             restaurantImage ||
//                             FALLBACK_OFFER_IMAGE
//                           }
//                           alt={
//                             offer.title ||
//                             "Special Offer"
//                           }
//                           loading="lazy"
//                           onError={(e) => {
//                             e.currentTarget.src =
//                               FALLBACK_OFFER_IMAGE;
//                           }}
//                         />

//                         <div className="offer-overlay"></div>

//                         {offer.discount && (
//                           <span className="discount-badge">
//                             <FaFire />

//                             {offer.discount}% OFF
//                           </span>
//                         )}

//                         <span className="offer-view">
//                           View Deal

//                           <FaArrowRight />
//                         </span>
//                       </div>

//                       <div className="offer-content">
//                         <div className="offer-restaurant">
//                           <div className="offer-restaurant-img">
//                             <img
//                               src={
//                                 restaurantImage ||
//                                 FALLBACK_RESTAURANT_IMAGE
//                               }
//                               alt={
//                                 restaurant?.name ||
//                                 "Restaurant"
//                               }
//                               onError={(e) => {
//                                 e.currentTarget.src =
//                                   FALLBACK_RESTAURANT_IMAGE;
//                               }}
//                             />
//                           </div>

//                           <span>
//                             {restaurant?.name ||
//                               "FAMY Restaurant"}
//                           </span>
//                         </div>

//                         <h3>
//                           {offer.title ||
//                             "Special Offer"}
//                         </h3>

//                         <p>
//                           {offer.description ||
//                             "Special offer available now"}
//                         </p>

//                         <div className="offer-footer">
//                           <span>
//                             <FaBolt />

//                             Limited Deal
//                           </span>

//                           <FaArrowRight />
//                         </div>
//                       </div>
//                     </article>
//                   );
//                 })}
//             </div>
//           )}
//       </section>

//       {/* ===================================================
//           PROMO
//       =================================================== */}

//       <section className="promo-section">
//         <div className="promo-glow"></div>

//         <div className="promo-content">
//           <span className="promo-label">
//             FAMY OFFERS
//           </span>

//           <h2>
//             Delicious Food.
//             <br />

//             <strong>
//               Better Prices.
//             </strong>
//           </h2>

//           <p>
//             Discover exclusive deals from your
//             favorite restaurants and enjoy amazing
//             food without paying more.
//           </p>

//           <button
//             onClick={() =>
//               navigate("/offers")
//             }
//           >
//             Explore Offers

//             <FaArrowRight />
//           </button>
//         </div>

//         <div className="promo-image">
//           <img
//             src={PROMO_IMAGE}
//             alt="FAMY Pizza"
//             loading="lazy"
//           />

//           <div className="promo-image-badge">
//             <FaFire />

//             <span>
//               Hot Deals
//             </span>
//           </div>
//         </div>
//       </section>

//       {/* ===================================================
//           MODAL
//       =================================================== */}

//       {modalOpen && (
//         <Modal
//           closeModal={() =>
//             setModalOpen(false)
//           }
//         >
//           <InputForm
//             closeModal={() =>
//               setModalOpen(false)
//             }
//           />
//         </Modal>
//       )}
//     </div>
//   );
// }

// export default Home;