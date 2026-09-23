export default function ProductCards({ products }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {products.map((product) => (
        <div
          key={product.id}
          className="rounded-xl bg-white p-5 shadow"
        >
          <div className="flex items-start gap-4">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="h-20 w-20 rounded-lg object-cover"
            />

            <div className="min-w-0 flex-1">
              <h2 className="truncate font-semibold text-gray-900">
                {product.title}
              </h2>

              <p className="mt-1 text-sm capitalize text-gray-500">
                {product.category}
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 border-t pt-4">
            <div>
              <p className="text-xs text-gray-500">Price</p>
              <p className="mt-1 font-semibold text-gray-900">
                ${product.price}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Rating</p>
              <p className="mt-1 font-semibold text-gray-900">
                ⭐ {product.rating}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Stock</p>
              <p className="mt-1 font-semibold text-gray-900">
                {product.stock}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}