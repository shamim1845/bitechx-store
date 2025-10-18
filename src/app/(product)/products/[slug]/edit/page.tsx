"use client";
import { useParams, useRouter } from "next/navigation";
import ProductForm from "@/components/ProductForm";
import {
  useGetProductBySlugQuery,
  useGetCategoriesQuery,
  useUpdateProductMutation,
} from "@/services/productsApi";

export default function EditProductPage() {
  const { slug } = useParams<{ slug: string }>();

  // Fetch product by slug
  const { data: product, isLoading } = useGetProductBySlugQuery(
    slug as string,
    { skip: !slug }
  );
  // Fetch categories for the form
  const {
    data: categories,
    isLoading: catLoading,
    isError: catError,
    refetch: refetchCats,
  } = useGetCategoriesQuery();

  // Update product mutation
  const [updateProduct, { isLoading: isSaving }] = useUpdateProductMutation();

  const router = useRouter();

  // Initial form values
  const initialValues = product
    ? {
        name: product.name,
        description: product.description,
        price: String(product.price),
        categoryId: product.category?.id ?? "",
        images: (product.images || []).join(", "),
      }
    : undefined;

  const handleSubmit = async (values: {
    name: string;
    description: string;
    price: number;
    categoryId: string;
    images: string[];
  }) => {
    if (!product) return;
    const updated = await updateProduct({
      id: product.id,
      data: values,
    }).unwrap();
    router.replace(`/products/${updated.slug}`);
  };

  if (isLoading && !product)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <ProductForm
      title="Edit product"
      initialValues={initialValues}
      categories={categories}
      loadingCategories={catLoading}
      categoriesError={catError}
      onRetryCategories={() => refetchCats()}
      submitting={isSaving}
      onCancel={() => router.back()}
      onSubmit={handleSubmit}
    />
  );
}
