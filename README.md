# Working Days API

API para el cálculo de días y horas hábiles en Colombia, considerando días festivos nacionales y horarios laborales específicos.

## 🚀 Características

- Cálculo preciso de fechas hábiles en zona horaria de Colombia (America/Bogota)
- Manejo automático de días festivos colombianos
- Horarios laborales: 8:00 AM - 5:00 PM con almuerzo 12:00 PM - 1:00 PM
- Validación estricta de parámetros según especificación técnica
- Respuestas en formato UTC ISO 8601
- Documentación OpenAPI 3.0.3 completa
- Cobertura de tests del 100% (72 tests)
- Despliegue serverless con AWS Lambda

## 📋 Prerrequisitos

- Node.js 20.x o superior
- npm 9.x o superior
- Serverless Framework (opcional, para despliegue)

## 🛠️ Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/working-days-layered.git
   cd working-days-layered
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Construye el proyecto:
   ```bash
   npm run build
   ```

## 🚦 Uso local

Para iniciar el servidor localmente:

```bash
npm run dev
```

Esto iniciará el servidor en `http://localhost:3000`.

Para ejecutar los tests:

```bash
npm test
```

## 📚 Documentación de la API

La documentación OpenAPI está disponible en el archivo `openapi.yaml`. Puedes visualizarla usando:

1. **Swagger Editor Online**: Ve a [editor.swagger.io](https://editor.swagger.io/) y carga el archivo `openapi.yaml`
2. **Swagger UI Local**: Cuando el servidor esté corriendo, visita `http://localhost:3000/api-docs`

## 🌐 API Endpoint

### GET /business-hours

Calcula fechas hábiles considerando horarios laborales colombianos y días festivos.

**Parámetros de consulta:**
- `days` (opcional): Número de días hábiles a sumar (entero positivo)
- `hours` (opcional): Número de horas hábiles a sumar (entero positivo)  
- `date` (opcional): Fecha inicial en UTC ISO 8601 con sufijo Z (por defecto: fecha actual)

**Nota**: Al menos uno de `days` o `hours` debe ser proporcionado.

**Ejemplos de uso:**

```bash
# Agregar 1 día hábil
curl "http://localhost:3000/business-hours?days=1"

# Agregar 8 horas hábiles
curl "http://localhost:3000/business-hours?hours=8"

# Agregar 1 día y 3 horas desde fecha específica
curl "http://localhost:3000/business-hours?days=1&hours=3&date=2025-04-10T15:00:00.000Z"
```

**Respuesta exitosa (200 OK):**
```json
{
  "date": "2025-08-01T14:00:00.000Z"
}
```

**Respuesta de error (400 Bad Request):**
```json
{
  "error": "InvalidParameters",
  "message": "At least one of 'days' or 'hours' parameters is required"
}
```

## 🏗️ Estructura del Proyecto

```
working-days-layered/
├── src/
│   ├── controllers/     # Controladores de la API
│   ├── services/        # Lógica de negocio (cálculo de fechas hábiles)
│   ├── lambdas/         # Funciones Lambda para AWS
│   ├── types/           # Definiciones de tipos TypeScript
│   └── utils/           # Utilidades (manejo de festivos)
├── tests/
│   ├── controllers/     # Tests unitarios de controladores
│   ├── integration/     # Tests de integración
│   └── specification-compliance.test.ts  # Tests de cumplimiento de especificación
├── openapi.yaml         # Documentación OpenAPI 3.0.3
├── jest.config.js       # Configuración de Jest para testing
├── serverless.ts        # Configuración de Serverless Framework
├── tsconfig.json        # Configuración de TypeScript
└── package.json         # Dependencias y scripts
```

## 🧠 Lógica de Negocio

### Zona Horaria
- **Zona horaria base:** America/Bogota (Colombia)
- **Conversión automática:** Los cálculos se realizan en hora colombiana y se devuelven en UTC

### Horario Laboral
- **Horario:** 8:00 AM - 5:00 PM (hora de Colombia)
- **Almuerzo:** 12:00 PM - 1:00 PM (no se cuenta como tiempo hábil)
- **Días laborables:** Lunes a Viernes

### Días Festivos
- Se obtienen dinámicamente desde: `https://content.capta.co/Recruitment/WorkingDays.json`
- Incluye todos los días festivos nacionales de Colombia
- Se excluyen automáticamente del cálculo de días hábiles

### Reglas de Cálculo
1. Si la fecha inicial está fuera del horario laboral, se aproxima hacia atrás al horario hábil más cercano
2. Los días se suman primero, luego las horas
3. Se saltan automáticamente fines de semana y festivos
4. El resultado final se convierte a UTC ISO 8601

## 🧪 Testing

El proyecto incluye una suite completa de tests:

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests con cobertura
npm run test:coverage

# Ejecutar tests en modo watch
npm run test:watch
```

**Cobertura de tests:**
- ✅ 72 tests en total
- ✅ Tests unitarios de controladores
- ✅ Tests de integración de API
- ✅ Tests de cumplimiento de especificación
- ✅ Validación de formatos de respuesta
- ✅ Casos edge y manejo de errores

## 🔧 Dependencias Principales

### Producción
- `date-fns` & `date-fns-tz`: Manipulación de fechas y zonas horarias
- `express`: Framework web para Node.js
- `serverless-http`: Adaptador para AWS Lambda
- `node-fetch`: Cliente HTTP para obtener días festivos

### Desarrollo y Testing
- `jest` & `ts-jest`: Framework de testing
- `supertest`: Testing de APIs HTTP
- `typescript`: Tipado estático
- `serverless`: Framework serverless
- `eslint`: Linter de código

## 🚀 Despliegue

### Desarrollo Local
```bash
npm run dev
```

### Producción (AWS Lambda)
```bash
# Construir
npm run build

# Desplegar con Serverless
npm run deploy
```

### Plataformas Soportadas
- ✅ Vercel
- ✅ Railway  
- ✅ Render
- ✅ AWS Lambda (con Serverless Framework)
- ✅ Cualquier plataforma que soporte Node.js

## 📊 Validación de Especificación

Esta API cumple exactamente con los requisitos de la prueba técnica:

- ✅ Parámetros: `days`, `hours`, `date`
- ✅ Respuesta exitosa: `{"date": "ISO8601Z"}`
- ✅ Respuesta de error: `{"error": "Type", "message": "Description"}`
- ✅ Códigos HTTP correctos (200, 400, 500)
- ✅ Validación estricta de parámetros
- ✅ Manejo de zona horaria colombiana
- ✅ Exclusión de días festivos nacionales

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
