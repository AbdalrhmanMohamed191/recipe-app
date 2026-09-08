import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import api from "../../api/api";
import { toast } from "react-hot-toast";
import { baseUrlHandler } from "../../utils/baseUrlHandler";

import { io } from "socket.io-client";

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaPowerOff,
  FaImage,
  FaTags,
  FaClock,
  FaPercent,
  FaMoneyBillWave,
  FaStore,
  FaTimes,
  FaSave,
  FaUpload,
  FaCheckCircle,
  FaExclamationCircle,
  FaEye,
  FaArrowRight,
  FaCalendarAlt,
  FaUtensils,
  FaSyncAlt,
} from "react-icons/fa";

const RestaurantOffer = () => {
  // =========================================================
  // STATE
  // =========================================================

  const [offers, setOffers] = useState([]);

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  const [togglingId, setTogglingId] =
    useState(null);

  const [editingOffer, setEditingOffer] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);

  const [imagePreview, setImagePreview] =
    useState("");

  const [imageError, setImageError] =
    useState(false);

  const [failedImages, setFailedImages] =
    useState({});

  const [socketConnected, setSocketConnected] =
    useState(false);

  const fileInputRef = useRef(null);

  const socketRef = useRef(null);

  // =========================================================
  // INITIAL FORM
  // =========================================================

  const initialForm = {
    title: "",
    description: "",
    price: "",
    discount: "",
    expiresAt: "",
    productId: "",
    image: null,
  };

  const [form, setForm] =
    useState(initialForm);

  // =========================================================
  // IMAGE URL
  // =========================================================

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";

    let imageValue = imagePath;

    // -------------------------------------------------------
    // IMAGE OBJECT
    // -------------------------------------------------------

    if (
      typeof imageValue === "object" &&
      imageValue !== null
    ) {
      imageValue =
        imageValue.url ||
        imageValue.secure_url ||
        imageValue.secureUrl ||
        imageValue.path ||
        imageValue.filename ||
        imageValue.fileName ||
        imageValue.image ||
        imageValue.src ||
        imageValue.location ||
        "";
    }

    if (!imageValue) return "";

    imageValue = String(imageValue).trim();

    if (!imageValue) return "";

    // -------------------------------------------------------
    // FULL URL
    // -------------------------------------------------------

    if (
      imageValue.startsWith("http://") ||
      imageValue.startsWith("https://")
    ) {
      return imageValue;
    }

    // -------------------------------------------------------
    // BLOB
    // -------------------------------------------------------

    if (
      imageValue.startsWith("blob:")
    ) {
      return imageValue;
    }

    // -------------------------------------------------------
    // DATA URL
    // -------------------------------------------------------

    if (
      imageValue.startsWith("data:image/")
    ) {
      return imageValue;
    }

    // -------------------------------------------------------
    // BASE URL
    // -------------------------------------------------------

    let baseUrl = "";

    try {
      baseUrl = baseUrlHandler();
    } catch (error) {
      console.error(
        "baseUrlHandler error:",
        error
      );
    }

    baseUrl = String(
      baseUrl || ""
    ).trim();

    baseUrl = baseUrl.replace(
      /\/+$/,
      ""
    );

    imageValue =
      imageValue.replace(
        /^\/+/,
        ""
      );

    // -------------------------------------------------------
    // API PREFIX
    // -------------------------------------------------------

    if (
      imageValue.startsWith("api/") &&
      baseUrl.endsWith("/api")
    ) {
      imageValue =
        imageValue.replace(
          /^api\//,
          ""
        );
    }

    if (!baseUrl) {
      return `/${imageValue}`;
    }

    return `${baseUrl}/${imageValue}`;
  };

  // =========================================================
  // GET OFFER IMAGE
  // =========================================================

  const getOfferImage = (offer) => {
    if (!offer) return "";

    const possibleImages = [
      offer.image,
      offer.imageUrl,
      offer.coverImage,
      offer.imagePath,
      offer.CoverImage,
      offer.photo,
      offer.photoUrl,
      offer.thumbnail,
      offer.thumbnailUrl,
    ];

    const image =
      possibleImages.find(
        (item) => {
          if (!item) return false;

          if (
            typeof item === "object" &&
            item !== null
          ) {
            return Boolean(
              item.url ||
                item.secure_url ||
                item.secureUrl ||
                item.path ||
                item.filename ||
                item.fileName ||
                item.image ||
                item.src ||
                item.location
            );
          }

          return (
            String(item).trim() !== ""
          );
        }
      );

    return getImageUrl(image);
  };

  // =========================================================
  // NORMALIZE OFFER
  // =========================================================

  const normalizeOffer = (offer) => {
    if (!offer) return null;

    return {
      ...offer,

      _id:
        offer._id ||
        offer.id,

      isActive:
        Boolean(offer.isActive),

      price:
        offer.price ?? 0,

      discount:
        offer.discount ?? 0,

      title:
        offer.title || "",

      description:
        offer.description || "",

      productId:
        offer.productId || null,

      restaurantId:
        offer.restaurantId || null,
    };
  };

  // =========================================================
  // UPDATE OFFER IN STATE
  // =========================================================

  const upsertOffer = (incomingOffer) => {
    const normalized =
      normalizeOffer(
        incomingOffer
      );

    if (
      !normalized ||
      !normalized._id
    ) {
      return;
    }

    setOffers((prev) => {
      const exists =
        prev.some(
          (item) =>
            item._id ===
            normalized._id
        );

      if (!exists) {
        return [
          normalized,
          ...prev,
        ];
      }

      return prev.map((item) =>
        item._id ===
        normalized._id
          ? {
              ...item,
              ...normalized,
            }
          : item
      );
    });

    setFailedImages((prev) => {
      const next = {
        ...prev,
      };

      delete next[
        normalized._id
      ];

      return next;
    });
  };

  // =========================================================
  // REMOVE OFFER
  // =========================================================

  const removeOfferFromState = (
    offerId
  ) => {
    if (!offerId) return;

    setOffers((prev) =>
      prev.filter(
        (item) =>
          item._id !== offerId
      )
    );

    setFailedImages((prev) => {
      const next = {
        ...prev,
      };

      delete next[offerId];

      return next;
    });
  };

  // =========================================================
  // FETCH OFFERS
  // =========================================================

  const fetchOffers = async (
    showLoader = true
  ) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      const response =
        await api.get(
          "/api/v1/offers/my/offers"
        );

      const data =
        Array.isArray(
          response.data
        )
          ? response.data
          : Array.isArray(
              response.data?.offers
            )
          ? response.data.offers
          : Array.isArray(
              response.data?.data
            )
          ? response.data.data
          : [];

      const normalized =
        data
          .map(normalizeOffer)
          .filter(Boolean);

      setOffers(normalized);

      setFailedImages({});
    } catch (error) {
      console.error(
        "GET MY OFFERS ERROR:",
        error
      );

      if (showLoader) {
        toast.error(
          error.response?.data
            ?.message ||
            "Failed to load offers"
        );

        setOffers([]);
      }
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  // =========================================================
  // FETCH PRODUCTS / RECIPES
  // =========================================================

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);

      /*
       * Backend الموجود عندك فيه:
       *
       * GET /api/v1/recipes/my-menu
       *
       * وده مناسب للـ restaurantOwner.
       */

      const response =
        await api.get(
          "/api/v1/recipes/my-menu"
        );

      const data =
        Array.isArray(
          response.data
        )
          ? response.data
          : Array.isArray(
              response.data?.recipes
            )
          ? response.data.recipes
          : Array.isArray(
              response.data?.data
            )
          ? response.data.data
          : [];

      setProducts(data);
    } catch (error) {
      console.error(
        "GET MY MENU ERROR:",
        error
      );

      toast.error(
        error.response?.data
          ?.message ||
          "Failed to load restaurant products"
      );

      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  // =========================================================
  // SOCKET URL
  // =========================================================

  const getSocketUrl = () => {
    let baseUrl = "";

    try {
      baseUrl =
        baseUrlHandler();
    } catch (error) {
      console.error(
        "Socket base URL error:",
        error
      );
    }

    baseUrl = String(
      baseUrl || ""
    ).trim();

    /*
     * لو baseUrlHandler بيرجع:
     *
     * http://localhost:5000
     *
     * تمام.
     *
     * لو بيرجع:
     *
     * http://localhost:5000/api
     *
     * هنشيل /api لأن Socket.IO شغال
     * على السيرفر نفسه.
     */

    baseUrl =
      baseUrl.replace(
        /\/api\/?$/,
        ""
      );

    baseUrl =
      baseUrl.replace(
        /\/+$/,
        ""
      );

    return baseUrl;
  };

  // =========================================================
  // SOCKET.IO
  // =========================================================

  useEffect(() => {
    const socketUrl =
      getSocketUrl();

    if (!socketUrl) {
      console.error(
        "Socket URL is empty"
      );

      return;
    }

    console.log(
      "Connecting Socket.IO:",
      socketUrl
    );

    const socket = io(
      socketUrl,
      {
        transports: [
          "websocket",
          "polling",
        ],

        reconnection: true,

        reconnectionAttempts:
          Infinity,

        reconnectionDelay: 1000,

        reconnectionDelayMax:
          5000,

        timeout: 10000,
      }
    );

    socketRef.current =
      socket;

    // -------------------------------------------------------
    // CONNECT
    // -------------------------------------------------------

    socket.on(
      "connect",
      () => {
        console.log(
          "🟢 OFFER SOCKET CONNECTED:",
          socket.id
        );

        setSocketConnected(true);
      }
    );

    // -------------------------------------------------------
    // DISCONNECT
    // -------------------------------------------------------

    socket.on(
      "disconnect",
      (reason) => {
        console.log(
          "🔴 OFFER SOCKET DISCONNECTED:",
          reason
        );

        setSocketConnected(false);
      }
    );

    // -------------------------------------------------------
    // CONNECT ERROR
    // -------------------------------------------------------

    socket.on(
      "connect_error",
      (error) => {
        console.error(
          "❌ OFFER SOCKET ERROR:",
          error.message
        );

        setSocketConnected(false);
      }
    );

    // =======================================================
    // OFFER CREATED
    // =======================================================

    socket.on(
      "offerCreated",
      (incomingOffer) => {
        console.log(
          "🟢 SOCKET offerCreated:",
          incomingOffer
        );

        upsertOffer(
          incomingOffer
        );
      }
    );

    // =======================================================
    // OFFER UPDATED
    // =======================================================

    socket.on(
      "offerUpdated",
      (incomingOffer) => {
        console.log(
          "🔵 SOCKET offerUpdated:",
          incomingOffer
        );

        upsertOffer(
          incomingOffer
        );
      }
    );

    // =======================================================
    // OFFER DELETED
    // =======================================================

    socket.on(
      "offerDeleted",
      (offerId) => {
        console.log(
          "🔴 SOCKET offerDeleted:",
          offerId
        );

        /*
         * Backend بيرسل:
         *
         * io.emit(
         *   "offerDeleted",
         *   req.params.id
         * );
         */

        const id =
          typeof offerId ===
          "object"
            ? offerId?._id ||
              offerId?.id
            : offerId;

        removeOfferFromState(
          id
        );
      }
    );

    // =======================================================
    // CLEANUP
    // =======================================================

    return () => {
      console.log(
        "Cleaning Offer Socket..."
      );

      socket.off(
        "connect"
      );

      socket.off(
        "disconnect"
      );

      socket.off(
        "connect_error"
      );

      socket.off(
        "offerCreated"
      );

      socket.off(
        "offerUpdated"
      );

      socket.off(
        "offerDeleted"
      );

      socket.disconnect();

      socketRef.current =
        null;
    };
  }, []);

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchOffers(true);
    fetchProducts();
  }, []);

  // =========================================================
  // BODY SCROLL
  // =========================================================

  useEffect(() => {
    if (!showModal) return;

    const oldOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        oldOverflow;
    };
  }, [showModal]);

  // =========================================================
  // CLEAN BLOB URL
  // =========================================================

  useEffect(() => {
    return () => {
      if (
        imagePreview &&
        imagePreview.startsWith(
          "blob:"
        )
      ) {
        URL.revokeObjectURL(
          imagePreview
        );
      }
    };
  }, [imagePreview]);

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // HANDLE IMAGE
  // =========================================================

  const handleImageChange = (
    e
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      toast.error(
        "Please select a valid image"
      );

      e.target.value = "";

      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      toast.error(
        "Image must be less than 5MB"
      );

      e.target.value = "";

      return;
    }

    if (
      imagePreview &&
      imagePreview.startsWith(
        "blob:"
      )
    ) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    const preview =
      URL.createObjectURL(file);

    setForm((prev) => ({
      ...prev,
      image: file,
    }));

    setImagePreview(preview);

    setImageError(false);
  };

  // =========================================================
  // OPEN CREATE MODAL
  // =========================================================

  const openCreateModal = () => {
    setEditingOffer(null);

    if (
      imagePreview &&
      imagePreview.startsWith(
        "blob:"
      )
    ) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setForm({
      ...initialForm,
    });

    setImagePreview("");

    setImageError(false);

    if (
      fileInputRef.current
    ) {
      fileInputRef.current.value =
        "";
    }

    setShowModal(true);

    /*
     * Refresh products silently in case
     * restaurant menu changed.
     */
    fetchProducts();
  };

  // =========================================================
  // GET PRODUCT ID
  // =========================================================

  const getProductId = (
    offer
  ) => {
    if (!offer) return "";

    if (
      typeof offer.productId ===
      "object"
    ) {
      return (
        offer.productId?._id ||
        offer.productId?.id ||
        ""
      );
    }

    return (
      offer.productId || ""
    );
  };

  // =========================================================
  // OPEN EDIT MODAL
  // =========================================================

  const openEditModal = (
    offer
  ) => {
    setEditingOffer(offer);

    const existingImage =
      getOfferImage(offer);

    setForm({
      title:
        offer.title || "",

      description:
        offer.description ||
        "",

      price:
        offer.price ?? "",

      discount:
        offer.discount ?? "",

      expiresAt:
        offer.expiresAt
          ? new Date(
              offer.expiresAt
            )
              .toISOString()
              .split("T")[0]
          : "",

      productId:
        getProductId(offer),

      image: null,
    });

    setImagePreview(
      existingImage
    );

    setImageError(false);

    if (
      fileInputRef.current
    ) {
      fileInputRef.current.value =
        "";
    }

    setShowModal(true);

    fetchProducts();
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const closeModal = () => {
    if (submitting) return;

    if (
      imagePreview &&
      imagePreview.startsWith(
        "blob:"
      )
    ) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setShowModal(false);

    setEditingOffer(null);

    setImagePreview("");

    setImageError(false);

    setForm({
      ...initialForm,
    });

    if (
      fileInputRef.current
    ) {
      fileInputRef.current.value =
        "";
    }
  };

  // =========================================================
  // VALIDATION
  // =========================================================

  const validateForm = () => {
    if (!form.title.trim()) {
      toast.error(
        "Offer title is required"
      );

      return false;
    }

    if (
      form.price === "" ||
      Number.isNaN(
        Number(form.price)
      ) ||
      Number(form.price) < 0
    ) {
      toast.error(
        "Please enter a valid price"
      );

      return false;
    }

    if (
      form.discount !== "" &&
      (
        Number.isNaN(
          Number(
            form.discount
          )
        ) ||
        Number(
          form.discount
        ) < 0 ||
        Number(
          form.discount
        ) > 100
      )
    ) {
      toast.error(
        "Discount must be between 0 and 100"
      );

      return false;
    }

    /*
     * CREATE:
     * productId REQUIRED by backend.
     *
     * EDIT:
     * optional because old offers may not have it.
     */

    if (
      !editingOffer &&
      !form.productId
    ) {
      toast.error(
        "Please select a product for this offer"
      );

      return false;
    }

    /*
     * If editing an offer that already has
     * productId, we require it to remain valid.
     */

    if (
      editingOffer &&
      !form.productId &&
      getProductId(
        editingOffer
      )
    ) {
      toast.error(
        "Please select a product"
      );

      return false;
    }

    if (form.expiresAt) {
      const selected =
        new Date(
          form.expiresAt
        );

      selected.setHours(
        23,
        59,
        59,
        999
      );

      if (
        selected < new Date()
      ) {
        toast.error(
          "Expiry date cannot be in the past"
        );

        return false;
      }
    }

    return true;
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      const formData =
        new FormData();

      formData.append(
        "title",
        form.title.trim()
      );

      formData.append(
        "description",
        form.description.trim()
      );

      formData.append(
        "price",
        String(
          Number(form.price)
        )
      );

      formData.append(
        "discount",
        String(
          form.discount === ""
            ? 0
            : Number(
                form.discount
              )
        )
      );

      /*
       * Product ID
       */

      if (form.productId) {
        formData.append(
          "productId",
          form.productId
        );
      }

      /*
       * Expiry
       *
       * Empty expiry on EDIT:
       * sends empty string so backend
       * converts it to null.
       */

      if (
        editingOffer
      ) {
        formData.append(
          "expiresAt",
          form.expiresAt || ""
        );
      } else if (
        form.expiresAt
      ) {
        formData.append(
          "expiresAt",
          form.expiresAt
        );
      }

      /*
       * Image
       */

      if (form.image) {
        formData.append(
          "image",
          form.image
        );
      }

      let response;

      // =====================================================
      // EDIT
      // =====================================================

      if (editingOffer) {
        response =
          await api.put(
            `/api/v1/offers/${editingOffer._id}`,
            formData
          );
      }

      // =====================================================
      // CREATE
      // =====================================================

      else {
        response =
          await api.post(
            "/api/v1/offers",
            formData
          );
      }

      console.log(
        "SAVE OFFER RESPONSE:",
        response.data
      );

      const savedOffer =
        response.data?.offer;

      /*
       * Update immediately from HTTP response.
       *
       * Socket will also emit the same event,
       * but upsertOffer prevents duplicates.
       */

      if (savedOffer) {
        upsertOffer(
          savedOffer
        );
      }

      toast.success(
        response.data?.message ||
          "Offer saved successfully"
      );

      closeModal();
    } catch (error) {
      console.error(
        "SAVE OFFER ERROR:",
        error
      );

      console.error(
        "RESPONSE:",
        error.response?.data
      );

      toast.error(
        error.response?.data
          ?.message ||
          "Failed to save offer"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (
    offer
  ) => {
    const confirmed =
      window.confirm(
        `Delete "${offer.title}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(
        offer._id
      );

      const response =
        await api.delete(
          `/api/v1/offers/${offer._id}`
        );

      /*
       * Immediately remove from UI.
       * Socket will also remove it.
       */

      removeOfferFromState(
        offer._id
      );

      toast.success(
        response.data?.message ||
          "Offer deleted successfully"
      );
    } catch (error) {
      console.error(
        "DELETE OFFER ERROR:",
        error
      );

      toast.error(
        error.response?.data
          ?.message ||
          "Failed to delete offer"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================================================
  // TOGGLE
  // =========================================================

  const handleToggle = async (
    offer
  ) => {
    try {
      setTogglingId(
        offer._id
      );

      /*
       * IMPORTANT:
       *
       * Backend route:
       *
       * PATCH /:id/toggle
       *
       * Must use offer._id
       * NOT offer.id
       */

      const response =
        await api.patch(
          `/api/v1/offers/${offer._id}/toggle`
        );

      const updatedOffer =
        response.data?.offer;

      if (updatedOffer) {
        upsertOffer(
          updatedOffer
        );
      } else {
        /*
         * Fallback
         */

        setOffers((prev) =>
          prev.map(
            (item) =>
              item._id ===
              offer._id
                ? {
                    ...item,
                    isActive:
                      !item.isActive,
                  }
                : item
          )
        );
      }

      toast.success(
        response.data?.message ||
          "Offer status updated"
      );
    } catch (error) {
      console.error(
        "TOGGLE OFFER ERROR:",
        error
      );

      toast.error(
        error.response?.data
          ?.message ||
          "Failed to update offer status"
      );
    } finally {
      setTogglingId(null);
    }
  };

  // =========================================================
  // IMAGE ERROR
  // =========================================================

  const handleOfferImageError = (
    offerId,
    imageUrl
  ) => {
    console.error(
      "❌ OFFER IMAGE FAILED:",
      imageUrl
    );

    setFailedImages((prev) => ({
      ...prev,
      [offerId]: true,
    }));
  };

  // =========================================================
  // HELPERS
  // =========================================================

  const getDiscountedPrice = (
    price,
    discount
  ) => {
    const originalPrice =
      Number(price || 0);

    const discountValue =
      Number(discount || 0);

    if (!discountValue) {
      return originalPrice;
    }

    return (
      originalPrice -
      (originalPrice *
        discountValue) /
        100
    );
  };

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "No expiry";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "No expiry";
    }

    return parsedDate.toLocaleDateString(
      "en-EG",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  const isExpired = (
    date
  ) => {
    if (!date) {
      return false;
    }

    return (
      new Date(date).getTime() <
      Date.now()
    );
  };

  // =========================================================
  // STATS
  // =========================================================

  const stats = useMemo(() => {
    const total =
      offers.length;

    const active =
      offers.filter(
        (offer) =>
          offer.isActive &&
          !isExpired(
            offer.expiresAt
          )
      ).length;

    const inactive =
      offers.filter(
        (offer) =>
          !offer.isActive
      ).length;

    const expired =
      offers.filter(
        (offer) =>
          isExpired(
            offer.expiresAt
          )
      ).length;

    return {
      total,
      active,
      inactive,
      expired,
    };
  }, [offers]);

  // =========================================================
  // SELECTED PRODUCT
  // =========================================================

  const selectedProduct =
    useMemo(() => {
      if (!form.productId) {
        return null;
      }

      return (
        products.find(
          (product) =>
            String(
              product._id
            ) ===
            String(
              form.productId
            )
        ) || null
      );
    }, [
      products,
      form.productId,
    ]);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <>
      <div className="restaurant-offer-page">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="offer-page-header">

          <div className="offer-header-left">

            <div className="offer-header-icon">
              <FaTags />
            </div>

            <div>

              <div className="offer-title-row">

                <h2>
                  Offers
                </h2>

                <span
                  className={`socket-status ${
                    socketConnected
                      ? "connected"
                      : "disconnected"
                  }`}
                >
                  <span className="socket-dot" />

                  {socketConnected
                    ? "Live"
                    : "Offline"}
                </span>

              </div>

              <p>
                Create and manage your
                restaurant promotions
              </p>

            </div>

          </div>

          <button
            type="button"
            className="create-offer-btn"
            onClick={
              openCreateModal
            }
          >
            <FaPlus />

            <span>
              Create Offer
            </span>
          </button>

        </div>

        {/* ===================================================
            STATS
        =================================================== */}

        <div className="offer-stats-grid">

          <StatCard
            title="Total Offers"
            value={stats.total}
            icon={<FaTags />}
            type="blue"
          />

          <StatCard
            title="Active Offers"
            value={stats.active}
            icon={
              <FaCheckCircle />
            }
            type="green"
          />

          <StatCard
            title="Inactive"
            value={
              stats.inactive
            }
            icon={
              <FaPowerOff />
            }
            type="gray"
          />

          <StatCard
            title="Expired"
            value={stats.expired}
            icon={
              <FaExclamationCircle />
            }
            type="red"
          />

        </div>

        {/* ===================================================
            LOADING
        =================================================== */}

        {loading && (
          <div className="offers-grid">

            {[
              1,
              2,
              3,
              4,
              5,
              6,
            ].map(
              (item) => (
                <div
                  className="offer-skeleton-card"
                  key={item}
                >

                  <div className="offer-skeleton-image" />

                  <div className="offer-skeleton-body">

                    <div className="skeleton-line large" />

                    <div className="skeleton-line" />

                    <div className="skeleton-line short" />

                    <div className="skeleton-price" />

                  </div>

                </div>
              )
            )}

          </div>
        )}

        {/* ===================================================
            EMPTY
        =================================================== */}

        {!loading &&
          offers.length ===
            0 && (
            <div className="empty-offers">

              <div className="empty-icon">
                <FaTags />
              </div>

              <h3>
                No Offers Yet
              </h3>

              <p>
                Create your first
                offer and attract
                more customers.
              </p>

              <button
                type="button"
                className="create-offer-btn"
                onClick={
                  openCreateModal
                }
              >
                <FaPlus />

                Create First Offer
              </button>

            </div>
          )}

        {/* ===================================================
            OFFERS
        =================================================== */}

        {!loading &&
          offers.length > 0 && (
            <div className="offers-grid">

              {offers.map(
                (offer) => {
                  const image =
                    getOfferImage(
                      offer
                    );

                  const expired =
                    isExpired(
                      offer.expiresAt
                    );

                  const discountedPrice =
                    getDiscountedPrice(
                      offer.price,
                      offer.discount
                    );

                  const isActive =
                    offer.isActive &&
                    !expired;

                  const imageFailed =
                    failedImages[
                      offer._id
                    ];

                  return (
                    <div
                      className={`offer-card ${
                        !offer.isActive ||
                        expired
                          ? "offer-card-inactive"
                          : ""
                      }`}
                      key={
                        offer._id
                      }
                    >

                      {/* IMAGE */}

                      <div className="offer-card-image">

                        {image &&
                        !imageFailed ? (
                          <img
                            src={
                              image
                            }
                            alt={
                              offer.title ||
                              "Offer"
                            }
                            className="offer-main-image"
                            loading="lazy"
                            onError={() =>
                              handleOfferImageError(
                                offer._id,
                                image
                              )
                            }
                          />
                        ) : (
                          <div className="offer-card-image-fallback">

                            <FaImage
                              size={
                                40
                              }
                            />

                            <span>
                              No image
                            </span>

                          </div>
                        )}

                        <div className="offer-image-overlay" />

                        {Number(
                          offer.discount ||
                            0
                        ) > 0 && (
                          <span className="offer-discount-badge">

                            <FaPercent
                              size={9}
                            />

                            {
                              offer.discount
                            }
                            % OFF

                          </span>
                        )}

                        <span
                          className={`offer-status-badge ${
                            isActive
                              ? "active"
                              : "inactive"
                          }`}
                        >
                          {expired
                            ? "Expired"
                            : offer.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </div>

                      {/* BODY */}

                      <div className="offer-card-body">

                        <div className="offer-product-name">

                          <FaUtensils />

                          <span>
                            {typeof offer.productId ===
                            "object"
                              ? offer
                                  .productId
                                  ?.title ||
                                "Product"
                              : "Product"}
                          </span>

                        </div>

                        <h5 className="offer-title">
                          {offer.title ||
                            "Special Offer"}
                        </h5>

                        <p className="offer-description">
                          {offer.description ||
                            "Special offer from your restaurant."}
                        </p>

                        {/* PRICE */}

                        <div className="offer-price-box">

                          <div className="offer-price-left">

                            <div className="offer-price-icon">
                              <FaMoneyBillWave />
                            </div>

                            <div>

                              <span className="offer-small-label">
                                Customer pays
                              </span>

                              <strong className="offer-current-price">
                                {discountedPrice.toFixed(
                                  2
                                )}{" "}
                                EGP
                              </strong>

                            </div>

                          </div>

                          {Number(
                            offer.discount ||
                              0
                          ) > 0 && (
                            <div className="offer-original-price">

                              <span>
                                Original
                              </span>

                              <del>
                                {Number(
                                  offer.price ||
                                    0
                                ).toFixed(
                                  2
                                )}{" "}
                                EGP
                              </del>

                            </div>
                          )}

                        </div>

                        {/* EXPIRY */}

                        <div
                          className={`offer-info-row ${
                            expired
                              ? "expired"
                              : ""
                          }`}
                        >

                          <FaCalendarAlt />

                          <span>
                            {expired
                              ? "Expired on "
                              : "Expires: "}

                            {formatDate(
                              offer.expiresAt
                            )}
                          </span>

                        </div>

                        {/* RESTAURANT */}

                        {offer.restaurantId &&
                          typeof offer.restaurantId ===
                            "object" && (
                            <div className="offer-info-row">

                              <FaStore />

                              <span>
                                {
                                  offer
                                    .restaurantId
                                    .name
                                }
                              </span>

                            </div>
                          )}

                        {/* ACTIONS */}

                        <div className="offer-actions">

                          <button
                            type="button"
                            className="offer-edit-btn"
                            onClick={() =>
                              openEditModal(
                                offer
                              )
                            }
                          >

                            <FaEdit />

                            <span>
                              Edit
                            </span>

                          </button>

                          <button
                            type="button"
                            className={`offer-toggle-btn ${
                              offer.isActive
                                ? "warning"
                                : "success"
                            }`}
                            disabled={
                              togglingId ===
                              offer._id
                            }
                            onClick={() =>
                              handleToggle(
                                offer
                              )
                            }
                            title={
                              offer.isActive
                                ? "Deactivate offer"
                                : "Activate offer"
                            }
                          >

                            {togglingId ===
                            offer._id ? (
                              <span className="mini-spinner" />
                            ) : (
                              <FaPowerOff />
                            )}

                          </button>

                          <button
                            type="button"
                            className="offer-delete-btn"
                            disabled={
                              deletingId ===
                              offer._id
                            }
                            onClick={() =>
                              handleDelete(
                                offer
                              )
                            }
                            title="Delete offer"
                          >

                            {deletingId ===
                            offer._id ? (
                              <span className="mini-spinner" />
                            ) : (
                              <FaTrash />
                            )}

                          </button>

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

      </div>

      {/* =====================================================
          MODAL
      ===================================================== */}

      {showModal && (
        <div
          className="offer-modal-backdrop"
          onMouseDown={(e) => {
            if (
              e.target ===
              e.currentTarget
            ) {
              closeModal();
            }
          }}
        >

          <div
            className="offer-modal"
            role="dialog"
            aria-modal="true"
          >

            {/* HEADER */}

            <div className="offer-modal-header">

              <div className="offer-modal-title-wrapper">

                <div className="offer-modal-title-icon">

                  {editingOffer ? (
                    <FaEdit />
                  ) : (
                    <FaPlus />
                  )}

                </div>

                <div>

                  <h4>
                    {editingOffer
                      ? "Edit Offer"
                      : "Create New Offer"}
                  </h4>

                  <p>
                    {editingOffer
                      ? "Update your promotion details"
                      : "Create an attractive offer for your customers"}
                  </p>

                </div>

              </div>

              <button
                type="button"
                className="offer-close-btn"
                onClick={
                  closeModal
                }
                disabled={
                  submitting
                }
              >
                <FaTimes />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={
                handleSubmit
              }
              className="offer-form"
            >

              <div className="offer-modal-body">

                <div className="offer-modal-grid">

                  {/* LEFT */}

                  <div className="offer-form-column">

                    {/* PRODUCT */}

                    <div className="offer-form-group">

                      <label>
                        Product
                        <span className="required-star">
                          *
                        </span>
                      </label>

                      <div className="offer-product-select-wrapper">

                        <FaUtensils />

                        <select
                          className="offer-product-select"
                          name="productId"
                          value={
                            form.productId
                          }
                          onChange={
                            handleChange
                          }
                          disabled={
                            submitting ||
                            productsLoading
                          }
                        >

                          <option value="">
                            {productsLoading
                              ? "Loading products..."
                              : "Select a product"}
                          </option>

                          {products.map(
                            (
                              product
                            ) => (
                              <option
                                key={
                                  product._id
                                }
                                value={
                                  product._id
                                }
                              >
                                {
                                  product.title
                                }
                                {product.price !==
                                  undefined &&
                                  product.price !==
                                    null
                                  ? ` — ${product.price} EGP`
                                  : ""}
                              </option>
                            )
                          )}

                        </select>

                      </div>

                      {!productsLoading &&
                        products.length ===
                          0 && (
                          <small className="offer-error-text">
                            No products found
                            in your restaurant
                            menu.
                          </small>
                        )}

                    </div>

                    {/* TITLE */}

                    <div className="offer-form-group">

                      <label>
                        Offer Title
                        <span className="required-star">
                          *
                        </span>
                      </label>

                      <input
                        type="text"
                        className="offer-input"
                        name="title"
                        value={
                          form.title
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Example: Mega Burger Deal"
                        disabled={
                          submitting
                        }
                      />

                    </div>

                    {/* DESCRIPTION */}

                    <div className="offer-form-group">

                      <label>
                        Description
                      </label>

                      <textarea
                        className="offer-input offer-textarea"
                        name="description"
                        rows="5"
                        value={
                          form.description
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Describe what's included in this offer..."
                        disabled={
                          submitting
                        }
                      />

                    </div>

                    {/* PRICE + DISCOUNT */}

                    <div className="offer-two-columns">

                      <div className="offer-form-group">

                        <label>
                          Price
                          <span className="required-star">
                            *
                          </span>
                        </label>

                        <div className="offer-input-group">

                          <span>
                            <FaMoneyBillWave />
                          </span>

                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            name="price"
                            value={
                              form.price
                            }
                            onChange={
                              handleChange
                            }
                            placeholder="150"
                            disabled={
                              submitting
                            }
                          />

                          <small>
                            EGP
                          </small>

                        </div>

                      </div>

                      <div className="offer-form-group">

                        <label>
                          Discount
                        </label>

                        <div className="offer-input-group">

                          <span>
                            <FaPercent />
                          </span>

                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            name="discount"
                            value={
                              form.discount
                            }
                            onChange={
                              handleChange
                            }
                            placeholder="20"
                            disabled={
                              submitting
                            }
                          />

                          <small>
                            %
                          </small>

                        </div>

                      </div>

                    </div>

                    {/* EXPIRY */}

                    <div className="offer-form-group">

                      <label>
                        Expiry Date
                      </label>

                      <div className="offer-input-group">

                        <span>
                          <FaClock />
                        </span>

                        <input
                          type="date"
                          name="expiresAt"
                          value={
                            form.expiresAt
                          }
                          onChange={
                            handleChange
                          }
                          disabled={
                            submitting
                          }
                        />

                      </div>

                      <small className="offer-help-text">
                        Leave empty if the
                        offer has no expiry
                        date.
                      </small>

                    </div>

                    {/* IMAGE */}

                    <div className="offer-form-group">

                      <label>
                        Offer Image
                      </label>

                      <div className="offer-upload-box">

                        <div className="offer-upload-content">

                          <div className="offer-upload-icon">
                            <FaImage />
                          </div>

                          <div>

                            <strong>
                              Upload offer image
                            </strong>

                            <span>
                              JPG, PNG or WEBP
                              • Max 5MB
                            </span>

                          </div>

                        </div>

                        <input
                          ref={
                            fileInputRef
                          }
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={
                            handleImageChange
                          }
                          disabled={
                            submitting
                          }
                          className="offer-file-input"
                        />

                        <button
                          type="button"
                          className="offer-upload-btn"
                          onClick={() =>
                            fileInputRef.current?.click()
                          }
                          disabled={
                            submitting
                          }
                        >

                          <FaUpload />

                          Choose Image

                        </button>

                      </div>

                    </div>

                  </div>

                  {/* RIGHT */}

                  <div className="offer-preview-column">

                    <div className="offer-preview-box">

                      <div className="offer-preview-heading">

                        <FaEye />

                        <span>
                          Live Preview
                        </span>

                      </div>

                      {/* SELECTED PRODUCT */}

                      {selectedProduct && (
                        <div className="selected-product-preview">

                          <div className="selected-product-icon">
                            <FaUtensils />
                          </div>

                          <div>

                            <span>
                              Product
                            </span>

                            <strong>
                              {
                                selectedProduct.title
                              }
                            </strong>

                          </div>

                        </div>
                      )}

                      <div className="offer-preview-card">

                        <div className="offer-preview-image">

                          {imagePreview &&
                          !imageError ? (
                            <img
                              src={
                                imagePreview
                              }
                              alt="Preview"
                              onError={() =>
                                setImageError(
                                  true
                                )
                              }
                            />
                          ) : (
                            <div className="offer-preview-empty">

                              <FaImage
                                size={
                                  40
                                }
                              />

                              <span>
                                {imageError
                                  ? "Image unavailable"
                                  : "Offer image"}
                              </span>

                            </div>
                          )}

                          {Number(
                            form.discount ||
                              0
                          ) > 0 && (
                            <span className="offer-preview-discount">

                              {
                                form.discount
                              }
                              % OFF

                            </span>
                          )}

                        </div>

                        <div className="offer-preview-content">

                          <h5>
                            {form.title ||
                              "Your Offer Title"}
                          </h5>

                          <p>
                            {form.description ||
                              "Your offer description will appear here."}
                          </p>

                          <div className="offer-preview-price-row">

                            <strong>
                              {form.price !==
                              ""
                                ? getDiscountedPrice(
                                    form.price,
                                    form.discount
                                  ).toFixed(
                                    2
                                  )
                                : "0.00"}{" "}
                              EGP
                            </strong>

                            {Number(
                              form.discount ||
                                0
                            ) > 0 &&
                              form.price !==
                                "" && (
                                <del>
                                  {Number(
                                    form.price
                                  ).toFixed(
                                    2
                                  )}{" "}
                                  EGP
                                </del>
                              )}

                          </div>

                        </div>

                      </div>

                      {form.price !==
                        "" && (
                        <div className="offer-customer-price">

                          <span>
                            Customer pays
                          </span>

                          <strong>
                            {getDiscountedPrice(
                              form.price,
                              form.discount
                            ).toFixed(
                              2
                            )}{" "}
                            EGP
                          </strong>

                        </div>
                      )}

                    </div>

                  </div>

                </div>

              </div>

              {/* FOOTER */}

              <div className="offer-modal-footer">

                <button
                  type="button"
                  className="offer-cancel-btn"
                  onClick={
                    closeModal
                  }
                  disabled={
                    submitting
                  }
                >

                  <FaTimes />

                  Cancel

                </button>

                <button
                  type="submit"
                  className="offer-save-btn"
                  disabled={
                    submitting
                  }
                >

                  {submitting ? (
                    <>
                      <span className="mini-spinner" />

                      Saving...
                    </>
                  ) : (
                    <>
                      {editingOffer ? (
                        <FaSave />
                      ) : (
                        <FaPlus />
                      )}

                      {editingOffer
                        ? "Save Changes"
                        : "Create Offer"}

                      <FaArrowRight />

                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =====================================================
          CSS
      ===================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .restaurant-offer-page {
          width: 100%;
          min-width: 0;
          min-height: 100vh;
          padding: 30px;
          background: #f7f8fa;
          color: #212529;
          overflow-x: hidden;
        }

        /* =====================================================
           HEADER
        ===================================================== */

        .offer-page-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 28px;
        }

        .offer-header-left {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .offer-header-icon {
          width: 54px;
          height: 54px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff0e8;
          color: #ff6b00;
          font-size: 22px;
          flex-shrink: 0;
        }

        .offer-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .offer-page-header h2 {
          margin: 0;
          font-size: 27px;
          font-weight: 800;
          color: #1f2937 !important;
        }

        .offer-page-header p {
          margin: 4px 0 0;
          color: #7a8491 !important;
          font-size: 14px;
        }

        .socket-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 9px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 800;
        }

        .socket-status.connected {
          background: #eaf8f0;
          color: #198754;
        }

        .socket-status.disconnected {
          background: #fff0f1;
          color: #dc3545;
        }

        .socket-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: currentColor;
        }

        .socket-status.connected .socket-dot {
          animation: socketPulse 1.5s infinite;
        }

        @keyframes socketPulse {
          0% {
            opacity: 1;
            transform: scale(1);
          }

          50% {
            opacity: .45;
            transform: scale(.7);
          }

          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .create-offer-btn {
          border: none;
          outline: none;
          background: #ff6b00;
          color: #fff;
          min-height: 46px;
          padding: 0 20px;
          border-radius: 13px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          box-shadow:
            0 7px 20px rgba(255,107,0,.18);
          transition: .2s ease;
          flex-shrink: 0;
        }

        .create-offer-btn:hover {
          background: #e85f00;
          transform: translateY(-1px);
          box-shadow:
            0 10px 25px rgba(255,107,0,.25);
        }

        /* =====================================================
           STATS
        ===================================================== */

        .offer-stats-grid {
          width: 100%;
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 18px;
          margin-bottom: 28px;
        }

        .offer-stat-card {
          min-width: 0;
          background: #fff;
          border: 1px solid #edf0f3;
          border-radius: 18px;
          padding: 20px;
          box-shadow:
            0 5px 22px rgba(28,39,49,.045);
        }

        .offer-stat-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
        }

        .offer-stat-label {
          margin: 0 0 5px;
          color: #87909b;
          font-size: 13px;
        }

        .offer-stat-value {
          margin: 0;
          color: #20262e !important;
          font-size: 27px;
          font-weight: 800;
        }

        .offer-stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .offer-stat-icon.blue {
          background: #edf4ff;
          color: #0d6efd;
        }

        .offer-stat-icon.green {
          background: #eaf8f0;
          color: #198754;
        }

        .offer-stat-icon.gray {
          background: #f0f1f3;
          color: #6c757d;
        }

        .offer-stat-icon.red {
          background: #fff0f1;
          color: #dc3545;
        }

        /* =====================================================
           GRID
        ===================================================== */

        .offers-grid {
          width: 100%;
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 24px;
          align-items: stretch;
        }

        /* =====================================================
           CARD
        ===================================================== */

        .offer-card {
          width: 100%;
          min-width: 0;
          max-width: 100%;
          overflow: hidden;
          background: #fff;
          border: 1px solid #edf0f3;
          border-radius: 20px;
          box-shadow:
            0 7px 28px rgba(28,39,49,.055);
          transition:
            transform .25s ease,
            box-shadow .25s ease,
            opacity .25s ease;
        }

        .offer-card:hover {
          transform: translateY(-4px);
          box-shadow:
            0 14px 35px rgba(28,39,49,.09);
        }

        .offer-card-inactive {
          opacity: .82;
        }

        .offer-card-image {
          position: relative;
          width: 100%;
          height: 230px;
          overflow: hidden;
          background: #eef0f2;
        }

        .offer-main-image {
          position: absolute;
          inset: 0;
          display: block;
          width: 100%;
          height: 100%;
          max-width: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform .35s ease;
          z-index: 1;
        }

        .offer-card:hover .offer-main-image {
          transform: scale(1.04);
        }

        .offer-card-image-fallback {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 8px;
          color: #9aa1a8;
          background: #eef0f2;
          z-index: 0;
        }

        .offer-card-image-fallback span {
          font-size: 12px;
        }

        .offer-image-overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          background:
            linear-gradient(
              to top,
              rgba(0,0,0,.5),
              rgba(0,0,0,0) 68%
            );
        }

        /* =====================================================
           BADGES
        ===================================================== */

        .offer-discount-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          z-index: 5;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 8px 11px;
          border-radius: 10px;
          background: #dc3545;
          color: #fff;
          font-size: 11px;
          font-weight: 800;
        }

        .offer-status-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          z-index: 5;
          padding: 8px 11px;
          border-radius: 10px;
          color: #fff;
          font-size: 11px;
          font-weight: 800;
        }

        .offer-status-badge.active {
          background: #198754;
        }

        .offer-status-badge.inactive {
          background: #6c757d;
        }

        /* =====================================================
           BODY
        ===================================================== */

        .offer-card-body {
          width: 100%;
          min-width: 0;
          padding: 21px;
        }

        .offer-product-name {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          max-width: 100%;
          margin-bottom: 9px;
          padding: 5px 8px;
          border-radius: 8px;
          background: #fff7f2;
          color: #ff6b00;
          font-size: 10px;
          font-weight: 800;
        }

        .offer-product-name span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .offer-title {
          margin: 0 0 8px;
          color: #20262e !important;
          font-size: 18px;
          font-weight: 800;
          line-height: 1.4;
          overflow-wrap: anywhere;
        }

        .offer-description {
          margin: 0 0 17px;
          color: #7b8590 !important;
          font-size: 13px;
          line-height: 1.65;
          min-height: 43px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* =====================================================
           PRICE
        ===================================================== */

        .offer-price-box {
          width: 100%;
          min-width: 0;
          padding: 13px;
          margin-bottom: 15px;
          border-radius: 14px;
          background: #f7f9fa;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .offer-price-left {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .offer-price-icon {
          width: 38px;
          height: 38px;
          border-radius: 11px;
          background: #eaf8f0;
          color: #198754;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .offer-small-label {
          display: block;
          color: #8a929b;
          font-size: 10px;
          margin-bottom: 2px;
        }

        .offer-current-price {
          display: block;
          color: #198754 !important;
          font-size: 17px;
          font-weight: 800;
          white-space: nowrap;
        }

        .offer-original-price {
          text-align: right;
          flex-shrink: 0;
        }

        .offer-original-price span {
          display: block;
          color: #9aa1a8;
          font-size: 10px;
          margin-bottom: 2px;
        }

        .offer-original-price del {
          color: #8b939c;
          font-size: 11px;
        }

        /* =====================================================
           INFO
        ===================================================== */

        .offer-info-row {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 9px;
          color: #7d8792;
          font-size: 12px;
          min-width: 0;
        }

        .offer-info-row span {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .offer-info-row svg {
          color: #ff6b00;
          flex-shrink: 0;
        }

        .offer-info-row.expired {
          color: #dc3545;
        }

        .offer-info-row.expired svg {
          color: #dc3545;
        }

        /* =====================================================
           ACTIONS
        ===================================================== */

        .offer-actions {
          width: 100%;
          display: flex;
          gap: 8px;
          margin-top: 18px;
          padding-top: 17px;
          border-top: 1px solid #edf0f2;
        }

        .offer-edit-btn,
        .offer-toggle-btn,
        .offer-delete-btn {
          height: 40px;
          border-radius: 11px;
          border: 1px solid;
          background: transparent;
          cursor: pointer;
          transition: .2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          font-size: 12px;
          font-weight: 700;
        }

        .offer-edit-btn {
          flex: 1;
          border-color: #cfe0ff;
          color: #0d6efd;
        }

        .offer-edit-btn:hover {
          background: #edf4ff;
        }

        .offer-toggle-btn,
        .offer-delete-btn {
          width: 40px;
          flex-shrink: 0;
        }

        .offer-toggle-btn.warning {
          border-color: #ffe0a3;
          color: #d99600;
        }

        .offer-toggle-btn.warning:hover {
          background: #fff8e8;
        }

        .offer-toggle-btn.success {
          border-color: #b9e7ce;
          color: #198754;
        }

        .offer-toggle-btn.success:hover {
          background: #eaf8f0;
        }

        .offer-delete-btn {
          border-color: #f4c2c7;
          color: #dc3545;
        }

        .offer-delete-btn:hover {
          background: #fff0f1;
        }

        .offer-edit-btn:disabled,
        .offer-toggle-btn:disabled,
        .offer-delete-btn:disabled {
          opacity: .55;
          cursor: not-allowed;
        }

        /* =====================================================
           SPINNER
        ===================================================== */

        .mini-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid currentColor;
          border-right-color: transparent;
          border-radius: 50%;
          display: inline-block;
          animation:
            offerSpin .7s linear infinite;
        }

        @keyframes offerSpin {
          to {
            transform: rotate(360deg);
          }
        }

        /* =====================================================
           EMPTY
        ===================================================== */

        .empty-offers {
          width: 100%;
          background: #fff;
          border: 1px solid #edf0f3;
          border-radius: 22px;
          padding: 75px 20px;
          text-align: center;
          box-shadow:
            0 7px 25px rgba(28,39,49,.04);
        }

        .empty-icon {
          width: 88px;
          height: 88px;
          margin: 0 auto 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff0e8;
          color: #ff6b00;
          font-size: 31px;
        }

        .empty-offers h3 {
          color: #20262e !important;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .empty-offers p {
          color: #818a94 !important;
          font-size: 14px;
          margin-bottom: 22px;
        }

        /* =====================================================
           SKELETON
        ===================================================== */

        .offer-skeleton-card {
          overflow: hidden;
          background: #fff;
          border-radius: 20px;
          border: 1px solid #edf0f3;
        }

        .offer-skeleton-image {
          height: 230px;
          background:
            linear-gradient(
              90deg,
              #f0f1f2 25%,
              #e7e9eb 37%,
              #f0f1f2 63%
            );
          background-size: 400% 100%;
          animation:
            offerSkeleton 1.4s infinite;
        }

        .offer-skeleton-body {
          padding: 22px;
        }

        .skeleton-line,
        .skeleton-price {
          border-radius: 8px;
          height: 13px;
          margin-bottom: 12px;
          background:
            linear-gradient(
              90deg,
              #f0f1f2 25%,
              #e7e9eb 37%,
              #f0f1f2 63%
            );
          background-size: 400% 100%;
          animation:
            offerSkeleton 1.4s infinite;
        }

        .skeleton-line.large {
          width: 70%;
          height: 18px;
        }

        .skeleton-line {
          width: 100%;
        }

        .skeleton-line.short {
          width: 50%;
        }

        .skeleton-price {
          height: 55px;
          margin-top: 20px;
        }

        @keyframes offerSkeleton {
          0% {
            background-position: 100% 0;
          }

          100% {
            background-position: -100% 0;
          }
        }

        /* =====================================================
           MODAL
        ===================================================== */

        .offer-modal-backdrop {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 99999;
          padding: 20px;
          background: rgba(15,23,42,.68);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .offer-modal {
          width: min(1100px, 100%);
          max-height: calc(100vh - 40px);
          background: #fff;
          border-radius: 22px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow:
            0 30px 100px rgba(0,0,0,.28);
        }

        .offer-modal-header {
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          border-bottom:
            1px solid #edf0f2;
          background: #fff;
          flex-shrink: 0;
        }

        .offer-modal-title-wrapper {
          display: flex;
          align-items: center;
          gap: 13px;
          min-width: 0;
        }

        .offer-modal-title-icon {
          width: 43px;
          height: 43px;
          border-radius: 12px;
          background: #fff0e8;
          color: #ff6b00;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .offer-modal-header h4 {
          margin: 0 0 3px;
          color: #20262e !important;
          font-weight: 800;
          font-size: 18px;
        }

        .offer-modal-header p {
          margin: 0;
          color: #858e98 !important;
          font-size: 12px;
        }

        .offer-close-btn {
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 11px;
          background: #f3f4f6;
          color: #626b75;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: .2s ease;
          flex-shrink: 0;
        }

        .offer-close-btn:hover {
          background: #fff0e8;
          color: #ff6b00;
        }

        .offer-form {
          min-height: 0;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .offer-modal-body {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          padding: 25px;
        }

        .offer-modal-grid {
          width: 100%;
          display: grid;
          grid-template-columns:
            minmax(0, 1.2fr)
            minmax(320px, .8fr);
          gap: 28px;
        }

        .offer-form-column,
        .offer-preview-column {
          min-width: 0;
        }

        .offer-form-group {
          margin-bottom: 21px;
        }

        .offer-form-group > label {
          display: block;
          margin-bottom: 8px;
          color: #343a40 !important;
          font-size: 13px;
          font-weight: 700;
        }

        .required-star {
          color: #dc3545;
          margin-left: 4px;
        }

        .offer-input {
          width: 100%;
          border: 1px solid #dfe3e7;
          border-radius: 12px;
          padding: 12px 14px;
          color: #212529 !important;
          background: #fff !important;
          outline: none;
          font-size: 14px;
          transition: .2s ease;
        }

        .offer-input::placeholder {
          color: #a3aab1 !important;
        }

        .offer-input:focus {
          border-color: #ff9b5a;
          box-shadow:
            0 0 0 3px
            rgba(255,107,0,.09);
        }

        .offer-textarea {
          resize: vertical;
          min-height: 125px;
        }

        /* =====================================================
           PRODUCT SELECT
        ===================================================== */

        .offer-product-select-wrapper {
          width: 100%;
          height: 48px;
          display: flex;
          align-items: center;
          border: 1px solid #dfe3e7;
          border-radius: 12px;
          overflow: hidden;
          background: #fff;
          color: #ff6b00;
        }

        .offer-product-select-wrapper > svg {
          width: 43px;
          height: 100%;
          padding: 15px;
          box-sizing: content-box;
          background: #fff7f2;
          flex-shrink: 0;
        }

        .offer-product-select {
          width: 100%;
          min-width: 0;
          height: 100%;
          border: none;
          outline: none;
          background: #fff;
          color: #212529;
          padding: 0 12px;
          font-size: 13px;
          cursor: pointer;
        }

        .offer-product-select-wrapper:focus-within {
          border-color: #ff9b5a;
          box-shadow:
            0 0 0 3px
            rgba(255,107,0,.09);
        }

        .offer-error-text {
          display: block;
          margin-top: 7px;
          color: #dc3545;
          font-size: 11px;
        }

        .offer-two-columns {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0,1fr));
          gap: 15px;
        }

        .offer-input-group {
          width: 100%;
          height: 45px;
          display: flex;
          align-items: center;
          border: 1px solid #dfe3e7;
          border-radius: 12px;
          overflow: hidden;
          background: #fff;
        }

        .offer-input-group:focus-within {
          border-color: #ff9b5a;
          box-shadow:
            0 0 0 3px
            rgba(255,107,0,.09);
        }

        .offer-input-group > span {
          width: 43px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ff6b00;
          background: #fff7f2;
          flex-shrink: 0;
        }

        .offer-input-group input {
          min-width: 0;
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
          padding: 0 10px;
          color: #212529 !important;
          background: #fff !important;
          font-size: 14px;
        }

        .offer-input-group small {
          padding: 0 12px;
          color: #747d87;
          font-weight: 700;
          flex-shrink: 0;
        }

        .offer-help-text {
          display: block;
          margin-top: 7px;
          color: #8c949d !important;
          font-size: 11px;
        }

        /* =====================================================
           UPLOAD
        ===================================================== */

        .offer-upload-box {
          padding: 18px;
          border: 1.5px dashed #d6dce1;
          border-radius: 16px;
          background: #fafbfc;
        }

        .offer-upload-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .offer-upload-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff0e8;
          color: #ff6b00;
          flex-shrink: 0;
        }

        .offer-upload-content strong {
          display: block;
          color: #343a40 !important;
          font-size: 13px;
          margin-bottom: 3px;
        }

        .offer-upload-content span {
          display: block;
          color: #8b949d !important;
          font-size: 11px;
        }

        .offer-file-input {
          width: 100%;
          margin-top: 14px;
          font-size: 12px;
        }

        .offer-upload-btn {
          margin-top: 12px;
          border: 1px solid #d8dde2;
          background: #fff;
          color: #4b5560;
          padding: 9px 13px;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .offer-upload-btn:hover {
          background: #f7f8f9;
        }

        /* =====================================================
           PREVIEW
        ===================================================== */

        .offer-preview-box {
          width: 100%;
          min-height: 450px;
          padding: 18px;
          border-radius: 18px;
          background: #f7f8fa;
          border: 1px solid #edf0f2;
        }

        .offer-preview-heading {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 13px;
          color: #343a40 !important;
          font-size: 13px;
          font-weight: 800;
        }

        .offer-preview-heading svg {
          color: #0d6efd;
        }

        .selected-product-preview {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 13px;
          padding: 10px 12px;
          border-radius: 12px;
          background: #fff;
          border: 1px solid #e8ebee;
        }

        .selected-product-icon {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: #fff0e8;
          color: #ff6b00;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .selected-product-preview span {
          display: block;
          font-size: 9px;
          color: #8b949d;
          margin-bottom: 2px;
        }

        .selected-product-preview strong {
          display: block;
          color: #303740;
          font-size: 12px;
        }

        .offer-preview-card {
          width: 100%;
          overflow: hidden;
          background: #fff;
          border-radius: 16px;
          border: 1px solid #edf0f2;
          box-shadow:
            0 6px 22px rgba(0,0,0,.055);
        }

        .offer-preview-image {
          width: 100%;
          height: 210px;
          position: relative;
          overflow: hidden;
          background: #edf0f2;
        }

        .offer-preview-image img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }

        .offer-preview-empty {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #a2a9b0;
        }

        .offer-preview-empty span {
          font-size: 11px;
        }

        .offer-preview-discount {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 3;
          background: #dc3545;
          color: #fff;
          padding: 7px 10px;
          border-radius: 9px;
          font-size: 10px;
          font-weight: 800;
        }

        .offer-preview-content {
          padding: 17px;
        }

        .offer-preview-content h5 {
          margin: 0 0 7px;
          color: #20262e !important;
          font-weight: 800;
          font-size: 16px;
        }

        .offer-preview-content p {
          margin: 0 0 15px;
          color: #7d8790 !important;
          font-size: 11px;
          line-height: 1.6;
          min-height: 35px;
        }

        .offer-preview-price-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .offer-preview-price-row strong {
          color: #198754 !important;
          font-size: 18px;
        }

        .offer-preview-price-row del {
          color: #8b939b !important;
          font-size: 11px;
        }

        .offer-customer-price {
          margin-top: 15px;
          padding: 12px 14px;
          border-radius: 12px;
          background: #eaf8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .offer-customer-price span {
          color: #65706a !important;
          font-size: 11px;
        }

        .offer-customer-price strong {
          color: #198754 !important;
          font-size: 15px;
        }

        /* =====================================================
           FOOTER
        ===================================================== */

        .offer-modal-footer {
          flex-shrink: 0;
          padding: 15px 24px;
          border-top:
            1px solid #edf0f2;
          background: #fff;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 9px;
        }

        .offer-cancel-btn,
        .offer-save-btn {
          min-height: 43px;
          border-radius: 11px;
          padding: 0 17px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: .2s ease;
        }

        .offer-cancel-btn {
          border: 1px solid #dfe3e7;
          background: #fff;
          color: #5f6872;
        }

        .offer-cancel-btn:hover {
          background: #f7f8f9;
        }

        .offer-save-btn {
          border: none;
          background: #ff6b00;
          color: #fff;
          box-shadow:
            0 6px 16px
            rgba(255,107,0,.18);
        }

        .offer-save-btn:hover {
          background: #e85f00;
        }

        .offer-save-btn:disabled,
        .offer-cancel-btn:disabled,
        .offer-close-btn:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 1250px) {

          .offers-grid {
            grid-template-columns:
              repeat(2, minmax(0,1fr));
          }

          .offer-stats-grid {
            grid-template-columns:
              repeat(2, minmax(0,1fr));
          }

        }

        @media (max-width: 1000px) {

          .offer-modal-grid {
            grid-template-columns: 1fr;
          }

          .offer-preview-box {
            min-height: auto;
          }

        }

        @media (max-width: 768px) {

          .restaurant-offer-page {
            padding: 22px 16px;
          }

          .offer-page-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .create-offer-btn {
            width: 100%;
          }

          .offers-grid {
            grid-template-columns: 1fr;
          }

          .offer-stats-grid {
            grid-template-columns:
              repeat(2, minmax(0,1fr));
          }

          .offer-modal-backdrop {
            padding: 10px;
          }

          .offer-modal {
            max-height:
              calc(100vh - 20px);
            border-radius: 18px;
          }

          .offer-modal-header {
            padding: 16px;
          }

          .offer-modal-body {
            padding: 17px;
          }

          .offer-modal-footer {
            padding: 12px 16px;
          }

        }

        @media (max-width: 520px) {

          .restaurant-offer-page {
            padding: 18px 12px;
          }

          .offer-header-left {
            width: 100%;
          }

          .offer-header-icon {
            width: 48px;
            height: 48px;
          }

          .offer-page-header h2 {
            font-size: 23px;
          }

          .offer-page-header p {
            font-size: 12px;
          }

          .offer-stats-grid {
            grid-template-columns: 1fr;
          }

          .offer-card-image {
            height: 220px;
          }

          .offer-two-columns {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .offer-modal-title-icon {
            display: none;
          }

          .offer-modal-footer {
            display: grid;
            grid-template-columns:
              1fr 1.5fr;
          }

          .offer-cancel-btn,
          .offer-save-btn {
            width: 100%;
          }

          .offer-price-box {
            align-items: flex-start;
          }

        }

        @media (max-width: 380px) {

          .offer-card-body {
            padding: 17px;
          }

          .offer-current-price {
            font-size: 15px;
          }

          .offer-original-price del {
            font-size: 10px;
          }

          .offer-edit-btn span {
            display: none;
          }

          .offer-edit-btn {
            flex: 0 0 40px;
          }

        }

      `}</style>
    </>
  );
};

// =========================================================
// STAT CARD
// =========================================================

const StatCard = ({
  title,
  value,
  icon,
  type,
}) => {
  return (
    <div className="offer-stat-card">

      <div className="offer-stat-content">

        <div>

          <p className="offer-stat-label">
            {title}
          </p>

          <h3 className="offer-stat-value">
            {value}
          </h3>

        </div>

        <div
          className={`offer-stat-icon ${type}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
};

export default RestaurantOffer;