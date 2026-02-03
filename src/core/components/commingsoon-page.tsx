"use client";

import Link from "next/link";
import { Button } from "@/src/shared/ui/button";
import { useI18n } from "@/src/shared/hooks/use-i18n";
import { ShoppingBag } from "./icons/ShoppingBag";
import { GlobeAmericas } from "./icons/GlobeAmericas";
import { Mail } from "./icons/Mail";
import { ClockFill } from "./icons/ClockFill";
import { Globe2 } from "./icons/Globe2";
import { ShieldFillCheck } from "./icons/ShieldFillCheck";
import { MegaphoneFill } from "./icons/MegaphoneFill";
import { Share } from "./icons/Share";
import { AlternateEmail } from "./icons/AlternateEmal";

export default function ComingSoonPage() {
  const { t } = useI18n();

  const colors = {
    primary: "#fb7e51",
    "background-light": "#f8f6f5",
    "background-dark": "#23140f",
    "electric-blue": "#e0f2fe",
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-[#1c110d] dark:text-white transition-colors duration-300">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        {/* Header / TopNavBar */}
        <header className="flex items-center justify-between whitespace-nowrap px-6 py-6 md:px-20 lg:px-40">
          <div className="flex items-center gap-3">
            <div className="text-primary flex items-center justify-center">
              <span
                className="material-symbols-outlined text-4xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                <ShoppingBag color={colors.primary} size={40} />
              </span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">VentasYa</h2>
          </div>
          <div className="hidden md:block">
            <span className="text-sm font-medium opacity-60">
              {t("common.coming_soon.year_text")} {new Date().getFullYear()}
            </span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
          <div className="max-w-[800px] w-full flex flex-col items-center">
            {/* Pulsing Icon */}
            <div className="mb-10 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl pulse-slow"></div>
              <div className="relative bg-white dark:bg-background-dark p-8 rounded-full shadow-xl border border-primary/10">
                <span
                  className="material-symbols-outlined text-primary text-7xl md:text-8xl pulse-slow"
                  style={{ fontVariationSettings: "FILL 0, wght 200" }}
                >
                  <GlobeAmericas color={colors.primary} size={100} />
                </span>
              </div>
            </div>

            {/* Hero Section Text */}
            <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6">
              {t("common.coming_soon.title.section_1")}{" "}
              <br className="hidden md:block" />{" "}
              {t("common.coming_soon.title.section_2")}.
            </h1>
            <p className="text-lg md:text-xl font-normal leading-relaxed opacity-80 mb-10 max-w-[600px]">
              {t("common.coming_soon.description")}
            </p>

            {/* Email Capture Form */}
            <div className="w-full max-w-[500px] mb-12">
              <form className="relative group">
                <div className="flex flex-col md:flex-row w-full gap-3 p-2 bg-white/50 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl md:rounded-full shadow-2xl">
                  <div className="flex items-center flex-1 px-4">
                    <span className="material-symbols-outlined text-[#9e5e47] mr-3">
                      <Mail color={colors.primary} size={24} />
                    </span>
                    <input
                      className="w-full bg-transparent border-none focus:ring-0 text-lg placeholder:text-[#9e5e47]/60"
                      placeholder={t("common.email_placeholder")}
                      required
                      type="email"
                    />
                  </div>
                  <button
                    className="text-white font-bold py-4 px-8 rounded-xl md:rounded-full transition-all transform active:scale-95 shadow-lg"
                    style={{
                      backgroundColor: colors.primary,
                      boxShadow: `0 10px 25px ${colors.primary}40`, // 40 = 25% de opacidad
                    }}
                    onMouseEnter={(e) => {
                      if (e.currentTarget instanceof HTMLElement) {
                        e.currentTarget.style.backgroundColor = `${colors.primary}CC`; // 80% de opacidad
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (e.currentTarget instanceof HTMLElement) {
                        e.currentTarget.style.backgroundColor = colors.primary;
                      }
                    }}
                    type="submit"
                  >
                    {t("common.notify_me")}
                  </button>
                </div>
              </form>
              <p className="mt-4 text-xs opacity-50 uppercase tracking-widest font-bold">
                {t("common.be_first_to_know")}
              </p>
            </div>

            {/* Stats / Quick Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8">
              <div className="flex flex-col gap-2 rounded-xl p-6 border border-primary/10 bg-white/30 dark:bg-white/5 backdrop-blur-sm">
                <span className="text-primary mb-2 flex items-center justify-center">
                  <ClockFill color={colors.primary} size={30} viewBox="0 0 20 20"/>
                </span>
                <p className="text-sm font-medium opacity-70">
                  {t("common.launch")}
                </p>
                <p className="text-xl font-bold">{t("common.very_soon")}</p>
              </div>
              <div className="flex flex-col gap-2 rounded-xl p-6 border border-primary/10 bg-white/30 dark:bg-white/5 backdrop-blur-sm">
                <span className="text-primary mb-2 flex items-center justify-center">
                  <Globe2 color={colors.primary} size={30} viewBox="0 0 20 20"/>
                </span>
                <p className="text-sm font-medium opacity-70">
                  {t("common.shippings")}
                </p>
                <p className="text-xl font-bold">{t("common.globals")}</p>
              </div>
              <div className="flex flex-col gap-2 rounded-xl p-6 border border-primary/10 bg-white/30 dark:bg-white/5 backdrop-blur-sm">
                <span className="text-primary mb-2 flex items-center justify-center">
                  <ShieldFillCheck color={colors.primary} size={30} viewBox="0 0 20 20"/>
                </span>
                <p className="text-sm font-medium opacity-70">
                  {t("common.coming_soon.security")}
                </p>
                <p className="text-xl font-bold">
                  {t("common.100_guaranteed")}
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="flex flex-col gap-6 px-6 py-10 text-center items-center border-t border-primary/5">
          <div className="flex flex-wrap justify-center gap-8">
            <Link
              href="/privacy"
              className="text-[#9e5e47] dark:text-[#fcf9f8]/60 text-sm font-medium hover:text-primary transition-colors"
            >
              {t("footer.privacy")}
            </Link>
            <Link
              href="/terms"
              className="text-[#9e5e47] dark:text-[#fcf9f8]/60 text-sm font-medium hover:text-primary transition-colors"
            >
              {t("footer.terms")}
            </Link>
            <Link
              href="/support"
              className="text-[#9e5e47] dark:text-[#fcf9f8]/60 text-sm font-medium hover:text-primary transition-colors"
            >
              {t("footer.support")}
            </Link>
          </div>
          <div className="flex gap-6">
            <Link
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
            >
              <span className="text-primary mb-2 flex items-center justify-center">
                <MegaphoneFill color={colors.primary} size={24} viewBox="0 0 20 10"/>
              </span>
            </Link>
            <Link
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
            >
              <span className="text-primary mb-2 flex items-center justify-center">
                <Share color={colors.primary} size={24} viewBox="0 0 20 10"/>
              </span>
            </Link>
            <Link
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
            >
              <span className="text-xl flex items-center justify-center">
                <AlternateEmail color={colors.primary} size={30} viewBox="0 0 30 30"/>
              </span>
            </Link>
          </div>
          <p className="text-[#9e5e47] dark:text-[#fcf9f8]/40 text-sm font-medium">
            © {new Date().getFullYear()} VentasYa. {t("common.all_rights_reserved")}.
          </p>
        </footer>
      </div>
    </div>
  );
}
