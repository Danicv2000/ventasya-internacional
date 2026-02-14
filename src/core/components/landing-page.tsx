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
import { Logo } from "./icons/Logo";
import { PeopleGroup } from "./icons/PeopleGroup";
import { Mail } from "./icons/Mail";
import { useTasasElToque } from "@/src/shared/hooks/use-elToque";
import SplitText from "@/src/shared/ui/gsapSplitText";
import ShinyText from "@/src/shared/ui/motionText";

export default function LandingPage() {
  // Para que no salgan los ✓ solos al inicio
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timerClear = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timerClear);
  }, []);

  const { t } = useI18n();
  const [packageWeight, setPackageWeight] = useState(1.0);
  const [itemValue, setItemValue] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash-usd");

  // Hook para obtener las tasas de El Toque
  const {
    data: tasasData,
    loading: tasasLoading,
    error: tasasError,
  } = useTasasElToque({
    dateFrom: `${new Date().toISOString().split("T")[0]} 00:00:01`,
    dateTo: `${new Date().toISOString().split("T")[0]} 23:59:01`,
  });

  // Mostrar la respuesta de El Toque en la consola
  // useEffect(() => {
  //   if (tasasData) {
  //     console.log("Respuesta de El Toque API:", tasasData);
  //   }
  //   if (tasasError) {
  //     console.error("Error de El Toque API:", tasasError);
  //   }
  // }, [tasasData, tasasError]);

  const calculateTotal = () => {
    const price = parseFloat(itemValue) || 0;

    // Paso 1: Precio base (Precio del producto * 1.5 si price es menor a 15 sino producto * 2.0)
    const baseCost = price <= 15 ? price * 2.0 : price * 1.5;

    /*
     * Paso 2: Lógica del 20% solo para transferencias y tasa de cambio para pagos en CUP
     *
     * - Evalua si el metodo de pago seleccionado es en cup sino devuelve el el precio base
     * - Evalua si el metodo de pago es transferencia por cup y aplica la formula:
     *    precio base * tasa de conversion + 20%
     * - Si es pago en cup aplica la formula:
     *    precio base * tasa de conversion
     */
    let fee = 0;
    let total = 0;
    const packageWeightCost = packageWeight * 10;

    if (paymentMethod.includes("cup")) {
      let cost = (baseCost + packageWeightCost) * tasasData?.tasas.USD;
      if (paymentMethod === "transfer-cup") {
        fee = cost * 0.2;
      } else if (paymentMethod === "cash-cup") {
        fee = 0;
      }
      total = cost + fee;
    } else {
      if (paymentMethod === "cash-usd") {
        total = baseCost + packageWeightCost;
      } else if (paymentMethod === "cash-euro") {
        let dif = (baseCost + packageWeightCost) * tasasData?.tasas.USD;
        total = dif / tasasData?.tasas.ECU;
      }
    }

    // console.log("tasa USD: " + tasasData?.tasas.USD)
    // console.log("tasa EURO: " + tasasData?.tasas.ECU)
    // console.log("price: " + price)
    // console.log("baseCost: " + baseCost)
    // console.log("fee: " + fee)
    // console.log("total: " + total)

    return total.toFixed(2);
  };

  return (
    <div
      className="
        text-[#0d121c]
        bg-background-light
        transition-colors
        dark:bg-background-dark dark:text-white duration-300
      "
    >
      {/* Top Navigation Bar */}
      <header
        className="
          z-50
          bg-background-light/80
          border-b border-solid border-[#e6ebf4]
          sticky top-0 dark:bg-background-dark/80 backdrop-blur-md dark:border-gray-800
        "
      >
        <div
          className="
            flex
            max-w-[1280px]
            mx-auto px-6 py-4
            items-center justify-between
            lg:px-10
          "
        >
          <div
            className="
              flex
              items-center gap-3
            "
          >
            <div
              className="
                text-primary
              "
            >
              <Logo />
            </div>
            <h2
              className="
                text-xl font-extrabold tracking-tight
              "
            >
              VentasYa
            </h2>
          </div>
          <nav
            className="
              hidden
              items-center gap-8
              md:flex
            "
          >
            <a
              href="/commingsoon"
              className="
                text-sm font-semibold
                transition-colors
                hover:text-primary
              "
            >
              Calculadora
            </a>
            <a
              href="/commingsoon"
              className="
                text-sm font-semibold
                transition-colors
                hover:text-primary
              "
            >
              Seguimiento
            </a>
            <a
              href="/commingsoon"
              className="
                text-sm font-semibold
                transition-colors
                hover:text-primary
              "
            >
              Tiendas
            </a>
            <a
              href="/commingsoon"
              className="
                text-sm font-semibold
                transition-colors
                hover:text-primary
              "
            >
              Soporte
            </a>
          </nav>
          <div
            className="
              flex
              items-center gap-3
            "
          >
            <Button
              variant="outline"
              className="
                px-4 py-2
                text-sm font-bold
              "
            >
              Iniciar Sesión
            </Button>
            <Button
              className="
                px-5 py-2
                text-sm font-bold text-white
                bg-primary
                rounded-lg
                transition-colors shadow-lg shadow-primary/20
                hover:bg-blue-700
              "
            >
              Registrarse
            </Button>
          </div>
        </div>
      </header>

      <main
        className="
          max-w-[1280px]
          mx-auto
        "
      >
        {/* Hero Section with Calculator */}
        <section
          className="
            flex flex-col
            px-6 py-16
            gap-12 items-center
            lg:flex-row lg:px-10 lg:py-24
          "
        >
          {/* Left: Value Prop */}
          <div
            className="
              flex-1
              space-y-8
            "
          >
            <div
              className="
                space-y-4
              "
            >
              <SplitText
                text={t("hero.head")}
                delay={50}
                duration={1.25}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
                className="
                  inline-block
                  py-1 px-3
                  text-primary text-xs font-bold tracking-wider
                  bg-primary/10
                  rounded-full
                  uppercase
                "
              />
              <h1
                className="
                  text-5xl font-black leading-[1.1] tracking-tight
                  lg:text-7xl
                "
              >
                <SplitText
                  text={t("hero.title_section_1")}
                  delay={50}
                  duration={1}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="center"
                  className="
                    text-5xl font-black leading-[1.1] tracking-tight
                    lg:text-7xl
                  "
                />
                {""}
                <SplitText
                  text={t("hero.title_section_2")}
                  delay={50}
                  duration={1}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="center"
                  className="
                    text-primary
                  "
                />
              </h1>

              <SplitText
                text={t("hero.subtitle")}
                delay={20}
                duration={0.5}
                ease="power3.out"
                splitType="words"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
                className="
                  max-w-xl
                  text-lg text-slate-custom leading-relaxed
                  dark:text-gray-400
                "
              />
            </div>
            <div
              className="
                flex flex-wrap
                gap-4
              "
            >
              <div
                className="
                  flex
                  text-sm font-medium
                  items-center gap-2
                "
              >
                <SplitText
                  text="✓"
                  delay={50}
                  duration={2.5}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="center"
                  className={`
                    text-green-500
                    ${isVisible ? "visible" : "hidden"}
                  `}
                />

                <ShinyText
                  text={t("common.transparency")}
                  speed={2}
                  delay={0}
                  color="black"
                  shineColor="#ffffff"
                  spread={120}
                  direction="left"
                  yoyo={false}
                  pauseOnHover={false}
                  disabled={false}
                />
              </div>
              <div
                className="
                  flex
                  text-sm font-medium
                  items-center gap-2
                "
              >
                <SplitText
                  text="✓"
                  delay={50}
                  duration={2.5}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="center"
                  className={`
                    text-green-500
                    ${isVisible ? "visible" : "hidden"}
                  `}
                />
                <ShinyText
                  text={t("tracking.title")}
                  speed={2}
                  delay={0}
                  color="black"
                  shineColor="#ffffff"
                  spread={120}
                  direction="left"
                  yoyo={false}
                  pauseOnHover={false}
                  disabled={false}
                />
              </div>
              <div
                className="
                  flex
                  text-sm font-medium
                  items-center gap-2
                "
              >
                <SplitText
                  text="✓"
                  delay={50}
                  duration={2.5}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="center"
                  className={`
                    text-green-500
                    ${isVisible ? "visible" : "hidden"}
                  `}
                />
                <ShinyText
                  text={t("common.security")}
                  speed={2}
                  delay={0}
                  color="black"
                  shineColor="#ffffff"
                  spread={120}
                  direction="left"
                  yoyo={false}
                  pauseOnHover={false}
                  disabled={false}
                />
              </div>
            </div>
          </div>

          {/* Right: Interactive Calculator Widget */}

          <div
            className="
              w-full
              lg:w-[460px]
            "
          >
            <Card
              className="
                p-8
                bg-white
                rounded-xl border border-[#e6ebf4]
                shadow-lg
                calculator-card dark:bg-gray-900 dark:border-gray-800
              "
            >
              <h3
                className="
                  flex
                  mb-6
                  text-xl font-bold
                  items-center gap-2
                "
              >
                <Calculator
                  className="
                    h-5 w-5
                    text-primary
                  "
                />
                {t("calculator.title")}
              </h3>

              <div
                className="
                  space-y-6
                "
              >
                {/* Store Selection */}
                <div
                  className="
                    space-y-2
                  "
                >
                  <label
                    className="
                      text-sm font-bold text-gray-700
                      dark:text-gray-300
                    "
                  >
                    {t("calculator.store")}
                  </label>
                  <Select onValueChange={setSelectedStore}>
                    <SelectTrigger
                      className="
                        w-full h-12
                        text-sm
                        rounded-lg border-[#ced7e9]
                        dark:border-gray-700 dark:bg-gray-800
                      "
                    >
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
                <div
                  className="
                    space-y-4
                  "
                >
                  <div
                    className="
                      flex
                      justify-between items-center
                    "
                  >
                    <label
                      className="
                        text-sm font-bold text-gray-700
                        dark:text-gray-300
                      "
                    >
                      {t("calculator.weight")}
                    </label>
                    <span
                      className="
                        text-primary font-bold
                      "
                    >
                      {packageWeight} lbs
                    </span>
                  </div>

                  <div
                    className="
                      flex
                      h-2 w-full
                      relative items-center
                    "
                  >
                    <div
                      className="
                        h-full w-full
                        bg-[#ced7e9]
                        rounded-full
                        dark:bg-gray-800 absolute
                      "
                    ></div>
                    <div
                      style={{ width: `${(packageWeight / 10) * 100}%` }}
                      className="
                        h-full
                        bg-primary
                        rounded-full
                        transition-all
                        absolute duration-100 ease-out
                      "
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
                      style={{ top: "-8px" }}
                      className="
                        z-10
                        w-full h-6
                        bg-transparent
                        cursor-pointer opacity-0
                        absolute appearance-none
                      "
                    />

                    <div
                      style={{
                        left: `${(packageWeight / 10) * 100}%`,
                        transform: "translateX(-50%)",
                      }}
                      className="
                        bg-white
                        rounded-full border-2 border-primary
                        shadow-md pointer-events-none transition-all
                        size-5 absolute duration-100 ease-out
                      "
                    ></div>
                  </div>
                </div>

                {/* Item Value Input */}
                <div
                  className="
                    space-y-2
                  "
                >
                  <label
                    className="
                      text-sm font-bold text-gray-700
                      dark:text-gray-300
                    "
                  >
                    {t("calculator.value")}
                  </label>
                  <div
                    className="
                      relative
                    "
                  >
                    <span
                      className="
                        text-gray-500 font-bold
                        absolute left-4 top-1/2 -translate-y-1/2
                      "
                    >
                      $
                    </span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={itemValue}
                      onChange={(e) => setItemValue(e.target.value)}
                      className="
                        w-full h-12
                        pl-8
                        text-sm
                        rounded-lg border-[#ced7e9]
                        dark:border-gray-700 dark:bg-gray-800
                      "
                    />
                  </div>
                </div>

                {/* Payment Method Selector (NUEVO) */}
                <div
                  className="
                    space-y-2
                  "
                >
                  <label
                    className="
                      text-sm font-bold text-gray-700
                      dark:text-gray-300
                    "
                  >
                    Método de Pago
                  </label>
                  <Select
                    onValueChange={setPaymentMethod}
                    value={paymentMethod}
                  >
                    <SelectTrigger
                      className="
                        w-full h-12
                        text-sm
                        rounded-lg border-[#ced7e9]
                        dark:border-gray-700 dark:bg-gray-800
                      "
                    >
                      <SelectValue placeholder="Selecciona..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash-usd">
                        <div
                          className="
                            flex
                            items-center gap-2
                          "
                        >
                          <span>Efectivo / USD</span>
                          <span
                            className="
                              text-xs text-green-600 font-normal
                            "
                          >
                            (Sin Fee)
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="cash-euro">
                        <div
                          className="
                            flex
                            items-center gap-2
                          "
                        >
                          <span>Efectivo / EURO</span>
                          <span
                            className="
                              text-xs text-green-600 font-normal
                            "
                          >
                            (Sin Fee)
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="cash-cup">
                        <div
                          className="
                            flex
                            items-center gap-2
                          "
                        >
                          <span>Efectivo / CUP</span>
                          <span
                            className="
                              text-xs text-red-500 font-normal
                            "
                          >
                            (ElToque)
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="transfer-cup">
                        <div
                          className="
                            flex
                            items-center gap-2
                          "
                        >
                          <span>Transferencia / CUP</span>
                          <span
                            className="
                              text-xs text-gray-500 font-normal
                            "
                          >
                            (+20% Fee)
                          </span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Result Box */}
                <div
                  className="
                    p-5
                    bg-primary/5
                    rounded-lg border border-primary/20
                    dark:bg-primary/10
                  "
                >
                  <div
                    className="
                      flex
                      mb-1
                      justify-between items-center
                    "
                  >
                    <span
                      className="
                        text-xs font-semibold text-slate-custom
                        uppercase
                      "
                    >
                      {t("calculator.estimated")}
                    </span>
                    <div
                      title="Tasa de El Toque del mercado informal"
                      className="
                        text-primary text-sm
                      "
                    >
                      ℹ
                    </div>
                  </div>
                  <div
                    className="
                      text-3xl font-black text-primary
                    "
                  >
                    {paymentMethod.includes("euro") ? "€" : "$"}
                    {calculateTotal()}{" "}
                    <span
                      className="
                        text-sm font-medium text-slate-custom
                      "
                    >
                      {paymentMethod.includes("cup")
                        ? "CUP"
                        : paymentMethod.includes("eur")
                          ? "EUR"
                          : "USD"}
                    </span>
                  </div>
                  <p
                    className="
                      mt-2
                      text-[10px] text-slate-custom
                      italic
                    "
                  >
                    *{t("calculator.delivery_time")}
                  </p>
                </div>
                {/* Warning Cartel */}
                {/* Solo se muestra si el peso sigue siendo 1.0 (valor inicial) */}
                {packageWeight === 1.0 && (
                  <div
                    className="
                      flex
                      mt-3 p-3
                      text-amber-700 text-xs
                      bg-amber-50
                      rounded-lg border border-amber-200
                      items-start gap-2 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50
                    "
                  >
                    <AlertTriangle
                      className="
                        flex-shrink-0
                        w-4 h-4
                        mt-0.5
                      "
                    />
                    <p>
                      {t("calculator.warning.section_1")}{" "}
                      <strong>1 libra</strong>.{" "}
                      {t("calculator.warning.section_2")}
                    </p>
                  </div>
                )}

                <Button
                  className="
                    w-full
                    py-4
                    text-white font-bold
                    bg-primary
                    rounded-lg
                    transition-all shadow-lg shadow-primary/30
                    hover:bg-blue-700 transform active:scale-[0.98]
                  "
                >
                  {t("hero.cta")}
                </Button>
              </div>
            </Card>
          </div>
        </section>

        {/* Trust Bar / Partners */}

        <section
          className="
            px-6 py-12
            border-y border-[#e6ebf4]
            dark:border-gray-800
            lg:px-10
          "
        >
          <p
            className="
              mb-8
              text-center text-xs font-bold text-slate-custom tracking-[0.2em]
              uppercase
            "
          >
            {t("stores.title")}
          </p>
          <div
            className="
              flex flex-wrap
              opacity-50 transition-all
              justify-center items-center gap-12 grayscale hover:grayscale-0 duration-500
            "
          >
            <span
              className="
                text-2xl font-black
                partnerItems
              "
            >
              AMAZON
            </span>
            <span
              className="
                text-2xl font-black
                partnerItems italic
              "
            >
              SHEIN
            </span>
            <span
              className="
                text-2xl font-black
                partnerItems
              "
            >
              TEMU
            </span>
          </div>
        </section>

        {/* Security & Tracking Section */}
        <section
          className="
            px-6 py-24
            lg:px-10
          "
        >
          <div
            className="
              grid
              gap-16 items-center
              lg:grid-cols-2
            "
          >
            <div
              className="
                relative
              "
            >
              <div
                data-location="Miami to Havana route map"
                style={{}}
                className="
                  overflow-hidden
                  bg-gray-200
                  rounded-2xl
                  shadow-2xl
                  dark:bg-gray-800 aspect-video relative
                "
              >
                <img
                  alt="Global tracking map"
                  data-alt="Satellite map showing delivery route from USA to Cuba"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBdVIZ2FMi97kyfpKLUJx_Wh1Vijmzjlg3gmOxGdbbn-s-zQCr0IMfLhM7boGjvjdwlsRdrkrRavFYaolp_Mg_Tr73HT_6_U-VDtcRwnd6pwyQPw7rjEk1B-dBpcJC-TTpl9fmPrrHNwmbYFDMlEQSjEz7hgYeURl4RzK42bxKMVJONpXi9mbefxINDeT19CQ2T0qifMfzy9-Dd9wCaILM4FjgAEyk5jNGBVJz4fFzMqWTB0QY6pbNpxCCC9i6QNfzIDK0pPm4oA4"
                  className="
                    object-cover
                    w-full h-full
                    opacity-60
                    dark:opacity-40
                  "
                />
                <div
                  className="
                    bg-gradient-to-t from-background-light via-transparent to-transparent
                    absolute inset-0 dark:from-background-dark
                  "
                ></div>
                {/* Mock Tracking Widget */}
                <div
                  className="
                    w-64
                    p-4
                    bg-white
                    rounded-xl border border-primary/20
                    shadow-xl animate-pulse
                    absolute top-6 right-6 dark:bg-gray-900
                  "
                >
                  <div
                    className="
                      flex
                      mb-3
                      items-center gap-3
                    "
                  >
                    <div
                      className="
                        bg-green-500
                        rounded-full
                        size-3
                      "
                    ></div>
                    <div
                      className="
                        text-sm font-bold
                      "
                    >
                      {t("tracking.in_transit")}
                    </div>
                  </div>
                  <div
                    className="
                      mb-2
                      text-xs text-slate-custom
                    "
                  >
                    Pedido #VENTASYA-001
                  </div>
                  <div
                    className="
                      w-full h-2
                      bg-gray-200
                      rounded-full
                      dark:bg-gray-700
                    "
                  >
                    <div
                      style={{ width: "75%" }}
                      className="
                        h-2
                        bg-primary
                        rounded-full
                      "
                    ></div>
                  </div>
                  <div
                    className="
                      flex
                      mt-2
                      text-xs text-slate-custom
                      justify-between
                    "
                  >
                    <span>USA</span>
                    <span>Cuba</span>
                  </div>
                </div>
                <div
                  className="
                    overflow-hidden
                    w-full h-1.5
                    bg-gray-100
                    rounded-full
                    dark:bg-gray-800
                  "
                >
                  <div
                    className="
                      h-full w-[70%]
                      bg-primary
                    "
                  ></div>
                </div>
              </div>
              {/*Decorative Elements*/}
              <div
                className="
                  bg-primary
                  rounded-2xl
                  opacity-20
                  absolute -bottom-6 -left-6 size-24 -z-10
                "
              ></div>
            </div>

            {/* Feature Cards */}
            <div
              className="
                space-y-8
              "
            >
              <h2
                className="
                  text-4xl font-black
                "
              >
                {t("tracking.title")}{" "}
                <span
                  className="
                    text-primary
                  "
                >
                  {t("tracking.24_7")}
                </span>
              </h2>
              <p
                className="
                  text-slate-custom leading-relaxed
                  dark:text-gray-400
                "
              >
                {t("tracking.description")}
              </p>
              <div
                className="
                  grid grid-cols-1
                  gap-6
                  sm:grid-cols-3
                "
              >
                <div
                  className="
                    p-5
                    bg-white/50
                    rounded-xl border border-[#e6ebf4]
                    dark:border-gray-800 dark:bg-gray-900/50
                  "
                >
                  <div
                    className="
                      flex
                      text-primary
                      size-12 items-center justify-center
                    "
                  >
                    <ShieldCheck
                      className="
                        h-10 w-10
                      "
                    />
                  </div>
                  <h4
                    className="
                      mb-1
                      font-bold
                    "
                  >
                    Seguro de Carga
                  </h4>
                  <p
                    className="
                      text-xs text-slate-custom
                    "
                  >
                    Protección total contra daños o pérdidas durante el
                    trayecto.
                  </p>
                </div>
                <div
                  className="
                    p-5
                    bg-white/50
                    rounded-xl border border-[#e6ebf4]
                    dark:border-gray-800 dark:bg-gray-900/50
                  "
                >
                  <div
                    className="
                      flex
                      text-primary
                      size-12 items-center justify-center
                    "
                  >
                    <Lock
                      className="
                        h-10 w-10
                      "
                    />
                  </div>
                  <h4
                    className="
                      mb-1
                      font-bold
                    "
                  >
                    Pagos Seguros
                  </h4>
                  <div
                    className="
                      flex
                      mt-2
                      opacity-70
                      gap-2
                    "
                  ></div>
                  <p
                    className="
                      mt-2
                      text-xs text-slate-custom
                    "
                  >
                    Aceptamos tarjetas y efectivo en distintas monedas.
                  </p>
                </div>
                <div
                  className="
                    p-5
                    bg-white/50
                    rounded-xl border border-[#e6ebf4]
                    dark:border-gray-800 dark:bg-gray-900/50
                  "
                >
                  <div
                    className="
                      flex
                      text-primary
                      size-12 items-center justify-center
                    "
                  >
                    <Headset
                      className="
                        h-10 w-10
                      "
                    />
                  </div>
                  <h4
                    className="
                      mb-1
                      font-bold
                    "
                  >
                    Soporte
                  </h4>
                  <div
                    className="
                      flex
                      mt-2
                      opacity-70
                      gap-2
                    "
                  ></div>
                  <p
                    className="
                      mt-2
                      text-xs text-slate-custom
                    "
                  >
                    Brindamos soporte tecnico y asesorias 24h.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section
          className="
            px-6 py-24
            bg-white
            dark:bg-background-dark/50
            lg:px-10
          "
        >
          <div
            className="
              max-w-4xl
              mx-auto space-y-12
            "
          >
            <h2
              className="
                text-4xl font-black text-center
              "
            >
              {t("common.reviews_title")}
            </h2>
            <div
              className="
                grid
                gap-8
                md:grid-cols-3
              "
            >
              {/* Testimonial Cards */}
              <Card
                className="
                  p-6
                  bg-background-light
                  rounded-2xl border border-[#e6ebf4]
                  dark:bg-gray-900 dark:border-gray-800
                "
              >
                <div
                  className="
                    flex
                    mb-4
                    items-center gap-1
                  "
                >
                  <Star
                    className="
                      h-4 w-4
                      text-amber-400
                      fill-current
                    "
                  />
                  <Star
                    className="
                      h-4 w-4
                      text-amber-400
                      fill-current
                    "
                  />
                  <Star
                    className="
                      h-4 w-4
                      text-amber-400
                      fill-current
                    "
                  />
                  <Star
                    className="
                      h-4 w-4
                      text-amber-400
                      fill-current
                    "
                  />
                  <Star
                    className="
                      h-4 w-4
                      text-amber-400
                      fill-current
                    "
                  />
                </div>
                <p
                  className="
                    mb-6
                    text-slate-custom
                    dark:text-gray-400
                  "
                >
                  "La mejor experiencia de compra internacional que he tenido.
                  Todo llegó en perfecto estado y en el tiempo prometido."
                </p>
                <div
                  className="
                    flex
                    items-center gap-3
                  "
                >
                  <div
                    className="
                      bg-gray-200
                      rounded-full
                      size-10 dark:bg-gray-700
                    "
                  ></div>
                  <div>
                    <h4
                      className="
                        font-bold
                      "
                    >
                      María González
                    </h4>
                    <p
                      className="
                        text-sm text-slate-custom
                        dark:text-gray-500
                      "
                    >
                      Havana
                    </p>
                  </div>
                </div>
              </Card>

              <Card
                className="
                  p-6
                  bg-background-light
                  rounded-2xl border border-[#e6ebf4]
                  dark:bg-gray-900 dark:border-gray-800
                "
              >
                <div
                  className="
                    flex
                    mb-4
                    items-center gap-1
                  "
                >
                  <Star
                    className="
                      h-4 w-4
                      text-amber-400
                      fill-current
                    "
                  />
                  <Star
                    className="
                      h-4 w-4
                      text-amber-400
                      fill-current
                    "
                  />
                  <Star
                    className="
                      h-4 w-4
                      text-amber-400
                      fill-current
                    "
                  />
                  <Star
                    className="
                      h-4 w-4
                      text-amber-400
                      fill-current
                    "
                  />
                  <Star
                    className="
                      h-4 w-4
                      text-amber-400
                      fill-current
                    "
                  />
                </div>
                <p
                  className="
                    mb-6
                    text-slate-custom
                    dark:text-gray-400
                  "
                >
                  "El seguimiento en tiempo real me dio mucha tranquilidad.
                  Sabía exactamente dónde estaba mi pedido en todo momento."
                </p>
                <div
                  className="
                    flex
                    items-center gap-3
                  "
                >
                  <div
                    className="
                      bg-gray-200
                      rounded-full
                      size-10 dark:bg-gray-700
                    "
                  ></div>
                  <div>
                    <h4
                      className="
                        font-bold
                      "
                    >
                      Carlos Rodríguez
                    </h4>
                    <p
                      className="
                        text-sm text-slate-custom
                        dark:text-gray-500
                      "
                    >
                      Santiago
                    </p>
                  </div>
                </div>
              </Card>

              <Card
                className="
                  p-6
                  bg-background-light
                  rounded-2xl border border-[#e6ebf4]
                  dark:bg-gray-900 dark:border-gray-800
                "
              >
                <div
                  className="
                    flex
                    mb-4
                    items-center gap-1
                  "
                >
                  <Star
                    className="
                      h-4 w-4
                      text-amber-400
                      fill-current
                    "
                  />
                  <Star
                    className="
                      h-4 w-4
                      text-amber-400
                      fill-current
                    "
                  />
                  <Star
                    className="
                      h-4 w-4
                      text-amber-400
                      fill-current
                    "
                  />
                  <Star
                    className="
                      h-4 w-4
                      text-amber-400
                      fill-current
                    "
                  />
                  <Star
                    className="
                      h-4 w-4
                      text-amber-400
                      fill-current
                    "
                  />
                </div>
                <p
                  className="
                    mb-6
                    text-slate-custom
                    dark:text-gray-400
                  "
                >
                  "Increíble servicio. La calculadora de costos es precisa y el
                  proceso de compra es muy sencillo."
                </p>
                <div
                  className="
                    flex
                    items-center gap-3
                  "
                >
                  <div
                    className="
                      bg-gray-200
                      rounded-full
                      size-10 dark:bg-gray-700
                    "
                  ></div>
                  <div>
                    <h4
                      className="
                        font-bold
                      "
                    >
                      Ana Martínez
                    </h4>
                    <p
                      className="
                        text-sm text-slate-custom
                        dark:text-gray-500
                      "
                    >
                      Camagüey
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section
          className="
            px-6 py-20 my-10 mx-6
            bg-primary/5
            rounded-[2.5rem]
            dark:bg-primary/5
            lg:px-10
          "
        >
          <div
            className="
              max-w-2xl
              mx-auto mb-16
              text-center
            "
          >
            <h2
              className="
                mb-4
                text-3xl font-black
              "
            >
              {t("process_steps.title")}
            </h2>
            <p
              className="
                text-slate-custom
                dark:text-gray-400
              "
            >
              {t("process_steps.subtitle")}
            </p>
          </div>

          <div
            className="
              grid grid-cols-1
              gap-8
              md:grid-cols-3
              lg:grid-cols-5
            "
          >
            {/* Step 1 */}
            <div
              className="
                space-y-4
                text-center
                relative
              "
            >
              <div
                className="
                  flex
                  mx-auto
                  text-2xl font-black text-primary
                  bg-white
                  rounded-2xl border border-[#e6ebf4]
                  shadow-sm
                  size-16 dark:bg-gray-900 dark:border-gray-800 items-center justify-center
                "
              >
                {t("process_steps.step_1.nro")}
              </div>
              <h4
                className="
                  font-bold
                "
              >
                {t("process_steps.step_1.title")}
              </h4>
              <p
                className="
                  px-4
                  text-sm text-slate-custom
                "
              >
                {t("process_steps.step_1.description")}
              </p>
            </div>

            {/* Step 2 */}
            <div
              className="
                space-y-4
                text-center
                relative
              "
            >
              <div
                className="
                  flex
                  mx-auto
                  text-2xl font-black text-primary
                  bg-white
                  rounded-2xl border border-[#e6ebf4]
                  shadow-sm
                  size-16 dark:bg-gray-900 dark:border-gray-800 items-center justify-center
                "
              >
                {t("process_steps.step_2.nro")}
              </div>
              <h4
                className="
                  font-bold
                "
              >
                {t("process_steps.step_2.title")}
              </h4>
              <p
                className="
                  px-4
                  text-sm text-slate-custom
                "
              >
                {t("process_steps.step_2.description")}
              </p>
            </div>

            {/* Step 3 */}
            <div
              className="
                space-y-4
                text-center
                relative
              "
            >
              <div
                className="
                  flex
                  mx-auto
                  text-2xl font-black text-primary
                  bg-white
                  rounded-2xl border border-[#e6ebf4]
                  shadow-sm
                  size-16 dark:bg-gray-900 dark:border-gray-800 items-center justify-center
                "
              >
                {t("process_steps.step_3.nro")}
              </div>
              <h4
                className="
                  font-bold
                "
              >
                {t("process_steps.step_3.title")}
              </h4>
              <p
                className="
                  px-4
                  text-sm text-slate-custom
                "
              >
                {t("process_steps.step_3.description")}
              </p>
            </div>

            {/* Step 4 */}
            <div
              className="
                space-y-4
                text-center
                relative
              "
            >
              <div
                className="
                  flex
                  mx-auto
                  text-2xl font-black text-primary
                  bg-white
                  rounded-2xl border border-[#e6ebf4]
                  shadow-sm
                  size-16 dark:bg-gray-900 dark:border-gray-800 items-center justify-center
                "
              >
                {t("process_steps.step_4.nro")}
              </div>
              <h4
                className="
                  font-bold
                "
              >
                {t("process_steps.step_4.title")}
              </h4>
              <p
                className="
                  px-4
                  text-sm text-slate-custom
                "
              >
                {t("process_steps.step_4.description")}
              </p>
            </div>

            {/* Step 5 (NUEVO) */}
            <div
              className="
                space-y-4
                text-center
                relative
              "
            >
              <div
                className="
                  flex
                  mx-auto
                  text-2xl font-black text-primary
                  bg-white
                  rounded-2xl border border-[#e6ebf4]
                  shadow-sm
                  size-16 dark:bg-gray-900 dark:border-gray-800 items-center justify-center
                "
              >
                {t("process_steps.step_5.nro")}
              </div>
              <h4
                className="
                  font-bold
                "
              >
                {t("process_steps.step_5.title")}
              </h4>
              <p
                className="
                  px-4
                  text-sm text-slate-custom
                "
              >
                {t("process_steps.step_5.description")}
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className="
            px-6 py-24
            text-center
            lg:px-10
          "
        >
          <div
            className="
              overflow-hidden
              max-w-4xl
              mx-auto p-12
              text-white
              bg-primary
              rounded-3xl
              shadow-2xl shadow-primary/40
              relative
              lg:p-20
            "
          >
            <div
              className="
                p-10
                opacity-10
                absolute top-0 right-0
              "
            >
              <span
                className="
                  text-[12rem]
                  material-symbols-outlined
                "
              >
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
            <div
              className="
                z-10
                space-y-8
                relative
              "
            >
              <h2
                className="
                  text-4xl font-black leading-tight
                  lg:text-5xl
                "
              >
                {t("common.ready_to_buy")}
              </h2>
              <p
                className="
                  max-w-2xl
                  mx-auto
                  text-lg
                  opacity-90
                "
              >
                {t("hero.description")}
              </p>
              <div
                className="
                  flex flex-col
                  gap-4 justify-center
                  sm:flex-row
                "
              >
                <button
                  className="
                    px-10 py-4
                    text-primary font-black
                    bg-white
                    rounded-xl
                    transition-colors shadow-xl
                    hover:bg-gray-100
                  "
                >
                  {t("common.create_account")}
                </button>
                <button
                  className="
                    px-10 py-4
                    text-white font-black
                    bg-primary
                    border-2 border-white/30 rounded-xl
                    transition-colors
                    hover:bg-white/10
                  "
                >
                  {t("common.talk_to_agent")}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer
        className="
          max-w-[1280px]
          mx-auto px-6 py-12
          border-t border-[#e6ebf4]
          dark:border-gray-800
          lg:px-10
        "
      >
        <div
          className="
            grid
            gap-12
            md:grid-cols-4
          "
        >
          <div
            className="
              space-y-6
              col-span-2
              md:col-span-1
            "
          >
            <h3
              className="
                mb-4
                font-bold text-lg
              "
            >
              {t("footer.title")}
            </h3>
            <p
              className="
                text-slate-custom text-sm
                dark:text-gray-400
              "
            >
              {t("footer.subtitle")}
            </p>
            <div
              className="
                flex
                gap-4
              "
            >
              <span
                className="
                  text-slate-custom
                  cursor-pointer
                  material-symbols-outlined hover:text-primary
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#434b51"
                    d="M12 20q1.875 0 3.188-1.313T16.5 15.5q0-1.875-1.313-3.188T12 11q-1.875 0-3.188 1.313T7.5 15.5q0 1.875 1.313 3.188T12 20ZM9.075 9.7q.5-.275 1.063-.437t1.137-.213L8.75 4h-2.5l2.825 5.7ZM6.4 18.8q-.425-.725-.663-1.563T5.5 15.5q0-.9.238-1.738T6.4 12.2q-1.05.35-1.725 1.238T4 15.5q0 1.175.675 2.063T6.4 18.8Zm11.2 0q1.05-.35 1.725-1.238T20 15.5q0-1.175-.675-2.063T17.6 12.2q.425.725.663 1.563T18.5 15.5q0 .9-.238 1.738T17.6 18.8ZM12 22q-1 0-1.913-.288T8.4 20.925q-.225.05-.45.063T7.475 21Q5.2 21 3.6 19.4T2 15.525Q2 13.35 3.45 11.8t3.575-1.725l-3.3-6.625q-.25-.5.038-.975T4.625 2h4.15q.575 0 1.038.3t.737.8L12 6l1.45-2.9q.275-.5.738-.8t1.037-.3h4.15q.575 0 .863.475t.037.975L17 10.025q2.125.2 3.563 1.75T22 15.5q0 2.3-1.6 3.9T16.5 21q-.225 0-.463-.013t-.462-.062q-.775.5-1.675.788T12 22Zm0-6.5ZM9.075 9.7L6.25 4l2.825 5.7ZM12 16.85l-1.225.925q-.15.125-.3.013t-.1-.288l.475-1.525l-1.225-.875q-.15-.125-.1-.288t.25-.162h1.5l.475-1.625q.05-.175.25-.175t.25.175l.475 1.625h1.5q.2 0 .25.163t-.1.287l-1.225.875l.475 1.525q.05.175-.1.288t-.3-.013L12 16.85Zm2.925-7.15l2.85-5.7H15.25l-2.125 4.25l.475.95q.35.1.675.213t.65.287Z"
                  />
                </svg>
              </span>
              <span
                className="
                  text-slate-custom
                  cursor-pointer
                  material-symbols-outlined hover:text-primary
                "
              >
                <PeopleGroup />
              </span>
              <span
                className="
                  text-slate-custom
                  cursor-pointer
                  material-symbols-outlined hover:text-primary
                "
              ></span>
            </div>
          </div>
          <div
            className="
              space-y-4
            "
          >
            <h4
              className="
                mb-4
                font-bold
              "
            >
              {t("footer.services.title")}
            </h4>
            <ul
              className="
                space-y-2
                text-sm text-slate-custom
              "
            >
              <li>
                <a
                  href="#"
                  className="
                    hover:text-primary
                  "
                >
                  {t("footer.services.sea_shipping")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="
                    hover:text-primary
                  "
                >
                  {t("footer.services.aerial_shipping")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="
                    hover:text-primary
                  "
                >
                  {t("footer.services.assisted_purchase")}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4
              className="
                mb-4
                font-bold
              "
            >
              {t("footer.resources.title")}
            </h4>
            <ul
              className="
                space-y-2
                text-sm text-slate-custom
                dark:text-gray-400
              "
            >
              <li>
                <a
                  href="#"
                  className="
                    hover:text-primary
                  "
                >
                  {t("footer.resources.faq")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="
                    hover:text-primary
                  "
                >
                  {t("footer.resources.calculator")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="
                    hover:text-primary
                  "
                >
                  {t("footer.resources.terms")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="
                    hover:text-primary
                  "
                >
                  {t("footer.resources.blog")}
                </a>
              </li>
            </ul>
          </div>
          <div
            className="
              space-y-4
            "
          >
            <h4
              className="
                mb-4
                font-bold
              "
            >
              {t("footer.contact.title")}
            </h4>
            <ul
              className="
                space-y-2
                text-sm text-slate-custom
              "
            >
              <li
                className="
                  flex
                  items-center gap-2
                "
              >
                <span
                  className="
                    text-xs
                    material-symbols-outlined
                  "
                >
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
              <li
                className="
                  flex
                  items-center gap-2
                "
              >
                <span
                  className="
                    text-xs
                    material-symbols-outlined
                  "
                >
                  <Mail color="#434b51" size={20} />
                </span>
                soporte@ventasya.com
              </li>
              <li
                className="
                  flex
                  items-center gap-2
                "
              >
                <span
                  className="
                    text-xs
                    material-symbols-outlined
                  "
                >
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

        <div
          className="
            flex flex-col
            max-w-[1280px]
            mx-auto mt-12 pt-8
            border-t border-[#e6ebf4]
            dark:border-gray-800 justify-between items-center gap-4
            md:flex-row
          "
        >
          <p
            className="
              text-xs text-slate-custom
            "
          >
            © {new Date().getFullYear()} VentasYa.{" "}
            {t("common.all_rights_reserved")}.
          </p>
          <div
            className="
              flex
              text-xs text-slate-custom
              items-center gap-6
            "
          >
            <a
              href="#"
              className="
                hover:text-primary
              "
            >
              Privacidad
            </a>
            <a
              href="#"
              className="
                hover:text-primary
              "
            >
              Cookies
            </a>
            <div
              className="
                flex
                ml-4
                items-center gap-2
              "
            >
              <span
                className="
                  text-sm
                  material-symbols-outlined
                "
              >
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
