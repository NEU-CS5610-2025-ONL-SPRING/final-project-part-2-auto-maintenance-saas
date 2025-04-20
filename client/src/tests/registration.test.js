import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Register from "../pages/Register";

describe("Registration Form Validation", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 1, email: "test@example.com" }),
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("validates email format", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Register />
        </AuthProvider>
      </MemoryRouter>
    );

    // Enter invalid email
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "invalid-email" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    // Check for email validation error
    expect(screen.getByText(/email is invalid/i)).toBeInTheDocument();
  });

  test("validates password requirements", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Register />
        </AuthProvider>
      </MemoryRouter>
    );

    // Enter short password
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "12345" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    // Check for password validation error
    expect(
      screen.getByText(/password must be at least 6 characters/i)
    ).toBeInTheDocument();
  });

  test("validates password confirmation", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Register />
        </AuthProvider>
      </MemoryRouter>
    );

    // Enter password
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    // Enter different confirmation password
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "password456" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    // Check for password confirmation error
    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });

  test("successfully registers with valid data", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Register />
        </AuthProvider>
      </MemoryRouter>
    );

    // Enter valid data
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "password123" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    // Verify API call
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/auth/register"),
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      );
    });
  });
});
