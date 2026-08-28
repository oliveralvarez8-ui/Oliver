// Configuración de los planes de SneakVault Pro y sus beneficios.
// Vive separado de la pantalla para poder cambiar precios/textos sin tocar el JSX.
// Los precios de aquí son solo para mostrar en pantalla: la compra real (fase
// posterior) se conectará a RevenueCat o a las librerías nativas de compras,
// que son las que de verdad determinan lo que se cobra.

import React from 'react';
import { Camera, Infinity as IconoInfinito, TrendingUp, Download } from 'lucide-react-native';

export type PlanId = 'mensual' | 'anual';

export interface Plan {
  id: PlanId;
  nombre: string;
  precio: string;
  periodo: string;
  precioEquivalente?: string;
  badge?: string;
  destacado?: boolean;
}

export const PLANES: Plan[] = [
  {
    id: 'mensual',
    nombre: 'Mensual',
    precio: '$6,99',
    periodo: '/mes',
  },
  {
    id: 'anual',
    nombre: 'Anual',
    precio: '$49,99',
    periodo: '/año',
    precioEquivalente: '$4,17/mes',
    badge: 'MEJOR VALOR · AHORRA 40%',
    destacado: true,
  },
];

interface Beneficio {
  Icono: React.ComponentType<{ color?: string; size?: number }>;
  texto: string;
}

export const BENEFICIOS: Beneficio[] = [
  { Icono: Camera, texto: 'Escanea hasta 300 zapatillas al mes' },
  { Icono: IconoInfinito, texto: 'Colecciona sin límites' },
  { Icono: TrendingUp, texto: 'Ve el valor total de tu colección' },
  { Icono: Download, texto: 'Exporta tus datos cuando quieras' },
];

export const DIAS_PRUEBA_GRATIS = 7;
