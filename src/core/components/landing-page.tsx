"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/shared/ui/button";
import { Input } from "@/src/shared/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src/shared/ui/select";
import { Card } from "@/src/shared/ui/card";
import {
  Calculator,
  Lock,
  Headset,
  Star,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { useI18n } from "@/src/shared/hooks/use-i18n";
import { useExchangeRate } from "@/src/shared/hooks/use-exchange-rate";
import { Logo } from "./icons/Logo";
import { PeopleGroup } from "./icons/PeopleGroup";
import { Mail } from "./icons/Mail";
import Link from "next/link";
import { VolunteerActivism } from "./icons/VolunteerActivism";
import { PackageFilled } from "./icons/PackageFilled";
import { LocationFilled } from "./icons/LocationFilled";

interface LandingPageProps {
  initialExchangeRates?: any;
}

export default function LandingPage({
  initialExchangeRates,
}: LandingPageProps = {}) {
  return (
    <LandingPageContent initialExchangeRates={initialExchangeRates} />
  );
}

function LandingPageContent({
  initialExchangeRates,
}: LandingPageProps = {}) {
  const { t } = useI18n();
  const [packageWeight, setPackageWeight] = useState(1.0);
  const [itemValue, setItemValue] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash-usd");

  const colors = {
    primary: "#fb7e51",
    "background-light": "#f8f6f5",
    "background-dark": "#23140f",
    "electric-blue": "#e0f2fe",
  };

  // Use exchange rate from API (with fallback to initial data for SSR)
  const { exchangeRate, exchangeRates, loading: tasasLoading, calculateTotalCost } = useExchangeRate({
    fallbackRate: initialExchangeRates?.tasas?.USD || 420
  });

  // Use the shared calculation function from hook
  const calculateTotal = () => {
    const price = parseFloat(itemValue) || 0;
    return calculateTotalCost(price, packageWeight, paymentMethod).toFixed(2);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-[#0d121c] dark:text-white transition-colors duration-300">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-solid border-[#e6ebf4] dark:border-gray-800">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-primary">
              <Logo />
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">VentasYa</h2>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a
              className="text-sm font-semibold hover:text-primary transition-colors"
              href="/commingsoon"
            >
              Calculadora
            </a>
            <a
              className="text-sm font-semibold hover:text-primary transition-colors"
              href="/commingsoon"
            >
              Seguimiento
            </a>
            <a
              className="text-sm font-semibold hover:text-primary transition-colors"
              href="/commingsoon"
            >
              Tiendas
            </a>
            <a
              className="text-sm font-semibold hover:text-primary transition-colors"
              href="/commingsoon"
            >
              Soporte
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" className="px-4 py-2 text-sm font-bold">
                Iniciar Sesión
              </Button>
            </Link>
            <Button className="px-5 py-2 text-sm font-bold bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-primary/20">
              Registrarse
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto">
        {/* Hero Section with Calculator */}
        <section className="flex flex-col lg:flex-row gap-12 px-6 lg:px-10 py-16 lg:py-24 items-center">
          {/* Left: Value Prop */}
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <span className="inline-block py-1 px-3 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-full">
                {t("hero.head")}
              </span>
              <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight">
                {t("hero.title_section_1")}{" "}
                <span className="text-primary">
                  {t("hero.title_section_2")}
                </span>
              </h1>
              <p className="text-lg text-slate-custom dark:text-gray-400 max-w-xl leading-relaxed">
                {t("hero.subtitle")}
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <div className="text-green-500">✓</div>
                {t("common.transparency")}
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <div className="text-green-500">✓</div>
                {t("tracking.title")}
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <div className="text-green-500">✓</div>
                {t("common.security")}
              </div>
            </div>
          </div>

          {/* Right: Interactive Calculator Widget */}
          <div className="w-full lg:w-[460px]">
            <Card className="calculator-card bg-white dark:bg-gray-900 p-8 rounded-xl border border-[#e6ebf4] dark:border-gray-800 shadow-lg">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                {t("calculator.title")}
              </h3>

              <div className="space-y-6">
                {/* Store Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    {t("calculator.store")}
                  </label>
                  <Select onValueChange={setSelectedStore}>
                    <SelectTrigger className="w-full h-12 rounded-lg border-[#ced7e9] dark:border-gray-700 dark:bg-gray-800 text-sm">
                      <SelectValue placeholder="Amazon, Shein, Temu..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="amazon">Amazon</SelectItem>
                      <SelectItem value="shein">Shein</SelectItem>
                      <SelectItem value="temu">Temu</SelectItem>
                      <SelectItem value="ebay">eBay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Package Weight Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                      {t("calculator.weight")}
                    </label>
                    <span className="text-primary font-bold">
                      {packageWeight} lbs
                    </span>
                  </div>

                  <div className="relative flex h-2 w-full items-center">
                    <div className="h-full w-full rounded-full bg-[#ced7e9] dark:bg-gray-800 absolute"></div>
                    <div
                      className="h-full rounded-full bg-primary absolute transition-all duration-100 ease-out"
                      style={{ width: `${(packageWeight / 10) * 100}%` }}
                    ></div>

                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.1"
                      value={packageWeight}
                      onChange={(e) =>
                        setPackageWeight(parseFloat(e.target.value))
                      }
                      className="w-full h-6 absolute appearance-none bg-transparent cursor-pointer z-10 opacity-0"
                      style={{ top: "-8px" }}
                    />

                    <div
                      className="size-5 rounded-full bg-white border-2 border-primary absolute shadow-md pointer-events-none transition-all duration-100 ease-out"
                      style={{
                        left: `${(packageWeight / 10) * 100}%`,
                        transform: "translateX(-50%)",
                      }}
                    ></div>
                  </div>
                </div>

                {/* Item Value Input */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    {t("calculator.value")}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                      $
                    </span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={itemValue}
                      onChange={(e) => setItemValue(e.target.value)}
                      className="w-full h-12 pl-8 rounded-lg border-[#ced7e9] dark:border-gray-700 dark:bg-gray-800 text-sm"
                    />
                  </div>
                </div>

                {/* Payment Method Selector (NUEVO) */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    Método de Pago
                  </label>
                  <Select
                    onValueChange={setPaymentMethod}
                    value={paymentMethod}
                  >
                    <SelectTrigger className="w-full h-12 rounded-lg border-[#ced7e9] dark:border-gray-700 dark:bg-gray-800 text-sm">
                      <SelectValue placeholder="Selecciona..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash-usd">
                        <div className="flex items-center gap-2">
                          <span>Efectivo / USD</span>
                          <span className="text-xs text-green-600 font-normal">
                            (Sin Fee)
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="cash-euro">
                        <div className="flex items-center gap-2">
                          <span>Efectivo / EURO</span>
                          <span className="text-xs text-green-600 font-normal">
                            (Sin Fee)
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="cash-cup">
                        <div className="flex items-center gap-2">
                          <span>Efectivo / CUP</span>
                          <span className="text-xs text-red-500 font-normal">
                            (ElToque)
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="transfer-cup">
                        <div className="flex items-center gap-2">
                          <span>Transferencia / CUP</span>
                          <span className="text-xs text-gray-500 font-normal">
                            (+20% Fee)
                          </span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Result Box */}
                <div className="bg-primary/5 dark:bg-primary/10 p-5 rounded-lg border border-primary/20">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-slate-custom uppercase">
                      {t("calculator.estimated")}
                    </span>
                    <div
                      className="text-primary text-sm"
                      title="Tasa de El Toque del mercado informal"
                    >
                      ℹ
                    </div>
                  </div>
                  <div className="text-3xl font-black text-primary">
                    {paymentMethod.includes("euro") ? "€" : "$"}
                    {calculateTotal()}{" "}
                    <span className="text-sm font-medium text-slate-custom">
                      {paymentMethod.includes("cup")
                        ? "CUP"
                        : paymentMethod.includes("eur")
                        ? "EUR"
                        : "USD"}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-custom mt-2 italic">
                    *{t("calculator.delivery_time")}
                  </p>
                </div>
                {/* Warning Cartel */}
                {/* Solo se muestra si el peso sigue siendo 1.0 (valor inicial) */}
                {packageWeight === 1.0 && (
                  <div className="mt-3 flex items-start gap-2 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 p-3 rounded-lg text-xs border border-amber-200 dark:border-amber-800/50">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p>
                      {t("calculator.warning.section_1")}{" "}
                      <strong>1 libra</strong>.{" "}
                      {t("calculator.warning.section_2")}
                    </p>
                  </div>
                )}

                <Button className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition-all transform active:scale-[0.98] shadow-lg shadow-primary/30">
                  {t("hero.cta")}
                </Button>
              </div>
            </Card>
          </div>
        </section>

        {/* Trust Bar / Partners */}
        <section className="px-6 lg:px-10 py-12 border-y border-[#e6ebf4] dark:border-gray-800">
          <p className="text-center text-xs font-bold text-slate-custom uppercase tracking-[0.2em] mb-8">
            {t("stores.title")}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-2xl font-black">AMAZON</span>
            <span className="text-2xl font-black italic">SHEIN</span>
            <span className="text-2xl font-black">TEMU</span>
          </div>
        </section>

        {/* Security & Tracking Section */}
        <section className="px-6 lg:px-10 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div
                className="bg-gray-200 dark:bg-gray-800 rounded-2xl aspect-video overflow-hidden shadow-2xl relative"
                data-location="Miami to Havana route map"
                style={{}}
              >
                <img
                  alt="Global tracking map"
                  className="w-full h-full object-cover opacity-60 dark:opacity-40"
                  data-alt="Satellite map showing delivery route from USA to Cuba"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBdVIZ2FMi97kyfpKLUJx_Wh1Vijmzjlg3gmOxGdbbn-s-zQCr0IMfLhM7boGjvjdwlsRdrkrRavFYaolp_Mg_Tr73HT_6_U-VDtcRwnd6pwyQPw7rjEk1B-dBpcJC-TTpl9fmPrrHNwmbYFDMlEQSjEz7hgYeURl4RzK42bxKMVJONpXi9mbefxINDeT19CQ2T0qifMfzy9-Dd9wCaILM4FjgAEyk5jNGBVJz4fFzMqWTB0QY6pbNpxCCC9i6QNfzIDK0pPm4oA4"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-light dark:from-background-dark via-transparent to-transparent"></div>
                {/* Mock Tracking Widget */}
                <div className="absolute top-6 right-6 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-xl border border-primary/20 w-64 animate-pulse">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="size-3 rounded-full bg-green-500"></div>
                    <div className="text-sm font-bold">
                      {t("tracking.in_transit")}
                    </div>
                  </div>
                  <div className="text-xs text-slate-custom mb-2">
                    Pedido #VENTASYA-001
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-custom mt-2">
                    <span>USA</span>
                    <span>Cuba</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[70%]"></div>
                </div>
              </div>
              {/*Decorative Elements*/}
              <div className="absolute -bottom-6 -left-6 bg-primary size-24 rounded-2xl -z-10 opacity-20"></div>
            </div>

            {/* Feature Cards */}
            <div className="space-y-8">
              <h2 className="text-4xl font-black">
                {t("tracking.title")}{" "}
                <span className="text-primary">{t("tracking.24_7")}</span>
              </h2>
              <p className="text-slate-custom dark:text-gray-400 leading-relaxed">
                {t("tracking.description")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-5 rounded-xl border border-[#e6ebf4] dark:border-gray-800 bg-white/50 dark:bg-gray-900/50">
                  <div className="size-12 flex items-center justify-center text-primary">
                    <ShieldCheck className="h-10 w-10" />
                  </div>
                  <h4 className="font-bold mb-1">Seguro de Carga</h4>
                  <p className="text-xs text-slate-custom">
                    Protección total contra daños o pérdidas durante el
                    trayecto.
                  </p>
                </div>
                <div className="p-5 rounded-xl border border-[#e6ebf4] dark:border-gray-800 bg-white/50 dark:bg-gray-900/50">
                  <div className="size-12 flex items-center justify-center text-primary">
                    <Lock className="h-10 w-10" />
                  </div>
                  <h4 className="font-bold mb-1">Pagos Seguros</h4>
                  <div className="flex gap-2 mt-2 opacity-70"></div>
                  <p className="text-xs text-slate-custom mt-2">
                    Aceptamos tarjetas y efectivo en distintas monedas.
                  </p>
                </div>
                <div className="p-5 rounded-xl border border-[#e6ebf4] dark:border-gray-800 bg-white/50 dark:bg-gray-900/50">
                  <div className="size-12 flex items-center justify-center text-primary">
                    <Headset className="h-10 w-10" />
                  </div>
                  <h4 className="font-bold mb-1">Soporte</h4>
                  <div className="flex gap-2 mt-2 opacity-70"></div>
                  <p className="text-xs text-slate-custom mt-2">
                    Brindamos soporte tecnico y asesorias 24h.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/*<!-- Stats Section -->*/}
        <section className="px-6 py-12 max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 bg-white dark:bg-surface-dark shadow-sm">
              <div className="flex items-center gap-3 mb-2 text-primary">
                <span className="material-symbols-outlined text-3xl">
                  <VolunteerActivism />
                </span>
                <p className="text-slate-500 dark:text-slate-400 text-base font-semibold">
                  Familias felices
                </p>
              </div>
              <div className="flex items-end gap-3">
                <p className="text-4xl font-extrabold tracking-tight">
                  10,000+
                </p>
                <p className="text-green-600 text-sm font-bold pb-1">
                  +12% este mes
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 bg-white dark:bg-surface-dark shadow-sm">
              <div className="flex items-center gap-3 mb-2 text-primary">
                <span className="material-symbols-outlined text-3xl">
                  <PackageFilled />
                </span>
                <p className="text-slate-500 dark:text-slate-400 text-base font-semibold">
                  Entregas exitosas
                </p>
              </div>
              <div className="flex items-end gap-3">
                <p className="text-4xl font-extrabold tracking-tight">25k+</p>
                <p className="text-green-600 text-sm font-bold pb-1">
                  +18% este mes
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 bg-white dark:bg-surface-dark shadow-sm">
              <div className="flex items-center gap-3 mb-2 text-primary">
                <span className="material-symbols-outlined text-3xl">
                  <LocationFilled />
                </span>
                <p className="text-slate-500 dark:text-slate-400 text-base font-semibold">
                  Provincias cubiertas
                </p>
              </div>
              <div className="flex items-end gap-3">
                <p className="text-4xl font-extrabold tracking-tight">1</p>
                <p className="text-slate-500 text-sm font-bold pb-1">
                  Santiago de Cuba
                </p>
              </div>
            </div>
          </div>
        </section>

        {/*<!-- Collection Header & Tabs -->*/}
        <section className="px-6 pt-12 max-w-[1280px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-1">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight mb-2">
                Colecciones destacadas
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                Lo más pedido esta semana en Cuba
              </p>
            </div>
            <div className="flex gap-8 overflow-x-auto no-scrollbar">
              <a
                className="flex flex-col items-center justify-center border-b-[3px] border-b-primary text-primary pb-3 transition-colors"
                href="#"
              >
                <p className="text-sm font-bold whitespace-nowrap">
                  Tendencias Shein
                </p>
              </a>
              <a
                className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 pb-3 transition-colors"
                href="#"
              >
                <p className="text-sm font-bold whitespace-nowrap">
                  Lo mejor de Amazon
                </p>
              </a>
              <a
                className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 pb-3 transition-colors"
                href="#"
              >
                <p className="text-sm font-bold whitespace-nowrap">
                  Electrónica
                </p>
              </a>
            </div>
          </div>
          {/* Collection Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10">
            <div className="group cursor-pointer">
              <div className="aspect-square rounded-2xl overflow-hidden mb-3 bg-slate-100 relative">
                <img
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  data-alt="Summer fashion clothes layout"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfW47Y7dYq3pnTNpCsf47IJhLiVoOh9323vidJAjcn6dSE0jsnGqm_lGVLs0UYIfm9yEIxsT7VXodpsXRgcjP7cgmKsP2d-wxcDXOmWkfqx4h9ZjWQKmrQlNN2y59YjaYNflKs28YhxXeWpLQ61i2xaNVJ59JtcculNlQqneJuXA__W0Q56DOhl_3scIkQ8NYXiZiSKECwhfX4dbDvCt5ehKAc5rhqkzBydLeomCH1esg-u5ymHJ7mgR7a9dDVTfgaFVQBfuNkJug"
                />
                <span className="absolute top-3 left-3 bg-coral text-white text-[10px] font-black px-2 py-1 rounded-full uppercase">
                  Hot
                </span>
              </div>
              <h3 className="font-bold text-lg">Moda Verano Shein</h3>
              <p className="text-slate-500 text-sm">Desde $12.99</p>
            </div>
            <div className="group cursor-pointer">
              <div className="aspect-square rounded-2xl overflow-hidden mb-3 bg-slate-100">
                <img
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  data-alt="Stylish running sneakers"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCC8VEA-TTfPAcrZPIsu5-NTxNmmleu6dc9PEZv0IzUPpBlJCl96QIY9tnhN0kwbKGBOvvpLTSrLek7B-6_dj9-NagsqwuFaizzF9XZ461bM6Fx43R8TWZMUEyv0_sigThvJwBjNxG4PG5buurdrhlUfpZF57Rl7HnV8UINhwaCDstl6CZV9cj0yeRGLRcC4EKs7HCQt0U7YQ9V0qv9tkoP1XSs5AI5UYETnzP3jZwFdW58Ct3YjKej_eNcPXxsMqhiX1g9kku9Ho"
                />
              </div>
              <h3 className="font-bold text-lg">Calzado Deportivo</h3>
              <p className="text-slate-500 text-sm">Amazon Choice</p>
            </div>
            <div className="group cursor-pointer">
              <div className="aspect-square rounded-2xl overflow-hidden mb-3 bg-slate-100">
                <img
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  data-alt="Living room furniture and decor"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBR951xhvz_4Xk79pW2LZs7otx5lP-NJMkTgqMOO8PyeEBkyCUGYExGqU6O7oYlRqaUQRV1CyymI1y1G3e3qMxJQx7jrLqDAoss3pcn7l1LOKAVPIYvhWDiRohgd0nbjHpcBtcu4epaPbmAxUlcFMnfZgYtxXx_uqjqZJTHLnjkSdBTCqZfFH6aCnsnOCPKOV0aF07_eLSQ3vrTJDmXv30bCzcjeXFl9kiBmCefoUP_GOzX3P9b8JCAcMd_ZBuPLyGgs5dJc9ShZJY"
                />
              </div>
              <h3 className="font-bold text-lg">Hogar y DecoraciÃ³n</h3>
              <p className="text-slate-500 text-sm">MÃ¡s de 500 items</p>
            </div>
            <div className="group cursor-pointer">
              <div className="aspect-square rounded-2xl overflow-hidden mb-3 bg-slate-100">
                <img
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  data-alt="Modern smart watch design"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHTbTpb1kHFW3UiczvRZjFBcntu4ylnvnb9nekQL9rGMPQVVNwR_DsdadAknwR3-qOV5qV-JXrZ5454eTGeeNrycjYmObEwjx4PIgkDEw9hhzNH8eUYlp10jH-vibTkUB2sv2h5OtVZ8ePZ12a-N3kFvBc8ne79BdM-SeXXpUC0q_sqKRSm2ZB6pUFIB42Bu7VocEk1ZBsx_L43nk5k2SXqa8YpqLecxZ8u6X5J0RUdicgKehmb8-gYWotIA9xBukLlqA2wKK6RJg"
                />
              </div>
              <h3 className="font-bold text-lg">Smartwatches</h3>
              <p className="text-slate-500 text-sm">Electrónica Top</p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="px-6 lg:px-10 py-24 bg-white dark:bg-background-dark/50">
          <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-4xl font-black text-center">
              {t("common.reviews_title")}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Testimonial Cards */}
              <Card className="bg-background-light dark:bg-gray-900 p-6 rounded-2xl border border-[#e6ebf4] dark:border-gray-800">
                <div className="flex items-center gap-1 mb-4">
                  <Star className="h-4 w-4 text-amber-400 fill-current" />
                  <Star className="h-4 w-4 text-amber-400 fill-current" />
                  <Star className="h-4 w-4 text-amber-400 fill-current" />
                  <Star className="h-4 w-4 text-amber-400 fill-current" />
                  <Star className="h-4 w-4 text-amber-400 fill-current" />
                </div>
                <p className="text-slate-custom dark:text-gray-400 mb-6">
                  "La mejor experiencia de compra internacional que he tenido.
                  Todo llegó en perfecto estado y en el tiempo prometido."
                </p>
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div>
                    <h4 className="font-bold">María González</h4>
                    <p className="text-sm text-slate-custom dark:text-gray-500">
                      Havana
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-background-light dark:bg-gray-900 p-6 rounded-2xl border border-[#e6ebf4] dark:border-gray-800">
                <div className="flex items-center gap-1 mb-4">
                  <Star className="h-4 w-4 text-amber-400 fill-current" />
                  <Star className="h-4 w-4 text-amber-400 fill-current" />
                  <Star className="h-4 w-4 text-amber-400 fill-current" />
                  <Star className="h-4 w-4 text-amber-400 fill-current" />
                  <Star className="h-4 w-4 text-amber-400 fill-current" />
                </div>
                <p className="text-slate-custom dark:text-gray-400 mb-6">
                  "El seguimiento en tiempo real me dio mucha tranquilidad.
                  Sabía exactamente dónde estaba mi pedido en todo momento."
                </p>
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div>
                    <h4 className="font-bold">Carlos Rodríguez</h4>
                    <p className="text-sm text-slate-custom dark:text-gray-500">
                      Santiago
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-background-light dark:bg-gray-900 p-6 rounded-2xl border border-[#e6ebf4] dark:border-gray-800">
                <div className="flex items-center gap-1 mb-4">
                  <Star className="h-4 w-4 text-amber-400 fill-current" />
                  <Star className="h-4 w-4 text-amber-400 fill-current" />
                  <Star className="h-4 w-4 text-amber-400 fill-current" />
                  <Star className="h-4 w-4 text-amber-400 fill-current" />
                  <Star className="h-4 w-4 text-amber-400 fill-current" />
                </div>
                <p className="text-slate-custom dark:text-gray-400 mb-6">
                  "Increíble servicio. La calculadora de costos es precisa y el
                  proceso de compra es muy sencillo."
                </p>
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div>
                    <h4 className="font-bold">Ana Martínez</h4>
                    <p className="text-sm text-slate-custom dark:text-gray-500">
                      Camagüey
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="px-6 py-24 bg-white dark:bg-background-dark">
          <div className="mx-auto max-w-[1200px]">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-black mb-4">
                {t("process_steps.title")}
              </h2>
              <p className="text-slate-500 dark:text-gray-400">
                {t("process_steps.subtitle")}
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-5">
              {/* Step 1 */}
              <div className="group relative flex flex-col items-center gap-6 rounded-2xl border border-slate-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-900/30 p-8 transition-all hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 text-center">
                <div className="flex h-14 w-14 items-center justify-center  text-primary  mx-auto">
                  
                </div>
                <div>
                  <h4 className="font-bold mb-2">
                    {t("process_steps.step_1.title")}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-gray-400 px-0">
                    {t("process_steps.step_1.description")}
                  </p>
                </div>
                <span className="absolute -top-4 -right-4 text-6xl font-black text-slate-100 dark:text-gray-800 z-0 select-none">
                  {t("process_steps.step_1.nro").padStart(2, "0")}
                </span>
              </div>

              {/* Step 2 */}
              <div className="group relative flex flex-col items-center gap-6 rounded-2xl border border-slate-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-900/30 p-8 transition-all hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 text-center">
                <div className="flex h-14 w-14 items-center justify-center  text-primary  mx-auto">
                  
                </div>
                <div>
                  <h4 className="font-bold mb-2">
                    {t("process_steps.step_2.title")}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-gray-400 px-0">
                    {t("process_steps.step_2.description")}
                  </p>
                </div>
                <span className="absolute -top-4 -right-4 text-6xl font-black text-slate-100 dark:text-gray-800 z-0 select-none">
                  {t("process_steps.step_2.nro").padStart(2, "0")}
                </span>
              </div>

              {/* Step 3 */}
              <div className="group relative flex flex-col items-center gap-6 rounded-2xl border border-slate-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-900/30 p-8 transition-all hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 text-center">
                <div className="flex h-14 w-14 items-center justify-center  text-primary  mx-auto">
                  
                </div>
                <div>
                  <h4 className="font-bold mb-2">
                    {t("process_steps.step_3.title")}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-gray-400 px-0">
                    {t("process_steps.step_3.description")}
                  </p>
                </div>
                <span className="absolute -top-4 -right-4 text-6xl font-black text-slate-100 dark:text-gray-800 z-0 select-none">
                  {t("process_steps.step_3.nro").padStart(2, "0")}
                </span>
              </div>

              {/* Step 4 */}
              <div className="group relative flex flex-col items-center gap-6 rounded-2xl border border-slate-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-900/30 p-8 transition-all hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 text-center">
                <div className="flex h-14 w-14 items-center justify-center  text-primary  mx-auto">
                  
                </div>
                <div>
                  <h4 className="font-bold mb-2">
                    {t("process_steps.step_4.title")}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-gray-400 px-0">
                    {t("process_steps.step_4.description")}
                  </p>
                </div>
                <span className="absolute -top-4 -right-4 text-6xl font-black text-slate-100 dark:text-gray-800 z-0 select-none">
                  {t("process_steps.step_4.nro").padStart(2, "0")}
                </span>
              </div>

              {/* Step 5 */}
              <div className="group relative flex flex-col items-center gap-6 rounded-2xl border border-slate-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-900/30 p-8 transition-all hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 text-center">
                <div className="flex h-14 w-14 items-center justify-center  text-primary  mx-auto">
                  
                </div>
                <div>
                  <h4 className="font-bold mb-2">
                    {t("process_steps.step_5.title")}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-gray-400 px-0">
                    {t("process_steps.step_5.description")}
                  </p>
                </div>
                <span className="absolute -top-4 -right-4 text-6xl font-black text-slate-100 dark:text-gray-800 z-0 select-none">
                  {t("process_steps.step_5.nro").padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 lg:px-10 py-24 text-center">
          <div className="max-w-4xl mx-auto bg-primary rounded-3xl p-12 lg:p-20 text-white relative overflow-hidden shadow-2xl shadow-primary/40">
            <div className="absolute top-0 right-0 p-10 opacity-10">
              <span className="material-symbols-outlined text-[12rem]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="200"
                  height="200"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="#a6d4f7"
                    d="M16 464h480v32H16zm439.688-311.836c-23.388-6.515-48.252-6.053-70.008 1.3l-.894.3l-65.1 30.94l-189.981-75.528a47.719 47.719 0 0 0-49.771 8.862L54.5 140.836a24 24 0 0 0 2.145 37.452l117.767 83.458l-45.173 23.663l-35.775-32.687a48.067 48.067 0 0 0-51.47-8.6l-19.455 8.435a24 24 0 0 0-11.642 33.3l72.821 136.827L480.3 227.21c23.746-11.177 26.641-29.045 21.419-42.059c-5.788-14.428-22.568-26.451-46.031-32.987Zm10.9 46.133l-.149.07l-369.045 181.9l-54.176-101.8l11.5-4.987a16.021 16.021 0 0 1 17.157 2.867l52.336 47.819l111.329-58.318L83.322 157.974l17.971-16.108a15.908 15.908 0 0 1 16.59-2.954l202.943 80.681l75.95-36.095c15.456-5.009 33.863-5.165 50.662-.413c13.834 3.914 21.182 9.6 23.672 12.582a24.211 24.211 0 0 1-4.52 2.633Z"
                  />
                </svg>
              </span>
            </div>
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl lg:text-5xl font-black leading-tight">
                {t("common.ready_to_buy")}
              </h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                {t("hero.description")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-10 py-4 bg-white text-primary font-black rounded-xl hover:bg-gray-100 transition-colors shadow-xl">
                  {t("common.create_account")}
                </button>
                <button className="px-10 py-4 bg-primary border-2 border-white/30 text-white font-black rounded-xl hover:bg-white/10 transition-colors">
                  {t("common.talk_to_agent")}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12 border-t border-[#e6ebf4] dark:border-gray-800">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="col-span-2 md:col-span-1 space-y-6">
            <h3 className="font-bold text-lg mb-4">{t("footer.title")}</h3>
            <p className="text-slate-custom dark:text-gray-400 text-sm">
              {t("footer.subtitle")}
            </p>
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-slate-custom hover:text-primary cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#434b51"
                    d="M12 20q1.875 0 3.188-1.313T16.5 15.5q0-1.875-1.313-3.188T12 11q-1.875 0-3.188 1.313T7.5 15.5q0 1.875 1.313 3.188T12 20ZM9.075 9.7q.5-.275 1.063-.437t1.137-.213L8.75 4h-2.5l2.825 5.7ZM6.4 18.8q-.425-.725-.663-1.563T5.5 15.5q0-.9.238-1.738T6.4 12.2q-1.05.35-1.725 1.238T4 15.5q0 1.175.675 2.063T6.4 18.8Zm11.2 0q1.05-.35 1.725-1.238T20 15.5q0-1.175-.675-2.063T17.6 12.2q.425.725.663 1.563T18.5 15.5q0 .9-.238 1.738T17.6 18.8ZM12 22q-1 0-1.913-.288T8.4 20.925q-.225.05-.45.063T7.475 21Q5.2 21 3.6 19.4T2 15.525Q2 13.35 3.45 11.8t3.575-1.725l-3.3-6.625q-.25-.5.038-.975T4.625 2h4.15q.575 0 1.038.3t.737.8L12 6l1.45-2.9q.275-.5.738-.8t1.037-.3h4.15q.575 0 .863.475t.037.975L17 10.025q2.125.2 3.563 1.75T22 15.5q0 2.3-1.6 3.9T16.5 21q-.225 0-.463-.013t-.462-.062q-.775.5-1.675.788T12 22Zm0-6.5ZM9.075 9.7L6.25 4l2.825 5.7ZM12 16.85l-1.225.925q-.15.125-.3.013t-.1-.288l.475-1.525l-1.225-.875q-.15-.125-.1-.288t.25-.162h1.5l.475-1.625q.05-.175.25-.175t.25.175l.475 1.625h1.5q.2 0 .25.163t-.1.287l-1.225.875l.475.95q.35.1.675.213t.65.287Zm2.925-7.15l2.85-5.7H15.25l-2.125 4.25l.475.95q.35.1.675.213t.65.287Z"
                  />
                </svg>
              </span>
              <span className="material-symbols-outlined text-slate-custom hover:text-primary cursor-pointer">
                <PeopleGroup />
              </span>
              <span className="material-symbols-outlined text-slate-custom hover:text-primary cursor-pointer"></span>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold mb-4">{t("footer.services.title")}</h4>
            <ul className="text-sm text-slate-custom space-y-2">
              <li>
                <a className="hover:text-primary" href="#">
                  {t("footer.services.sea_shipping")}
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  {t("footer.services.aerial_shipping")}
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  {t("footer.services.assisted_purchase")}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">{t("footer.resources.title")}</h4>
            <ul className="space-y-2 text-sm text-slate-custom dark:text-gray-400">
              <li>
                <a className="hover:text-primary" href="#">
                  {t("footer.resources.faq")}
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  {t("footer.resources.calculator")}
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  {t("footer.resources.terms")}
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  {t("footer.resources.blog")}
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold mb-4">{t("footer.contact.title")}</h4>
            <ul className="text-sm text-slate-custom space-y-2">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xs">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#434b51"
                      d="M19.95 21q-3.125 0-6.175-1.363t-5.55-3.862q-2.5-2.5-3.862-5.55T3 4.05q0-.45.3-.75t.75-.3H8.1q.35 0 .625.238t.325.562l.65 3.5q.05.4-.025.675T9.4 8.45L6.975 10.9q.5.925 1.187 1.787t1.513 1.663q.775.775 1.625 1.438T13.1 17l2.35-2.35q.225-.225.588-.338t.712-.062l3.45.7q.35.1.575.363T21 15.9v4.05q0 .45-.3.75t-.75.3Z"
                    />
                  </svg>
                </span>
                +1 (305) 555-0123
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xs">
                  <Mail color="#434b51" size={20} />
                </span>
                soporte@ventasya.com
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xs">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 12 12"
                  >
                    <path
                      fill="#434b51"
                      d="M6 .5A4.5 4.5 0 0 1 10.5 5c0 1.863-1.42 3.815-4.2 5.9a.5.5 0 0 1-.6 0C2.92 8.815 1.5 6.863 1.5 5A4.5 4.5 0 0 1 6 .5Zm0 3a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3Z"
                    />
                  </svg>
                </span>
                Doral, FL 33172, USA
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto mt-12 pt-8 border-t border-[#e6ebf4] dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-custom">
            © {new Date().getFullYear()} VentasYa.{" "}
            {t("common.all_rights_reserved")}.
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-custom">
            <a className="hover:text-primary" href="#">
              Privacidad
            </a>
            <a className="hover:text-primary" href="#">
              Cookies
            </a>
            <div className="flex items-center gap-2 ml-4">
              <span className="material-symbols-outlined text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#434b51"
                    d="M12 22q-2.05 0-3.875-.788t-3.188-2.15q-1.362-1.362-2.15-3.187T2 12q0-2.075.788-3.888t2.15-3.174Q6.3 3.575 8.124 2.788T12 2q2.075 0 3.888.788t3.174 2.15q1.363 1.362 2.15 3.175T22 12q0 2.05-.788 3.875t-2.15 3.188q-1.362 1.362-3.175 2.15T12 22Zm0-2.05q.65-.9 1.125-1.875T13.9 16h-3.8q.3 1.1.775 2.075T12 19.95Zm-2.6-.4q-.45-.825-.788-1.713T8.05 16H5.1q.725 1.25 1.813 2.175T9.4 19.55Zm5.2 0q1.4-.45 2.488-1.375T18.9 16h-2.95q-.225.95-.562 1.838T14.6 19.55ZM4.25 14h3.4q-.075-.5-.113-.988T7.5 12q0-.525.038-1.012T7.65 10h-3.4q-.125.5-.188.988T4 12q0 .525.063 1.012T4.25 14Zm5.4 0h4.7q.075-.5.113-.988T14.5 12q0-.525-.038-1.012T14.35 10h-4.7q-.075.5-.113.988T9.5 12q0 .525.038 1.012T9.65 14Zm6.7 0h3.4q.125-.5.188-.988T20 12q0-.525-.063-1.012T19.75 10h-3.4q.075.5.113.988T16.5 12q0 .525-.038 1.012T16.35 14Zm-.4-6h2.95q-.725-1.25-1.812-2.175T14.6 4.45q.45.825.788 1.713T15.95 8ZM10.1 8h3.8q-.3-1.1-.775-2.075T12 4.05q-.65.9-1.125 1.875T10.1 8Zm-5 0h2.95q.225-.95.563-1.838T9.4 4.45Q8 4.9 6.912 5.825T5.1 8Z"
                  />
                </svg>
              </span>
              <span>Español (Cuba)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
