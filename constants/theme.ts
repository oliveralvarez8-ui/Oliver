// Paleta de colores y estilos compartidos ("design tokens").
// Centralizarlos aquí hace que sea fácil cambiar el look de toda la app
// editando un solo archivo.

export const colors = {
  background: '#0B0B0D',
  surface: '#17171B',
  surfaceAlt: '#1F1F24',
  border: '#2A2A31',
  textPrimary: '#F5F5F7',
  textSecondary: '#9A9AA5',
  accent: '#39FF6A', // verde neón: acciones principales
  accentAlt: '#FF3B4E', // rojo vivo: acentos/alertas/destacados
  gold: '#F5C542',
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  full: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  title: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.textSecondary,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    color: colors.textPrimary,
  },
  label: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
};
