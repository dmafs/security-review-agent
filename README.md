# security-review-agent

Agente de Inteligencia Artificial para la Revisión de Seguridad del Código Fuente en Pull Requests — Trabajo de grado SDLC-AI, Politécnico Grancolombiano.

## 📋 Descripción del proyecto

Este proyecto desarrolla un agente de inteligencia artificial que analiza automáticamente los cambios propuestos en Pull Requests de GitHub, con el objetivo de identificar, explicar y sugerir correcciones a vulnerabilidades de seguridad en el código fuente — tomando como referencia el estándar **OWASP Top 10**.

El agente busca actuar como un asistente de revisión de seguridad que complementa la revisión humana, especialmente útil en equipos de desarrollo pequeños que no cuentan con un especialista en seguridad disponible de forma permanente.

> Para el detalle completo del problema, la pregunta de investigación, los objetivos y la metodología, ver el documento de anteproyecto (`docs/`).

## 🛠️ Stack tecnológico

- **Lenguaje:** TypeScript
- **Entorno de ejecución:** Node.js
- **Ejecución de TypeScript:** [tsx](https://github.com/privatenumber/tsx) (en reemplazo de `ts-node`, por problemas de compatibilidad)
- **Conexión con GitHub:** [Octokit](https://github.com/octokit/octokit.js) (API REST de GitHub)
- **Motor de razonamiento (LLM):** Anthropic Claude (`@anthropic-ai/sdk`) — *pendiente de activación por disponibilidad de créditos*
- **Manejo de variables de entorno:** `dotenv`

## 📁 Estructura del proyecto

```
security-review-agent/
├── README.md
├── docs/                      ← anteproyecto y documentación del trabajo de grado
├── src/
│   ├── index.ts                ← punto de entrada del programa
│   ├── github/
│   │   ├── githubClient.ts     ← conexión con la API de GitHub (autenticación, lectura de PRs)
│   │   └── diffParser.ts       ← separación y filtrado del diff por archivo
│   ├── agent/
│   │   ├── analyzer.ts         ← lógica que llamará al LLM para analizar el código (pendiente)
│   │   └── prompts.ts          ← instrucciones/prompts para el LLM (pendiente)
│   ├── config/
│   │   └── env.ts              ← carga de variables de entorno (API keys)
│   └── types/
│       └── index.ts            ← tipos/interfaces de TypeScript
├── test-data/                  ← fragmentos de código de prueba (OWASP Juice Shop, etc.)
├── .env                        ← claves de API (NO se sube a git)
└── .gitignore
```

## ✅ Avance del proyecto

### Fase 1 — Revisión y caracterización
- [x] Estudio del estándar **OWASP Top 10** (las 10 categorías de vulnerabilidades más comunes)
- [x] Instalación y exploración de **OWASP Juice Shop** (aplicación con vulnerabilidades conocidas, usada como caso de prueba) vía Docker
- [x] Identificación de un ejemplo real de vulnerabilidad de **Injection (inyección SQL)** en el código fuente de Juice Shop (`routes/login.ts`), usado como caso de estudio

### Fase 2 y 3 — Diseño e implementación del prototipo
- [x] Repositorio del proyecto creado en GitHub (`security-review-agent`)
- [x] Proyecto Node.js + TypeScript configurado (`tsconfig.json`, dependencias instaladas)
- [x] **Conexión funcional con la API de GitHub** mediante Octokit (autenticación verificada)
- [x] **Lectura del diff de un Pull Request real**, obtenido directamente desde GitHub
- [x] **Separación del diff por archivo**, para procesar cada archivo de forma individual
- [x] **Filtro de archivos relevantes**: se descartan archivos de configuración y dependencias (`package.json`, `package-lock.json`, `tsconfig.json`, `.gitignore`), dejando solo código fuente real (`.ts`) para análisis
- [ ] Conexión del agente con el modelo de lenguaje (LLM) para el análisis del código — *pendiente, bloqueado temporalmente por disponibilidad de créditos de la API*
- [ ] Clasificación de hallazgos por severidad (crítico, alto, medio, bajo)
- [ ] Generación de explicación en lenguaje natural del riesgo detectado
- [ ] Generación de sugerencia de corrección
- [ ] Publicación automática de comentarios en el Pull Request

### Fase 4 — Evaluación (pendiente)
- [ ] Evaluación del agente contra código con vulnerabilidades conocidas (OWASP Benchmark / Juice Shop / DVWA)
- [ ] Comparación de resultados frente a una herramienta SAST tradicional
- [ ] Cálculo de métricas: precisión, cobertura (recall), tasa de falsos positivos

## 🔑 Decisiones técnicas tomadas

| Decisión | Detalle |
|---|---|
| Lenguaje del agente | Node.js/TypeScript, por mejor soporte de librerías de IA y de la API de GitHub, y coherencia con el stack de Juice Shop |
| Alcance de interfaz | El agente interactúa directamente con GitHub (comentarios en el PR), sin interfaz visual adicional por ahora. Si el proyecto avanza bien, se evaluará construir un dashboard simple más adelante |
| Ejecución de TypeScript | Se reemplazó `ts-node` por `tsx` tras errores de compatibilidad de configuración |
| Versión de Octokit | Se usa una versión específica (`octokit@3.1.2`) por incompatibilidad de las versiones más recientes (solo ESM) con la configuración CommonJS del proyecto |
| Datos de prueba | Se usan aplicaciones con vulnerabilidades ya conocidas y documentadas (OWASP Juice Shop, DVWA, OWASP Benchmark) en lugar de un sistema propio en producción |

## ⚠️ Problemas resueltos durante el desarrollo

- **Política de ejecución de PowerShell**: bloqueaba `npm`. Se resolvió con `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`.
- **Error de configuración de TypeScript (`verbatimModuleSyntax`)**: el `tsconfig.json` generado por defecto no era compatible con el proyecto. Se reemplazó por una configuración simplificada en CommonJS.
- **Error `Cannot read properties of undefined (reading 'fileExists')` con `ts-node`**: se resolvió migrando la ejecución a `tsx`.
- **Error `ERR_PACKAGE_PATH_NOT_EXPORTED` con Octokit**: la versión más reciente de `octokit` es solo ESM; se resolvió instalando `octokit@3.1.2`, compatible con CommonJS.

## 🚀 Cómo ejecutar el proyecto (estado actual)

```powershell
# Instalar dependencias
npm install

# Ejecutar el programa principal
npx tsx src/index.ts
```

Actualmente, el programa:
1. Se conecta a GitHub con el token configurado en `.env`
2. Obtiene el diff de un Pull Request de prueba
3. Separa el diff por archivo
4. Filtra y muestra solo los archivos de código relevantes para análisis de seguridad

## 📌 Próximos pasos

1. Obtener créditos en la API de Anthropic para activar el análisis con el LLM
2. Diseñar y escribir el prompt de análisis de seguridad (`src/agent/prompts.ts`)
3. Implementar la llamada al LLM y el procesamiento de su respuesta (`src/agent/analyzer.ts`)
4. Publicar los hallazgos como comentarios automáticos en el Pull Request
5. Evaluar el agente contra el conjunto de pruebas y comparar con una herramienta SAST tradicional

---
**Autor:** Aura María Fierro — Politécnico Grancolombiano
**Temática:** SDLC-AI — Aplicación de la Inteligencia Artificial Agéntica en las fases del desarrollo de software