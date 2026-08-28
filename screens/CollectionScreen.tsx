// Pantalla de Colección: cuadrícula de 3 columnas con todas las zapatillas
// escaneadas, ordenadas de la más reciente a la más antigua (estilo feed de Instagram).

import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCollection } from '../context/CollectionContext';
import { SneakerCard } from '../components/SneakerCard';
import { colors, spacing, typography } from '../constants/theme';

export function CollectionScreen() {
  const navigation = useNavigation<any>();
  const { sneakers } = useCollection();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Text style={styles.title}>Colección</Text>

      {sneakers.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Tu colección está vacía</Text>
          <Text style={styles.emptySubtitle}>
            Ve a la pestaña Escáner para identificar y añadir tu primera zapatilla.
          </Text>
        </View>
      ) : (
        <FlatList
          data={sneakers}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <SneakerCard
              sneaker={item}
              style={{
                width: '31.3%',
                marginRight: (index + 1) % 3 === 0 ? 0 : '3%',
              }}
              onPress={() => navigation.navigate('SneakerDetail', { id: item.id })}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
  },
  title: {
    ...typography.title,
    marginBottom: spacing.md,
  },
  gridContent: {
    paddingBottom: spacing.xl,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  emptySubtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
