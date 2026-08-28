// Pantalla de detalle de una zapatilla: foto grande, datos, notas, editar y eliminar.

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Trash2, Pencil, Check, X } from 'lucide-react-native';
import { useCollection } from '../context/CollectionContext';
import { EstadoBadge } from '../components/EstadoBadge';
import { colors, radius, spacing, typography } from '../constants/theme';
import { tiempoRelativo } from '../utils/tiempo';

const FUENTE_NO_CONFIRMADA = 'Estimación de Claude (no confirmada)';

type DetailRoute = RouteProp<{ SneakerDetail: { id: string } }, 'SneakerDetail'>;

export function SneakerDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<DetailRoute>();
  const { sneakers, updateSneaker, removeSneaker } = useCollection();

  const sneaker = sneakers.find((s) => s.id === route.params.id);

  // Estado local del formulario de edición (solo se usa cuando editando === true).
  const [editando, setEditando] = useState(false);
  const [talla, setTalla] = useState(sneaker?.talla ?? '');
  const [precioPagado, setPrecioPagado] = useState(String(sneaker?.precioPagado ?? ''));
  const [notas, setNotas] = useState(sneaker?.notas ?? '');

  if (!sneaker) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Esta zapatilla ya no existe en tu colección.</Text>
      </View>
    );
  }

  const guardarCambios = async () => {
    await updateSneaker(sneaker.id, {
      talla,
      precioPagado: Number(precioPagado) || 0,
      notas,
    });
    setEditando(false);
  };

  const confirmarEliminar = () => {
    Alert.alert(
      'Eliminar zapatilla',
      `¿Seguro que quieres eliminar ${sneaker.modelo} de tu colección?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await removeSneaker(sneaker.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image source={{ uri: sneaker.foto || sneaker.imagen }} style={styles.image} />

      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.marca}>{sneaker.marca}</Text>
          <Text style={styles.modelo}>{sneaker.modelo}</Text>
          <Text style={styles.colorway}>{sneaker.colorway}</Text>
        </View>
        <EstadoBadge estado={sneaker.estado} />
      </View>

      {/* Datos generales del modelo (no editables, vienen del catálogo) */}
      <View style={styles.infoGrid}>
        <InfoBlock label="TALLA" value={sneaker.talla} />
        <InfoBlock label="AÑO" value={sneaker.anioLanzamiento ? String(sneaker.anioLanzamiento) : 'N/D'} />
        <InfoBlock
          label="PRECIO ORIGINAL"
          value={sneaker.precioOriginal ? `$${sneaker.precioOriginal}` : 'N/D'}
        />
        <InfoBlock
          label="PRECIO ACTUAL"
          value={sneaker.precioEstimadoActual ? `$${sneaker.precioEstimadoActual}` : 'N/D'}
          accent
        />
      </View>

      {sneaker.fuentePrecio && sneaker.fechaConsultaPrecio && (
        <Text style={styles.fuentePrecioTexto}>
          {sneaker.fuentePrecio === FUENTE_NO_CONFIRMADA
            ? '⚠️ Estimación sin confirmar · '
            : `Según ${sneaker.fuentePrecio} · `}
          {tiempoRelativo(sneaker.fechaConsultaPrecio)}
        </Text>
      )}

      {/* Sección editable: talla, precio pagado, notas */}
      <View style={styles.editSection}>
        <View style={styles.editHeader}>
          <Text style={styles.sectionTitle}>Mis datos</Text>
          {!editando ? (
            <TouchableOpacity onPress={() => setEditando(true)} style={styles.iconButton}>
              <Pencil color={colors.textSecondary} size={18} />
            </TouchableOpacity>
          ) : (
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <TouchableOpacity onPress={() => setEditando(false)} style={styles.iconButton}>
                <X color={colors.textSecondary} size={18} />
              </TouchableOpacity>
              <TouchableOpacity onPress={guardarCambios} style={styles.iconButton}>
                <Check color={colors.accent} size={18} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Field label="Talla" editando={editando} value={talla} onChangeText={setTalla} />
        <Field
          label="Precio pagado ($)"
          editando={editando}
          value={precioPagado}
          onChangeText={setPrecioPagado}
          keyboardType="numeric"
          displayValue={`$${sneaker.precioPagado}`}
        />
        <Field
          label="Notas"
          editando={editando}
          value={notas}
          onChangeText={setNotas}
          multiline
          displayValue={sneaker.notas || 'Sin notas'}
        />

        <Text style={styles.fecha}>
          Añadida el {new Date(sneaker.fechaAnadida).toLocaleDateString()}
        </Text>
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={confirmarEliminar}>
        <Trash2 color={colors.accentAlt} size={18} />
        <Text style={styles.deleteText}>Eliminar de mi colección</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function InfoBlock({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View style={styles.infoBlock}>
      <Text style={typography.label}>{label}</Text>
      <Text style={[styles.infoValue, accent && { color: colors.accent }]}>{value}</Text>
    </View>
  );
}

function Field({
  label,
  editando,
  value,
  onChangeText,
  displayValue,
  keyboardType,
  multiline,
}: {
  label: string;
  editando: boolean;
  value: string;
  onChangeText: (t: string) => void;
  displayValue?: string;
  keyboardType?: 'default' | 'numeric';
  multiline?: boolean;
}) {
  return (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {editando ? (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          multiline={multiline}
          style={[styles.fieldInput, multiline && { minHeight: 60, textAlignVertical: 'top' }]}
          placeholderTextColor={colors.textSecondary}
        />
      ) : (
        <Text style={styles.fieldValue}>{displayValue ?? value}</Text>
      )}
    </View>
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
    gap: spacing.md,
  },
  notFound: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  marca: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modelo: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  colorway: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  fuentePrecioTexto: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: -spacing.xs,
  },
  infoBlock: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    gap: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  editSection: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  editHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  iconButton: {
    padding: 6,
  },
  fieldRow: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  fieldValue: {
    fontSize: 15,
    color: colors.textPrimary,
  },
  fieldInput: {
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 8,
  },
  fecha: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.accentAlt,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
  },
  deleteText: {
    color: colors.accentAlt,
    fontWeight: '700',
  },
});
