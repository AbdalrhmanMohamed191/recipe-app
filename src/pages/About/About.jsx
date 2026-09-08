import React from "react";
import {
  FaUtensils,
  FaStore,
  FaHeart,
  FaBolt,
  FaStar,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./About.css";

const About = () => {
  const navigate = useNavigate();

  return (
    <main className="about-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="about-hero">

        <div className="about-hero-content">

          <span className="about-label">
            ABOUT FAMY
          </span>

          <h1>
            Good Food.
            <br />
            <span>Great Choices.</span>
          </h1>

          <p>
            FAMY is your place to discover restaurants,
            explore delicious food, and order your
            favorite meals — all in one place.
          </p>

          <div className="about-hero-buttons">

            <button
              className="about-primary-btn"
              onClick={() => navigate("/restaurants")}
            >
              Explore Restaurants
              <FaArrowRight />
            </button>

            <button
              className="about-secondary-btn"
              onClick={() => navigate("/contact")}
            >
              Contact Us
            </button>

          </div>

        </div>


        {/* FOOD VISUAL */}

        <div className="about-hero-visual">

          <div className="food-glow"></div>

          <div className="food-circle">
            🍔
          </div>

          <div className="floating-card card-one">
            <FaStar />
            <div>
              <strong>Great Taste</strong>
              <span>Made with love</span>
            </div>
          </div>

          <div className="floating-card card-two">
            <FaUtensils />
            <div>
              <strong>Many Choices</strong>
              <span>Restaurants & menus</span>
            </div>
          </div>

        </div>

      </section>


      {/* =====================================================
          STATS
      ===================================================== */}

      <section className="about-stats">

        <div className="stat-item">
          <strong>10+</strong>
          <span>Restaurants</span>
        </div>

        <div className="stat-item">
          <strong>100+</strong>
          <span>Food Choices</span>
        </div>

        <div className="stat-item">
          <strong>1000+</strong>
          <span>Happy Orders</span>
        </div>

        <div className="stat-item">
          <strong>24/7</strong>
          <span>Easy Ordering</span>
        </div>

      </section>


      {/* =====================================================
          OUR STORY
      ===================================================== */}

      <section className="about-story">

        <div className="story-image">

          <img
            src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1000&q=85"
            alt="Delicious burger"
          />

          <div className="story-badge">
            <FaHeart />
            <span>
              Made for
              <strong>Food Lovers</strong>
            </span>
          </div>

        </div>


        <div className="story-content">

          <span className="about-label">
            OUR STORY
          </span>

          <h2>
            More than just
            <span> food.</span>
          </h2>

          <p>
            FAMY was created to make discovering great food
            easier, faster, and more enjoyable.
          </p>

          <p>
            Instead of searching through countless places,
            FAMY brings restaurants and their menus together
            in one simple experience. Whether you're looking
            for a juicy burger, a delicious crepe, or something
            completely new, there's always something waiting
            for you.
          </p>

          <div className="story-points">

            <div>
              <FaHeart />
              <span>
                <strong>Made for Food Lovers</strong>
                <small>
                  Discover meals you'll actually love.
                </small>
              </span>
            </div>

            <div>
              <FaBolt />
              <span>
                <strong>Simple & Fast</strong>
                <small>
                  Find your food without the hassle.
                </small>
              </span>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          WHY FAMY
      ===================================================== */}

      <section className="why-famy">

        <div className="section-heading">

          <span className="about-label">
            WHY FAMY
          </span>

          <h2>
            Everything you need,
            <span> in one place.</span>
          </h2>

          <p>
            We keep food discovery simple, enjoyable,
            and focused on what really matters.
          </p>

        </div>


        <div className="features-grid">

          <div className="feature-card">

            <div className="feature-icon">
              <FaStore />
            </div>

            <h3>
              Discover Restaurants
            </h3>

            <p>
              Explore different restaurants and
              find the perfect place for your next meal.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              <FaUtensils />
            </div>

            <h3>
              Explore Menus
            </h3>

            <p>
              Browse menus, discover new dishes,
              and choose exactly what you're craving.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              <FaBolt />
            </div>

            <h3>
              Easy Ordering
            </h3>

            <p>
              A smooth ordering experience designed
              to get you from hungry to happy faster.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="about-cta">

        <div>

          <span>
            READY TO EAT?
          </span>

          <h2>
            Your next favorite meal
            <br />
            is waiting for you.
          </h2>

          <p>
            Explore restaurants and discover
            something delicious today.
          </p>

          <button
            onClick={() => navigate("/restaurants")}
          >
            Find a Restaurant
            <FaArrowRight />
          </button>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="about-footer">

        <div className="footer-logo">
          <span>FA</span>
          <strong>MY</strong>
        </div>

        <p>
          Discover. Choose. Enjoy.
        </p>

        <small>
          © {new Date().getFullYear()} FAMY. All rights reserved.
        </small>

      </footer>

    </main>
  );
};

export default About;