import { useCart } from "../../component/CartContext/CartContext";
import "./offers.css";

const OfferCard = ({ offer }) => {
  const { addToCart } = useCart();

  if (!offer) return null;

  const handleAddToCart = (e) => {
    e.stopPropagation();

    if (!offer.isActive) return;

    addToCart({
      _id: offer._id,
      title: offer.title,
      image: offer.image,

      originalPrice: offer.price,
      discount: offer.discount || 0,
      isActive: offer.isActive,

      price:
        offer.discount > 0
          ? offer.price - (offer.price * offer.discount) / 100
          : offer.price,
    });
  };

  return (
    <div className="offer-card-modern">

      <div className="offer-image">
        <img
          src={
            offer?.image
              ? `http://localhost:5000${offer.image}`
              : "https://via.placeholder.com/300"
          }
          alt={offer?.title || "offer"}
        />

        {offer?.discount > 0 && (
          <span className="discount-badge">
            -{offer.discount}%
          </span>
        )}

        <span
          className={`status-badge ${
            offer.isActive ? "active" : "disabled"
          }`}
        >
          {offer.isActive ? "Available" : "Sold Out"}
        </span>
      </div>

      <div className="offer-body">
        <h3 className="offer-title">{offer?.title}</h3>

        <p className="offer-desc">
          {offer?.description?.slice(0, 70) || "No description"}...
        </p>

        <div className="offer-price">
          {offer?.discount > 0 ? (
            <>
              <span className="old-price">{offer.price} EGP</span>
              <span className="new-price">
                {(
                  offer.price -
                  (offer.price * offer.discount) / 100
                ).toFixed(0)}{" "}
                EGP
              </span>
            </>
          ) : (
            <span className="new-price">{offer?.price} EGP</span>
          )}
        </div>

        <button
          className="order-btn"
          onClick={handleAddToCart}
          disabled={!offer.isActive}
          style={{
            opacity: offer.isActive ? 1 : 0.5,
            cursor: offer.isActive ? "pointer" : "not-allowed",
            backgroundColor: offer.isActive ? "#ff4d2d" : "#ccc",
          }}
        >
          {offer.isActive ? "Order Now 🍔" : "Unavailable ⛔"}
        </button>

      </div>
    </div>
  );
};

export default OfferCard;