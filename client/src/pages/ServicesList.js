import React, { useEffect, useState } from "react";

export default function ServicesList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");
        if (!res.ok) throw new Error("Failed to fetch services");
        const data = await res.json();
        setServices(data);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };
    fetchServices();
  }, []);

  return (
    <div>
      <h1>Maintenance Services</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <ul>
          {services.map((service) => (
            <li key={service.id}>
              <h3>{service.name}</h3>
              <p>Price: ${service.price}</p>
              <p>Duration: {service.duration} minutes</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
