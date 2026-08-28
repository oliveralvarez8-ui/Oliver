// Pantalla para leer la política de privacidad o los términos de uso dentro
// de la app. Se abre como modal desde la pantalla de Planes (obligatorio
// según las normas de Apple para apps de suscripción) o desde donde se
// necesite enlazarla.
//
// El contenido vive en /legal/contenido.ts (copia en TypeScript de los
// archivos /legal/privacidad.md y /legal/terminos.md, que son los que se
// publican como página web pública — ver instrucciones de publicación).

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import Markdown from 'react-native-markdown-display';
import { PRIVACIDAD_MD, TERMINOS_MD } from '../legal/contenido';
import { colors, radius, spacing } from '../constants/theme';

type Documento = 'privacidad' | 'terminos';
type LegalRoute = RouteProp<{ Legal: { documento: Documento } }, 'Legal'>;

const TITULOS: Record<Documento, string> = {
  privacidad: 'Política de privacidad',
  terminos: 'Términos de uso',
};

export function LegalScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<LegalRoute>();
  const documento = route.params?.documento ?? 'privacidad';
  const contenido = documento === 'privacidad' ? PRIVACIDAD_MD : TERMINOS_MD;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{TITULOS[documento]}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <X color={colors.textSecondary} size={22} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Markdown style={markdownStyles}>{contenido}</Markdown>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
});

// Estilos del renderizador de markdown, adaptados a la estética oscura de la app.
const markdownStyles = {
  body: { color: colors.textPrimary, fontSize: 14, lineHeight: 21 },
  heading1: { color: colors.textPrimary, fontSize: 22, fontWeight: '800' as const, marginTop: spacing.md, marginBottom: spacing.sm },
  heading2: { color: colors.textPrimary, fontSize: 18, fontWeight: '800' as const, marginTop: spacing.lg, marginBottom: spacing.sm },
  heading3: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' as const, marginTop: spacing.md, marginBottom: 4 },
  strong: { color: colors.textPrimary, fontWeight: '800' as const },
  em: { color: colors.textSecondary, fontStyle: 'italic' as const },
  link: { color: colors.accent },
  blockquote: {
    backgroundColor: colors.surface,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginVertical: spacing.sm,
    borderRadius: radius.sm,
  },
  bullet_list: { marginBottom: spacing.sm },
  ordered_list: { marginBottom: spacing.sm },
  list_item: { color: colors.textPrimary, marginBottom: 4 },
  hr: { backgroundColor: colors.border, height: 1, marginVertical: spacing.md },
  table: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, marginVertical: spacing.sm },
  th: { padding: spacing.xs, backgroundColor: colors.surface, color: colors.textPrimary, fontWeight: '700' as const },
  td: { padding: spacing.xs, color: colors.textPrimary },
  tr: { borderBottomWidth: 1, borderColor: colors.border },
};
