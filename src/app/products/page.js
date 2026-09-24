import { Suspense } from "react";

import ProductsClient from "./ProductsClient";

function ProductsLoading() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-xl bg-white p-8 text-center shadow">
          <p className="text-gray-600">
            Loading products...
          </p>
        </div>
      </div>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsClient />
    </Suspense>
  );
}