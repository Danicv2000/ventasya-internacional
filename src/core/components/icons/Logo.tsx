import React from "react";

// Definimos tipos para las props (permite pasar className o estilos extra)
interface LogoProps extends React.SVGProps<SVGSVGElement> {
  // Puedes agregar más props si necesitas, como 'color'
}

export const Logo: React.FC<LogoProps> = ({ className = "", ...props }) => {
    return (
        <svg
            {...props}
            fill="none"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            // Usamos merge de clases: por defecto tamaño medio, y lo que tú le pases
            className={`w-14 h-14 ${className}`}
        >
            <path
                d="M20 35L50 50L80 35L50 20L20 35Z"
                stroke="#5100ff"
                strokeLinejoin="round"
                strokeWidth="3"
            ></path>
            <path
                d="M20 35V65L50 80M80 35V65L50 80M50 50V80"
                stroke="#5100ff"
                strokeLinejoin="round"
                strokeWidth="3"
            ></path>
            <path
                d="M50 50L70 40M50 50L30 40"
                stroke="#0052FF"
                strokeLinecap="round"
                strokeWidth="3"
            ></path>
        </svg>
    );
};