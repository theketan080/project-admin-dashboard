import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/*
 * Request Interceptor
 *
 * Automatically attach the login token
 * to every API request.
 */
apiClient.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/*
 * Response Interceptor
 *
 * Centralized API error handling.
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const status =
        error.response.status;

      switch (status) {
        case 400:
          console.error(
            "Bad Request:",
            error.response.data
          );
          break;

        case 401:
          console.error(
            "Unauthorized:",
            error.response.data
          );
          break;

        case 403:
          console.error(
            "Forbidden:",
            error.response.data
          );
          break;

        case 404:
          console.error(
            "Resource Not Found:",
            error.response.data
          );
          break;

        case 500:
          console.error(
            "Server Error:",
            error.response.data
          );
          break;

        default:
          console.error(
            "API Error:",
            error.response.data
          );
      }
    } else if (error.request) {
      console.error(
        "Network Error: No response received from server."
      );
    } else {
      console.error(
        "Request Error:",
        error.message
      );
    }

    return Promise.reject(error);
  }
);

export default apiClient;