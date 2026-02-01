# 📚 Documentación del Proyecto

Bienvenido a la documentación completa para el despliegue de Ventasya Internacional.

## 🗂️ Índice de Documentos

### 🚀 **Guías Principales**

#### [ARQUITECTURA_MODULAR.md](./docs/ARQUITECTURA_MODULAR.md)
Documentación completa de la nueva arquitectura modular.
- Estructura de directorios
- Convenciones de nomenclatura
- Beneficios de la arquitectura
- Rutas de importación

#### [DEPLOYMENT-GUIDE.md](./docs/DEPLOYMENT-GUIDE.md)
Guía completa paso a paso para desplegar en GitHub Pages.
- Configuración del proyecto
- Manejo de variables de entorno
- Despliegue manual y automático
- Troubleshooting

#### [QUICK-START.md](./docs/QUICK-START.md)
Versión resumida para despliegue rápido.
- Pasos esenciales
- Configuración mínima
- Despliegue en 5 minutos

### 🔐 **Seguridad**

#### [SECURITY-GUIDE.md](./docs/SECURITY-GUIDE.md)
Manejo seguro de variables de entorno y claves.
- Buenas prácticas de seguridad
- Configuración de GitHub Secrets
- Prevención de exposición de claves
- Rotación de credenciales

### ❓ **Ayuda**

#### [FAQ.md](./docs/FAQ.md)
Respuestas a preguntas frecuentes.
- Problemas técnicos comunes
- Alternativas de hosting
- Optimización y performance
- Soporte y comunidad

---

## 🎯 ¿Por dónde empezar?

### Si es tu primera vez:
1. Lee [QUICK-START.md](./docs/QUICK-START.md) para desplegar rápidamente
2. Consulta [FAQ.md](./docs/FAQ.md) si tienes dudas

### Si necesitas detalle técnico:
1. Sigue [DEPLOYMENT-GUIDE.md](./docs/DEPLOYMENT-GUIDE.md) completo
2. Revisa [SECURITY-GUIDE.md](./docs/SECURITY-GUIDE.md) para buenas prácticas

---

## 🛠️ Tecnologías Utilizadas

- **Framework**: Next.js 16
- **Autenticación**: Supabase Auth
- **Hosting**: GitHub Pages
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Arquitectura**: Modular (Feature-Sliced Design)

---

## 📁 Estructura del Proyecto

```
ventasya-internacional/
├── app/                 # Páginas de la aplicación
├── src/                 # Código fuente modularizado
│   ├── core/            # Componentes y funcionalidades centrales
│   ├── features/        # Características específicas del negocio
│   ├── shared/          # Recursos compartidos
│   ├── utils/           # Utilidades y funciones auxiliares
│   └── services/        # Servicios externos e integraciones
├── components/          # Componentes reutilizables (migrados al nuevo esquema)
├── contexts/            # Context providers
├── lib/                 # Librerías y utilidades
├── public/              # Assets estáticos
├── styles/              # Estilos globales
├── docs/                # Esta documentación
├── .env.local          # Variables locales (NO SUBIR)
├── .env.example        # Plantilla de variables (SÍ SUBIR)
└── ...
```

---

## 🔐 Variables de Entorno Requeridas

Crea `.env.local` con:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://ksexligqknyjgzvfhwoe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Importante**: Nunca subas `.env` al repositorio.

---

## 🚀 Comandos Básicos

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Build para producción
npm run build

# Linting
npm run lint
```

---

## 🤝 Contribución

1. Fork del repositorio
2. Crea rama feature/nueva-funcionalidad
3. Commit cambios
4. Push a la rama
5. Crea Pull Request

---

## 📞 Soporte

- **Issues**: [Crear issue en GitHub](https://github.com/TU_USUARIO/TU_REPO/issues)
- **Email**: [tu-email@ejemplo.com]
- **Discord**: [Link a servidor]

---

## 📄 Licencia

MIT License - Ver [LICENSE](.LICENSE) para más detalles.

---

## 🔄 Última Actualización

**Fecha**: Enero 2026  
**Versión**: 1.0.0  
**Autor**: Equipo Ventasya
