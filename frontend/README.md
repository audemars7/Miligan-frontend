# Miligan Frontend - React App

Aplicación React para la gestión de clientes y reservas del club de tenis Miligan.

## 🚀 Configuración para Render

### Variables de Entorno

Para desplegar en Render, necesitas configurar las siguientes variables de entorno:

1. Ve a tu dashboard de Render
2. Selecciona tu aplicación frontend
3. Ve a "Environment" en el menú lateral
4. Agrega las siguientes variables:

```
REACT_APP_API_URL=https://tennismiligan.onrender.com
```

### Configuración de Build

- **Build Command**: `npm run build`
- **Publish Directory**: `build`
- **Node Version**: 18.x o superior

### Configuración de CORS

Asegúrate de que tu backend en Render tenga configurado CORS para permitir requests desde tu dominio frontend.

## 🛠️ Desarrollo Local

### Instalación

```bash
npm install
```

### Variables de Entorno Local

Crea un archivo `.env` en la raíz del proyecto:

```env
REACT_APP_API_URL=http://localhost:5000
```

### Ejecutar en Desarrollo

```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

### Build para Producción

```bash
npm run build
```

## 📁 Estructura del Proyecto

```
src/
├── api/
│   ├── clientes.js      # API calls para clientes
│   └── reservas.js      # API calls para reservas
├── components/
│   ├── clientes/
│   │   ├── ClienteForm.jsx
│   │   └── ClientesList.jsx
│   └── reservas/
│       ├── ReservaForm.jsx
│       └── ReservasList.jsx
├── config.js            # Configuración de API
└── App.js              # Componente principal
```

## 🔧 Configuración de API

El archivo `src/config.js` maneja automáticamente las URLs de la API:

- **Desarrollo**: `http://localhost:5000`
- **Producción**: `https://tennismiligan.onrender.com`

## 🔐 Autenticación

La aplicación usa JWT tokens para autenticación. El token está configurado en `src/config.js`.

## 📝 Notas Importantes

1. **CORS**: Asegúrate de que tu backend permita requests desde tu dominio frontend
2. **Variables de Entorno**: En Render, usa `REACT_APP_API_URL` para configurar la URL del backend
3. **Build**: El comando de build genera archivos estáticos en la carpeta `build/`

## 🚀 Deployment

1. Sube tu código a GitHub
2. Conecta tu repositorio a Render
3. Configura las variables de entorno
4. Deploy automático con cada push a main 