'use client';

import Link from 'next/link';
import { Button } from '@/src/shared/ui/button';
import { useI18n } from '@/src/hooks/use-i18n';

export default function NotFoundPage() {
  const { t } = useI18n();

  return (
    <div className="bg-background-light dark:bg-background-dark text-[#0d141c] dark:text-slate-200 min-h-screen flex flex-col overflow-x-hidden">
      {/* TopNavBar */}
      <div className="layout-container flex flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e6edf4] dark:border-slate-800 px-6 md:px-10 py-4 bg-background-light dark:bg-background-dark">
          <div className="flex items-center gap-4 text-[#0d141c] dark:text-white">
            <div className="text-primary">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z" fill="currentColor"></path>
                <path clipRule="evenodd" d="M39.998 35.764C39.9944 35.7463 39.9875 35.7155 39.9748 35.6706C39.9436 35.5601 39.8949 35.4259 39.8346 35.2825C39.8168 35.2403 39.7989 35.1993 39.7813 35.1602C38.5103 34.2887 35.9788 33.0607 33.7095 32.5189C30.9875 31.8691 27.6413 31.4783 24 31.4783C20.3587 31.4783 17.0125 31.8691 14.2905 32.5189C12.0012 33.0654 9.44505 34.3104 8.18538 35.1832C8.17384 35.2075 8.16216 35.233 8.15052 35.2592C8.09919 35.3751 8.05721 35.4886 8.02977 35.589C8.00356 35.6848 8.00039 35.7333 8.00004 35.7388C8.00004 35.739 8 35.7393 8.00004 35.7388C8.00004 35.7641 8.0104 36.0767 8.68485 36.6314C9.34546 37.1746 10.4222 37.7531 11.9291 38.2772C14.9242 39.319 19.1919 40 24 40C28.8081 40 33.0758 39.319 36.0709 38.2772C37.5778 37.7531 38.6545 37.1746 39.3151 36.6314C39.9006 36.1499 39.9857 35.8511 39.998 35.764ZM4.95178 32.7688L21.4543 6.30267C22.6288 4.4191 25.3712 4.41909 26.5457 6.30267L43.0534 32.777C43.0709 32.8052 43.0878 32.8338 43.104 32.8629L41.3563 33.8352C43.104 32.8629 43.1038 32.8626 43.104 32.8629L43.1051 32.865L43.1065 32.8675L43.1101 32.8739L43.1199 32.8918C43.1276 32.906 43.1377 32.9246 43.1497 32.9473C43.1738 32.9925 43.2062 33.0545 43.244 33.1299C43.319 33.2792 43.4196 33.489 43.5217 33.7317C43.6901 34.1321 44 34.9311 44 35.7391C44 37.4427 43.003 38.7775 41.8558 39.7209C40.6947 40.6757 39.1354 41.4464 37.385 42.0552C33.8654 43.2794 29.133 44 24 44C18.867 44 14.1346 43.2794 10.615 42.0552C8.86463 41.4464 7.30529 40.6757 6.14419 39.7209C4.99695 38.7775 3.99999 37.4427 3.99999 35.7391C3.99999 34.8725 4.29264 34.0922 4.49321 33.6393C4.60375 33.3898 4.71348 33.1804 4.79687 33.0311C4.83898 32.9556 4.87547 32.8935 4.9035 32.8471C4.91754 32.8238 4.92954 32.8043 4.93916 32.7889L4.94662 32.777L4.95178 32.7688ZM35.9868 29.004L24 9.77997L12.0131 29.004C12.4661 28.8609 12.9179 28.7342 13.3617 28.6282C16.4281 27.8961 20.0901 27.4783 24 27.4783C27.9099 27.4783 31.5719 27.8961 34.6383 28.6282C35.082 28.7342 35.5339 28.8609 35.9868 29.004Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-[#0d141c] dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">VentasYa</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary/20" data-alt="User avatar placeholder" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDLpnKYj9I1zUhzPxUk2d726bmkEuCHZyjSZNBtRLMfyMMBSRYyu546JtJBvuPHGIciSi8sNjcLZMZvTF7MQ6DecFEVHMTvQ5aJaGctW13F9HtcKkZWOb7RjGAny47chR0gQb9bssxtme5lf9O36f52Ji572lOLcT1qfSdziGIEIwry070cDeY4-ah7vmJInnrkOwug7AoW6DjRb3ncrP3aD8qha_1H9bAtdaAfd36HUz91xBBulorgX34_cc-QeIpaZteN2Gch1Bw")'}}></div>
          </div>
        </header>
      </div>
      
      {/* Main Content Area (EmptyState with customization) */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-[960px] w-full flex flex-col items-center">
          <div className="flex flex-col items-center gap-8 w-full">
            {/* Illustration */}
            <div className="relative w-full max-w-[500px] aspect-[4/3] rounded-2xl flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20 dark:from-primary/10 dark:to-transparent"></div>
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-primary text-[120px] mb-4 material-symbols-outlined">
                  airplanemode_inactive
                </span>
                <div className="flex gap-4">
                  <span className="text-primary/40 text-4xl animate-bounce material-symbols-outlined">inventory_2</span>
                  <span className="text-primary/60 text-5xl material-symbols-outlined">inventory_2</span>
                  <span className="text-primary/40 text-4xl material-symbols-outlined">inventory_2</span>
                </div>
              </div>
              {/* Decorative floating boxes */}
              <div className="absolute top-10 right-10 opacity-20 transform rotate-12">
                <span className="text-6xl material-symbols-outlined">box_edit</span>
              </div>
              <div className="absolute bottom-10 left-10 opacity-20 transform -rotate-12">
                <span className="text-6xl material-symbols-outlined">local_shipping</span>
              </div>
            </div>
            
            {/* Text Content */}
            <div className="flex max-w-[540px] flex-col items-center gap-4 text-center">
              <h1 className="text-primary text-5xl font-extrabold tracking-tight">404</h1>
              <h2 className="text-[#0d141c] dark:text-white text-3xl font-bold leading-tight tracking-[-0.015em]">{t('common.not_found')}</h2>
              <p className="text-[#4f7396] dark:text-slate-400 text-lg font-normal leading-relaxed">
                {t('common.page_not_found')}
              </p>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col items-center gap-6 w-full">
              <Link href="/">
                <Button className="flex min-w-[240px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-8 bg-primary text-white text-lg font-bold leading-normal tracking-[0.015em] transition-all hover:bg-primary/90 shadow-lg shadow-primary/20 active:scale-95">
                  <span className="material-symbols-outlined mr-2">home</span>
                  <span className="truncate">{t('common.go_home')}</span>
                </Button>
              </Link>
              
              {/* MetaText Component styled as a secondary link */}
              <Link href="/soporte" className="group flex items-center gap-2 text-[#47739e] dark:text-primary text-base font-semibold leading-normal underline decoration-2 underline-offset-4 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-xl">support_agent</span>
                {t('common.contact_support')}
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <div className="px-6 md:px-10 bg-background-light dark:bg-background-dark">
        <footer className="flex flex-col gap-6 py-10 text-center border-t border-solid border-[#e6edf4] dark:border-slate-800">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/privacy" className="text-[#47739e] dark:text-slate-400 text-base font-normal leading-normal hover:text-primary transition-colors">{t('footer.privacy')}</Link>
            <Link href="/terms" className="text-[#47739e] dark:text-slate-400 text-base font-normal leading-normal hover:text-primary transition-colors">{t('footer.terms')}</Link>
            <Link href="/help" className="text-[#47739e] dark:text-slate-400 text-base font-normal leading-normal hover:text-primary transition-colors">{t('footer.help')}</Link>
          </div>
          <p className="text-[#47739e] dark:text-slate-500 text-sm font-normal leading-normal">
            © 2024 VentasYa. {t('common.all_rights_reserved')}.
          </p>
        </footer>
      </div>
    </div>
  );
}