"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { formatCurrency, formatDate } from "@/utils/format";
import {
  ProductCardSkeleton,
  ProductDetailsSkeleton,
} from "@/components/Skeleton";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import ImageSlider from "@/components/ImageSlider";
import {
  useDeleteProductMutation,
  useGetProductBySlugQuery,
  useGetProductsQuery,
} from "@/services/productsApi";
import ProductCard from "@/components/ProductCard";

export default function ProductDetailsPage() {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = params?.slug as string;

  // Fetch product by slug
  const { data, isLoading, isError, error } = useGetProductBySlugQuery(slug, {
    skip: !slug,
  });
  // Delete product mutation
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  // Fetch related products
  const { data: relatedProducts, isFetching: isProductFetching } =
    useGetProductsQuery(
      {
        offset: 0,
        limit: 4,
        categoryId: data?.category?.id,
      },
      {
        skip: !data?.category?.id,
      }
    );
  // Filter out the current product from related products
  const filteredRelatedProducts = relatedProducts
    ?.filter((product) => product.id !== data?.id)
    .slice(0, 3);

  // Handle delete action
  const handleDelete = async () => {
    if (!data) return;

    try {
      await deleteProduct(data.id).unwrap();
      setConfirmOpen(false);
      router.replace("/products");
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  // Error message extraction
  const err = error as FetchBaseQueryError;
  const errorMessage =
    (err?.data as { message?: string })?.message || "Failed to load product.";

  return (
    <div className="min-h-screen px-4 py-6 max-w-5xl mx-auto text-bx-fg">
      {/* Handle Error UI*/}
      {isError && (
        <div className="w-full min-h-40 flex justify-center items-center">
          <div className="text-bx-danger">{errorMessage}</div>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && <ProductDetailsSkeleton />}

      {/* Render Product */}
      {!isLoading && data && (
        <div className="bg-bx-card rounded-lg p-6 border border-bx-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageSlider images={data.images || []} />
            <div>
              <div className="flex items-start justify-between gap-3">
                <h1 className="text-2xl font-semibold">{data.name}</h1>
                <div className="flex gap-2">
                  <Link
                    href={`/products/${data.slug}/edit`}
                    className="px-3 h-9 rounded bg-bx-muted/20 inline-flex items-center"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => setConfirmOpen(true)}
                    className="px-3 h-9 rounded bg-bx-danger text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-bx-muted mt-2">{data.description}</p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="text-lg font-medium">
                  {formatCurrency(data.price)}
                </div>
                <div className="text-sm">Category: {data.category?.name}</div>
                <div className="text-sm text-bx-muted">
                  Created: {formatDate(data.createdAt)}
                </div>
                <div className="text-sm text-bx-muted">
                  Updated: {formatDate(data.updatedAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Loading Skleton  */}
      {(isLoading || isProductFetching) && (
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Related Products Section */}
      {!isLoading &&
        data &&
        filteredRelatedProducts &&
        filteredRelatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredRelatedProducts?.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onDelete={undefined}
                />
              ))}
            </div>
          </div>
        )}

      {confirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-bx-card rounded-lg p-6 w-full max-w-sm border border-bx-border">
            <h2 className="text-lg font-semibold mb-2">Confirm deletion</h2>
            <p className="text-sm text-bx-muted mb-4">
              This removes the product from the current view.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-3 h-9 rounded bg-bx-input border border-bx-border"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
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
