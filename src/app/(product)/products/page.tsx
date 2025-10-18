"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  useDeleteProductMutation,
  useGetProductsQuery,
  useSearchProductsQuery,
  useGetCategoriesQuery,
} from "@/services/productsApi";
import { ProductCardSkeleton } from "@/components/Skeleton";
import ProductCard from "@/components/ProductCard";

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  const offset = Number(searchParams.get("offset") || 0);
  const limit = Number(searchParams.get("limit") || 12);

  // debounced state
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Fetch categories for filter
  const { data: categories, isLoading: catLoading } = useGetCategoriesQuery();
  // Fetch products
  const {
    data,
    isLoading,
    isFetching,
    isError: isProductError,
  } = useGetProductsQuery({
    offset,
    limit,
    categoryId: categoryId || undefined,
  });
  // Search products
  const {
    data: searched,
    isFetching: isSearching,
    isError: isSearchError,
  } = useSearchProductsQuery(
    { searchedText: debouncedQuery },
    { skip: !debouncedQuery }
  );
  // Delete product mutation
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  // Memoized product list
  const list = useMemo(() => {
    if (debouncedQuery && searched) return searched;
    return data ?? [];
  }, [debouncedQuery, searched, data]);

  // Pagination handlers
  const nextPage = () =>
    router.replace(`/products?offset=${offset + limit}&limit=${limit}`);
  const prevPage = () =>
    router.replace(
      `/products?offset=${Math.max(0, offset - limit)}&limit=${limit}`
    );

  // Delete confirmation handler
  const onConfirmDelete = async () => {
    if (!confirmId) return;
    try {
      await deleteProduct(confirmId).unwrap();
    } finally {
      setConfirmId(null);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 max-w-6xl mx-auto text-bx-fg">
      {/* Products Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <h1 className="text-xl md:text-2xl font-semibold">Products</h1>
        <Link
          href="/products/new"
          className="px-3 h-9 text-base md:px-4 md:h-10 rounded-md bg-bx-accent text-white inline-flex items-center"
        >
          New Product
        </Link>
      </div>

      {/* Products Card Container */}
      <div className="bg-bx-card rounded-lg p-4 border border-bx-border">
        {/*  Search & Filter  */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name..."
            className="w-full h-10 px-3 rounded-md bg-bx-input border border-bx-border outline-none focus:ring-2 focus:ring-bx-accent"
          />
          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              router.replace(`/products?offset=0&limit=${limit}`);
            }}
            className="w-full sm:w-60 h-10 px-3 rounded-md bg-bx-input border border-bx-border"
            disabled={catLoading}
          >
            <option value="">All categories</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={limit}
            onChange={(e) => {
              const newLimit = Number(e.target.value);
              router.replace(`/products?offset=0&limit=${newLimit}`);
            }}
            className="w-full sm:w-40 h-10 px-3 rounded-md bg-bx-input border border-bx-border"
          >
            <option value={6}>6 per page</option>
            <option value={12}>12 per page</option>
            <option value={24}>24 per page</option>
            <option value={48}>48 per page</option>
          </select>
        </div>

        {/* Products Loading Skleton  */}
        {(isLoading || isFetching || isSearching) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
            {Array.from({ length: limit }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error UI */}
        {(isProductError || isSearchError) && (
          <div className="p-6 text-bx-danger min-h-[20vh] flex justify-center items-center">
            Failed to load products.
          </div>
        )}

        {/* NotFound UI */}
        {!isProductError && !isSearchError && !list.length && (
          <div className="p-6 text-bx-accent min-h-[20vh] flex justify-center items-center">
            No product Found!
          </div>
        )}

        {/* Render Product List & Pagination */}
        {!isLoading &&
          !isFetching &&
          !isSearching &&
          !isProductError &&
          !isSearchError &&
          list.length > 0 && (
            <>
              {/* Product List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {list?.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onDelete={(id) => setConfirmId(id)}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={prevPage}
                  className="px-3 h-9 rounded bg-bx-input border border-bx-border"
                  disabled={offset === 0}
                >
                  Prev
                </button>
                <button
                  onClick={nextPage}
                  className="px-3 h-9 rounded bg-bx-input border border-bx-border"
                >
                  Next
                </button>
              </div>
            </>
          )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-bx-card rounded-lg p-6 w-full max-w-sm border border-bx-border">
            <h2 className="text-lg font-semibold mb-2">Delete product?</h2>
            <p className="text-sm text-bx-muted mb-4">
              This will simulate deletion and remove it from the list
              temporarily.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmId(null)}
                className="px-3 h-9 rounded bg-bx-input border border-bx-border"
              >
                Cancel
              </button>
              <button
                onClick={onConfirmDelete}
                disabled={isDeleting}
                className="px-3 h-9 rounded bg-bx-danger text-white"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
