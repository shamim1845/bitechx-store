import { api } from "../utils/api";
import {
  Product,
  CreateProductInput,
  UpdateProductInput,
  Category,
} from "@/types";

export const productsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<
      Product[],
      { offset?: number; limit?: number; categoryId?: string }
    >({
      query: ({ offset, limit, categoryId } = {}) => {
        const params = new URLSearchParams();
        if (offset !== undefined) params.set("offset", String(offset));
        if (limit !== undefined) params.set("limit", String(limit));
        if (categoryId) params.set("categoryId", categoryId);
        const qs = params.toString();
        return { url: `/products${qs ? `?${qs}` : ""}` };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((product) => ({
                type: "Product" as const,
                id: product.id,
              })),
              { type: "Products" as const, id: "LIST" },
            ]
          : [{ type: "Products" as const, id: "LIST" }],
    }),
    searchProducts: build.query<Product[], { searchedText: string }>({
      query: ({ searchedText }) => ({
        url: `/products/search?searchedText=${encodeURIComponent(
          searchedText
        )}`,
      }),
      providesTags: [{ type: "Products", id: "SEARCH" }],
    }),
    getProductBySlug: build.query<Product, string>({
      query: (slug) => ({ url: `/products/${slug}` }),
      providesTags: (_res, _err, slug) => [{ type: "Product", id: slug }],
    }),
    createProduct: build.mutation<Product, CreateProductInput>({
      query: (body) => ({ url: "/products/", method: "POST", body }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),
    updateProduct: build.mutation<
      Product,
      { id: string; data: UpdateProductInput }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Product", id: arg.id },
        { type: "Products", id: "LIST" },
      ],
    }),
    deleteProduct: build.mutation<{ id: string }, string>({
      query: (id) => ({ url: `/products/${id}`, method: "DELETE" }),

      // Instead of invalidation (since deletion is simulated), optimistically filter caches
      async onQueryStarted(id, { dispatch, getState, queryFulfilled }) {
        // Helper: update all cached getProducts queries
        const apiState = (getState() as any)[api.reducerPath];
        const patches: Array<() => void> = [];

        if (apiState && apiState.queries) {
          for (const key of Object.keys(apiState.queries)) {
            if (key.startsWith("getProducts(")) {
              const argJson = key.slice("getProducts(".length, -1);
              try {
                const arg = argJson ? JSON.parse(argJson) : undefined;
                const patch = dispatch(
                  productsApi.util.updateQueryData(
                    "getProducts",
                    arg,
                    (draft) => {
                      return draft.filter((p) => p.id !== id);
                    }
                  )
                );
                patches.push(patch.undo);
              } catch {}
            }
            if (key.startsWith("searchProducts(")) {
              const argJson = key.slice("searchProducts(".length, -1);
              try {
                const arg = argJson ? JSON.parse(argJson) : undefined;
                const patch = dispatch(
                  productsApi.util.updateQueryData(
                    "searchProducts",
                    arg,
                    (draft) => {
                      return draft.filter((p) => p.id !== id);
                    }
                  )
                );
                patches.push(patch.undo);
              } catch {}
            }
          }
        }

        try {
          await queryFulfilled;
        } catch {
          // Revert optimistic updates on error
          patches.forEach((undo) => undo());
        }
      },
    }),
    getCategories: build.query<
      Category[],
      { offset?: number; limit?: number } | void
    >({
      query: (args) => {
        const params = new URLSearchParams();
        if (args?.offset !== undefined)
          params.set("offset", String(args.offset));
        if (args?.limit !== undefined) params.set("limit", String(args.limit));
        const qs = params.toString();
        return { url: `/categories${qs ? `?${qs}` : ""}` };
      },
      providesTags: [{ type: "Categories", id: "LIST" }],
    }),
    searchCategories: build.query<Category[], { searchedText: string }>({
      query: ({ searchedText }) => ({
        url: `/categories/search?searchedText=${encodeURIComponent(
          searchedText
        )}`,
      }),
      providesTags: [{ type: "Categories", id: "SEARCH" }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useSearchProductsQuery,
  useGetProductBySlugQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetCategoriesQuery,
  useSearchCategoriesQuery,
} = productsApi;
