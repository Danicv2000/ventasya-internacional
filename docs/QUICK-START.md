# 🚀 Despliegue Rápido en GitHub Pages

## 📋 Pasos Rápidos

### 1. Preparar el proyecto
```bash
# Asegúrate de tener estas variables en tu .env.local (local, no se sube)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_publica
```

### 2. Configurar GitHub Secrets
Ve a: `Repositorio → Settings → Secrets and variables → Actions`

Agrega:
- `NEXT_PUBLIC_SUPABASE_URL` = tu URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = tu clave pública

### 3. Crear workflow automático
Crea `.github/workflows/deploy.yml` con este contenido:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          
      - run: npm ci
      - run: npm run build
      
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 4. Configurar GitHub Pages
1. Ve a `Settings → Pages`
2. Source: "GitHub Actions"
3. Guarda

### 5. ¡Listo!
Haz push a `main` y el sitio se desplegará automáticamente.

---

## ⚠️ Recordatorio Importante

**NUNCA subas archivos `.env` al repositorio.**
Solo sube `.env.example` como plantilla.
