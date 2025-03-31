import React from "react";
import { Link } from "react-router-dom";

export default function Homepage() {
  return (
    <main aria-labelledby="page-title">
      <h1 id="page-title">Welcome to Car Maintenance SaaS</h1>
      <nav aria-label="Main navigation">
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>
            <Link to="/login" role="button" aria-label="Login">
              Login
            </Link>
          </li>
          <li>
            <Link to="/register" role="button" aria-label="Register">
              Register
            </Link>
          </li>
        </ul>
      </nav>
      <section aria-labelledby="services-heading">
        <h2 id="services-heading">Our Services</h2>
        <p>Explore our maintenance services and schedule your appointment</p>
      </section>
    </main>
  );
}
