import { useMemo, useState } from "react";
import { VehicleDetailsDialog } from "./VehicleDetailsDialog.tsx";
import { useFavorites } from "./FavoritesContext.tsx";
import { useAuth } from "../auth/AuthContext";
import { Gauge, Calendar, Heart, ShoppingCart, Eye } from "lucide-react";

interface VehicleCardProps {
  vehiculo: any; // ahora puede traer vehiculo.imagenUrl
  isComparing: boolean;
  onToggleCompare: () => void;
  canAddToCompare: boolean;
  viewMode: "grid" | "list";
  onStartSale?: (vehicle: any) => void;
}

export function VehicleCard({
  vehiculo,
  isComparing,
  onToggleCompare,
  canAddToCompare,
  viewMode,
  onStartSale,
}: VehicleCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useAuth();

  // ✅ Si por alguna razón llega vehiculo undefined/null, no renderiza y evita crash
  if (!vehiculo) return null;

  const vehiculoId = vehiculo?.id;

  // ✅ Solo calculamos favorito si hay id
  const favorito = useMemo(() => {
    if (!vehiculoId) return false;
    try {
      return !!isFavorite(vehiculoId);
    } catch {
      return false;
    }
  }, [vehiculoId, isFavorite]);

  const infoVersion = vehiculo?.version;
  const infoModelo = infoVersion?.modelo;
  const infoMarca = infoModelo?.marca;

  const precioFinal = Number(vehiculo?.precio_final ?? 0);

  // ✅ URL de imagen que viene desde /galeria (la agregamos en HomePage como imagenUrl)
  const imagenUrl: string | null = vehiculo?.imagenUrl ?? null;

  const handleToggleFavorite = () => {
    if (!vehiculoId) return; // evita crash si no hay id
    toggleFavorite(vehiculoId);
  };

  // --- VISTA LIST ---
  if (viewMode === "list") {
    return (
      <>
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow border-2 border-slate-200">
          <div className="flex flex-col md:flex-row">
            <div className="relative overflow-hidden md:w-80 aspect-video md:aspect-auto bg-slate-200">
              {/* ✅ Imagen */}
              {imagenUrl ? (
                <img
                  src={imagenUrl}
                  alt="vehiculo"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : null}

              <button
                onClick={handleToggleFavorite}
                type="button"
                className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                aria-label="Agregar a favoritos"
              >
                <Heart
                  className={`w-5 h-5 ${
                    favorito ? "fill-red-600 text-red-600" : "text-slate-600"
                  }`}
                />
              </button>
            </div>

            <div className="flex-1 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    {infoMarca?.logo_url ? (
                      <img
                        src={infoMarca.logo_url}
                        className="w-8 h-8 object-contain"
                        alt="brand-logo"
                        onError={(e) => {
                          // si falla el logo, lo ocultamos
                          (e.currentTarget as HTMLImageElement).style.display =
                            "none";
                        }}
                      />
                    ) : null}

                    <h3 className="text-2xl font-bold text-slate-900">
                      {(infoMarca?.nombre ?? "Marca")}{" "}
                      {(infoModelo?.nombre ?? "Modelo")}
                    </h3>
                  </div>

                  <p className="text-3xl font-bold text-red-600">
                    ${precioFinal.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-red-600" />
                  <span className="font-medium">
                    {infoVersion?.anio ?? "—"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-red-600" />
                  <span className="font-medium truncate">
                    {infoVersion?.motor ?? "—"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap pt-4">
                <button
                  type="button"
                  className="px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 font-medium transition-colors flex items-center gap-2"
                  onClick={() => setDialogOpen(true)}
                >
                  <Eye className="w-4 h-4" /> Ver Detalles
                </button>

                {canAddToCompare && (
                  <button
                    type="button"
                    onClick={onToggleCompare}
                    className={`px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
                      isComparing
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "border-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                    }`}
                  >
                    {isComparing ? "Comparando" : "Comparar"}
                  </button>
                )}

                <button
                  type="button"
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-md font-medium shadow-lg transition-all"
                >
                  Contactar
                </button>

                {user?.rol === "cliente" && typeof onStartSale === "function" && (
                  <button
                    type="button"
                    onClick={() => onStartSale(vehiculo)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium shadow-lg transition-all flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" /> Comprar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <VehicleDetailsDialog
          vehiculo={vehiculo}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </>
    );
  }

  // --- VISTA GRID ---
  return (
    <>
      <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group bg-white border border-gray-100">
        {/* ✅ Ahora mostramos imagen si existe */}
        <div className="relative aspect-[4/5] bg-slate-200">
          {imagenUrl ? (
            <img
              src={imagenUrl}
              alt="vehiculo"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              style={{ objectPosition: vehiculo?.imageFocus ?? "50% 50%" }}
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : null}

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* ❤️ Favorito en grid también */}
          <button
            onClick={handleToggleFavorite}
            type="button"
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors z-10"
            aria-label="Agregar a favoritos"
          >
            <Heart
              className={`w-5 h-5 ${
                favorito ? "fill-red-600 text-red-600" : "text-slate-700"
              }`}
            />
          </button>

          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow-lg">
              {infoVersion?.anio ?? "—"}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3 z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {infoMarca?.logo_url ? (
                  <img
                    src={infoMarca.logo_url}
                    className="w-6 h-6 object-contain invert brightness-0"
                    alt="logo"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display =
                        "none";
                    }}
                  />
                ) : null}

                <h3 className="text-xl font-bold text-white leading-tight">
                  {(infoMarca?.nombre ?? "Marca")}{" "}
                  {(infoModelo?.nombre ?? "Modelo")}
                </h3>
              </div>

              <p className="text-2xl font-bold text-red-400">
                ${precioFinal.toLocaleString()}
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDialogOpen(true)}
                className="w-full px-3 py-2 bg-white/95 backdrop-blur-sm hover:bg-white text-slate-900 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md"
              >
                <Eye className="w-3.5 h-3.5" /> Ver Detalles
              </button>

              {canAddToCompare && (
                <button
                  type="button"
                  onClick={onToggleCompare}
                  className={`w-full px-3 py-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md ${
                    isComparing
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-white/95 backdrop-blur-sm hover:bg-white text-blue-700"
                  }`}
                >
                  {isComparing ? "Comparando" : "Comparar"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <VehicleDetailsDialog
        vehiculo={vehiculo}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}