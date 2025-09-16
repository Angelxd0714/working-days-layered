# Working Days API

API para el cálculo de días y horas hábiles, teniendo en cuenta días festivos y horarios comerciales.

## 🚀 Características

- Cálculo de fechas considerando días hábiles
- Soporte para horarios comerciales personalizables
- Inclusión automática de días festivos
- Documentación automática con Swagger
- Despliegue serverless con AWS Lambda

## 📋 Prerrequisitos

- Node.js 20.x o superior
- npm 9.x o superior
- Serverless Framework instalado globalmente

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

3. Configura las variables de entorno (si es necesario) en el archivo `.env`

## 🚦 Uso local

Para iniciar el servidor localmente:

```bash
npm run dev
```

Esto iniciará el servidor en `http://localhost:3000` con la documentación de la API disponible en:
- Documentación Swagger UI: `http://localhost:3000/api-docs`
- Esquema OpenAPI: `http://localhost:3000/api-docs.json`

## 🌐 Endpoints

### GET /business-hours

Calcula la fecha y hora resultante de agregar días y horas hábiles a una fecha de inicio.

**Parámetros de consulta:**
- `dayToAdd` (opcional): Número de días hábiles a agregar
- `hourToAdd` (opcional): Número de horas hábiles a agregar
- `startDate` (opcional): Fecha de inicio en formato ISO (por defecto: fecha actual)

**Ejemplo de respuesta exitosa (200 OK):**
```json
{
  "statusCode": 200,
  "result": "2023-09-25T10:30:00.000Z"
}
```

## 🏗️ Estructura del Proyecto

```
working-days-layered/
├── src/
│   ├── controllers/     # Controladores de la API
│   ├── services/        # Lógica de negocio
│   ├── lambdas/         # Funciones Lambda
│   ├── types/           # Tipos TypeScript
│   └── utils/           # Utilidades
├── .eslintrc.cjs        # Configuración de ESLint
├── serverless.ts        # Configuración de Serverless
├── tsconfig.json        # Configuración de TypeScript
└── package.json         # Dependencias y scripts
```

## 🧠 Lógica de Negocio

### Horario Comercial
- **Horario laboral estándar:** 8:00 AM - 5:00 PM
- **Hora de almuerzo:** 12:00 PM - 1:00 PM
- **Días laborables:** Lunes a Viernes

### Cálculo de Días Hábiles
1. Se ignoran sábados y domingos
2. Se excluyen los días festivos definidos
3. Si la hora cae fuera del horario laboral, se ajusta al siguiente horario hábil

### Manejo de Festivos
- Los días festivos se definen en `src/utils/holidays.ts`
- Se pueden agregar festivos fijos (ej: Navidad) y dinámicos (ej: Jueves Santo)

## 🔧 Dependencias Principales

### Producción
- `date-fns`: Manipulación avanzada de fechas
- `date-fns-tz`: Manejo de zonas horarias
- `express`: Framework web para Node.js
- `serverless-http`: Adaptador para ejecutar Express en AWS Lambda

### Desarrollo
- `serverless`: Framework para aplicaciones serverless
- `serverless-offline`: Ejecución local de funciones Lambda
- `serverless-auto-swagger`: Generación automática de documentación Swagger
- `typescript`: Tipado estático para JavaScript
- `eslint`: Linter para mantener la calidad del código

## 🚀 Despliegue

Para desplegar a AWS:

```bash
# Construir el proyecto
npm run build

# Desplegar
serverless deploy
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
