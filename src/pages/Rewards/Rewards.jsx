import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import api from "../../api/api";

import "./Rewards.css";

const Rewards = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // =========================================================
  // FETCH LOYALTY WALLETS
  // =========================================================

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    const userString =
      localStorage.getItem("user");

    let user = null;

    try {
      user = userString
        ? JSON.parse(userString)
        : null;
    } catch (error) {
      console.log(
        "User Parse Error:",
        error
      );
    }

    // =======================================================
    // NOT LOGGED IN
    // =======================================================

    if (!token || !user) {
      navigate("/");
      return;
    }

    const fetchWallets = async () => {
      try {
        const res = await api.get(
          "/api/v1/loyalty",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data =
          res.data?.wallets;

        setWallets(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (error) {
        console.log(
          "Fetch Loyalty Wallets Error:",
          error
        );

        setWallets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, [navigate]);

  // =========================================================
  // TOTAL POINTS
  // =========================================================

  const totalPoints = useMemo(() => {
    return wallets.reduce(
      (total, wallet) =>
        total +
        Number(wallet?.points || 0),
      0
    );
  }, [wallets]);

  // =========================================================
  // RESTAURANTS COUNT
  // =========================================================

  const restaurantsCount =
    wallets.length;

  // =========================================================
  // SORT WALLETS
  // =========================================================

  const sortedWallets = useMemo(() => {
    return [...wallets].sort(
      (a, b) =>
        Number(b?.points || 0) -
        Number(a?.points || 0)
    );
  }, [wallets]);

  // =========================================================
  // IMAGE HANDLER
  // =========================================================

  const getRestaurantImage = (
    wallet
  ) => {
    if (!wallet?.restaurantImage) {
      return null;
    }

    return wallet.restaurantImage;
  };

  // =========================================================
  // GO TO RESTAURANTS
  // =========================================================

  const handleOrderNow = () => {
    navigate("/restaurants");
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="rewards-container">

        <h2 className="title">
          Rewards
        </h2>

        <div className="rewards-loading">
          <div className="rewards-spinner"></div>

          <p>
            Loading your points... ⏳
          </p>
        </div>

      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="rewards-container">

      {/* ===================================================
          TITLE
      =================================================== */}

      <h2 className="title">
        Rewards
      </h2>

      {/* ===================================================
          INTRO
      =================================================== */}

      <div className="rewards-intro">

        <div className="rewards-intro-icon">
          ⭐
        </div>

        <div className="rewards-intro-content">

          <h3>
            Earn Points with FAMY
          </h3>

          <p>
            Every{" "}
            <strong>
              10 EGP
            </strong>{" "}
            you spend earns you{" "}
            <strong>
              1 point
            </strong>
            .
          </p>

          <span>
            Points are collected separately
            for each restaurant.
          </span>

        </div>

      </div>

      {/* ===================================================
          SUMMARY
      =================================================== */}

      <div className="rewards-summary">

        {/* TOTAL POINTS */}

        <div className="summary-card">

          <div className="summary-icon">
            ⭐
          </div>

          <div className="summary-content">

            <span className="summary-label">
              Total Points
            </span>

            <strong className="summary-value">
              {totalPoints}
            </strong>

          </div>

        </div>

        {/* RESTAURANTS */}

        <div className="summary-card">

          <div className="summary-icon restaurant-summary-icon">
            🍽️
          </div>

          <div className="summary-content">

            <span className="summary-label">
              Restaurants
            </span>

            <strong className="summary-value">
              {restaurantsCount}
            </strong>

          </div>

        </div>

        {/* EARNING RATE */}

        <div className="summary-card">

          <div className="summary-icon rate-summary-icon">
            💰
          </div>

          <div className="summary-content">

            <span className="summary-label">
              Earning Rate
            </span>

            <strong className="summary-value rate-value">
              1 / 10 EGP
            </strong>

          </div>

        </div>

      </div>

      {/* ===================================================
          NO POINTS
      =================================================== */}

      {wallets.length === 0 ? (

        <div className="empty-box">

          <div className="empty-rewards-icon">
            ⭐
          </div>

          <h3>
            No Points Yet
          </h3>

          <p>
            Start ordering from your
            favorite restaurants and
            collect points with every
            delivered order.
          </p>

          <button
            type="button"
            onClick={handleOrderNow}
            className="btn-outline"
          >
            Order Now 🍔
          </button>

        </div>

      ) : (

        /* =================================================
           RESTAURANTS
        ================================================= */

        <>

          <div className="rewards-section-header">

            <div>
              <h3>
                Your Restaurant Points
              </h3>

              <p>
                Your points are kept
                separately for each restaurant.
              </p>
            </div>

          </div>

          <div className="rewards-grid">

            {sortedWallets.map(
              (wallet) => {

                const image =
                  getRestaurantImage(
                    wallet
                  );

                const points =
                  Number(
                    wallet?.points || 0
                  );

                return (
                  <div
                    className="reward-card"
                    key={
                      wallet?.restaurantId ||
                      wallet?.restaurantName
                    }
                  >

                    {/* =================================
                        RESTAURANT IMAGE
                    ================================= */}

                    <div className="reward-card-image">

                      {image ? (
                        <img
                          src={image}
                          alt={
                            wallet?.restaurantName ||
                            "Restaurant"
                          }
                          onError={(e) => {
                            e.currentTarget.style.display =
                              "none";

                            const fallback =
                              e.currentTarget
                                .parentElement
                                ?.querySelector(
                                  ".reward-image-fallback"
                                );

                            if (fallback) {
                              fallback.style.display =
                                "flex";
                            }
                          }}
                        />
                      ) : null}

                      <div
                        className="reward-image-fallback"
                        style={{
                          display: image
                            ? "none"
                            : "flex",
                        }}
                      >
                        🍽️
                      </div>

                      <div className="points-badge">
                        ⭐ {points}
                      </div>

                    </div>

                    {/* =================================
                        CARD BODY
                    ================================= */}

                    <div className="reward-card-body">

                      <h3>
                        {wallet?.restaurantName ||
                          "Unknown Restaurant"}
                      </h3>

                      <p className="points-description">
                        Your accumulated points
                      </p>

                      {/* POINTS */}

                      <div className="points-display">

                        <span className="points-number">
                          {points}
                        </span>

                        <span className="points-label">
                          Points
                        </span>

                      </div>

                      {/* RATE */}

                      <div className="points-rule">

                        <span>
                          💰
                        </span>

                        <p>
                          Every{" "}
                          <strong>
                            10 EGP
                          </strong>{" "}
                          spent =
                          <strong>
                            {" "}
                            1 Point
                          </strong>
                        </p>

                      </div>

                      {/* NOTE */}

                      <div className="restaurant-points-note">

                        <span>
                          🍽️
                        </span>

                        <p>
                          These points can only
                          be used with this
                          restaurant.
                        </p>

                      </div>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </>

      )}

    </div>
  );
};

export default Rewards;

