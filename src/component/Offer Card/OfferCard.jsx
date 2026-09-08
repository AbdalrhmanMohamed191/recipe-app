// import { useCart } from "../../component/CartContext/CartContext";
// import "./offers.css";

// const OfferCard = ({ offer }) => {
//   const { addToCart } = useCart();

//   if (!offer) return null;

//   const handleAddToCart = (e) => {
//     e.stopPropagation();

//     if (!offer.isActive) return;

//     addToCart({
//       _id: offer._id,
//       title: offer.title,
//       image: offer.image,

//       originalPrice: offer.price,
//       discount: offer.discount || 0,
//       isActive: offer.isActive,

//       price:
//         offer.discount > 0
//           ? offer.price - (offer.price * offer.discount) / 100
//           : offer.price,
//     });
//   };

//   return (
//     <div className="offer-card-modern">

//       <div className="offer-image">
//         <img
//           src={
//             offer?.image
//               ? `http://localhost:5000${offer.image}`
//               : "https://via.placeholder.com/300"
//           }
//           alt={offer?.title || "offer"}
//         />

//         {offer?.discount > 0 && (
//           <span className="discount-badge">
//             -{offer.discount}%
//           </span>
//         )}

//         <span
//           className={`status-badge ${
//             offer.isActive ? "active" : "disabled"
//           }`}
//         >
//           {offer.isActive ? "Available" : "Sold Out"}
//         </span>
//       </div>

//       <div className="offer-body">
//         <h3 className="offer-title">{offer?.title}</h3>

//         <p className="offer-desc">
//           {offer?.description?.slice(0, 70) || "No description"}...
//         </p>

//         <div className="offer-price">
//           {offer?.discount > 0 ? (
//             <>
//               <span className="old-price">{offer.price} EGP</span>
//               <span className="new-price">
//                 {(
//                   offer.price -
//                   (offer.price * offer.discount) / 100
//                 ).toFixed(0)}{" "}
//                 EGP
//               </span>
//             </>
//           ) : (
//             <span className="new-price">{offer?.price} EGP</span>
//           )}
//         </div>

//         <button
//           className="order-btn"
//           onClick={handleAddToCart}
//           disabled={!offer.isActive}
//           style={{
//             opacity: offer.isActive ? 1 : 0.5,
//             cursor: offer.isActive ? "pointer" : "not-allowed",
//             backgroundColor: offer.isActive ? "#ff4d2d" : "#ccc",
//           }}
//         >
//           {offer.isActive ? "Order Now 🍔" : "Unavailable ⛔"}
//         </button>

//       </div>
//     </div>
//   );
// };

// export default OfferCard;





import { useCart } from "../../component/CartContext/CartContext";
import "./offers.css";

const OfferCard = ({ offer }) => {
  const { addToCart } = useCart();

  if (!offer) return null;

  // =========================================================
  // PRICE
  // =========================================================

  const price = Number(offer.price) || 0;
  const discount = Number(offer.discount) || 0;

  const finalPrice =
    discount > 0
      ? price - (price * discount) / 100
      : price;

  // =========================================================
  // RESTAURANT
  // =========================================================

  // ممكن الـ API يرجع:
  // restaurant: { name, image }
  // أو restaurantId: { name, image }
  // أو restaurantName مباشرة

  const restaurant =
    offer.restaurant ||
    offer.restaurantId ||
    null;

  const restaurantName =
    restaurant?.name ||
    restaurant?.restaurantName ||
    offer.restaurantName ||
    "Restaurant";

  const restaurantImage =
    restaurant?.image ||
    restaurant?.logo ||
    restaurant?.logoImage ||
    offer.restaurantImage ||
    null;

  // =========================================================
  // IMAGES
  // =========================================================

  const getImageUrl = (image) => {
    if (!image) return null;

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return `http://localhost:5000${image}`;
  };

  const offerImage =
    getImageUrl(offer.image) ||
    "https://via.placeholder.com/600x400?text=Food";

  const restaurantLogo = getImageUrl(restaurantImage);

  // =========================================================
  // ADD TO CART
  // =========================================================

  const handleAddToCart = (e) => {
    e.stopPropagation();

    if (!offer.isActive) return;

    addToCart({
      _id: offer._id,
      title: offer.title,
      image: offer.image,

      originalPrice: price,
      discount,
      isActive: offer.isActive,

      price: finalPrice,

      // نحفظ المطعم مع المنتج في الـ cart
      restaurantId:
        restaurant?._id ||
        offer.restaurantId ||
        offer.restaurant?._id,

      restaurantName,
    });
  };

  return (
    <article className="offer-card-modern">

      {/* =====================================================
          OFFER IMAGE
      ====================================================== */}

      <div className="offer-image">

        <img
          src={offerImage}
          alt={offer.title || "Offer"}
          loading="lazy"
        />

        {/* Overlay */}

        <div className="offer-image-overlay"></div>

        {/* Discount */}

        {discount > 0 && (
          <span className="discount-badge">
            🔥 -{discount}%
          </span>
        )}

        {/* Status */}

        <span
          className={`status-badge ${
            offer.isActive
              ? "active"
              : "disabled"
          }`}
        >
          <span className="status-dot"></span>

          {offer.isActive
            ? "Available"
            : "Sold Out"}
        </span>

      </div>

      {/* =====================================================
          BODY
      ====================================================== */}

      <div className="offer-body">

        {/* ===================================================
            RESTAURANT
        ==================================================== */}

        <div className="offer-restaurant">

          <div className="restaurant-logo">

            {restaurantLogo ? (
              <img
                src={restaurantLogo}
                alt={restaurantName}
              />
            ) : (
              <span className="restaurant-placeholder">
                🍽️
              </span>
            )}

          </div>

          <div className="restaurant-info">

            <span className="restaurant-label">
              OFFER FROM
            </span>

            <strong className="restaurant-name">
              {restaurantName}
            </strong>

          </div>

        </div>

        {/* ===================================================
            OFFER TITLE
        ==================================================== */}

        <h3 className="offer-title">
          {offer.title || "Special Offer"}
        </h3>

        {/* ===================================================
            DESCRIPTION
        ==================================================== */}

        <p className="offer-desc">
          {offer.description ||
            "Enjoy this amazing offer from our restaurant."}
        </p>

        {/* ===================================================
            PRICE
        ==================================================== */}

        <div className="offer-price-section">

          <div className="offer-price">

            {discount > 0 && (
              <span className="old-price">
                {price.toFixed(0)} EGP
              </span>
            )}

            <span className="new-price">
              {finalPrice.toFixed(0)} EGP
            </span>

          </div>

          {discount > 0 && (
            <span className="save-text">
              Save{" "}
              {(price - finalPrice).toFixed(0)} EGP
            </span>
          )}

        </div>

        {/* ===================================================
            ORDER BUTTON
        ==================================================== */}

        <button
          type="button"
          className={`order-btn ${
            !offer.isActive
              ? "disabled-btn"
              : ""
          }`}
          onClick={handleAddToCart}
          disabled={!offer.isActive}
        >
          {offer.isActive ? (
            <>
              <span>Order Now</span>
              <span className="order-icon">
                🛒
              </span>
            </>
          ) : (
            <>
              <span>Unavailable</span>
              <span>⛔</span>
            </>
          )}
        </button>

      </div>

    </article>
  );
};

export default OfferCard;
