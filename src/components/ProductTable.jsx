export default function ProductTable({ products }) {
  return (
    <div className="mt-8 overflow-hidden rounded-xl bg-white shadow">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                Image
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                Title
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                Category
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                Price
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                Rating
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                Stock
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                </td>

                <td className="px-6 py-4 font-medium text-gray-900">
                  {product.title}
                </td>

                <td className="px-6 py-4 capitalize text-gray-600">
                  {product.category}
                </td>

                <td className="px-6 py-4 text-gray-700">
                  ${product.price}
                </td>

                <td className="px-6 py-4 text-gray-700">
                  ⭐ {product.rating}
                </td>

                <td className="px-6 py-4 text-gray-700">
                  {product.stock}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}