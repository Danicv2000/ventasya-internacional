# ❓ Preguntas Frecuentes sobre Despliegue

## 🚀 Despliegue en GitHub Pages

### ¿Cómo configuro mi proyecto para GitHub Pages?
1. Asegúrate de tener `next.config.mjs` configurado con `output: 'export'`
2. Crea workflow en `.github/workflows/deploy.yml`
3. Configura GitHub Pages en Settings → Pages

### ¿Dónde se despliega mi sitio?
`https://TU_USUARIO.github.io/NOMBRE_DEL_REPO`

Ejemplo: `https://juanito.github.io/ventasya-internacional`

---

## 🔐 Variables de Entorno

### ¿Por qué no puedo subir .env al repositorio?
Porque contiene información sensible como claves de API que no deben ser públicas.

### ¿Cómo accedo a las variables en producción?
Usa GitHub Secrets y configúralas en el workflow de despliegue.

### ¿Qué diferencia hay entre NEXT_PUBLIC_ y variables normales?
- `NEXT_PUBLIC_*`: Se envían al cliente (navegador), pueden ser vistas
- Sin `NEXT_PUBLIC_`: Solo existen en el servidor, no se exponen

### ¿Dónde debo guardar mis claves secretas?
- GitHub: Settings → Secrets and variables → Actions
- Vercel: Dashboard → Settings → Environment Variables
- Netlify: Site settings → Build & deploy → Environment

---

## ⚙️ Problemas Técnicos

### Mi sitio muestra 404 en todas las rutas
**Solución**: Configura `basePath` en `next.config.mjs`:
```javascript
const nextConfig = {
  basePath: '/NOMBRE_DE_TU_REPO',
  assetPrefix: '/NOMBRE_DE_TU_REPO',
}
```

### Las imágenes no cargan
**Solución**: En `next.config.mjs`:
```javascript
images: {
  unoptimized: true
}
```

### Variables de entorno undefined en producción
**Verifica**:
1. Que usas prefijo `NEXT_PUBLIC_`
2. Que las variables están en GitHub Secrets
3. Que el workflow las está inyectando correctamente

---

## 🛠️ Herramientas y Comandos

### Comandos útiles:
```bash
# Build para producción
npm run build

# Verificar errores
npm run lint

# Crear archivo .env.local desde ejemplo
cp .env.example .env.local

# Limpiar build anterior
rm -rf .next dist out
```

### Extensiones recomendadas VS Code:
- GitHub Actions
- dotenv
- ESLint
- Prettier

---

## 💰 Alternativas a GitHub Pages

### Vercel (Recomendado para Next.js)
✅ Integración perfecta con Next.js
✅ Despliegue automático con GitHub
✅ Variables de entorno integradas
✅ Dominio gratuito personalizado

### Netlify
✅ Fácil configuración
✅ Formulario de contacto gratis
✅ Serverless functions

### Firebase Hosting
✅ CDN global de Google
✅ Integración con otras herramientas Google
✅ Reglas de seguridad avanzadas

---

## 📊 Performance y Optimización

### ¿Cómo mejorar la velocidad de carga?
1. Usa `next/image` para imágenes optimizadas
2. Habilita compresión en `next.config.mjs`
3. Minimiza bundles con code splitting

### ¿Cuánto tarda el despliegue?
- GitHub Pages: 1-5 minutos
- Vercel: ~30 segundos
- Netlify: 1-2 minutos

---

## 🔧 Personalización

### ¿Puedo usar dominio personalizado?
Sí, en GitHub Pages:
1. Ve a Settings → Pages
2. Custom domain
3. Agrega tu dominio
4. Configura DNS en tu proveedor

### ¿Cómo cambio el tema/colores?
Edita `app/globals.css` o `styles/globals.css`
Modifica las variables CSS definidas allí.

---

## 🤝 Colaboración

### ¿Cómo colaboran otros desarrolladores?
1. Clonan el repositorio
2. Copian `.env.example` a `.env.local`
3. Solicitan acceso a secrets si es necesario
4. Contribuyen normalmente

### ¿Qué permisos necesitan los colaboradores?
- `Read` para contribuidores externos
- `Write` para equipo de desarrollo
- `Admin` solo para mantenedores principales

---

## 📱 Mobile y Responsive

### ¿Funciona en móviles?
Sí, Next.js genera sitios responsive por defecto.
Verifica usando DevTools → Toggle device toolbar.

### ¿Cómo pruebo mobile?
```bash
# Lighthouse audit
npx lighthouse http://localhost:3000 --view
```

---

## 🆘 Soporte y Ayuda

### Documentación oficial:
- [Next.js Docs](https://nextjs.org/docs)
- [GitHub Pages](https://docs.github.com/en/pages)
- [Supabase](https://supabase.com/docs)

### Comunidad:
- GitHub Discussions
- Stack Overflow
- Reddit r/nextjs

---

## 🔄 Actualizaciones

### ¿Cómo actualizo mi sitio?
1. Haz cambios en código
2. Commit y push a `main`
3. GitHub Actions despliega automáticamente

### ¿Cómo vuelvo a versión anterior?
1. Ve a Commits en GitHub
2. Encuentra el commit deseado
3. Revert changes o crea nueva rama

---

## 💾 Backup y Recuperación

### ¿Cómo hago backup?
```bash
# Backup del código
git clone https://github.com/TU_USUARIO/TU_REPO.git

# Backup manual de datos (si aplica)
# Exporta desde Supabase Dashboard
```

### ¿Cómo recupero datos perdidos?
1. Desde GitHub: History → Revert commit
2. Desde Supabase: Database → Table Editor → History

---

## 📈 Analytics y Monitoreo

### ¿Cómo agrego Google Analytics?
1. Obtén Measurement ID de GA4
2. Agrega a `_app.tsx` o componente Layout
3. Configura en GitHub Secrets si es necesario

### ¿Cómo monitorizo errores?
- Sentry (integración con Next.js)
- LogRocket para session replay
- Uptime monitoring con UptimeRobot

---

## 🎨 Temas Avanzados

### ¿Puedo usar i18n (internacionalización)?
Sí, con `next-i18next` o middleware de Next.js 13+

### ¿Cómo implemento SEO?
- Meta tags dinámicos
- Sitemap.xml generado
- robots.txt
- Schema.org markup

---

## 📞 Contacto

Para problemas específicos del proyecto:
1. Crea issue en GitHub
2. Incluye capturas de pantalla
3. Detalla pasos para reproducir
4. Menciona versión de Node/npm
