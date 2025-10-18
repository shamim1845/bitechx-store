"use client";
import Link from "next/link";
import { formatCurrency } from "@/utils/format";

export type ProductCardProps = {
  product: {
    id: string;
    name: string;
    images?: string[];
    price: number;
    slug: string;
    category?: { name?: string } | null;
  };
  onDelete?: (id: string) => void;
};

export default function ProductCard({ product, onDelete }: ProductCardProps) {
  return (
    <div className="border border-bx-border rounded-lg overflow-hidden bg-bx-bg/40">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={product.images?.[0] || "/vercel.svg"}
        alt={product.name}
        className="w-full h-56 object-cover"
      />
      <div className="p-4 space-y-2">
        <Link
          href={`/products/${product.slug}`}
          className="text-base font-semibold hover:underline block"
        >
          {product.name}
        </Link>
        <div className="text-sm text-bx-muted">
          {product.category?.name || "Uncategorized"}
        </div>
        <div className="text-sm font-medium">
          {formatCurrency(product.price)}
        </div>

        {/* Delete and Edit Button */}
        {onDelete && (
          <div className="flex gap-2 pt-2">
            <Link
              href={`/products/${product.slug}/edit`}
              className="px-3 h-9 rounded bg-bx-muted/20 inline-flex items-center"
            >
              Edit
            </Link>
            <button
              onClick={() => onDelete(product.id)}
              className="px-3 h-9 rounded bg-bx-danger text-white"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
