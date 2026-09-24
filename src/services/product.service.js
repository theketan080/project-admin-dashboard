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

/*
 * Add Product
 */
export const addProduct = async (
  productData
) => {
  const response = await apiClient.post(
    "/products/add",
    productData
  );

  return response.data;
};

/*
 * Update Product
 */
export const updateProduct = async (
  id,
  productData
) => {
  const response = await apiClient.put(
    `/products/${id}`,
    productData
  );

  return response.data;
};

/*
 * Delete Product
 */
export const deleteProduct = async (
  id
) => {
  const response = await apiClient.delete(
    `/products/${id}`
  );

  return response.data;
};