# DESDELSUR Intelligence Hub

## ESTRUCTURA DEL PROYECTO

```
desdelsur-hub/
├── index.html        ← la app (no tocar)
├── sessions.json     ← ACÁ SE ACTUALIZAN LAS SESIONES
├── api/
│   └── chat.js       ← función serverless (no tocar)
├── vercel.json       ← config de Vercel (no tocar)
└── README.md
```

---

## PASO A PASO: DESPLIEGUE INICIAL

### 1. Crear cuenta en GitHub (si no tenés)
- Ir a https://github.com → Sign up
- Crear un repositorio nuevo: `desdelsur-hub` (privado recomendado)

### 2. Subir los archivos al repositorio
Opción A (más fácil): arrastrá toda la carpeta al repositorio en GitHub desde el navegador.

Opción B (terminal):
```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/desdelsur-hub.git
git push -u origin main
```

### 3. Crear cuenta en Vercel (si no tenés)
- Ir a https://vercel.com → Sign up with GitHub

### 4. Importar el proyecto en Vercel
1. En Vercel → "Add New..." → "Project"
2. Buscar el repositorio `desdelsur-hub` → "Import"
3. NO cambiar nada en la configuración → "Deploy"
4. Vercel lo detecta automáticamente como proyecto estático con función serverless

### 5. Agregar la API key de Anthropic en Vercel
1. En el proyecto en Vercel → "Settings" → "Environment Variables"
2. Agregar:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** tu API key de Anthropic (la conseguís en https://console.anthropic.com)
3. Hacer click en "Save"
4. Ir a "Deployments" → en el último deployment → "..." → "Redeploy"

✅ Listo. Tu URL será algo como `desdelsur-hub.vercel.app`

---

## CÓMO AGREGAR UNA SESIÓN NUEVA

### Ejemplo: agregar G3 S4

1. Abrí `sessions.json`
2. Dentro del objeto `"G3"`, en `"sessions"`, agregá después de `"S3"`:

```json
"S4": {
  "date": "21 May 2026",
  "domain": "Dominio 4 — Entrenador de GPTs",
  "trainers": ["Brahin Carrillo", "Sofía Fernández Bravo"],
  "summary": "Resumen breve de lo que se trabajó en la sesión.",
  "blocks": [
    {
      "title": "Título del bloque 1",
      "text": "Descripción de lo trabajado en este bloque."
    },
    {
      "title": "Título del bloque 2",
      "text": "Descripción de lo trabajado en este bloque."
    }
  ],
  "nextSteps": [
    { "actor": "El grupo", "text": "Tarea acordada en la sesión." },
    { "actor": "STANNUM", "text": "Acción que debe tomar STANNUM." }
  ],
  "details": [
    {
      "title": "Nombre del tema discutido",
      "text": "Descripción detallada de lo que se habló.",
      "time": "00:10:00"
    }
  ],
  "transcriptRaw": "Texto libre con la información de la sesión: fecha, participantes, dominio trabajado, datos de empresa, decisiones tomadas, etc. Cuanto más detallado, mejor responde el chat."
}
```

3. Guardá el archivo
4. Subí el cambio a GitHub:
   - En GitHub: editá el archivo directamente y hacé "Commit changes"
   - O desde la terminal: `git add sessions.json && git commit -m "G3 S4 agregada" && git push`
5. Vercel se autodeploya en ~30 segundos. ¡Listo!

---

## CÓMO ACTUALIZAR GRUPOS G7 y G8 (cuando empiecen)

Buscá en `sessions.json` los objetos `"G7"` y `"G8"` y cambiá el color + empezá a agregar sesiones:

```json
"G7": {
  "name": "G7 — Tartagal",
  "location": "Tartagal",
  "color": "#F97316",
  "sessions": {
    "S1": { ... }
  }
}
```

---

## LLENADO DEL CAMPO `transcriptRaw`

Este campo es el que usa el chat de IA para responder preguntas. Cuanto más información cargues, mejor responde. Podés pegar directamente:
- El resumen del documento de Gemini Notes de Drive
- Los nombres de participantes y sus roles
- Los temas trabajados
- Las decisiones tomadas
- Datos específicos de la empresa mencionados en la sesión

No necesita ser formateado: texto libre está bien.

---

## COSTOS ESTIMADOS

- **Vercel:** gratis para proyectos pequeños (Hobby plan)
- **Anthropic API:** aproximadamente USD 0.003 por consulta al chat (Claude Sonnet 4)
- **GitHub:** gratis para repositorios privados

---

## PREGUNTAS FRECUENTES

**¿Qué pasa si subí mal el JSON?**
Vercel va a mostrar el error en el deployment. Podés editar el archivo en GitHub y volver a commitear.

**¿Cómo sé que el chat está funcionando?**
Seleccioná cualquier sesión → hacé una pregunta → si responde, está OK.

**¿Puedo agregar campos custom al JSON?**
Sí, podés agregar lo que quieras al `transcriptRaw`. También podés agregar campos nuevos al objeto de sesión siempre que los agregues consistentemente.

**¿Cómo accedo al sitio?**
La URL la da Vercel. Podés configurar un dominio propio desde Settings → Domains.
