// Pantalla de Inicio: resumen de la colección + acceso rápido al escáner.

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Sparkles } from 'lucide-react-native';
import { useCollection } from '../context/CollectionContext';
import { useCollectionStats } from '../hooks/useCollectionStats';
import { StatCard } from '../components/StatCard';
import { colors, radius, spacing, typography } from '../constants/theme';

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const { sneakers } = useCollection();
  const stats = useCollectionStats(sneakers);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.greeting}>Tu colección</Text>
          <Text style={styles.title}>SneakVault</Text>
        </View>
        <TouchableOpacity
          style={styles.proButton}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Plans')}
        >
          <Sparkles color={colors.accent} size={14} />
          <Text style={styles.proButtonText}>PRO</Text>
        </TouchableOpacity>
      </View>

      {/* Resumen de estadísticas */}
      <View style={styles.statsRow}>
        <StatCard label="PARES" value={String(stats.totalPares)} accent />
        <StatCard
          label="VALOR ESTIMADO"
          value={`$${stats.valorTotalEstimado.toLocaleString()}`}
        />
        <StatCard label="MARCA TOP" value={stats.marcaFavorita ?? '—'} />
      </View>

      {/* Última zapatilla añadida */}
      <Text style={styles.sectionTitle}>Última añadida</Text>
      {stats.ultimaAnadida ? (
        <View style={styles.lastCard}>
          <Image
            source={{ uri: stats.ultimaAnadida.foto || stats.ultimaAnadida.imagen }}
            style={styles.lastImage}
          />
          <View style={styles.lastInfo}>
            <Text style={styles.lastMarca}>{stats.ultimaAnadida.marca}</Text>
            <Text style={styles.lastModelo}>{stats.ultimaAnadida.modelo}</Text>
            <Text style={styles.lastColorway}>{stats.ultimaAnadida.colorway}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            Todavía no has añadido ninguna zapatilla. ¡Escanea la primera!
          </Text>
        </View>
      )}

      {/* Botón grande para ir al escáner */}
      <TouchableOpacity
        style={styles.scanButton}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('Escáner')}
      >
        <Camera color="#0B0B0D" size={22} />
        <Text style={styles.scanButtonText}>Escanear ahora</Text>
      </TouchableOpacity>

      {/* Acceso a los documentos legales, siempre visible desde Inicio */}
      <View style={styles.legalRow}>
        <TouchableOpacity onPress={() => navigation.navigate('Legal', { documento: 'privacidad' })}>
          <Text style={styles.legalTexto}>Privacidad</Text>
        </TouchableOpacity>
        <Text style={styles.legalSeparador}>·</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Legal', { documento: 'terminos' })}>
          <Text style={styles.legalTexto}>Términos de uso</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  proButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 4,
  },
  proButtonText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  greeting: {
    ...typography.subtitle,
  },
  title: {
    ...typography.title,
    fontSize: 32,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  lastCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    alignItems: 'center',
  },
  lastImage: {
    width: 90,
    height: 90,
    backgroundColor: colors.surfaceAlt,
  },
  lastInfo: {
    flex: 1,
    paddingHorizontal: spacing.md,
    gap: 2,
  },
  lastMarca: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  lastModelo: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  lastColorway: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    padding: spacing.lg,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  scanButton: {
    flexDirection: 'row',
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  scanButtonText: {
    color: '#0B0B0D',
    fontSize: 16,
    fontWeight: '800',
  },
  legalRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: spacing.xs,
  },
  legalTexto: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  legalSeparador: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});
