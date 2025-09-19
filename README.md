# MiniApp Push Notifications Demo

## Descripción

Este proyecto muestra cómo enviar y recibir notificaciones push entre usuarios en una app React Native usando Expo. Incluye un pequeño backend en Node.js para enviar la notificación push a través de la Expo Push API.

## Requisitos

- Node.js y npm instalados en tu PC
- Expo CLI instalado globalmente (`npm install -g expo-cli`)
- App **Expo Go** instalada en tu celular
- Ambos dispositivos (PC y celular) conectados a la misma red WiFi

## Instalación

### 1. Instala dependencias del frontend

```bash
npm install
npm install expo-notifications expo-device
```

### 2. Instala dependencias del backend

```bash
npm install express node-fetch
```

## Uso

### 1. Corre el backend

```bash
node server.js
```

El backend estará escuchando en el puerto 3000. Si tu PC tiene IP local `192.168.0.100`, usa esa en el fetch del frontend. Cambia la IP por la de tu PC si es diferente.

### 2. Corre el frontend

```bash
expo start
```

Escanea el QR con Expo Go en tu celular.

### 3. Prueba el envío de notificaciones

1. Abre la app en dos celulares o dos instancias (puede ser emulador + físico).
2. Copia el token de Expo de uno y pégalo en el campo "Token destino" del otro.
3. Presiona el botón para enviar la notificación.
4. La notificación aparecerá en el dispositivo destino.

## Comentarios

- El token de Expo cambia si reinstalas la app.
- Puedes adaptar el backend para guardar tokens y manejar usuarios.
- Las notificaciones push solo llegan a dispositivos físicos.

## Archivos importantes

- `App.js`: Código de la app Expo/React Native.
- `server.js`: Backend Node.js para enviar notificaciones push.
- `README.md`: Este archivo.

---

¡Listo para mostrar, compartir y modificar para tu presentación!
