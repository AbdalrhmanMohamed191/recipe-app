import React, { useEffect, useRef, useState } from "react";
import { useCart } from "../../component/CartContext/CartContext";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/api";
import "./cart.css";

const Cart = () => {
  const {
    cart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    clearCart,
    addToCart,
  } = useCart();

  const location = useLocation();
  const go = useNavigate();
  const didReorder = useRef(false);

  const [address, setAddress] = useState({
    street: "",
    city: "",
    notes: "",
  });

  // ================= REORDER =================
  useEffect(() => {
    if (location.state?.reorderItems && !didReorder.current) {
      didReorder.current = true;

      location.state.reorderItems.forEach((item) => {
        addToCart({
          _id: item._id,
          title: item.title,
          price: Number(item.price),

          selectedVariant:
            item.variant ||
            item.selectedVariant ||
            null,

          restaurantId: item.restaurantId,

          // 🔥 IMPORTANT
          itemType: item.itemType || "product",
          offerId: item.offerId || null,
        });
      });

      window.history.replaceState({}, document.title);
    }
  }, [location.state, addToCart]);

  // ================= TOTAL =================
  const totalItems = cart.reduce(
    (sum, i) => sum + i.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (sum, i) => sum + Number(i.price || 0) * i.quantity,
    0
  );

  // ================= VARIANT DISPLAY =================
  const getVariantName = (item) => {
    const v =
      item.selectedVariant ||
      item.variant;

    if (!v) return "Standard";

    if (typeof v === "string") return v;

    return (
      v.name ||
      v.size ||
      "Standard"
    );
  };

  // ================= ORDER =================
  const createOrder = async () => {
    const token =
      localStorage.getItem("token");

    // ================= TOKEN =================
    if (!token) {
      alert(
        "You must login first"
      );

      go("/login");
      return;
    }

    // ================= ADDRESS =================
    if (
      !address.street ||
      !address.city
    ) {
      return alert(
        "Please enter full address"
      );
    }

    // ================= CART =================
    if (cart.length === 0) {
      return alert(
        "Cart is empty"
      );
    }

    try {
      // =================================================
      // BUILD ITEMS
      // =================================================

      const items = cart.map((i) => {
        // ===============================================
        // OFFER
        // ===============================================

        if (
          i.itemType === "offer" ||
          i.offerId
        ) {
          return {
            itemType: "offer",

            offerId:
              i.offerId || i._id,

            title: i.title,

            quantity:
              Number(i.quantity) || 1,

            price:
              Number(i.price) || 0,

            discount:
              Number(i.discount || 0),

            image:
              i.image || "",

            variant:
              null,
          };
        }

        // ===============================================
        // NORMAL PRODUCT
        // ===============================================

        return {
          itemType: "product",

          productId: i._id,

          title: i.title,

          quantity:
            Number(i.quantity) || 1,

          price:
            Number(i.price) || 0,

          variant:
            i.selectedVariant ||
            i.variant ||
            null,

          image:
            i.image || "",
        };
      });

      // =================================================
      // CREATE ORDER
      // =================================================

      await api.post(
        "/api/v1/orders/create",
        {
          // 🔥 باقي الـ backend بتاعك بيجيب
          // restaurantId من المنتج/العرض
          items,

          address,

          paymentMethod: "cash",
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      // =================================================
      // SUCCESS
      // =================================================

      clearCart();

      go("/myorders");

    } catch (err) {
      console.error(
        "CREATE ORDER ERROR:",
        err
      );

      alert(
        err?.response?.data?.message ||
          "Error creating order"
      );
    }
  };

  return (
    <div className="cart-container">

      <div className="cart-header">
        <h2>
          🛒 Your Cart
        </h2>

        <button
          onClick={() =>
            go("/myorders")
          }
        >
          📦 My Orders
        </button>
      </div>

      {/* SUMMARY */}
      <div className="cart-summary">

        <span>
          Total Items: {totalItems}
        </span>

        <span>
          Total:{" "}
          {totalPrice.toFixed(2)} EGP
        </span>

      </div>

      {/* CART ITEMS */}
      {cart.length === 0 ? (
        <p>
          Cart is empty
        </p>
      ) : (
        cart.map((item) => (
          <div
            className="cart-item"
            key={
              item.key ||
              item._id
            }
          >

            <div>

              <h4>
                {item.title}
              </h4>

              {/* OFFER */}
              {(
                item.itemType === "offer" ||
                item.offerId
              ) && (
                <p className="variant">
                  🏷️ Special Offer
                </p>
              )}

              {/* VARIANT */}
              {item.itemType !== "offer" &&
                !item.offerId && (
                  <p className="variant">
                    {getVariantName(item)}
                  </p>
                )}

              <p>
                {Number(
                  item.price || 0
                ).toFixed(2)}{" "}
                EGP × {item.quantity}
              </p>

            </div>

            <div className="actions">

              <button
                onClick={() =>
                  decreaseQty(
                    item.key
                  )
                }
              >
                <FaMinus />
              </button>

              <button
                onClick={() =>
                  increaseQty(
                    item.key
                  )
                }
              >
                <FaPlus />
              </button>

              <button
                onClick={() =>
                  removeFromCart(
                    item.key
                  )
                }
              >
                <FaTrash />
              </button>

            </div>

          </div>
        ))
      )}

      {/* ADDRESS */}
      {cart.length > 0 && (
        <>

          <div className="address">

            <input
              placeholder="Street"
              value={
                address.street
              }
              onChange={(e) =>
                setAddress({
                  ...address,
                  street:
                    e.target.value,
                })
              }
            />

            <input
              placeholder="City"
              value={
                address.city
              }
              onChange={(e) =>
                setAddress({
                  ...address,
                  city:
                    e.target.value,
                })
              }
            />

            <input
              placeholder="Notes"
              value={
                address.notes
              }
              onChange={(e) =>
                setAddress({
                  ...address,
                  notes:
                    e.target.value,
                })
              }
            />

          </div>

          <button
            className="confirm-btn"
            onClick={createOrder}
          >
            Confirm Order
          </button>

        </>
      )}

    </div>
  );
};

export default Cart;