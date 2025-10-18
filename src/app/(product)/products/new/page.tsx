"use client";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import ProductForm from "@/components/ProductForm";
import type { RootState } from "@/store";
import {
  useCreateProductMutation,
  useGetCategoriesQuery,
} from "@/services/productsApi";

export default function NewProductPage() {
  const router = useRouter();
  const token = useAppSelector((s: RootState) => s.auth.token);

  // Fetch categories for the form
  const {
    data: categories,
    isLoading: isCatLoading,
    isError: isCatError,
    refetch: refetchCats,
  } = useGetCategoriesQuery(undefined, { skip: !token });
  // Create product mutation
  const [createProduct, { isLoading }] = useCreateProductMutation();

  // Handle form submission
  const handleSubmit = async (values: {
    name: string;
    description: string;
    price: number;
    categoryId: string;
    images: string[];
  }) => {
    const created = await createProduct(values).unwrap();
    router.replace(`/products/${created.slug}`);
  };

  return (
    <ProductForm
      title="Create product"
      categories={categories}
      loadingCategories={isCatLoading}
      categoriesError={isCatError}
      onRetryCategories={() => refetchCats()}
      submitting={isLoading}
      onCancel={() => router.back()}
      onSubmit={handleSubmit}
    />
  );
}
