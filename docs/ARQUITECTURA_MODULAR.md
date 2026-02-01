# Arquitectura Modular del Proyecto Ventasya Internacional

## Descripción General

Este documento describe la nueva arquitectura modular implementada en el proyecto Ventasya Internacional (también conocido como "EncargosYa"). La estructura modular mejora la organización del código, facilita el mantenimiento y permite una escalabilidad más eficiente.

## Estructura de Directorios

```
src/
├── core/                 # Componentes y funcionalidades centrales
│   ├── components/       # Componentes reutilizables del núcleo
│   ├── layout/           # Componentes de layout general
│   └── providers/        # Proveedores de contexto y estado global
├── features/             # Características específicas del negocio
│   ├── admin/            # Funcionalidades de administración
│   ├── calculator/       # Calculadoras y herramientas financieras
│   ├── orders/           # Gestión de pedidos
│   ├── stores/           # Funcionalidades de tiendas
│   ├── tracking/         # Seguimiento de envíos
│   └── reports/          # Generación de informes
├── shared/               # Recursos compartidos
│   ├── ui/               # Componentes de interfaz reutilizables
│   ├── hooks/            # Hooks personalizados
│   ├── types/            # Definiciones de tipos TypeScript
│   └── constants/        # Constantes globales
├── utils/                # Utilidades y funciones auxiliares
└── services/             # Servicios externos e integraciones
```

## Módulos Principales

### Core
Contiene los componentes y funcionalidades fundamentales que son utilizados a lo largo de toda la aplicación:
- Componentes de UI básicos
- Layout principal
- Proveedores de contexto (autenticación, temas, etc.)

### Features
Cada característica del negocio se encapsula en su propio módulo:
- **Admin**: Panel de administración y autenticación
- **Calculator**: Calculadoras de costos, envíos y comisiones
- **Orders**: Gestión completa de pedidos
- **Stores**: Integración con tiendas externas (Amazon, Shein, Temu)
- **Tracking**: Sistema de seguimiento de envíos
- **Reports**: Generación de informes y estadísticas

### Shared
Componentes y recursos que son utilizados por múltiples características:
- Componentes de UI reutilizables
- Hooks personalizados
- Tipos y constantes globales

### Utils
Funciones auxiliares y utilidades generales:
- Manipulación de fechas
- Formateo de números y monedas
- Validaciones
- Utilidades de strings

### Services
Capa de integración con servicios externos:
- APIs de terceros
- Servicios de autenticación
- Servicios de notificación

## Beneficios de la Arquitectura Modular

1. **Mantenibilidad**: Código organizado en módulos lógicos
2. **Reutilización**: Componentes compartidos fáciles de localizar
3. **Escalabilidad**: Nuevo funcionalidades pueden agregarse sin afectar otros módulos
4. **Colaboración**: Equipos pueden trabajar en módulos diferentes simultáneamente
5. **Testing**: Facilita el aislamiento y testing de componentes individuales

## Convenciones de Nomenclatura

- Los nombres de los archivos y directorios usan kebab-case
- Los componentes de React usan PascalCase
- Los archivos de estilo siguen la convención [nombre-componente].module.css
- Los archivos de test usan la extensión [.test.tsx] o [.spec.tsx]

## Rutas de Importación

La configuración de TypeScript en `tsconfig.json` permite rutas absolutas:

- `@/src/core/*` - Para componentes del núcleo
- `@/src/features/*` - Para características específicas
- `@/src/shared/*` - Para recursos compartidos
- `@/src/utils/*` - Para utilidades
- `@/src/services/*` - Para servicios

## Flujo de Trabajo

1. Identificar la característica o componente que se va a desarrollar
2. Determinar a qué módulo pertenece (features, shared, etc.)
3. Crear los archivos necesarios dentro del módulo correspondiente
4. Exportar componentes y utilidades públicas a través de archivos index.ts
5. Importar utilizando rutas absolutas con el alias @/

## Consideraciones Especiales

- La integración con Amazon tiene restricciones de scraping y requiere el uso de APIs de terceros autorizados
- El sistema de autenticación utiliza Supabase
- La aplicación está optimizada para el mercado cubano de compras internacionales
- Todos los precios y cálculos deben considerar tasas de cambio y comisiones aplicables