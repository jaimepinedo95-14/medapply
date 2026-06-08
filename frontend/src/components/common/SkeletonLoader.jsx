// Componentes de skeleton loader reutilizables

function Shimmer({ className = "" }) {
  return (
    <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg ${className}`} />
  );
}

// Skeleton para una tarjeta de oferta de empleo
export function SkeletonOferta() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Shimmer className="w-12 h-12 rounded-xl flex-shrink-0" />
          <div className="space-y-2">
            <Shimmer className="h-4 w-40" />
            <Shimmer className="h-3 w-28" />
          </div>
        </div>
        <Shimmer className="h-6 w-20 rounded-full" />
      </div>
      <div className="space-y-2 mb-4">
        <Shimmer className="h-3 w-full" />
        <Shimmer className="h-3 w-5/6" />
      </div>
      <div className="flex gap-2">
        <Shimmer className="h-6 w-16 rounded-full" />
        <Shimmer className="h-6 w-20 rounded-full" />
        <Shimmer className="h-6 w-14 rounded-full" />
      </div>
    </div>
  );
}

// Skeleton para una fila de candidato en el banco
export function SkeletonCandidato() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm">
      <Shimmer className="w-12 h-12 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Shimmer className="h-4 w-36" />
        <Shimmer className="h-3 w-24" />
      </div>
      <div className="hidden sm:flex gap-2">
        <Shimmer className="h-6 w-16 rounded-full" />
        <Shimmer className="h-6 w-16 rounded-full" />
      </div>
      <Shimmer className="h-8 w-24 rounded-xl" />
    </div>
  );
}

// Skeleton para una tarjeta de empresa
export function SkeletonEmpresa() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <Shimmer className="w-14 h-14 rounded-xl flex-shrink-0" />
        <div className="space-y-2 flex-1">
          <Shimmer className="h-4 w-32" />
          <Shimmer className="h-3 w-20" />
        </div>
      </div>
      <Shimmer className="h-3 w-full mb-1.5" />
      <Shimmer className="h-3 w-4/5 mb-4" />
      <div className="flex justify-between items-center">
        <Shimmer className="h-6 w-24 rounded-full" />
        <Shimmer className="h-8 w-28 rounded-xl" />
      </div>
    </div>
  );
}

// Skeleton para estadísticas / tarjeta de stats del dashboard
export function SkeletonStat() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <Shimmer className="h-3 w-24" />
        <Shimmer className="w-9 h-9 rounded-xl" />
      </div>
      <Shimmer className="h-8 w-20 mb-2" />
      <Shimmer className="h-3 w-28" />
    </div>
  );
}

// Lista genérica de N skeletons de oferta
export function SkeletonListaOfertas({ cantidad = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: cantidad }).map((_, i) => (
        <SkeletonOferta key={i} />
      ))}
    </div>
  );
}

// Lista genérica de N skeletons de candidato
export function SkeletonListaCandidatos({ cantidad = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: cantidad }).map((_, i) => (
        <SkeletonCandidato key={i} />
      ))}
    </div>
  );
}
