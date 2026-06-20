import React from "react";

const About = () => {
  return (
    <div className="bg-dark text-white">

      {/* HERO */}
      <div className="container py-5 text-center mt-5">
        <h1 className="fw-bold display-5">
          About <span className="mt-3"><span className="text-warning">Us</span></span>
        </h1>
        <p className="text-secondary mt-3">
          Burgers • Crepes • Real Flavor Experience
        </p>
      </div>

      {/* STORY */}
      <div className="container py-4">
        <div className="row align-items-center g-4">

          {/* IMAGE (Burger / Crepe) */}
          <div className="col-md-6">
            <img
              src="https://images.unsplash.com/photo-1550547660-d9450f859349"
              alt="burger food"
              className="img-fluid rounded shadow"
            />
          </div>

          {/* TEXT */}
          <div className="col-md-6">
            <h3 className="text-warning fw-bold">Our Story</h3>
            <p className="text-secondary mt-3">
              "Our story" is all about bringing you the best burgers and crepes
              with a bold homemade taste and premium quality ingredients.
            </p>

            <p className="text-secondary">
              We combine juicy burgers, sweet & savory crepes, and fast service
              to give you a full food experience you’ll love.
            </p>
          </div>

        </div>
      </div>

      {/* VALUES */}
      <div className="container py-5">
        <h3 className="text-center text-warning mb-4 fw-bold">
          Why Choose Us
        </h3>

        <div className="row text-center g-4">

          <div className="col-md-4">
            <h5>🍔 Juicy Burgers</h5>
            <p className="text-secondary">
              Fresh beef, melted cheese, and perfect grill taste.
            </p>
          </div>

          <div className="col-md-4">
            <h5>🥞 Delicious Crepes</h5>
            <p className="text-secondary">
              Sweet and savory crepes made fresh daily.
            </p>
          </div>

          <div className="col-md-4">
            <h5>⚡ Fast & Fresh</h5>
            <p className="text-secondary">
              Quick service without losing quality.
            </p>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <div className="container text-center py-4 border-top border-secondary">
        <p className="text-secondary mb-0">
          © {new Date().getFullYear()} Our Restaurant. All rights reserved.
        </p>
      </div>

    </div>
  );
};

export default About;



