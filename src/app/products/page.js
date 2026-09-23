"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  getProducts,
  searchProducts,
} from "@/services/product.service";

import ProductTable from "@/components/ProductTable";
import ProductCards from "@/components/ProductCards";

const ALLOWED_PAGE_SIZES = [10, 20, 50];

const SEARCH_DEBOUNCE_TIME = 500;

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /*
   * Pagination values from URL
   */
  const rawPage = Number(searchParams.get("page"));

  const page =
    Number.isInteger(rawPage) && rawPage >= 1
      ? rawPage
      : 1;

  const rawPageSize = Number(
    searchParams.get("pageSize")
  );

  const pageSize = ALLOWED_PAGE_SIZES.includes(
    rawPageSize
  )
    ? rawPageSize
    : 10;

  /*
   * Search value from URL
   */
  const searchQuery =
    searchParams.get("search") || "";

  /*
   * Search input state
   */
  const [searchInput, setSearchInput] =
    useState(searchQuery);

  /*
   * Product state
   */
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
   * Retry state
   */
  const [retryCount, setRetryCount] =
    useState(0);

  const totalPages =
    Math.ceil(total / pageSize);

  /*
   * Keep search input synced with URL
   */
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  /*
   * Debounced search
   */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const trimmedSearch =
        searchInput.trim();

      const currentSearch =
        searchParams.get("search") || "";

      if (
        trimmedSearch === currentSearch
      ) {
        return;
      }

      const params =
        new URLSearchParams(
          searchParams.toString()
        );

      if (trimmedSearch) {
        params.set(
          "search",
          trimmedSearch
        );
      } else {
        params.delete("search");
      }

      // Search always starts from page 1
      params.set("page", "1");

      router.push(
        `/products?${params.toString()}`
      );
    }, SEARCH_DEBOUNCE_TIME);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    searchInput,
    router,
    searchParams,
  ]);

  /*
   * Fetch products
   */
  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    const controller =
      new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const skip =
          (page - 1) * pageSize;

        let data;

        if (searchQuery) {
          data = await searchProducts(
            searchQuery,
            pageSize,
            skip,
            controller.signal
          );
        } else {
          data = await getProducts(
            pageSize,
            skip,
            controller.signal
          );
        }

        setProducts(data.products);
        setTotal(data.total);
      } catch (error) {
        /*
         * Ignore cancelled requests
         */
        if (
          error.code === "ERR_CANCELED" ||
          error.name === "CanceledError"
        ) {
          return;
        }

        console.error(
          "Failed to fetch products:",
          error
        );

        setError(
          "Failed to load products."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      controller.abort();
    };
  }, [
    router,
    page,
    pageSize,
    searchQuery,
    retryCount,
  ]);

  /*
   * Normalize invalid URL values
   */
  useEffect(() => {
    const currentPage =
      searchParams.get("page");

    const currentPageSize =
      searchParams.get("pageSize");

    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    let shouldUpdate = false;

    // Invalid page
    if (
      currentPage !== null &&
      (!Number.isInteger(
        Number(currentPage)
      ) ||
        Number(currentPage) < 1)
    ) {
      params.set("page", "1");
      shouldUpdate = true;
    }

    // Invalid page size
    if (
      currentPageSize !== null &&
      !ALLOWED_PAGE_SIZES.includes(
        Number(currentPageSize)
      )
    ) {
      params.set(
        "pageSize",
        "10"
      );

      shouldUpdate = true;
    }

    if (shouldUpdate) {
      router.replace(
        `/products?${params.toString()}`
      );
    }
  }, [
    router,
    searchParams,
  ]);

  /*
   * Handle page greater than
   * available pages
   */
  useEffect(() => {
    if (
      !loading &&
      total > 0 &&
      page > totalPages
    ) {
      const params =
        new URLSearchParams(
          searchParams.toString()
        );

      params.set(
        "page",
        String(totalPages)
      );

      router.replace(
        `/products?${params.toString()}`
      );
    }
  }, [
    loading,
    total,
    page,
    totalPages,
    router,
    searchParams,
  ]);

  /*
   * Update pagination values
   * in URL
   */
  const updatePagination = (
    newPage,
    newPageSize = pageSize
  ) => {
    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    params.set(
      "page",
      String(newPage)
    );

    params.set(
      "pageSize",
      String(newPageSize)
    );

    router.push(
      `/products?${params.toString()}`
    );
  };

  /*
   * Search input change
   */
  const handleSearchChange = (
    event
  ) => {
    setSearchInput(
      event.target.value
    );
  };

  /*
   * Page size change
   */
  const handlePageSizeChange = (
    event
  ) => {
    const newPageSize =
      Number(event.target.value);

    updatePagination(
      1,
      newPageSize
    );
  };

  /*
   * Retry failed request
   */
  const handleRetry = () => {
    setRetryCount(
      (previousCount) =>
        previousCount + 1
    );
  };

  /*
   * Logout
   */
  const handleLogout = () => {
    localStorage.removeItem(
      "token"
    );

    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Product Dashboard
            </h1>

            <p className="mt-1 text-gray-600">
              Manage your products
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-black px-4 py-2 font-medium text-white hover:bg-gray-800"
          >
            Logout
          </button>
        </div>

        {/* Search + Page Size */}
        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

          {/* Search */}
          <div className="w-full lg:max-w-md">
            <label
              htmlFor="search"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Search products
            </label>

            <input
              id="search"
              type="text"
              value={searchInput}
              onChange={
                handleSearchChange
              }
              placeholder="Search by product name..."
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-black"
            />
          </div>

          {/* Page Size */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="pageSize"
              className="text-sm font-medium text-gray-700"
            >
              Products per page:
            </label>

            <select
              id="pageSize"
              value={pageSize}
              onChange={
                handlePageSizeChange
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-black"
            >
              <option value="10">
                10
              </option>

              <option value="20">
                20
              </option>

              <option value="50">
                50
              </option>
            </select>
          </div>
        </div>

        {/* Showing Range */}
        {!loading && !error && (
          <p className="mt-6 text-gray-600">
            Showing{" "}
            {total === 0
              ? 0
              : (page - 1) *
                  pageSize +
                1}
            {" – "}
            {Math.min(
              page * pageSize,
              total
            )}{" "}
            of {total}
          </p>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-8 rounded-xl bg-white p-8 text-center shadow">
            <p className="text-gray-600">
              Loading products...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-8 rounded-xl bg-white p-8 text-center shadow">

            <p className="text-red-600">
              {error}
            </p>

            <button
              onClick={handleRetry}
              className="mt-4 rounded-lg bg-black px-5 py-2 font-medium text-white hover:bg-gray-800"
            >
              Retry
            </button>
          </div>
        )}

        {/* Products */}
        {!loading &&
          !error &&
          products.length > 0 && (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <ProductTable
                  products={products}
                />
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden">
                <ProductCards
                  products={products}
                />
              </div>

              {/* Pagination */}
              <div className="mt-6 flex flex-col items-center gap-4 rounded-xl bg-white p-4 shadow sm:flex-row sm:justify-between">

                {/* Previous */}
                <button
                  onClick={() =>
                    updatePagination(
                      page - 1
                    )
                  }
                  disabled={page <= 1}
                  className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {Array.from(
                    {
                      length:
                        totalPages,
                    },
                    (_, index) =>
                      index + 1
                  ).map(
                    (pageNumber) => (
                      <button
                        key={
                          pageNumber
                        }
                        onClick={() =>
                          updatePagination(
                            pageNumber
                          )
                        }
                        className={`h-9 min-w-9 rounded-lg px-3 text-sm font-medium ${
                          pageNumber ===
                          page
                            ? "bg-black text-white"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    )
                  )}
                </div>

                {/* Next */}
                <button
                  onClick={() =>
                    updatePagination(
                      page + 1
                    )
                  }
                  disabled={
                    page >=
                    totalPages
                  }
                  className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}

        {/* Empty State */}
        {!loading &&
          !error &&
          products.length === 0 && (
            <div className="mt-8 rounded-xl bg-white p-8 text-center shadow">
              <p className="text-gray-600">
                {searchQuery
                  ? `No products found for "${searchQuery}".`
                  : "No products found."}
              </p>
          </div>
        )}
      </div>
    </main>
  );
}