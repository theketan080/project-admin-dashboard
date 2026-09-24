"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ProductForm from "@/components/ProductForm";
import { addProduct } from "@/services/product.service";

export default function AddProductPage() {
  const router = useRouter();

  const [error, setError] = useState("");

  /*
   * Protect page
   */
  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  const handleAddProduct = async (
    productData
  ) => {
    try {
      setError("");

      await addProduct(productData);

      /*
       * DummyJSON returns a simulated
       * created product.
       */
      router.push("/products");
    } catch (error) {
      console.error(
        "Failed to add product:",
        error
      );

      setError(
        "Failed to add product. Please try again."
      );

      throw error;
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() =>
              router.push("/products")
            }
            className="mb-4 text-sm font-medium text-gray-600 hover:text-black"
          >
            ← Back to Products
          </button>

          <h1 className="text-3xl font-bold text-gray-900">
            Add Product
          </h1>

          <p className="mt-1 text-gray-600">
            Create a new product
          </p>
        </div>

        {/* Error */}
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
            onSubmit={
              handleAddProduct
            }
            submitLabel="Add Product"
          />
        </div>
      </div>
    </main>
  );
}