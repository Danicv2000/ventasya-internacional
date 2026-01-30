"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  Shield,
  Clock,
  DollarSign,
  Globe,
  CheckCircle,
  Settings,
  Sparkles,
  TrendingUp,
  Zap,
  Star,
  ArrowRight,
  Heart,
  ShoppingBag
} from "lucide-react"
import { useEffect, useState } from "react"
import { TemuIcon, SheinIcon, AmazonIcon } from '@/components/platform-icons'

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setIsVisible(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            transition: 'all 0.3s ease-out'
          }}
        />
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-r from-pink-400/20 to-yellow-400/20 rounded-full blur-3xl animate-bounce" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-bounce" style={{ animationDelay: "2s" }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/80 backdrop-blur-xl shadow-lg">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                <Package className="size-6 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/50 to-purple-600/50 rounded-xl blur-lg scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EncargosYa
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#servicios" className="text-gray-700 hover:text-blue-600 transition-colors relative group font-medium">
              Servicios
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link href="#como-funciona" className="text-gray-700 hover:text-blue-600 transition-colors relative group font-medium">
              Cómo Funciona
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link href="#tiendas" className="text-gray-700 hover:text-blue-600 transition-colors relative group font-medium">
              Tiendas
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link href="/calculadora">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <Sparkles className="size-4 mr-2" />
                Calculadora
              </Button>
            </Link>
            <Link href="/admin" title="Panel de Administración">
              <Button variant="ghost" size="icon" className="hover:bg-blue-50 rounded-xl transition-colors">
                <Settings className="size-5" />
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className={`container mx-auto max-w-7xl relative z-10 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="text-center space-y-12">
            <div className="space-y-6">
              <Badge className="mb-6 px-6 py-3 text-lg font-semibold bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-2 border-blue-200 animate-bounce shadow-lg">
                <Sparkles className="size-5 mr-2 inline animate-pulse" />
                🚀 Servicio de Compras Internacionales
              </Badge>

              <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-balance leading-tight">
                Compramos por ti en{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse inline-block">
                  Temu, Shein y Amazon
                </span>
              </h1>

              <p className="text-2xl md:text-3xl text-gray-600 max-w-4xl mx-auto text-pretty leading-relaxed">
                Accede a <span className="font-bold text-blue-600">miles de productos</span> internacionales con envío directo a Cuba.
                <span className="block mt-4 text-purple-600 font-bold text-3xl animate-pulse">
                  ⚡ Calculamos todo por ti: precio, comisión y envío ⚡
                </span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Link href="/tiendas">
                <Button size="lg" className="w-full sm:w-auto text-xl px-12 py-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 group">
                  <ShoppingBag className="size-6 mr-3 group-hover:rotate-12 transition-transform animate-pulse" />
                  🛍️ Buscar Productos
                  <ArrowRight className="size-6 ml-3 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
              <Link href="/scraper">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-xl px-12 py-6 border-3 border-purple-300 hover:bg-purple-50 hover:border-purple-500 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-white/80 backdrop-blur">
                  <Sparkles className="size-6 mr-3 group-hover:rotate-12 transition-transform text-purple-600" />
                  🤖 Buscador AI
                </Button>
              </Link>
              <Link href="/calculadora">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-xl px-12 py-6 border-3 border-blue-300 hover:bg-blue-50 hover:border-blue-500 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-white/80 backdrop-blur">
                  <Zap className="size-6 mr-3 group-hover:rotate-12 transition-transform" />
                  🧮 Calculadora
                </Button>
              </Link>
              <Link href="#como-funciona">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-xl px-12 py-6 border-3 border-blue-300 hover:bg-blue-50 hover:border-blue-500 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-white/80 backdrop-blur">
                  <Heart className="size-6 mr-3 text-red-500 animate-pulse" />
                  Ver Cómo Funciona
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-12 pt-12 text-lg">
              <div className="flex items-center gap-3 bg-white/80 backdrop-blur rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <CheckCircle className="size-6 text-green-500 animate-pulse" />
                <span className="font-semibold text-gray-700">🔒 Pago Seguro</span>
              </div>
              <div className="flex items-center gap-3 bg-white/80 backdrop-blur rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <TrendingUp className="size-6 text-blue-500 animate-pulse" />
                <span className="font-semibold text-gray-700">💎 Precios Transparentes</span>
              </div>
              <div className="flex items-center gap-3 bg-white/80 backdrop-blur rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <Sparkles className="size-6 text-purple-500 animate-pulse" />
                <span className="font-semibold text-gray-700">📱 Seguimiento 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="servicios" className="py-32 px-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center space-y-8 mb-20">
            <Badge className="mb-4 px-6 py-3 text-lg bg-gradient-to-r from-green-100 to-blue-100 text-green-700 border-2 border-green-200 animate-bounce">
              <Star className="size-5 mr-2 animate-pulse" />
              ✨ Beneficios Increíbles
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold text-balance bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-2xl text-gray-600 text-pretty max-w-3xl mx-auto">
              Hacemos que comprar internacionalmente sea <span className="font-bold text-blue-600">fácil, seguro y sin complicaciones</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "🛡️ Compra Segura",
                description: "Realizamos la compra por ti con total seguridad y verificamos cada producto antes de enviarlo.",
                gradient: "from-blue-100 to-blue-200",
                iconColor: "text-blue-600",
                delay: "0ms",
              },
              {
                icon: DollarSign,
                title: "💰 Precios Transparentes",
                description: "Calculadora automática que incluye precio del producto, comisión, tasa de cambio y envío.",
                gradient: "from-green-100 to-green-200",
                iconColor: "text-green-600",
                delay: "100ms",
              },
              {
                icon: Clock,
                title: "⏰ Seguimiento en Tiempo Real",
                description: "Consulta el estado de tu pedido en cualquier momento desde nuestra plataforma.",
                gradient: "from-purple-100 to-purple-200",
                iconColor: "text-purple-600",
                delay: "200ms",
              },
              {
                icon: Globe,
                title: "🌍 Envío a Toda Cuba",
                description: "Entregamos tu pedido directamente en tu ciudad sin complicaciones.",
                gradient: "from-orange-100 to-orange-200",
                iconColor: "text-orange-600",
                delay: "300ms",
              },
              {
                icon: Package,
                title: "📦 Múltiples Productos",
                description: "Puedes hacer varios pedidos de diferentes tiendas en un solo envío.",
                gradient: "from-pink-100 to-pink-200",
                iconColor: "text-pink-600",
                delay: "400ms",
              },
              {
                icon: CheckCircle,
                title: "✅ Sin Mínimos",
                description: "Realiza pedidos desde cualquier monto, no tenemos orden mínima de compra.",
                gradient: "from-indigo-100 to-indigo-200",
                iconColor: "text-indigo-600",
                delay: "500ms",
              },
            ].map((feature, i) => (
              <Card key={i} className={`p-8 space-y-6 group hover:shadow-2xl hover:scale-110 hover:-translate-y-4 transition-all duration-500 border-3 hover:border-blue-300 cursor-pointer bg-gradient-to-br ${feature.gradient} backdrop-blur`} style={{ animationDelay: feature.delay }}>
                <div className="w-20 h-20 rounded-2xl bg-white/80 flex items-center justify-center group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                  <feature.icon className={`size-10 ${feature.iconColor} group-hover:animate-pulse`} />
                </div>
                <h3 className="text-2xl font-bold group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="como-funciona" className="py-32 px-4 relative overflow-hidden bg-gradient-to-br from-white to-blue-50">
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center space-y-8 mb-20">
            <Badge className="mb-4 px-6 py-3 text-lg bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-2 border-purple-200 animate-bounce">
              <TrendingUp className="size-5 mr-2 animate-pulse" />
              🚀 Proceso Súper Fácil
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold text-balance bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Cómo Funciona
            </h2>
            <p className="text-2xl text-gray-600 text-pretty">Solo <span className="font-bold text-purple-600">4 pasos simples</span> para recibir tu pedido</p>
          </div>

          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 opacity-30 rounded-full" />

            <div className="grid md:grid-cols-4 gap-12 relative">
              {[
                {
                  num: "1",
                  title: "🔍 Elige tu Producto",
                  description: "Busca en Temu, Shein o Amazon y copia el enlace del producto que deseas",
                  emoji: "🛍️",
                  gradient: "from-blue-400 to-purple-500",
                },
                {
                  num: "2",
                  title: "📝 Envíanos el Enlace",
                  description: "Completa el formulario con el enlace del producto y tus datos de contacto",
                  emoji: "📲",
                  gradient: "from-purple-400 to-pink-500",
                },
                {
                  num: "3",
                  title: "💰 Te Enviamos el Precio",
                  description: "Calculamos y te enviamos el precio final por WhatsApp para tu aprobación",
                  emoji: "💸",
                  gradient: "from-pink-400 to-red-500",
                },
                {
                  num: "4",
                  title: "✅ Realizamos tu Compra",
                  description: "Una vez apruebes, compramos y enviamos el producto a tu dirección",
                  emoji: "🎉",
                  gradient: "from-green-400 to-blue-500",
                },
              ].map((step, i) => (
                <div key={i} className="text-center space-y-6 group">
                  <div className="relative mx-auto w-fit">
                    <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${step.gradient} text-white flex items-center justify-center text-4xl font-bold mx-auto shadow-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 relative z-10`}>
                      {step.num}
                    </div>
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} blur-2xl scale-150 opacity-0 group-hover:opacity-70 transition-opacity duration-500`} />

                    {/* Emoji badge */}
                    <div className="absolute -top-4 -right-4 text-4xl animate-bounce bg-white rounded-full p-2 shadow-lg" style={{ animationDelay: `${i * 200}ms` }}>
                      {step.emoji}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold group-hover:text-purple-600 transition-colors">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stores Section */}
      <section id="tiendas" className="py-32 px-4 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center space-y-8 mb-20">
            <Badge className="mb-4 px-6 py-3 text-lg bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border-2 border-orange-200 animate-bounce">
              <Globe className="size-5 mr-2 animate-pulse" />
              🌟 Tiendas Premium
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold text-balance bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Tiendas Disponibles
            </h2>
            <p className="text-2xl text-gray-600 text-pretty">
              Compramos en las <span className="font-bold text-orange-600">mejores tiendas internacionales</span>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                name: "TEMU",
                description: "Miles de productos con precios increíbles y envío rápido",
                gradient: "from-orange-400 to-red-500",
                bgGradient: "from-orange-50 to-red-50",
                icon: <TemuIcon className="w-32 h-20 md:w-40 md:h-24" />,
              },
              {
                name: "SHEIN",
                description: "Moda moderna y accesorios con las últimas tendencias",
                gradient: "from-pink-400 to-purple-500",
                bgGradient: "from-pink-50 to-purple-50",
                icon: <SheinIcon className="w-32 h-20 md:w-40 md:h-24" />,
              },
              {
                name: "AMAZON",
                description: "La mayor selección de productos de todas las categorías",
                gradient: "from-blue-400 to-cyan-500",
                bgGradient: "from-blue-50 to-cyan-50",
                icon: <AmazonIcon className="w-32 h-20 md:w-40 md:h-24" />,
              },
            ].map((store, i) => (
              <Card key={i} className={`p-12 text-center space-y-6 group hover:shadow-3xl hover:scale-110 hover:-translate-y-6 transition-all duration-500 cursor-pointer relative overflow-hidden bg-gradient-to-br ${store.bgGradient} border-3 hover:border-opacity-50`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${store.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

                <div className="relative z-10">
                  <div className="mb-6 flex justify-center">
                    <div className="animate-bounce transform transition-transform duration-300 group-hover:scale-110">
                      {store.icon}
                    </div>
                  </div>
                  <p className="text-gray-600 mt-6 leading-relaxed text-xl">{store.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4 overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-pink-600/90" />

        <div className="container mx-auto max-w-5xl text-center space-y-12 relative z-10">
          <div className="animate-bounce">
            <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <Sparkles className="size-12 text-white animate-pulse" />
            </div>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-balance text-white leading-tight">
            ¿Listo para hacer tu <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">primer pedido?</span>
          </h2>
          <p className="text-2xl md:text-3xl text-white/90 text-pretty max-w-3xl mx-auto leading-relaxed">
            Comienza ahora y recibe tus productos favoritos en casa en <span className="font-bold text-yellow-300">tiempo récord</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Link href="/tiendas">
              <Button size="lg" className="w-full sm:w-auto text-2xl px-12 py-6 bg-white text-gray-800 hover:bg-gray-100 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 group">
                <ShoppingBag className="size-6 mr-3 group-hover:rotate-12 transition-transform text-blue-600" />
                🛍️ Explorar Tiendas
                <ArrowRight className="size-6 ml-3 group-hover:translate-x-2 transition-transform text-blue-600" />
              </Button>
            </Link>
            <Link href="/scraper">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-2xl px-12 py-6 border-3 border-white hover:bg-white/20 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-white">
                <Sparkles className="size-6 mr-3 group-hover:rotate-12 transition-transform" />
                🤖 Buscador AI
              </Button>
            </Link>
            <Link href="/calculadora">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-2xl px-12 py-6 border-3 border-white hover:bg-white/20 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-white">
                <Zap className="size-6 mr-3 group-hover:rotate-12 transition-transform" />
                🧮 Calculadora
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Package className="size-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">EncargosYa</span>
              </div>
              <p className="text-gray-600 text-lg">
                Tu servicio confiable de compras internacionales en Cuba 🇨🇺
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="font-bold text-xl text-gray-800">🔗 Enlaces</h3>
              <nav className="flex flex-col gap-3 text-gray-600">
                <Link href="#servicios" className="hover:text-blue-600 transition-colors text-lg hover:translate-x-2 transform duration-200">
                  ✨ Servicios
                </Link>
                <Link href="#como-funciona" className="hover:text-blue-600 transition-colors text-lg hover:translate-x-2 transform duration-200">
                  🚀 Cómo Funciona
                </Link>
                <Link href="#tiendas" className="hover:text-blue-600 transition-colors text-lg hover:translate-x-2 transform duration-200">
                  🛍️ Tiendas
                </Link>
                <Link href="/admin" className="hover:text-blue-600 transition-colors text-lg hover:translate-x-2 transform duration-200">
                  ⚙️ Administración
                </Link>
              </nav>
            </div>

            <div className="space-y-6">
              <h3 className="font-bold text-xl text-gray-800">📞 Contacto</h3>
              <div className="text-gray-600 space-y-3 text-lg">
                <p className="flex items-center gap-2">
                  <span>📧</span> info@encargosya.com
                </p>
                <p className="flex items-center gap-2">
                  <span>📱</span> +57 300 123 4567
                </p>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t text-center text-gray-600">
            <p className="text-lg">2024 EncargosYa. Todos los derechos reservados. Hecho con ❤️ en Cuba</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
