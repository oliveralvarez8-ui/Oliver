// Celda de una zapatilla dentro de la cuadrícula de la Colección.
// Estilo "feed de Instagram": foto cuadrada a ancho completo de la celda,
// con el nombre y el precio en texto pequeño justo debajo.

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { colors, spacing } from '../constants/theme';
import { Sneaker } from '../types/sneaker';

interface SneakerCardProps {
  sneaker: Sneaker;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export function SneakerCard({ sneaker, onPress, style }: SneakerCardProps) {
  return (
    <TouchableOpacity style={[styles.card, style]} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: sneaker.foto || sneaker.imagen }} style={styles.image} />
      <Text style={styles.nombre} numberOfLines={1}>
        {sneaker.marca} {sneaker.modelo}
      </Text>
      <Text style={styles.precio}>
        {sneaker.precioEstimadoActual ? `$${sneaker.precioEstimadoActual}` : 'N/D'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 4,
    backgroundColor: colors.surfaceAlt,
  },
  nombre: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  precio: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accent,
  },
});
