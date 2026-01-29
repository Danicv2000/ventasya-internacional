# 🔐 Seguridad de Variables de Entorno

## 🛡️ Cómo manejar .env de forma segura

### ⚠️ PRINCIPIO FUNDAMENTAL
**Los archivos `.env` NUNCA deben subirse al repositorio público.**

---

## 📁 Estructura de archivos recomendada

```
proyecto/
├── .env                    # 🔴 NUNCA subir - Variables locales
├── .env.local             # 🔴 NUNCA subir - Variables locales
├── .env.production        # 🔴 NUNCA subir - Variables producción
├── .env.example           # ✅ SÍ subir - Plantilla
├── .gitignore             # ✅ SÍ subir - Ignora .env*
└── ...
```

---

## 📝 Archivos importantes

### 1. `.env.example` (SUBIR ESTE)
Plantilla para otros desarrolladores:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Otros servicios...
# API_KEYS=
```

### 2. `.gitignore` (SUBIR ESTE)
Asegúrate de incluir:

```gitignore
# Environment variables
.env*
!.env.example

# Next.js
.next/
out/
dist/

# Logs
*.log

# Node modules
node_modules/
```

---

## 🚀 Despliegue con Variables de Entorno

### Opción 1: GitHub Secrets (RECOMENDADO)

#### Paso 1: Configurar secrets en GitHub
1. Ve a tu repositorio
2. `Settings` → `Secrets and variables` → `Actions`
3. Agrega nuevas repository secrets:

| Nombre | Valor |
|--------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://ksexligqknyjgzvfhwoe.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

#### Paso 2: Usar en workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build with env vars
        run: |
          echo "NEXT_PUBLIC_SUPABASE_URL=${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}" > .env.local
          echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}" >> .env.local
          npm run build
```

### Opción 2: Vercel / Netlify (Alternativas)

#### Vercel:
1. Dashboard → Settings → Environment Variables
2. Agrega las variables allí
3. Se inyectan automáticamente en el build

#### Netlify:
1. Site settings → Build & deploy → Environment
2. Agrega las variables
3. Se usan durante el build

---

## 🔍 Verificar seguridad

### Checklist antes de hacer push:
- [ ] `.env` está en `.gitignore`
- [ ] No hay variables hardcodeadas en el código
- [ ] Solo se usan `NEXT_PUBLIC_` para frontend
- [ ] Las claves secretas están en GitHub Secrets
- [ ] `.env.example` existe como plantilla

### Comandos útiles:
```bash
# Verificar qué archivos .env se han commiteado (debería estar vacío)
git ls-files | grep "\.env"

# Verificar .gitignore
cat .gitignore | grep "\.env"
```

---

## ⚠️ Qué variables pueden ser públicas

### ✅ SEGURAS (prefijo NEXT_PUBLIC_)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=clave_publica
NEXT_PUBLIC_API_BASE_URL=https://api.ejemplo.com
```

Estas se envían al cliente y son visibles en el navegador.

### 🔒 PRIVADAS (NO llevan NEXT_PUBLIC_)
```bash
SUPABASE_SERVICE_ROLE_KEY=clave_secreta
DATABASE_URL=postgres://...
JWT_SECRET=secreto_jwt
API_PRIVATE_KEY=clave_privada
```

Estas solo deben usarse en el servidor/backend.

---

## 🧪 Pruebas de seguridad

### 1. Verificar en el navegador:
```javascript
// Abrir consola del navegador
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL) // ✅ Debe mostrar la URL
console.log(process.env.SUPABASE_SERVICE_ROLE_KEY) // ❌ Debe ser undefined
```

### 2. Verificar en el bundle:
```bash
# Después del build, busca en los archivos generados
grep -r "SUPABASE_SERVICE_ROLE_KEY" .next/

# No debería encontrar claves privadas
```

---

## 🆘 En caso de exposición accidental

### Si expones una clave:

1. **Rotar inmediatamente**:
   - Genera nuevas claves en Supabase Dashboard
   - Actualiza todas las ubicaciones donde se usaba

2. **Revocar acceso**:
   - En Supabase: Project Settings → API → Regenerate Keys

3. **Actualizar secrets**:
   - En GitHub: Settings → Secrets → Update

4. **Hacer nuevo commit**:
   ```bash
   # Eliminar historial sensible (si es necesario)
   git filter-branch --force --index-filter \
   'git rm --cached --ignore-unmatch .env' \
   --prune-empty --tag-name-filter cat -- --all
   ```

---

## 📚 Buenas prácticas

### ✅ HACER:
- Usar `.env.example` como plantilla
- Guardar secrets en GitHub/Vercel/Netlify
- Usar prefijo `NEXT_PUBLIC_` solo para variables seguras
- Revisar `.gitignore` regularmente
- Rotar claves periódicamente

### ❌ NO HACER:
- Subir `.env` al repositorio
- Hardcodear claves en el código
- Exponer claves privadas en frontend
- Compartir secrets por chat/correo
- Usar las mismas claves en todos los entornos

---

## 🎯 Ejemplo completo

### Estructura final del proyecto:
```
ventasya-internacional/
├── .env.example              # ✅ Plantilla pública
├── .gitignore               # ✅ Ignora .env*
├── .github/
│   └── workflows/
│       └── deploy.yml       # ✅ Workflow con secrets
├── app/
├── components/
├── lib/
│   └── supabase-client.ts   # ✅ Usa process.env.NEXT_PUBLIC_*
└── ...
```

### Flujo de trabajo:
1. Desarrollador clona repo
2. Copia `.env.example` a `.env.local`
3. Rellena variables locales
4. Trabaja normalmente
5. GitHub Actions usa secrets para build
6. Despliegue seguro a GitHub Pages
