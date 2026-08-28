// Pequeña etiqueta ("badge") que muestra si una zapatilla está "nuevo" o "usado".

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius } from '../constants/theme';
import { Estado } from '../types/sneaker';

export function EstadoBadge({ estado }: { estado: Estado }) {
  const esNuevo = estado === 'nuevo';
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: esNuevo ? colors.accent : colors.surfaceAlt },
      ]}
    >
      <Text style={[styles.text, { color: esNuevo ? '#0B0B0D' : colors.textSecondary }]}>
        {esNuevo ? 'NUEVO' : 'USADO'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
