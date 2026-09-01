// URL del backend intermedio (ver carpeta "sneakvault-server").
//
// - Simulador de iOS / emulador de Android en tu mismo Mac: "localhost" funciona
//   porque el simulador comparte la red de tu ordenador.
// - Un iPhone/Android físico con Expo Go en tu misma red WiFi: "localhost" NO
//   funciona (sería el propio teléfono). Sustitúyelo por la IP local de tu Mac,
//   por ejemplo "http://192.168.1.50:3001". Para encontrarla: en tu Mac,
//   Ajustes del Sistema > Wi-Fi > Detalles, o ejecuta `ipconfig getifaddr en0`
//   en la Terminal.
export const API_BASE_URL = 'http://172.20.10.5:3001';
