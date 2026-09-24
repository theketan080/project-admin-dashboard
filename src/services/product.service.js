import apiClient from "@/lib/axios";

export const getProducts = async (
  limit = 10,
  skip = 0,
  signal,
  sortBy = "",
  order = ""
) => {
  const response = await apiClient.get("/products", {
    params: {
      limit,
      skip,
      ...(sortBy && { sortBy }),
      ...(order && { order }),
    },
    signal,
  });

  return response.data;
};

export const searchProducts = async (
  query,
  limit = 10,
  skip = 0,
  signal,
  sortBy = "",
  order = ""
) => {
  const response = await apiClient.get(
    "/products/search",
    {
      params: {
        q: query,
        limit,
        skip,
        ...(sortBy && { sortBy }),
        ...(order && { order }),
      },
      signal,
    }
  );

  return response.data;
};

export const getCategories = async () => {
  const response = await apiClient.get(
    "/products/categories"
  );

  return response.data;
};

export const getProductsByCategory = async (
  category,
  limit = 10,
  skip = 0,
  signal,
  sortBy = "",
  order = ""
) => {
  const response = await apiClient.get(
    `/products/category/${category}`,
    {
      params: {
        limit,
        skip,
        ...(sortBy && { sortBy }),
        ...(order && { order }),
      },
      signal,
    }
  );

  return response.data;
};

/*
 * Get single product by ID
 */
export const getProductById = async (
  id,
  signal
) => {
  const response = await apiClient.get(
    `/products/${id}`,
    {
      signal,
    }
  );

  return response.data;
};