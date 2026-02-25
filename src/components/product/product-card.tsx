export default function ProductCard({ product }: any) {
  return (
    <div className="bg-white shadow rounded-xl p-4">
      <img
        src={product.imageUrl}
        className="h-40 w-full object-cover rounded"
      />

      <h3 className="mt-2 font-semibold">
        {product.name}
      </h3>

      <p className="text-green-600 font-bold">
        Rp {product.price}
      </p>
    </div>
  )
}