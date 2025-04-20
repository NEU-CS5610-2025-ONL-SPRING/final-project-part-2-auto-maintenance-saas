import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import BookAppointment from "../pages/BookAppointment";

describe("Appointment Booking System", () => {
  const mockServices = [
    { id: 1, name: "Oil Change", duration: 30, price: 50 },
    { id: 2, name: "Tire Rotation", duration: 45, price: 75 },
  ];

  const mockTimeSlots = [
    "2024-04-15T09:00:00",
    "2024-04-15T09:30:00",
    "2024-04-15T10:00:00",
  ];

  beforeEach(() => {
    global.fetch = jest.fn((url) => {
      if (url.includes("/api/services")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockServices),
        });
      }
      if (url.includes("/api/appointments/time-slots")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockTimeSlots),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 1, status: "PENDING" }),
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("successfully books an appointment", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <BookAppointment />
        </AuthProvider>
      </MemoryRouter>
    );

    // Wait for services to load
    await waitFor(() => {
      expect(screen.getByText(/oil change/i)).toBeInTheDocument();
    });

    // Select service
    fireEvent.change(screen.getByLabelText(/select service/i), {
      target: { value: "1" },
    });

    // Select date
    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: "2024-04-15" },
    });

    // Select time slot
    await waitFor(() => {
      expect(screen.getByText(/09:00/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/09:00/i));

    // Enter car model
    fireEvent.change(screen.getByLabelText(/car model/i), {
      target: { value: "Toyota Camry" },
    });

    // Submit appointment
    fireEvent.click(screen.getByRole("button", { name: /book appointment/i }));

    // Verify API call
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/appointments"),
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      );
    });
  });

  test("shows error when required fields are missing", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <BookAppointment />
        </AuthProvider>
      </MemoryRouter>
    );

    // Try to submit without filling required fields
    fireEvent.click(screen.getByRole("button", { name: /book appointment/i }));

    // Verify error messages
    expect(screen.getByText(/service is required/i)).toBeInTheDocument();
    expect(screen.getByText(/date is required/i)).toBeInTheDocument();
    expect(screen.getByText(/car model is required/i)).toBeInTheDocument();
  });
});
