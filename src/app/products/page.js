"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  getProducts,
  searchProducts,
  getCategories,
  getProductsByCategory,
} from "@/services/product.service";

import ProductTable from "@/components/ProductTable";
import ProductCards from "@/components/ProductCards";

const ALLOWED_PAGE_SIZES = [10, 20, 50];

const SEARCH_DEBOUNCE_TIME = 500;

const ALLOWED_SORTS = [
  "price-asc",
  "price-desc",
  "rating-asc",
  "rating-desc",
  "title-asc",
  "title-desc",
];

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
   * Category value from URL
   */
  const category =
    searchParams.get("category") || "";

  /*
   * Sorting values from URL
   */
  const sortBy =
    searchParams.get("sortBy") || "";

  const order =
    searchParams.get("order") || "";

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

  /*
   * Category state
   */
  const [categories, setCategories] =
    useState([]);

  /*
   * UI state
   */
  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
   * Retry state
   */
  const [retryCount, setRetryCount] =
    useState(0);

  /*
   * Total pages
   */
  const totalPages =
    Math.ceil(total / pageSize);

  /*
   * Current sort option
   */
  const currentSort =
    sortBy && order
      ? `${sortBy}-${order}`
      : "";

  /*
   * Keep search input synced with URL
   */
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  /*
   * Fetch categories
   */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();

        setCategories(data);
      } catch (error) {
        console.error(
          "Failed to fetch categories:",
          error
        );
      }
    };

    fetchCategories();
  }, []);

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

        /*
         * Search and category cannot
         * be combined.
         */
        params.delete("category");
      } else {
        params.delete("search");
      }

      /*
       * Search starts from page 1
       */
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

        /*
         * Search
         */
        if (searchQuery) {
          data = await searchProducts(
            searchQuery,
            pageSize,
            skip,
            controller.signal,
            sortBy,
            order
          );
        }

        /*
         * Category
         */
        else if (category) {
          data =
            await getProductsByCategory(
              category,
              pageSize,
              skip,
              controller.signal,
              sortBy,
              order
            );
        }

        /*
         * Normal products
         */
        else {
          data = await getProducts(
            pageSize,
            skip,
            controller.signal,
            sortBy,
            order
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

    /*
     * Cancel previous request
     */
    return () => {
      controller.abort();
    };
  }, [
    router,
    page,
    pageSize,
    searchQuery,
    category,
    sortBy,
    order,
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

    /*
     * Invalid page
     */
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

    /*
     * Invalid page size
     */
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

    /*
     * Invalid sorting
     */
    if (
      (sortBy || order) &&
      !ALLOWED_SORTS.includes(
        `${sortBy}-${order}`
      )
    ) {
      params.delete("sortBy");
      params.delete("order");

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
    sortBy,
    order,
  ]);

  /*
   * Search + category limitation
   */
  useEffect(() => {
    if (searchQuery && category) {
      const params =
        new URLSearchParams(
          searchParams.toString()
        );

      params.delete("category");

      router.replace(
        `/products?${params.toString()}`
      );
    }
  }, [
    searchQuery,
    category,
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
   * Category change
   */
  const handleCategoryChange = (
    event
  ) => {
    const selectedCategory =
      event.target.value;

    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    /*
     * Category and search
     * cannot be combined.
     */
    params.delete("search");

    setSearchInput("");

    if (selectedCategory) {
      params.set(
        "category",
        selectedCategory
      );
    } else {
      params.delete("category");
    }

    /*
     * Category starts from page 1
     */
    params.set("page", "1");

    router.push(
      `/products?${params.toString()}`
    );
  };

  /*
   * Sorting change
   */
  const handleSortChange = (
    event
  ) => {
    const selectedSort =
      event.target.value;

    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    if (!selectedSort) {
      params.delete("sortBy");
      params.delete("order");
    } else {
      const [newSortBy, newOrder] =
        selectedSort.split("-");

      params.set(
        "sortBy",
        newSortBy
      );

      params.set(
        "order",
        newOrder
      );
    }

    /*
     * Sorting starts from page 1
     */
    params.set("page", "1");

    router.push(
      `/products?${params.toString()}`
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

        {/* Search + Category + Sorting + Page Size */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-4">

          {/* Search */}
          <div className="lg:col-span-1">
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

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Category
            </label>

            <select
              id="category"
              value={category}
              onChange={
                handleCategoryChange
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-black"
            >
              <option value="">
                All Categories
              </option>

              {categories.map(
                (categoryItem) => (
                  <option
                    key={
                      categoryItem.slug
                    }
                    value={
                      categoryItem.slug
                    }
                  >
                    {categoryItem.name}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Sorting */}
          <div>
            <label
              htmlFor="sort"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Sort by
            </label>

            <select
              id="sort"
              value={currentSort}
              onChange={
                handleSortChange
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-black"
            >
              <option value="">
                Default
              </option>

              <option value="price-asc">
                Price: Low → High
              </option>

              <option value="price-desc">
                Price: High → Low
              </option>

              <option value="rating-asc">
                Rating: Low → High
              </option>

              <option value="rating-desc">
                Rating: High → Low
              </option>

              <option value="title-asc">
                Title: A → Z
              </option>

              <option value="title-desc">
                Title: Z → A
              </option>
            </select>
          </div>

          {/* Page Size */}
          <div>
            <label
              htmlFor="pageSize"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Products per page
            </label>

            <select
              id="pageSize"
              value={pageSize}
              onChange={
                handlePageSizeChange
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-black"
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

        {/* Active Filters */}
        {!loading &&
          !error &&
          (category ||
            currentSort) && (
            <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-500">
              {category && (
                <span>
                  Category:{" "}
                  <strong className="text-gray-800">
                    {category}
                  </strong>
                </span>
              )}

              {currentSort && (
                <span>
                  Sort:{" "}
                  <strong className="text-gray-800">
                    {currentSort}
                  </strong>
                </span>
              )}
            </div>
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
                  : category
                    ? `No products found in "${category}".`
                    : "No products found."}
              </p>
            </div>
          )}
      </div>
    </main>
  );
}