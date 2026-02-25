"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/src/lib/supabase-client";
import { sileo } from "sileo";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/ui/dialog";
import { Button } from "@/src/shared/ui/button";
import { Input } from "@/src/shared/ui/input";
import { Label } from "@/src/shared/ui/label";
import { Textarea } from "@/src/shared/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/ui/select";
import {
  Calculator,
  Save,
  User,
  Package,
  DollarSign,
  ShoppingCart,
  Plus,
  X,
} from "lucide-react";
import {
  TemuIcon,
  SheinIcon,
  AmazonIcon,
} from "@/src/features/common/platform-icons";
import { useI18n } from "@/src/shared/hooks/use-i18n";
import { useExchangeRate } from "@/src/shared/hooks/use-exchange-rate";

interface ProductItem {
  id: string;
  name: string;
  url: string;
  price: string;
  quantity: number;
  weight: string;
  store: string;
}

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (orderData: any) => void;
}

export function CreateOrderModal({
  isOpen,
  onClose,
  onSave,
}: CreateOrderModalProps) {
  const { t } = useI18n();

  // Fetch exchange rates from El Toque API
  const {
    exchangeRate,
    exchangeRates,
    loading: tasasLoading,
    error: tasasError,
  } = useExchangeRate();

  const [formData, setFormData] = useState({
    clientName: "",
    clientPhone: "",
    shippingAddress: "",
    shippingCity: "",
    notes: "",
  });

  // Use exchange rate from API, default to 420 if not loaded yet
  const [currentRate, setCurrentRate] = useState<number>(420);
  // Allow manual override of the rate
  const [manualRate, setManualRate] = useState<string>("");

  // Update rate when API data is available
  useEffect(() => {
    if (exchangeRate && !manualRate) {
      setCurrentRate(exchangeRate);
    }
  }, [exchangeRate, manualRate]);

  // Use manual rate if set, otherwise use API rate
  const effectiveRate = manualRate
    ? Number.parseFloat(manualRate)
    : currentRate;

  const [ordersInPackage, setOrdersInPackage] = useState("4");
  const [products, setProducts] = useState<ProductItem[]>([
    {
      id: "1",
      name: "",
      url: "",
      price: "",
      quantity: 1,
      weight: "",
      store: "",
    },
  ]);

  const [priceBreakdown, setPriceBreakdown] = useState<any>(null);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setPriceBreakdown(null);
  };

  const handleOrdersInPackageChange = (value: string) => {
    setOrdersInPackage(value);
    setPriceBreakdown(null);
  };

  const addProduct = () => {
    const newProduct: ProductItem = {
      id: Date.now().toString(),
      name: "",
      url: "",
      price: "",
      quantity: 1,
      weight: "",
      store: "",
    };
    setProducts([...products, newProduct]);
  };

  const removeProduct = (id: string) => {
    if (products.length > 1) {
      setProducts(products.filter((p) => p.id !== id));
      setPriceBreakdown(null);
    }
  };

  const updateProduct = (
    id: string,
    field: keyof ProductItem,
    value: string | number
  ) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
    setPriceBreakdown(null);
  };

  const calculatePrice = () => {
    let totalProductUSD = 0;
    let totalWeight = 0;

    products.forEach((product) => {
      const price = Number.parseFloat(product.price) || 0;
      const qty = product.quantity || 1;
      const weight = Number.parseFloat(product.weight) || 2.0;

      totalProductUSD += price * qty;
      totalWeight += weight * qty;
    });

    const ordersCount = Number.parseInt(ordersInPackage) || 4;
    const baseShipping = 10 / ordersCount;
    const weightShipping = totalWeight * 5.5;
    const operationalCost = 5;
    const insuranceRate = 3;
    const insuranceCost = (totalProductUSD * insuranceRate) / 100;
    const platformFee = 2;
    const totalShipping =
      baseShipping + weightShipping + operationalCost + insuranceCost;

    const totalCostUSD = totalProductUSD + totalShipping + platformFee;
    const rate = effectiveRate || 420;

    const commissionPercentage = 20;
    const commissionCUP = totalProductUSD * rate * (commissionPercentage / 100);

    const profitMarginPercentage = 15;
    const profitMarginCUP =
      totalProductUSD * rate * (profitMarginPercentage / 100);

    const finalPriceCUP = totalCostUSD * rate + commissionCUP + profitMarginCUP;

    const initialMargin = profitMarginCUP * 0.5;
    const firstPaymentUSD = totalProductUSD + insuranceCost + platformFee;
    const firstPaymentCUP = firstPaymentUSD * rate + initialMargin;

    const remainingMargin = profitMarginCUP * 0.5;
    const secondPaymentUSD = totalShipping - insuranceCost;
    const secondPaymentCUP =
      secondPaymentUSD * rate + remainingMargin + commissionCUP;

    setPriceBreakdown({
      totalProductUSD,
      totalWeight,
      baseShippingUSD: baseShipping,
      weightShippingUSD: weightShipping,
      totalShippingUSD: totalShipping,
      operationalCost,
      insuranceCost,
      platformFee,
      totalCostUSD,
      exchangeRate: rate,
      commissionPercentage,
      commissionCUP,
      profitMarginPercentage,
      profitMarginCUP,
      finalPriceCUP,
      firstPaymentCUP,
      secondPaymentCUP,
    });
  };

  const handleSave = async () => {
    const orderNumber = `ORD-${Date.now()}`;
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // First, create or get the client
      const clientData = {
        full_name: formData.clientName,
        email: formData.clientName.toLowerCase().replace(/\s+/g, '.') + '@client.local',
        phone: formData.clientPhone,
        address: formData.shippingAddress,
        city: formData.shippingCity,
      };

      // Check if client already exists by phone
      const { data: existingClient } = await supabase
        .from('clients')
        .select('id')
        .eq('phone', formData.clientPhone)
        .single();

      let clientId = existingClient?.id;

      // If client doesn't exist, create them
      if (!clientId) {
        const { data: newClient, error: clientError } = await supabase
          .from('clients')
          .insert([clientData])
          .select('id')
          .single();

        if (clientError) {
          console.error('Error creating client:', clientError);
          sileo.error({ title: 'Error al crear cliente' });
          return;
        }
        clientId = newClient?.id;
      }

      // Prepare order data for Supabase - matching the new schema
      const orderData = {
        order_number: orderNumber,
        client_id: clientId,
        manager_id: null,
        status: "pending",
        total_amount:
          (priceBreakdown?.finalPriceCUP || 0) /
          (priceBreakdown?.exchangeRate || 1),
        shipping_cost:
          (priceBreakdown?.baseShippingUSD || 0) +
          (priceBreakdown?.weightShippingUSD || 0),
        profit_margin:
          (((priceBreakdown?.finalPriceCUP || 0) -
            (priceBreakdown?.commissionCUP || 0)) /
            (priceBreakdown?.exchangeRate || 1)) *
          0.1,
        currency: "USD",
        amount_paid: 0,
        items: products.map((product) => ({
          name: product.name,
          url: product.url,
          quantity: parseInt(String(product.quantity)) || 1,
          price: parseFloat(String(product.price)) || 0,
          store: product.store,
          weight: product.weight,
        })),
        admin_notes: formData.notes || "",
      };

      // Save to Supabase
      const { data, error } = await supabase
        .from("orders")
        .insert([orderData])
        .select("*")
        .single();

      if (error) {
        if (
          error.message.includes("relation") &&
          error.message.includes("does not exist")
        ) {
          sileo.error({
            title: "Error: La tabla de pedidos no existe",
            fill: "#171717",
          });
        } else if (error.message.includes("duplicate key")) {
          sileo.error({
            title: "Error: Ya existe un pedido con este número",
            fill: "#171717",
          });
        } else {
          sileo.error({
            title: "Error al guardar: " + error.message,
            fill: "#171717",
          });
        }
        return;
      }

      sileo.success({
        title: "Pedido " + orderNumber + " guardado exitosamente!",
        fill: "#171717",
      });

      // Call onSave with local data (for any local state updates)
      onSave({
        ...orderData,
        id: data?.[0]?.id,
      });

      onClose();
      setFormData({
        clientName: "",
        clientPhone: "",
        shippingAddress: "",
        shippingCity: "",
        notes: "",
      });
      setProducts([
        {
          id: "1",
          name: "",
          url: "",
          price: "",
          quantity: 1,
          weight: "",
          store: "",
        },
      ]);
      setPriceBreakdown(null);
    } catch (error) {
      sileo.error({ title: "Error al procesar el pedido" });
    }
  };

  const isFormValid =
    formData.clientName &&
    formData.clientPhone &&
    products.some((p) => p.name && p.price);

  const shippingPerOrder = (
    10 / Number.parseInt(ordersInPackage || "4")
  ).toFixed(2);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[98vw] max-w-[98vw] max-h-[98vh] overflow-hidden p-0 bg-white">
        <DialogHeader className="px-6 py-4 border-b bg-white">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-white">
            <div className="flex items-center justify-center size-10 rounded-xl bg-primary/20 text-primary">
              <Package className="size-5" />
            </div>
            {t("createOrder.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="w-full h-[calc(98vh-200px)] overflow-y-auto px-6 py-4 space-y-4">
          {/* Configuración*/}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="space-y-2">
              <Label
                htmlFor="exchangeRate"
                className="text-sm font-medium text-slate-700 flex items-center gap-2"
              >
                <DollarSign className="size-4 text-primary" />
                {t("createOrder.exchangeRate")}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                  1 USD =
                </span>
                <Input
                  id="exchangeRate"
                  type="text"
                  step="0.01"
                  value={
                    manualRate ||
                    (effectiveRate > 0 ? effectiveRate.toString() : "")
                  }
                  onChange={(e) => {
                    setManualRate(e.target.value);
                    setPriceBreakdown(null);
                  }}
                  placeholder="420"
                  className="pl-16 text-slate-500 font-semibold h-10 text-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="ordersInPackage"
                className="text-sm font-medium text-slate-700 flex items-center gap-2"
              >
                <Package className="size-4 text-primary" />
                {t("createOrder.ordersPerPackage")}
              </Label>
              <Input
                id="ordersInPackage"
                type="number"
                min="1"
                max="10"
                value={ordersInPackage}
                onChange={(e) => handleOrdersInPackageChange(e.target.value)}
                className="font-semibold h-10 text-lg"
              />
            </div>
          </div>

          <div className="flex items-center justify-between w-full">
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg w-full">
              <p className="text-sm text-green-400 font-medium">
                📦 $10 ÷ {ordersInPackage} = ${shippingPerOrder} USD/
                {t("createOrder.ordersPerPackage").toLowerCase()}
              </p>
            </div>
          </div>

          {/* Client & Products - Full Width Maximizado */}
          <div className="grid grid-cols-1 gap-6 w-full">
            {/* Client Info - Full Width */}
            <div className="backdrop-blur-sm border rounded-xl p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                <User className="size-5 text-primary" />
                {t("createOrder.client")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label
                    htmlFor="clientName"
                    className="text-sm text-slate-400"
                  >
                    {t("createOrder.clientName")} *
                  </Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => handleChange("clientName", e.target.value)}
                    placeholder={t("createOrder.clientName")}
                    className="h-10 text-base"
                  />
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="clientPhone"
                    className="text-sm text-slate-400"
                  >
                    {t("createOrder.clientPhone")} *
                  </Label>
                  <Input
                    id="clientPhone"
                    value={formData.clientPhone}
                    onChange={(e) =>
                      handleChange("clientPhone", e.target.value)
                    }
                    placeholder="+53 5xxx xxxx"
                    className="h-10 text-base"
                  />
                </div>

                <div className="col-span-full space-y-1">
                  <Label
                    htmlFor="shippingAddress"
                    className="text-sm text-slate-400"
                  >
                    {t("createOrder.address")}
                  </Label>
                  <Input
                    id="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={(e) =>
                      handleChange("shippingAddress", e.target.value)
                    }
                    placeholder={t("createOrder.address")}
                    className="h-10 text-base"
                  />
                </div>

                <div className="col-span-full space-y-1">
                  <Label
                    htmlFor="shippingCity"
                    className="text-sm text-slate-400"
                  >
                    {t("createOrder.city")}
                  </Label>
                  <Input
                    id="shippingCity"
                    value={formData.shippingCity}
                    onChange={(e) =>
                      handleChange("shippingCity", e.target.value)
                    }
                    placeholder={t("createOrder.city")}
                    className="h-10 text-base"
                  />
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="backdrop-blur-sm border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2 text-lg">
                  <ShoppingCart className="size-5 text-primary" />
                  {t("createOrder.products")} ({products.length})
                </h3>
                <Button
                  type="button"
                  onClick={addProduct}
                  className="h-9 px-4 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 text-sm"
                >
                  <Plus className="size-4 mr-2" />
                  {t("createOrder.addProduct")}
                </Button>
              </div>

              <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 -mr-2">
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className="border border-slate-300 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-primary">
                        {t("createOrder.products")} #{index + 1}
                      </span>
                      {products.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeProduct(product.id)}
                          className="h-8 w-8 p-0 bg-red-500/20 hover:bg-red-500/40 text-red-400 border-0"
                        >
                          <X className="size-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                      {/* Nombre del producto */}
                      <div className="md:col-span-5 space-y-1">
                        <Input
                          value={product.name}
                          onChange={(e) =>
                            updateProduct(product.id, "name", e.target.value)
                          }
                          placeholder={t("createOrder.productName")}
                          className="text-base h-10"
                        />
                      </div>

                      {/* Fila de campos secundarios */}
                      <div className="md:col-span-1 space-y-1">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                            $
                          </span>
                          <Input
                            type="number"
                            step="0.01"
                            value={product.price}
                            onChange={(e) =>
                              updateProduct(product.id, "price", e.target.value)
                            }
                            placeholder={t("createOrder.productPrice")}
                            className="pl-8 text-base h-10"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-1 space-y-1">
                        <Input
                          type="number"
                          min="1"
                          value={product.quantity}
                          onChange={(e) =>
                            updateProduct(
                              product.id,
                              "quantity",
                              Number.parseInt(e.target.value) || 1
                            )
                          }
                          placeholder={t("createOrder.productQuantity")}
                          className="text-base h-10 "
                        />
                      </div>

                      <div className="md:col-span-1 space-y-1">
                        <Input
                          type="number"
                          step="0.1"
                          value={product.weight}
                          onChange={(e) =>
                            updateProduct(product.id, "weight", e.target.value)
                          }
                          placeholder={t("createOrder.productWeight")}
                          className="text-base h-10"
                        />
                      </div>

                      {/* Store */}
                      <div className="md:col-span-1 space-y-1">
                        <Select
                          value={product.store}
                          onValueChange={(value) =>
                            updateProduct(product.id, "store", value)
                          }
                        >
                          <SelectTrigger className="text-base h-10">
                            <SelectValue
                              placeholder={t("createOrder.selectStore")}
                            />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem
                              value="Temu"
                              className="text-white text-base py-2"
                            >
                              <TemuIcon className="w-4 h-4 inline mr-2" />
                              {t("createOrder.temu")}
                            </SelectItem>
                            <SelectItem
                              value="Shein"
                              className="text-white text-base py-2"
                            >
                              <SheinIcon className="w-4 h-4 inline mr-2" />
                              {t("createOrder.shein")}
                            </SelectItem>
                            <SelectItem
                              value="Amazon"
                              className="text-white text-base py-2"
                            >
                              <AmazonIcon className="w-4 h-4 inline mr-2" />
                              {t("createOrder.amazon")}
                            </SelectItem>
                            <SelectItem
                              value="Otro"
                              className="text-white text-base py-2"
                            >
                              {t("createOrder.other")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* URL*/}
                      <div className="md:col-span-5 space-y-1">
                        <Input
                          value={product.url}
                          onChange={(e) =>
                            updateProduct(product.id, "url", e.target.value)
                          }
                          placeholder={t("createOrder.productUrl")}
                          className="text-base h-10 font-mono"
                        />
                      </div>

                      {/* Notes */}
                      <div className="md:col-span-5 space-y-1">
                        <Textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) =>
                            handleChange("notes", e.target.value)
                          }
                          placeholder={t("createOrder.notes")}
                          rows={3}
                          className="resize-none text-base h-24"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Prices */}
          <div className="backdrop-blur-sm border rounded-xl p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold flex items-center gap-2 text-lg">
                <Calculator className="size-5 text-primary" />
                {t("createOrder.paymentSystem")}
              </h3>
              <Button
                onClick={calculatePrice}
                disabled={!products.some((p) => p.price)}
                className="h-10 px-6 bg-gradient-to-r from-primary to-orange-400 hover:from-primary/90 text-white text-base"
              >
                <Calculator className="size-5 mr-2" />
                {t("createOrder.calculate")}
              </Button>
            </div>

            {priceBreakdown && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Primer Pago */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5">
                  <h4 className="font-semibold text-blue-400 mb-3 text-base">
                    {t("createOrder.firstPayment")}
                  </h4>
                  <p className="text-sm text-slate-500 mb-4">
                    {t("createOrder.firstPaymentDesc")}
                  </p>
                  <div className="space-y-2 text-base text-slate-700">
                    <div className="flex justify-between py-2 border-b border-blue-500/20">
                      <span>{t("createOrder.productCost")}:</span>
                      <span className="font-medium">
                        ${priceBreakdown.totalProductUSD.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-blue-500/20">
                      <span>{t("createOrder.insurance")}:</span>
                      <span className="font-medium">
                        ${priceBreakdown.insuranceCost.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-blue-500/20">
                      <span>{t("createOrder.platformFee")}:</span>
                      <span className="font-medium">
                        ${priceBreakdown.platformFee.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-3 font-bold text-blue-400 text-lg">
                      <span>{t("createOrder.total")}:</span>
                      <span className="font-extrabold">
                        $
                        {priceBreakdown.firstPaymentCUP.toLocaleString("es-CU")}{" "}
                        CUP
                      </span>
                    </div>
                  </div>
                </div>

                {/* Segundo Pago */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5">
                  <h4 className="font-semibold text-green-400 mb-3 text-base">
                    {t("createOrder.secondPayment")}
                  </h4>
                  <p className="text-sm text-slate-500 mb-4">
                    {t("createOrder.secondPaymentDesc")}
                  </p>
                  <div className="space-y-2 text-base text-slate-700">
                    <div className="flex justify-between py-2 border-b border-green-500/20">
                      <span>{t("createOrder.shippingBase")}:</span>
                      <span className="font-medium">
                        ${priceBreakdown.baseShippingUSD.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-green-500/20">
                      <span>
                        {t("createOrder.weightCost")} (
                        {priceBreakdown.totalWeight.toFixed(1)} lb):
                      </span>
                      <span className="font-medium">
                        ${priceBreakdown.weightShippingUSD.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-green-500/20">
                      <span>{t("createOrder.operational")}:</span>
                      <span className="font-medium">
                        ${priceBreakdown.operationalCost.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-green-500/20">
                      <span>{t("createOrder.commission")}:</span>
                      <span className="font-medium">
                        ${priceBreakdown.commissionCUP.toLocaleString("es-CU")}{" "}
                        CUP
                      </span>
                    </div>
                    <div className="flex justify-between pt-3 font-bold text-green-400 text-lg">
                      <span>{t("createOrder.total")}:</span>
                      <span className="font-extrabold">
                        $
                        {priceBreakdown.secondPaymentCUP.toLocaleString(
                          "es-CU"
                        )}{" "}
                        CUP
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-3 italic">
                      {t("createOrder.recalculateWarning")}
                    </p>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-gradient-to-br from-primary/20 to-orange-500/20 border-2 border-primary/50 rounded-xl p-5 flex flex-col justify-center">
                  <div className="text-center">
                    <span className="text-base text-slate-600">
                      {t("createOrder.total")}
                    </span>
                    <div className="text-4xl font-extrabold text-primary mt-2">
                      $
                      {(
                        priceBreakdown.firstPaymentCUP +
                        priceBreakdown.secondPaymentCUP
                      ).toLocaleString("es-CU")}
                    </div>
                    <div className="text-xl text-green-400 font-bold mt-1">
                      {t("createOrder.totalCUP")}
                    </div>
                    <div className="text-base text-slate-700 mt-3">
                      ≈ $
                      {(
                        (priceBreakdown.firstPaymentCUP +
                          priceBreakdown.secondPaymentCUP) /
                        priceBreakdown.exchangeRate
                      ).toFixed(2)}{" "}
                      USD
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save Button  */}
          <Button
            onClick={handleSave}
            disabled={!isFormValid || !priceBreakdown}
            className="w-full h-16 text-lg font-bold text-white bg-gradient-to-r from-green-900 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            <Save className="size-6 mr-3" />
            {t("createOrder.saveOrder")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
