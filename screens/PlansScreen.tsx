// Pantalla de planes (paywall) de SneakVault Pro.
// Se muestra como modal: automáticamente la primera vez que se abre la app
// (ver navigation/RootNavigator.tsx) y también accesible en cualquier momento
// desde el botón "PRO" de la pantalla de Inicio.
//
// IMPORTANTE: esto es solo la interfaz. El botón "Empezar prueba gratis" no
// cobra nada todavía — conectar el cobro real (RevenueCat o las compras
// nativas de Apple/Google) es una fase posterior.

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Sparkles, Check } from 'lucide-react-native';
import { PLANES, BENEFICIOS, DIAS_PRUEBA_GRATIS, Plan, PlanId } from '../data/plans';
import { colors, radius, spacing } from '../constants/theme';

// Calcula la fecha en la que empezaría a cobrarse, para no usar letra pequeña
// vaga tipo "tras el periodo de prueba" sino una fecha concreta.
function fechaFinPrueba(): string {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + DIAS_PRUEBA_GRATIS);
  return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
}

export function PlansScreen() {
  const navigation = useNavigation<any>();
  const [planSeleccionado, setPlanSeleccionado] = useState<PlanId>(
    PLANES.find((p) => p.destacado)?.id ?? PLANES[0].id
  );

  const plan = PLANES.find((p) => p.id === planSeleccionado) as Plan;

  // Fase posterior: aquí se llamará a RevenueCat / compras nativas.
  // Por ahora solo dejamos constancia de qué plan se eligió.
  const onSelectPlan = (id: PlanId) => {
    console.log('[SneakVault Pro] Plan elegido para iniciar prueba:', id);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <X color={colors.textSecondary} size={22} />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Sparkles color={colors.accent} size={28} />
          <Text style={styles.title}>Desbloquea SneakVault Pro</Text>
          <Text style={styles.subtitle}>Identifica y colecciona sneakers sin límites.</Text>
        </View>

        <View style={styles.beneficios}>
          {BENEFICIOS.map(({ Icono, texto }) => (
            <View key={texto} style={styles.beneficioRow}>
              <View style={styles.beneficioIcono}>
                <Icono color={colors.accent} size={18} />
              </View>
              <Text style={styles.beneficioTexto}>{texto}</Text>
            </View>
          ))}
        </View>

        <View style={styles.pruebaBadge}>
          <Text style={styles.pruebaBadgeText}>🎁 Prueba gratis {DIAS_PRUEBA_GRATIS} días</Text>
        </View>

        <View style={styles.planesRow}>
          {PLANES.map((p) => {
            const activo = p.id === planSeleccionado;
            return (
              <TouchableOpacity
                key={p.id}
                style={[styles.planCard, activo && styles.planCardActivo]}
                activeOpacity={0.85}
                onPress={() => setPlanSeleccionado(p.id)}
              >
                {p.badge && (
                  <View style={styles.planBadge}>
                    <Text style={styles.planBadgeText}>{p.badge}</Text>
                  </View>
                )}
                <View style={[styles.planCheck, activo && styles.planCheckActivo]}>
                  {activo && <Check color="#0B0B0D" size={14} strokeWidth={3} />}
                </View>
                <Text style={styles.planNombre}>{p.nombre}</Text>
                <Text style={styles.planPrecio}>
                  {p.precio}
                  <Text style={styles.planPeriodo}>{p.periodo}</Text>
                </Text>
                {p.precioEquivalente && (
                  <Text style={styles.planEquivalente}>{p.precioEquivalente}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.textoLegal}>
          Gratis hasta el {fechaFinPrueba()}. Después, {plan.precio}
          {plan.periodo} ({plan.id === 'anual' ? plan.precioEquivalente : 'facturación mensual'}).
          Cancela cuando quieras desde los ajustes de tu cuenta de la tienda.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.ctaButton}
          activeOpacity={0.85}
          onPress={() => onSelectPlan(planSeleccionado)}
        >
          <Text style={styles.ctaButtonText}>Empezar prueba gratis</Text>
        </TouchableOpacity>

        <View style={styles.enlacesRow}>
          <TouchableOpacity onPress={() => navigation.navigate('Legal', { documento: 'terminos' })}>
            <Text style={styles.enlaceTexto}>Términos</Text>
          </TouchableOpacity>
          <Text style={styles.enlaceSeparador}>·</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Legal', { documento: 'privacidad' })}>
            <Text style={styles.enlaceTexto}>Privacidad</Text>
          </TouchableOpacity>
          <Text style={styles.enlaceSeparador}>·</Text>
          <TouchableOpacity onPress={() => console.log('[SneakVault Pro] Restaurar compra')}>
            <Text style={styles.enlaceTexto}>Restaurar compra</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: spacing.md,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  header: {
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  beneficios: {
    gap: spacing.sm,
  },
  beneficioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  beneficioIcono: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  beneficioTexto: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  pruebaBadge: {
    alignSelf: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.full,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  pruebaBadgeText: {
    color: colors.accent,
    fontWeight: '800',
    fontSize: 14,
  },
  planesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  planCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.md,
    paddingTop: spacing.lg,
    gap: 2,
  },
  planCardActivo: {
    borderColor: colors.accent,
    backgroundColor: colors.surfaceAlt,
  },
  planBadge: {
    position: 'absolute',
    top: -11,
    left: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.accent,
    borderRadius: radius.full,
    paddingVertical: 3,
    alignItems: 'center',
  },
  planBadgeText: {
    color: '#0B0B0D',
    fontSize: 9,
    fontWeight: '800',
    textAlign: 'center',
  },
  planCheck: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 20,
    height: 20,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planCheckActivo: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  planNombre: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  planPrecio: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  planPeriodo: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  planEquivalente: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  textoLegal: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 17,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  ctaButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: '#0B0B0D',
    fontSize: 16,
    fontWeight: '800',
  },
  enlacesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  enlaceTexto: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  enlaceSeparador: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});
