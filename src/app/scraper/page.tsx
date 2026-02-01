'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Sparkles, 
  Globe, 
  Zap,
  Shield,
  TrendingUp
} from "lucide-react";
import { AIScrapingInterface } from "@/components/ai-scraping-interface";

export default function AIScraperPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/80 backdrop-blur-xl shadow-lg">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                <Sparkles className="size-6 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/50 to-pink-600/50 rounded-xl blur-lg scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              EncargosYa AI Scraper
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/tiendas">
              <Button variant="outline" className="hover:bg-purple-50">
                <Globe className="size-4 mr-2" />
                Tiendas
              </Button>
            </Link>
            <Link href="/calculadora">
              <Button variant="outline" className="hover:bg-blue-50">
                <Zap className="size-4 mr-2" />
                Calculadora
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Back Button */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </div>

        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mb-6 animate-pulse">
            <Sparkles className="size-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Buscador AI-Powered Universal
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Extrae información de productos de <span className="font-bold text-purple-600">cualquier sitio web</span> usando inteligencia artificial. 
            Solo ingresa la URL y nuestra IA hará el resto.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: <Globe className="size-8 text-blue-500" />,
              title: "Compatible con Todo",
              description: "Funciona con cualquier sitio web: Amazon, eBay, tiendas locales, blogs, etc."
            },
            {
              icon: <Shield className="size-8 text-green-500" />,
              title: "Datos Estructurados",
              description: "Extrae automáticamente nombre, precio, descripción, imágenes y más"
            },
            {
              icon: <TrendingUp className="size-8 text-purple-500" />,
              title: "Precisión AI",
              description: "Nuestra IA entiende el contexto y extrae información relevante con alta precisión"
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white/70 backdrop-blur rounded-2xl p-6 text-center border border-white/20 hover:shadow-xl transition-all duration-300 group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-purple-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* AI Scraping Interface */}
        <div className="bg-white/80 backdrop-blur rounded-3xl p-8 border border-white/30 shadow-2xl">
          <AIScrapingInterface 
            onProductScraped={(product) => {
              console.log('Product scraped:', product);
              // The interface already handles navigation to order page
            }} 
          />
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
          <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            💡 Cómo usar el Buscador AI
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Encuentra el Producto",
                description: "Busca cualquier producto en internet y copia la URL completa"
              },
              {
                step: "2",
                title: "Pégala aquí",
                description: "Ingresa la URL en el campo de arriba y haz clic en 'Extraer Datos'"
              },
              {
                step: "3",
                title: "Crea tu Pedido",
                description: "Nuestra IA extraerá la información y podrás crear tu pedido directamente"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6 text-lg">
            ¿Prefieres explorar tiendas específicas?
          </p>
          <Link href="/tiendas">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <Globe className="size-5 mr-3" />
              Explorar Tiendas
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}