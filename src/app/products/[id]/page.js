"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  deleteProduct,
  getProductById,
} from "@/services/product.service";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const productId = params?.id;

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleting, setDeleting] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    if (!productId) {
      return;
    }

    const controller =
      new AbortController();

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProductById(
          productId,
          controller.signal
        );

        setProduct(data);

        setSelectedImage(
          data.thumbnail ||
            data.images?.[0] ||
            ""
        );
      } catch (error) {
        if (
          error.code === "ERR_CANCELED" ||
          error.name === "CanceledError"
        ) {
          return;
        }

        console.error(
          "Failed to fetch product:",
          error
        );

        setError(
          "Product not found or failed to load."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      controller.abort();
    };
  }, [productId, router]);

  /*
   * Delete product
   */
  const handleDeleteProduct = async () => {
    if (deleting) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await deleteProduct(productId);

      setShowDeleteModal(false);

      router.push("/products");
    } catch (error) {
      console.error(
        "Failed to delete product:",
        error
      );

      setError(
        "Failed to delete product. Please try again."
      );

      setDeleting(false);
    }
  };

  /*
   * Loading state
   */
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-xl bg-white p-8 text-center shadow">
            <p className="text-gray-600">
              Loading product...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /*
   * Not Found state
   */
  if (error && !product) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-xl bg-white p-8 text-center shadow">
            <h1 className="text-2xl font-bold text-gray-900">
              Product Not Found
            </h1>

            <p className="mt-2 text-gray-600">
              The product you are looking for
              does not exist.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-block rounded-lg bg-black px-5 py-2.5 font-medium text-white hover:bg-gray-800"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const images = product.images?.length
    ? product.images
    : [product.thumbnail];

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-5xl">

        {/* Back */}
        <Link
          href="/products"
          className="mb-6 inline-block text-sm font-medium text-gray-700 hover:text-black"
        >
          ← Back to Products
        </Link>

        {/* API Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Product Details */}
        <div className="overflow-hidden rounded-xl bg-white shadow">

          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* Image Gallery */}
            <div className="bg-gray-50 p-6">

              {/* Main Image */}
              <div className="flex min-h-[400px] items-center justify-center rounded-xl bg-white p-6">
                <img
                  src={selectedImage}
                  alt={product.title}
                  className="max-h-[400px] max-w-full object-contain"
                />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {images.map(
                    (image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() =>
                          setSelectedImage(
                            image
                          )
                        }
                        className={`rounded-lg border-2 bg-white p-2 ${
                          selectedImage === image
                            ? "border-black"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.title} ${
                            index + 1
                          }`}
                          className="h-20 w-full object-contain"
                        />
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="p-8">

              {/* Category */}
              <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
                {product.category}
              </p>

              {/* Title */}
              <h1 className="mt-2 text-3xl font-bold text-gray-900">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="mt-4 flex items-center gap-2">
                <span className="rounded-md bg-gray-100 px-2.5 py-1 text-sm font-medium">
                  ⭐ {product.rating}
                </span>

                <span className="text-sm text-gray-500">
                  {product.reviews?.length ||
                    0}{" "}
                  reviews
                </span>
              </div>

              {/* Price */}
              <p className="mt-6 text-3xl font-bold text-gray-900">
                ${product.price}
              </p>

              {/* Discount */}
              {product.discountPercentage && (
                <p className="mt-1 text-sm text-green-600">
                  {product.discountPercentage.toFixed(
                    2
                  )}
                  % discount
                </p>
              )}

              {/* Stock */}
              <div className="mt-6">
                <span className="text-sm text-gray-500">
                  Stock
                </span>

                <p
                  className={`mt-1 font-semibold ${
                    product.stock > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {product.stock > 0
                    ? `${product.stock} units available`
                    : "Out of stock"}
                </p>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Description
                </h2>

                <p className="mt-2 leading-7 text-gray-600">
                  {product.description}
                </p>
              </div>

              {/* Brand */}
              {product.brand && (
                <div className="mt-6">
                  <span className="text-sm text-gray-500">
                    Brand
                  </span>

                  <p className="mt-1 font-medium text-gray-900">
                    {product.brand}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                {/* Edit */}
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/products/${productId}/edit`
                    )
                  }
                  className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-100"
                >
                  Edit Product
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() =>
                    setShowDeleteModal(true)
                  }
                  disabled={deleting}
                  className="rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>

          {/* Reviews */}
          {product.reviews?.length > 0 && (
            <div className="border-t p-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Reviews
              </h2>

              <div className="mt-6 space-y-4">
                {product.reviews.map(
                  (review, index) => (
                    <div
                      key={`${review.reviewerEmail}-${index}`}
                      className="rounded-lg border border-gray-200 p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {review.reviewerName}
                          </p>

                          <p className="text-sm text-gray-500">
                            {review.reviewerEmail}
                          </p>
                        </div>

                        <span className="rounded-md bg-gray-100 px-2.5 py-1 text-sm font-medium">
                          ⭐ {review.rating}
                        </span>
                      </div>

                      <p className="mt-3 text-gray-600">
                        {review.comment}
                      </p>

                      <p className="mt-2 text-xs text-gray-400">
                        {review.date}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
          >
            <h2
              id="delete-title"
              className="text-xl font-bold text-gray-900"
            >
              Delete Product?
            </h2>

            <p className="mt-2 text-gray-600">
              Are you sure you want to delete{" "}
              <strong>
                {product.title}
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              {/* Cancel */}
              <button
                type="button"
                onClick={() =>
                  setShowDeleteModal(false)
                }
                disabled={deleting}
                className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>

              {/* Confirm */}
              <button
                type="button"
                onClick={
                  handleDeleteProduct
                }
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting
                  ? "Deleting..."
                  : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}