"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import ProductForm from "@/components/ProductForm";
import {
  getProductById,
  updateProduct,
} from "@/services/product.service";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const productId = params?.id;

  const [product, setProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
   * Authentication + fetch product
   */
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

        const data =
          await getProductById(
            productId,
            controller.signal
          );

        setProduct(data);
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
          "Failed to load product."
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
   * Update product
   */
  const handleUpdateProduct = async (
    productData
  ) => {
    try {
      setError("");

      await updateProduct(
        productId,
        productData
      );

      router.push(
        `/products/${productId}`
      );
    } catch (error) {
      console.error(
        "Failed to update product:",
        error
      );

      setError(
        "Failed to update product. Please try again."
      );

      throw error;
    }
  };

  /*
   * Loading
   */
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-3xl">
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
   * Error / Not Found
   */
  if (error && !product) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl bg-white p-8 text-center shadow">
            <h1 className="text-2xl font-bold text-gray-900">
              Product Not Found
            </h1>

            <p className="mt-2 text-red-600">
              {error}
            </p>

            <button
              onClick={() =>
                router.push("/products")
              }
              className="mt-6 rounded-lg bg-black px-5 py-2.5 font-medium text-white hover:bg-gray-800"
            >
              Back to Products
            </button>
          </div>
        </div>
      </main>
    );
  }

  /*
   * Convert API data into form data
   */
  const initialData = {
    title: product.title || "",
    category: product.category || "",
    price: product.price ?? "",
    rating: product.rating ?? "",
    stock: product.stock ?? "",
    description:
      product.description || "",
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() =>
              router.push(
                `/products/${productId}`
              )
            }
            className="mb-4 text-sm font-medium text-gray-600 hover:text-black"
          >
            ← Back to Product
          </button>

          <h1 className="text-3xl font-bold text-gray-900">
            Edit Product
          </h1>

          <p className="mt-1 text-gray-600">
            Update product information
          </p>
        </div>

        {/* API Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Form */}
        <div className="rounded-xl bg-white p-6 shadow md:p-8">
          <ProductForm
            initialData={initialData}
            onSubmit={
              handleUpdateProduct
            }
            submitLabel="Save Changes"
          />
        </div>
      </div>
    </main>
  );
}