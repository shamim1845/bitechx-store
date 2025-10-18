"use client";
import { useEffect, useState } from "react";

export type ProductFormValues = {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  images: string;
};

export type ProductFormProps = {
  title: string;
  initialValues?: Partial<ProductFormValues>;
  categories: Array<{ id: string; name: string }> | undefined;
  loadingCategories?: boolean;
  categoriesError?: boolean;
  onRetryCategories?: () => void;
  submitting?: boolean;
  onCancel: () => void;
  onSubmit: (values: {
    name: string;
    description: string;
    price: number;
    categoryId: string;
    images: string[];
  }) => Promise<void> | void;
};

export default function ProductForm({
  title,
  initialValues,
  categories,
  loadingCategories,
  categoriesError,
  onRetryCategories,
  submitting,
  onCancel,
  onSubmit,
}: ProductFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [description, setDescription] = useState(
    initialValues?.description ?? ""
  );
  const [price, setPrice] = useState<string>(initialValues?.price ?? "");
  const [categoryId, setCategoryId] = useState(initialValues?.categoryId ?? "");
  const [images, setImages] = useState(initialValues?.images ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when initialValues change
  useEffect(() => {
    setName(initialValues?.name ?? "");
    setDescription(initialValues?.description ?? "");
    setPrice(initialValues?.price ?? "");
    setCategoryId(initialValues?.categoryId ?? "");
    setImages(initialValues?.images ?? "");
  }, [
    initialValues?.name,
    initialValues?.description,
    initialValues?.price,
    initialValues?.categoryId,
    initialValues?.images,
  ]);

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validateion
    const v: Record<string, string> = {};
    if (!name.trim()) v.name = "Name is required";
    const priceNum = Number(price);
    if (!price || Number.isNaN(priceNum) || priceNum <= 0)
      v.price = "Price must be > 0";
    if (!categoryId) v.categoryId = "Category is required";
    if (!description.trim()) v.description = "Description is required";
    const imgs = images
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (imgs.length === 0) v.images = "Provide at least one image URL";

    // If errors, set and return
    setErrors(v);
    if (Object.keys(v).length) return;

    // Submit form
    try {
      await onSubmit({
        name,
        description,
        price: priceNum,
        categoryId,
        images: imgs,
      });
    } catch (error) {
      console.error("Failed to submit form:", error);
      alert("Failed to submit form. Please try again.");
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 max-w-2xl mx-auto text-bx-fg">
      <h1 className="text-xl md:text-2xl font-semibold mb-4">{title}</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-bx-card rounded-lg p-6 border border-bx-border space-y-4"
      >
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-10 px-3 rounded-md bg-bx-input border border-bx-border"
          />
          {errors.name && (
            <p className="text-bx-danger text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full min-h-24 px-3 py-2 rounded-md bg-bx-input border border-bx-border"
          />
          {errors.description && (
            <p className="text-bx-danger text-sm mt-1">{errors.description}</p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Price</label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              className="w-full h-10 px-3 rounded-md bg-bx-input border border-bx-border"
            />
            {errors.price && (
              <p className="text-bx-danger text-sm mt-1">{errors.price}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Category</label>
            <div className="flex items-center gap-2">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full h-10 px-3 rounded-md bg-bx-input border border-bx-border"
                disabled={loadingCategories || !categories}
              >
                <option value="">
                  {loadingCategories
                    ? "Loading categories…"
                    : categoriesError
                    ? "Failed to load"
                    : "Select category"}
                </option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {categoriesError && (
                <button
                  type="button"
                  onClick={onRetryCategories}
                  className="px-3 h-10 rounded bg-bx-input border border-bx-border"
                >
                  Retry
                </button>
              )}
            </div>
            {errors.categoryId && (
              <p className="text-bx-danger text-sm mt-1">{errors.categoryId}</p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">
            Images (comma separated URLs)
          </label>
          <input
            value={images}
            onChange={(e) => setImages(e.target.value)}
            className="w-full h-10 px-3 rounded-md bg-bx-input border border-bx-border"
          />
          {errors.images && (
            <p className="text-bx-danger text-sm mt-1">{errors.images}</p>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 h-10 rounded bg-bx-input border border-bx-border"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!!submitting}
            className="px-4 h-10 rounded bg-bx-accent text-white"
          >
            {submitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
