import { MarketplaceView } from "@/src/features/stores/marketplace-view";


export default function StoreMarketplacePage({ params }: { params: { store?: string } }) {
  console.log('Store parameter:', params?.store);
  
  const validStores = ['temu', 'shein', 'amazon'];
  const storeParam = params?.store;
  
  // Handle case where store param is missing
  if (!storeParam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Tienda no especificada</h1>
          <p className="text-gray-600 mb-6">Por favor selecciona una tienda válida.</p>
          <a 
            href="/tiendas" 
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Ver tiendas disponibles
          </a>
        </div>
      </div>
    );
  }
  
  const store = storeParam.toLowerCase() as 'temu' | 'shein' | 'amazon';
  
  if (!validStores.includes(store)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Tienda no encontrada</h1>
          <p className="text-gray-600 mb-6">La tienda que buscas no está disponible.</p>
          <a 
            href="/tiendas" 
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Ver tiendas disponibles
          </a>
        </div>
      </div>
    );
  }

  return <MarketplaceView store={store} />;
}