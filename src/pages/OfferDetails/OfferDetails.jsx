import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaArrowRight,
  FaFire,
  FaTags,
  FaStore,
  FaClock,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaShoppingCart,
} from "react-icons/fa";

import api from "../../api/api";
import { toast } from "react-hot-toast";

import { useCart } from "../../component/CartContext/CartContext";

import "./OfferDetails.css";

const OfferDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // IMAGE URL
  // =====================================================

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

  // =====================================================
  // GET OFFER
  // =====================================================

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        setLoading(true);

        const response = await api.get(
          `/api/v1/offers/${id}`
        );

        const data =
          response.data?.offer ||
          response.data;

        setOffer(data);
      } catch (error) {
        console.error(
          "OFFER DETAILS ERROR:",
          error
        );

        setOffer(null);

        toast.error(
          error.response?.data?.message ||
            "Failed to load offer"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOffer();
    }
  }, [id]);

  // =====================================================
  // ORDER NOW
  // =====================================================

  const handleOrderNow = () => {
    if (!offer) return;

    // ===================================================
    // RESTAURANT
    // ===================================================

    const restaurant =
      offer.restaurantId ||
      offer.restaurant ||
      null;

    const restaurantId =
      typeof restaurant === "object"
        ? restaurant?._id
        : restaurant;

    if (!restaurantId) {
      toast.error(
        "Restaurant information is missing"
      );

      return;
    }

    // ===================================================
    // OFFER ID
    // ===================================================

    if (!offer._id) {
      toast.error(
        "Offer ID is missing"
      );

      return;
    }

    // ===================================================
    // ORIGINAL PRICE
    // ===================================================

    const originalPrice =
      Number(
        offer.price ??
          offer.offerPrice ??
          offer.originalPrice ??
          0
      );

    if (
      !Number.isFinite(originalPrice) ||
      originalPrice <= 0
    ) {
      toast.error(
        "This offer has no valid price"
      );

      return;
    }

    // ===================================================
    // DISCOUNT
    // ===================================================

    const discount = Number(
      offer.discount || 0
    );

    // ===================================================
    // FINAL PRICE
    // =====================================================

    const finalPrice =
      originalPrice -
      (originalPrice * discount) / 100;

    if (
      !Number.isFinite(finalPrice) ||
      finalPrice < 0
    ) {
      toast.error(
        "Invalid offer price"
      );

      return;
    }

    // ===================================================
    // CART ITEM
    // IMPORTANT:
    // THIS IS AN OFFER, NOT A PRODUCT
    // ===================================================

    const cartItem = {
      // Used by CartContext
      _id: offer._id,

      key: `offer-${offer._id}`,

      // IMPORTANT
      itemType: "offer",

      // Offer ID for backend
      offerId: offer._id,

      // There is NO Recipe ID
      productId: null,

      title:
        offer.title ||
        "Special Offer",

      price: Number(finalPrice),

      restaurantId,

      selectedVariant: null,

      variant: null,

      quantity: 1,

      discount,

      image:
        offer.image || "",
    };

    // ===================================================
    // ADD TO CART
    // ===================================================

    try {
      addToCart(cartItem);

      toast.success(
        "Offer added to cart 🛒"
      );

      // Go directly to cart
      navigate("/cart");

    } catch (error) {
      console.error(
        "ADD OFFER TO CART ERROR:",
        error
      );

      toast.error(
        "Could not add offer to cart"
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="offer-details-page">

        <div className="offer-details-loading">

          <div className="offer-loading-spinner"></div>

          <h3>
            Loading offer...
          </h3>

          <p>
            Please wait while we get the offer details.
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // NOT FOUND
  // =====================================================

  if (!offer) {
    return (
      <div className="offer-details-page">

        <div className="offer-not-found">

          <div className="offer-not-found-icon">
            <FaTags />
          </div>

          <span>
            FAMY OFFERS
          </span>

          <h1>
            Offer Not Found
          </h1>

          <p>
            This offer may have been removed,
            expired, or is no longer available.
          </p>

          <button
            className="offer-back-main-btn"
            onClick={() =>
              navigate("/offers")
            }
          >
            <FaArrowLeft />

            Back to Offers
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // RESTAURANT
  // =====================================================

  const restaurant =
    offer.restaurantId ||
    offer.restaurant ||
    null;

  const restaurantId =
    typeof restaurant === "object"
      ? restaurant?._id
      : restaurant;

  // =====================================================
  // IMAGES
  // =====================================================

  const offerImage =
    getImageUrl(offer.image);

  const restaurantImage =
    typeof restaurant === "object"
      ? getImageUrl(
          restaurant?.image
        )
      : "";

  const mainImage =
    offerImage ||
    restaurantImage ||
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=90";

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "Available now";
    }

    try {
      return new Date(
        date
      ).toLocaleDateString(
        "en-US",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "Available now";
    }
  };

  // =====================================================
  // DISCOUNT
  // =====================================================

  const discount =
    offer.discount !== undefined &&
    offer.discount !== null
      ? Number(offer.discount)
      : 0;

  // =====================================================
  // ORIGINAL PRICE
  // =====================================================

  const price =
    Number(
      offer.price ??
        offer.offerPrice ??
        offer.originalPrice ??
        0
    );

  // =====================================================
  // FINAL PRICE
  // =====================================================

  const finalPrice =
    price -
    (price * discount) / 100;

  // =====================================================
  // RESTAURANT NAME
  // =====================================================

  const restaurantName =
    typeof restaurant === "object"
      ? restaurant?.name ||
        "Restaurant"
      : "FAMY Restaurant";

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="offer-details-page">

      <div className="offer-details-container">

        {/* =================================================
            BACK
        ================================================= */}

        <button
          className="offer-details-back"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />

          <span>
            Back
          </span>
        </button>

        {/* =================================================
            HERO
        ================================================= */}

        <div className="offer-details-hero">

          {/* =================================================
              IMAGE
          ================================================= */}

          <div className="offer-details-image">

            <img
              src={mainImage}
              alt={
                offer.title ||
                "Special Offer"
              }
              onError={(e) => {
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=90";
              }}
            />

            <div className="offer-details-image-overlay"></div>

            {/* DISCOUNT */}

            {discount > 0 && (
              <div className="offer-details-discount">

                <FaFire />

                <strong>
                  {discount}%
                </strong>

                <span>
                  OFF
                </span>

              </div>
            )}

            {/* ACTIVE */}

            <div className="offer-details-active">

              <span></span>

              Available Now

            </div>

          </div>

          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="offer-details-content">

            {/* LABEL */}

            <span className="offer-details-label">

              <FaTags />

              SPECIAL OFFER

            </span>

            {/* TITLE */}

            <h1>
              {offer.title ||
                "Special Offer"}
            </h1>

            {/* DESCRIPTION */}

            <p className="offer-details-description">

              {offer.description ||
                "Enjoy this exclusive offer from one of the restaurants available on FAMY."}

            </p>

            {/* =================================================
                PRICE
            ================================================= */}

            {price > 0 && (
              <div
                className="offer-details-price"
                style={{
                  marginBottom: "24px",
                }}
              >

                <span>
                  Special Price
                </span>

                <strong>
                  {finalPrice.toFixed(2)} EGP
                </strong>

                {discount > 0 && (
                  <small
                    style={{
                      marginLeft: "10px",
                      textDecoration:
                        "line-through",
                      opacity: 0.6,
                    }}
                  >
                    {price.toFixed(2)} EGP
                  </small>
                )}

              </div>
            )}

            {/* =================================================
                RESTAURANT
            ================================================= */}

            <div
              className="offer-details-restaurant"
              onClick={() => {
                if (restaurantId) {
                  navigate(
                    `/menu/${restaurantId}`
                  );
                }
              }}
            >

              <div className="offer-details-restaurant-image">

                <img
                  src={
                    restaurantImage ||
                    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80"
                  }
                  alt={
                    restaurantName
                  }
                />

              </div>

              <div className="offer-details-restaurant-info">

                <span>
                  OFFER FROM
                </span>

                <strong>
                  {restaurantName}
                </strong>

              </div>

              <FaArrowRight />

            </div>

            {/* =================================================
                META
            ================================================= */}

            <div className="offer-details-meta">

              {/* START */}

              <div className="offer-meta-item">

                <div className="offer-meta-icon">

                  <FaCalendarAlt />

                </div>

                <div>

                  <span>
                    Starts
                  </span>

                  <strong>
                    {formatDate(
                      offer.startDate
                    )}
                  </strong>

                </div>

              </div>

              {/* END */}

              <div className="offer-meta-item">

                <div className="offer-meta-icon">

                  <FaClock />

                </div>

                <div>

                  <span>
                    Ends
                  </span>

                  <strong>
                    {offer.expiresAt
                      ? formatDate(
                          offer.expiresAt
                        )
                      : offer.endDate
                      ? formatDate(
                          offer.endDate
                        )
                      : "Limited time"}
                  </strong>

                </div>

              </div>

            </div>

            {/* =================================================
                ORDER NOW
            ================================================= */}

            <button
              className="offer-details-order-btn"
              onClick={handleOrderNow}
            >

              <FaShoppingCart />

              <span>
                Order Now
              </span>

              <FaArrowRight />

            </button>

          </div>

        </div>

        {/* =================================================
            BOTTOM INFO
        ================================================= */}

        <div className="offer-details-bottom">

          {/* BOX 1 */}

          <div className="offer-info-box">

            <div className="offer-info-box-icon">

              <FaTags />

            </div>

            <div>

              <h3>
                Exclusive Deal
              </h3>

              <p>
                Save more and enjoy your
                favorite food with FAMY.
              </p>

            </div>

          </div>

          {/* BOX 2 */}

          <div className="offer-info-box">

            <div className="offer-info-box-icon">

              <FaStore />

            </div>

            <div>

              <h3>
                One Platform
              </h3>

              <p>
                Discover restaurants and
                offers all in one place.
              </p>

            </div>

          </div>

          {/* BOX 3 */}

          <div className="offer-info-box">

            <div className="offer-info-box-icon">

              <FaMapMarkerAlt />

            </div>

            <div>

              <h3>
                Find Your Food
              </h3>

              <p>
                Open the restaurant menu and
                start your order.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default OfferDetails;