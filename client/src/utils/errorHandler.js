export const handleApiError = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "An error occurred");
  }
  return response.json();
};

export const displayError = (error, setError) => {
  console.error("API Error:", error);
  setError(error.message || "An unexpected error occurred");
};
