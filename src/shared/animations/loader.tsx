
'use client';

import { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';

export default function Loader() {
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const percentageTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cartPath = logoWrapperRef.current?.querySelector('#cart-path');
    const secureCheck = logoWrapperRef.current?.querySelector('#secure-check');
    const wheel1 = logoWrapperRef.current?.querySelector('#wheel-1');
    const wheel2 = logoWrapperRef.current?.querySelector('#wheel-2');
    const progressBar = progressBarRef.current;
    const percentageText = percentageTextRef.current;

    if (!cartPath || !secureCheck || !wheel1 || !wheel2 || !progressBar || !percentageText) {
      console.error('One or more animation targets not found');
      return;
    }

    // Initial state for morph targets
    (secureCheck as HTMLElement).style.opacity = '0';

    // --- ANIMATION SEQUENCE ---
    const sequence = anime.timeline({
      easing: 'easeOutCubic',
      duration: 1000,
    });

    // 1. Draw the main cart path
    sequence.add({
      targets: cartPath,
      strokeDashoffset: [anime.setDashoffset(cartPath as SVGElement), 0],
      duration: 1500,
      easing: 'easeInOutSine',
      begin: () => {
        percentageText.textContent = 'Loading assets...';
      },
    })
    // 2. Animate wheels appearing and rotating slightly
    .add({
      targets: [wheel1, wheel2],
      scale: [0, 1],
      rotate: 360,
      duration: 500,
      delay: 200,
      begin: () => {
        percentageText.textContent = 'Initializing secure gateway...';
      },
    })
    // 3. Animate the secure check mark
    .add({
      targets: secureCheck,
      opacity: [0, 1],
      scale: [0, 1],
      duration: 600,
      delay: 300,
      easing: 'spring(1, 80, 10, 0)',
      begin: () => {
        percentageText.textContent = 'Securing connection...';
      },
    })
    // 4. Animate the progress bar fill
    .add({
      targets: progressBar,
      width: '100%',
      duration: 2000,
      easing: 'linear',
      update: (anim: any) => {
        const percent = Math.round(anim.progress);
        percentageText.textContent = `Finalizing (${percent}%)`;
      },
      complete: () => {
        percentageText.textContent = 'Ready!';
      }
    });
  }, []);

  return (
    <main 
      className="min-h-screen flex items-center justify-center overflow-hidden bg-white bg-grid-dots relative font-sans antialiased text-slate-900"
      style={{
        backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
        backgroundSize: '30px 30px',
      }}
    >
      {/* Decorative Ambient Glow */}
      <div className="absolute w-[500px] h-[500px] bg-brand/5 rounded-full blur-[100px] animate-glow pointer-events-none"></div>
      
      <div className="z-10 flex flex-col items-center max-w-md w-full px-6">
        {/* Logo Container */}
        <div 
          ref={logoWrapperRef}
          className="relative mb-12 flex items-center justify-center"
          data-purpose="brand-identity"
        >
          {/* Background decorative ring */}
          <div className="absolute inset-0 scale-[1.8] opacity-10">
            <svg className="w-full h-full stroke-brand" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="none" r="48" strokeDasharray="4 4" strokeWidth="0.5"></circle>
            </svg>
          </div>
          
          {/* The Shopping Cart Logo (SVG) */}
          <svg fill="none" height="120" id="ventasya-logo" viewBox="0 0 100 100" width="120" xmlns="http://www.w3.org/2000/svg">
            {/* Main Cart Body Path (Optimized for Morphing) */}
            <path 
              className="logo-path" 
              d="M20 25H30L35 65H80L85 35H32" 
              id="cart-path" 
              stroke="#5100ff" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="4"
              style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}
            ></path>
            
            {/* Cart Wheels */}
            <circle cx="42" cy="78" fill="#5100ff" id="wheel-1" r="5" style={{ transformOrigin: '42px 78px' }}></circle>
            <circle cx="72" cy="78" fill="#5100ff" id="wheel-2" r="5" style={{ transformOrigin: '72px 78px' }}></circle>
            
            {/* Accent Flash (Secure/Speed check) */}
            <path 
              d="M45 45L52 52L65 38" 
              id="secure-check" 
              stroke="#5100ff" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="4"
            ></path>
          </svg>
        </div>
        
        {/* Typography & Status */}
        <div className="text-center" data-purpose="status-messaging">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">VentasYa</h1>
          <p className="text-slate-500 font-medium tracking-wide uppercase text-[10px] mb-8">Secure Premium Gateway</p>
          
          {/* Progress Bar Container */}
          <div className="w-64 h-1 bg-slate-100 rounded-full overflow-hidden relative" data-purpose="progress-bar">
            <div 
              ref={progressBarRef}
              className="absolute top-0 left-0 h-full bg-brand w-0 rounded-full"
              id="loading-bar"
            ></div>
          </div>
          
          {/* Percentage indicator */}
          <span 
            ref={percentageTextRef}
            className="block mt-4 text-xs font-semibold text-brand tabular-nums"
            id="percentage-text"
          >
            Preparing your experience...
          </span>
        </div>
        
        {/* Info Footer */}
        <div className="mt-20 flex items-center gap-3 text-slate-400" data-purpose="security-badges">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
            <span className="text-[11px] font-medium">SSL ENCRYPTED</span>
          </div>
          <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-medium tracking-widest uppercase">FAST DATA</span>
          </div>
        </div>
      </div>

      {/* Developer Note */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-full opacity-60 font-mono" data-purpose="dev-note">
        LOADING SEQUENCE ACTIVE
      </div>

      {/* Custom Styles via style tag or Tailwind JIT */}
      <style jsx global>{`
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }
        .animate-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        :root {
          --tw-bg-opacity: 1;
          color: rgb(15 23 42 / var(--tw-text-opacity));
          --tw-text-opacity: 1;
          background-color: rgb(255 255 255 / var(--tw-bg-opacity));
        }
        .bg-brand { --tw-bg-opacity: 1; background-color: rgb(81 0 255 / var(--tw-bg-opacity)); }
        .bg-brand\/5 { background-color: rgb(81 0 255 / 0.05); }
        .text-brand { --tw-text-opacity: 1; color: rgb(81 0 255 / var(--tw-text-opacity)); }
        .stroke-brand { --tw-stroke-opacity: 1; stroke: rgb(81 0 255 / var(--tw-stroke-opacity)); }
      `}</style>
    </main>
  );
}