"use client";

import { useEffect, useState } from "react";

const EMPTY_FORM = {
  title: "",
  category: "",
  price: "",
  rating: "",
  stock: "",
  description: "",
};

export default function ProductForm({
  initialData = EMPTY_FORM,
  onSubmit,
  submitLabel = "Add Product",
}) {
  const [formData, setFormData] =
    useState({
      ...EMPTY_FORM,
      ...initialData,
    });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] =
    useState(false);

  /*
   * Update form when initialData
   * changes.
   */
  useEffect(() => {
    setFormData({
      ...EMPTY_FORM,
      ...initialData,
    });
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    /*
     * Remove field error when
     * user starts correcting it.
     */
    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title =
        "Product title is required.";
    }

    if (!formData.category.trim()) {
      newErrors.category =
        "Category is required.";
    }

    if (
      formData.price === "" ||
      Number(formData.price) <= 0
    ) {
      newErrors.price =
        "Price must be greater than 0.";
    }

    if (
      formData.rating === "" ||
      Number(formData.rating) < 0 ||
      Number(formData.rating) > 5
    ) {
      newErrors.rating =
        "Rating must be between 0 and 5.";
    }

    if (
      formData.stock === "" ||
      Number(formData.stock) < 0 ||
      !Number.isInteger(
        Number(formData.stock)
      )
    ) {
      newErrors.stock =
        "Stock must be a non-negative integer.";
    }

    if (!formData.description.trim()) {
      newErrors.description =
        "Description is required.";
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    /*
     * Prevent repeated clicks.
     */
    if (submitting) {
      return;
    }

    const validationErrors =
      validateForm();

    if (
      Object.keys(validationErrors)
        .length > 0
    ) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);
      setErrors({});

      await onSubmit({
        title: formData.title.trim(),
        category:
          formData.category.trim(),
        price: Number(formData.price),
        rating: Number(formData.rating),
        stock: Number(formData.stock),
        description:
          formData.description.trim(),
      });

      /*
       * Reset only after a successful
       * submission.
       *
       * For Edit, the page normally
       * redirects after success.
       */
      setFormData(EMPTY_FORM);
    } catch (error) {
      console.error(
        "Form submission failed:",
        error
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Product Title
        </label>

        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter product title"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-black"
        />

        {errors.title && (
          <p className="mt-1 text-sm text-red-600">
            {errors.title}
          </p>
        )}
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="category"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Category
        </label>

        <input
          id="category"
          name="category"
          type="text"
          value={formData.category}
          onChange={handleChange}
          placeholder="Enter category"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-black"
        />

        {errors.category && (
          <p className="mt-1 text-sm text-red-600">
            {errors.category}
          </p>
        )}
      </div>

      {/* Price */}
      <div>
        <label
          htmlFor="price"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Price
        </label>

        <input
          id="price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          placeholder="Enter price"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-black"
        />

        {errors.price && (
          <p className="mt-1 text-sm text-red-600">
            {errors.price}
          </p>
        )}
      </div>

      {/* Rating */}
      <div>
        <label
          htmlFor="rating"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Rating
        </label>

        <input
          id="rating"
          name="rating"
          type="number"
          min="0"
          max="5"
          step="0.1"
          value={formData.rating}
          onChange={handleChange}
          placeholder="0 - 5"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-black"
        />

        {errors.rating && (
          <p className="mt-1 text-sm text-red-600">
            {errors.rating}
          </p>
        )}
      </div>

      {/* Stock */}
      <div>
        <label
          htmlFor="stock"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Stock
        </label>

        <input
          id="stock"
          name="stock"
          type="number"
          min="0"
          step="1"
          value={formData.stock}
          onChange={handleChange}
          placeholder="Enter stock quantity"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-black"
        />

        {errors.stock && (
          <p className="mt-1 text-sm text-red-600">
            {errors.stock}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Description
        </label>

        <textarea
          id="description"
          name="description"
          rows="5"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter product description"
          className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-black"
        />

        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-black px-5 py-3 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting
          ? "Saving..."
          : submitLabel}
      </button>
    </form>
  );
}