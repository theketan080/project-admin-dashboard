import Link from "next/link";

export default function ProductTable({
  products,
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-xl bg-white shadow">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50">
            <tr className="border-b">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Image
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Title
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Category
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Price
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Rating
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Stock
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b last:border-b-0 hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/products/${product.id}`}
                  >
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                  </Link>
                </td>

                <td className="px-6 py-4">
                  <Link
                    href={`/products/${product.id}`}
                    className="font-medium text-gray-900 hover:underline"
                  >
                    {product.title}
                  </Link>
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  {product.category}
                </td>

                <td className="px-6 py-4 font-medium text-gray-900">
                  ${product.price}
                </td>

                <td className="px-6 py-4">
                  ⭐ {product.rating}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={
                      product.stock > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {product.stock}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}