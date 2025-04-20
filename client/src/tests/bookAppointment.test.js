import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import BookAppointment from "../pages/BookAppointment";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

// Mock navigate function
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
  useLocation: () => ({
    state: { serviceId: "1" },
  }),
}));

// Mock auth context
jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: { id: 1, email: "test@example.com" },
  }),
}));

describe("BookAppointment Component", () => {
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

  const mockTimeSlots = [
    "2025-05-01T09:00:00Z",
    "2025-05-01T10:00:00Z",
    "2025-05-01T11:00:00Z",
  ];

  const mockMakes = ["Toyota", "Honda", "Ford"];
  const mockModels = ["Camry", "Corolla", "RAV4"];

  beforeEach(() => {
    // Mock all fetch calls
    global.fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        // Services
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockServices),
        })
      )
      .mockImplementationOnce(() =>
        // Makes
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMakes),
        })
      )
      .mockImplementationOnce(() =>
        // Models
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockModels),
        })
      )
      .mockImplementationOnce(() =>
        // Time slots
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockTimeSlots),
        })
      );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders booking form with stepper", async () => {
    render(
      <MemoryRouter>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <BookAppointment />
        </LocalizationProvider>
      </MemoryRouter>
    );

    // Check for the stepper to be present
    await waitFor(() => {
      expect(screen.getByText("Book an Appointment")).toBeInTheDocument();
    });
  });

  test("loads services and shows in dropdown", async () => {
    render(
      <MemoryRouter>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <BookAppointment />
        </LocalizationProvider>
      </MemoryRouter>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // Since the select may be in a Material-UI select, we need to check differently
    // First find and click the select element to open its dropdown
    const serviceSelect = await screen.findByLabelText(/service/i);
    fireEvent.mouseDown(serviceSelect);

    // Then check if our services appear in the dropdown
    await waitFor(() => {
      expect(screen.getByText("Oil Change")).toBeInTheDocument();
      expect(screen.getByText("Tire Rotation")).toBeInTheDocument();
    });
  });

  test("validates required fields before proceeding", async () => {
    render(
      <MemoryRouter>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <BookAppointment />
        </LocalizationProvider>
      </MemoryRouter>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // Try to proceed without selecting required fields
    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    // Check for validation message
    await waitFor(() => {
      expect(screen.getByText(/Please select a service/i)).toBeInTheDocument();
    });
  });
});
