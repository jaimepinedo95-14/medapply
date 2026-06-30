// Skeleton de carga para tarjetas de vacante — no usar spinners.
export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gray-200 rounded-xl flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-1/2 mb-3" />
          <div className="flex gap-2">
            <div className="h-5 bg-gray-100 rounded-full w-20" />
            <div className="h-5 bg-gray-100 rounded-full w-20" />
            <div className="h-5 bg-gray-100 rounded-full w-24" />
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
        <div className="h-4 bg-gray-100 rounded w-28" />
        <div className="h-9 bg-gray-200 rounded-xl w-24" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ cantidad = 6 }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {Array.from({ length: cantidad }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
