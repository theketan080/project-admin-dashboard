import Link from "next/link";

export default function ProductCards({
  products,
}) {
  return (
    <div className="mt-6 space-y-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="rounded-xl bg-white p-4 shadow"
        >
          <Link
            href={`/products/${product.id}`}
          >
            <img
              src={product.thumbnail}
              alt={product.title}
              className="h-48 w-full rounded-lg object-cover"
            />
          </Link>

          <div className="mt-4">
            <Link
              href={`/products/${product.id}`}
              className="text-lg font-semibold text-gray-900 hover:underline"
            >
              {product.title}
            </Link>

            <p className="mt-1 text-sm text-gray-500">
              {product.category}
            </p>

            <div className="mt-3 flex items-center justify-between">
              <span className="font-semibold text-gray-900">
                ${product.price}
              </span>

              <span className="text-sm">
                ⭐ {product.rating}
              </span>
            </div>

            <p
              className={`mt-2 text-sm font-medium ${
                product.stock > 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {product.stock > 0
                ? `${product.stock} in stock`
                : "Out of stock"}
            </p>

            <Link
              href={`/products/${product.id}`}
              className="mt-4 block rounded-lg bg-black px-4 py-2 text-center text-sm font-medium text-white hover:bg-gray-800"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}