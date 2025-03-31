import React from "react";
import { Link } from "react-router-dom";

export default function Homepage() {
  return (
    <main className="homepage">
      <h1>Welcome to Car Maintenance SaaS</h1>
      <p>Your one-stop solution for car maintenance scheduling and services.</p>
      <nav className="homepage-nav">
        <Link to="/login" className="btn">
          Login
        </Link>
        <Link to="/register" className="btn">
          Register
        </Link>
        <Link to="/services" className="btn">
          View Services
        </Link>
      </nav>
    </main>
  );
}
