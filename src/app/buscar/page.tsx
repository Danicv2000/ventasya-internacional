'use client';

import { useState } from 'react';
import { Card } from '@/src/shared/ui/card';
import { UniversalSearchBar } from '@/src/features/common/universal-search-bar';
import { AmazonSearchInterface } from '@/src/features/stores/amazon-search-interface';
import { Badge } from '@/src/shared/ui/badge';
import { Search, TrendingUp, Clock, ShoppingCart } from 'lucide-react';

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState<'search' | 'results'>('search');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string, results: any[]) => {
    setSearchQuery(query);
    setActiveTab(results.length > 0 ? 'results' : 'search');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <Badge className="mb-4 px-6 py-3 text-lg font-semibold bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-2 border-blue-200">
            <Search className="size-5 mr-2 inline animate-pulse" />
            Búsqueda Inteligente
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Encuentra productos en Amazon
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Busca millones de productos en Amazon y haz tu pedido a través de nuestro servicio internacional
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12 flex justify-center">
          <UniversalSearchBar 
            placeholder="¿Qué estás buscando hoy? (ej: bicicletas, laptops, ropa...)"
            onSearch={handleSearch}
            showSuggestions={true}
            autoFocus={true}
          />
        </div>

        {/* Tabs */}
        <Card className="p-6 mb-8">
          <div className="flex flex-wrap gap-4 mb-6 border-b pb-4">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'search' 
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              onClick={() => setActiveTab('search')}
            >
              <Search className="h-5 w-5" />
              Búsqueda
            </button>
            
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'results' 
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              onClick={() => setActiveTab('results')}
            >
              <ShoppingCart className="h-5 w-5" />
              Resultados
            </button>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'search' ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                  <Search className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">Comienza tu búsqueda</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Ingresa lo que estás buscando en el campo superior y encuentra productos de Amazon para comprar internacionalmente.
                </p>
              </div>
            ) : (
              <AmazonSearchInterface initialSearch={searchQuery} />
            )}
          </div>
        </Card>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="p-6 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Búsqueda Inteligente</h3>
            <p className="text-gray-600">
              Encuentra productos exactos en Amazon con nuestro sistema de búsqueda avanzado
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Precios Claros</h3>
            <p className="text-gray-600">
              Visualiza el precio total incluyendo envío internacional y comisiones
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Seguimiento</h3>
            <p className="text-gray-600">
              Sigue tu pedido desde la compra hasta la entrega en Cuba
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}