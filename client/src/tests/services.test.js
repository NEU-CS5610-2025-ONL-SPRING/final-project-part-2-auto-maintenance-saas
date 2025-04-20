import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import ServicesList from "../pages/ServicesList";

// Mock navigate function
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("ServicesList Component", () => {
  const mockServices = [
    {
      id: 1,
      name: "Oil Change",
      price: 45.99,
      duration: 30,
      description: "Comprehensive oil change service",
    },
    {
      id: 2,
      name: "Tire Rotation",
      price: 25.99,
      duration: 20,
      description: "Complete tire rotation service",
    },
  ];

  beforeEach(() => {
    // Mock fetch API
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockServices),
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("displays loading state initially", () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <ServicesList />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("renders services when loaded", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <ServicesList />
        </AuthProvider>
      </MemoryRouter>
    );

    // Wait for services to load
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Check if services are rendered
    expect(screen.getByText("Oil Change")).toBeInTheDocument();
    expect(screen.getByText("Tire Rotation")).toBeInTheDocument();
    expect(screen.getByText("$45.99")).toBeInTheDocument();
    expect(screen.getByText("Duration: 30 minutes")).toBeInTheDocument();
  });

  test("opens service details dialog when Learn More is clicked", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <ServicesList />
        </AuthProvider>
      </MemoryRouter>
    );

    // Wait for services to load
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Click Learn More button
    fireEvent.click(screen.getAllByText("Learn More")[0]);

    // Verify dialog content
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Oil Change")).toBeInTheDocument();
    expect(
      screen.getByText("Comprehensive oil change service")
    ).toBeInTheDocument();
  });

  test("navigates to login when Schedule is clicked by unauthenticated user", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <ServicesList />
        </AuthProvider>
      </MemoryRouter>
    );

    // Wait for services to load
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Click Schedule button
    fireEvent.click(screen.getAllByText("Schedule")[0]);

    // Verify navigation to login
    expect(mockedNavigate).toHaveBeenCalledWith("/login", {
      state: { from: "/book-appointment", serviceId: 1 },
    });
  });
});
