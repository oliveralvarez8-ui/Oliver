// Pantalla de Escáner: el corazón de la app.
// Es una máquina de estados sencilla con 4 pasos, todos en la misma pantalla:
//   1. "inicio"     -> el usuario toma o elige una foto
//   2. "analizando" -> mandamos la foto al backend, que le pregunta a Claude
//   3. "resultado"  -> mostramos la identificación que devolvió Claude
//   4. "formulario" -> el usuario rellena talla/estado/precio y la guarda
//
// Para el MVP no usamos una cámara en vivo (expo-camera) sino el selector nativo
// de cámara/galería (expo-image-picker), que es más simple y no necesita construir
// una interfaz de cámara propia.
//
// Fase 2: la identificación ya no es un mock local. Esta pantalla llama a
// nuestro backend (carpeta /sneakvault-server), que es quien habla con la
// API de Claude — la clave de API nunca viaja hasta el teléfono.

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { Camera, ImageIcon, Sparkles } from 'lucide-react-native';
import { buscarEnCatalogoPorNombre } from '../data/sneakers';
import { SneakerInfo, Estado } from '../types/sneaker';
import { useCollection } from '../context/CollectionContext';
import { colors, radius, spacing, typography } from '../constants/theme';
import { API_BASE_URL } from '../constants/config';
import { tiempoRelativo } from '../utils/tiempo';

type Paso = 'inicio' | 'analizando' | 'resultado' | 'formulario';

// Respuesta fija que devuelve nuestro backend (ver sneakvault-server/index.js).
// Fase 4: precio_estimado/fuente_precio/fecha_consulta ya no son un dato
// inventado — vienen de que Claude buscó en la web (StockX/GOAT u otra
// fuente), o van marcados como estimación sin confirmar si no encontró nada.
interface RespuestaIdentificacion {
  es_zapatilla: boolean;
  marca: string;
  modelo: string;
  colorway: string;
  confianza: number;
  precio_estimado: number;
  fuente_precio: string;
  fecha_consulta: string;
}

const FUENTE_NO_CONFIRMADA = 'Estimación de Claude (no confirmada)';

// Por debajo de este umbral, preferimos avisar al usuario antes que guardar
// una identificación en la que Claude mismo no confía.
const UMBRAL_CONFIANZA = 0.5;

export function ScannerScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const containerStyle = [styles.container, { paddingTop: insets.top + spacing.md }];
  const { addSneaker } = useCollection();

  const [paso, setPaso] = useState<Paso>('inicio');
  const [foto, setFoto] = useState<string | null>(null);
  const [identificacion, setIdentificacion] = useState<SneakerInfo | null>(null);

  // Campos del formulario "Añadir a mi colección"
  const [talla, setTalla] = useState('');
  const [estado, setEstado] = useState<Estado>('nuevo');
  const [precioPagado, setPrecioPagado] = useState('');
  const [notas, setNotas] = useState('');

  const resetear = () => {
    setPaso('inicio');
    setFoto(null);
    setIdentificacion(null);
    setTalla('');
    setEstado('nuevo');
    setPrecioPagado('');
    setNotas('');
  };

  // Manda la foto al backend para que la identifique con la API de Claude.
  const analizarFoto = async (uri: string) => {
    setFoto(uri);
    setPaso('analizando');

    try {
      // Redimensionamos y comprimimos la foto antes de subirla: la llamada
      // a la API cuesta menos y tarda menos cuanto más pequeña sea la imagen.
      const contexto = ImageManipulator.manipulate(uri);
      const imagenRedimensionada = await contexto.resize({ width: 1024 }).renderAsync();
      const resultado = await imagenRedimensionada.saveAsync({
        compress: 0.7,
        format: SaveFormat.JPEG,
        base64: true,
      });

      if (!resultado.base64) {
        throw new Error('No se pudo procesar la foto en el dispositivo.');
      }

      const respuesta = await fetch(`${API_BASE_URL}/identify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: resultado.base64, mediaType: 'image/jpeg' }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || 'No se pudo identificar la zapatilla.');
      }

      const identificacionApi = datos as RespuestaIdentificacion;

      if (!identificacionApi.es_zapatilla) {
        Alert.alert(
          'No se ha detectado ninguna zapatilla',
          'No hemos encontrado ninguna zapatilla en esta foto. Prueba a encuadrarla mejor o usa otra imagen.'
        );
        resetear();
        return;
      }

      if (identificacionApi.confianza < UMBRAL_CONFIANZA) {
        Alert.alert(
          'No hemos podido identificarla',
          'Vemos una zapatilla en la foto, pero no tenemos suficiente seguridad sobre la marca y el modelo exactos. Prueba con más luz o otro ángulo.'
        );
        resetear();
        return;
      }

      // La API no da año ni precio original de lanzamiento (eso no lo sabe
      // ni Claude ni la búsqueda web de forma fiable). Si ese modelo ya existe
      // en nuestro catálogo local, usamos su año/precio original como
      // referencia orientativa para esos dos campos; si no, se muestra "N/D".
      // El precio ACTUAL sí viene ahora de verdad de la API (búsqueda web).
      const referencia = buscarEnCatalogoPorNombre(identificacionApi.marca, identificacionApi.modelo);

      setIdentificacion({
        id: `${identificacionApi.marca}-${identificacionApi.modelo}-${Date.now()}`
          .toLowerCase()
          .replace(/\s+/g, '-'),
        marca: identificacionApi.marca,
        modelo: identificacionApi.modelo,
        colorway: identificacionApi.colorway || 'Desconocido',
        anioLanzamiento: referencia?.anioLanzamiento ?? 0,
        precioOriginal: referencia?.precioOriginal ?? 0,
        precioEstimadoActual: identificacionApi.precio_estimado,
        fuentePrecio: identificacionApi.fuente_precio,
        fechaConsultaPrecio: identificacionApi.fecha_consulta,
        imagen: referencia?.imagen ?? uri,
      });
      setPaso('resultado');
    } catch (error) {
      // Sin fallback automático al modo demo: si algo falla (sin conexión,
      // sin crédito, backend apagado...) avisamos claramente y volvemos al inicio.
      console.warn('Error identificando la zapatilla:', error);
      Alert.alert(
        'No se pudo identificar la zapatilla',
        error instanceof Error
          ? error.message
          : 'Ocurrió un error inesperado. Comprueba que el backend esté arrancado e inténtalo de nuevo.'
      );
      resetear();
    }
  };

  const tomarFoto = async () => {
    const permiso = await ImagePicker.requestCameraPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert('Permiso necesario', 'Necesitamos acceso a la cámara para escanear tu zapatilla.');
      return;
    }
    const resultado = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      aspect: [1, 1],
      allowsEditing: true,
    });
    if (!resultado.canceled) {
      analizarFoto(resultado.assets[0].uri);
    }
  };

  const elegirDeGaleria = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert('Permiso necesario', 'Necesitamos acceso a tus fotos para elegir una imagen.');
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
      aspect: [1, 1],
      allowsEditing: true,
    });
    if (!resultado.canceled) {
      analizarFoto(resultado.assets[0].uri);
    }
  };

  const guardarEnColeccion = async () => {
    if (!identificacion || !foto) return;
    if (!talla.trim()) {
      Alert.alert('Falta la talla', 'Introduce la talla de la zapatilla antes de guardar.');
      return;
    }

    await addSneaker({
      ...identificacion,
      id: `${identificacion.id}-${Date.now()}`, // id único para esta unidad guardada
      talla: talla.trim(),
      estado,
      precioPagado: Number(precioPagado) || 0,
      foto,
      notas: notas.trim(),
      fechaAnadida: new Date().toISOString(),
    });

    resetear();
    navigation.navigate('Colección');
  };

  // --- Paso 1: pantalla inicial con guía de encuadre y botones ---
  if (paso === 'inicio') {
    return (
      <View style={containerStyle}>
        <Text style={typography.title}>Escáner</Text>
        <Text style={styles.subtitle}>
          Encuadra la zapatilla y toma una foto, o elige una de tu galería.
        </Text>

        <View style={styles.frameGuide}>
          <View style={styles.frameCorner} />
          <Camera color={colors.textSecondary} size={48} />
          <Text style={styles.frameText}>Encuadra la zapatilla aquí</Text>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={tomarFoto}>
          <Camera color="#0B0B0D" size={20} />
          <Text style={styles.primaryButtonText}>Tomar foto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={elegirDeGaleria}>
          <ImageIcon color={colors.textPrimary} size={20} />
          <Text style={styles.secondaryButtonText}>Elegir de galería</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- Paso 2: analizando ---
  if (paso === 'analizando') {
    return (
      <View style={containerStyle}>
        {foto && <Image source={{ uri: foto }} style={styles.analizandoImage} />}
        <View style={styles.analizandoOverlay}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.analizandoText}>Analizando...</Text>
          <Text style={styles.subtitle}>Identificando marca, modelo y colorway</Text>
        </View>
      </View>
    );
  }

  // --- Paso 3: resultado de la identificación ---
  if (paso === 'resultado' && identificacion) {
    return (
      <ScrollView style={containerStyle} contentContainerStyle={{ gap: spacing.md }}>
        <View style={styles.resultBadge}>
          <Sparkles color={colors.accent} size={16} />
          <Text style={styles.resultBadgeText}>Identificación completada</Text>
        </View>

        {foto && <Image source={{ uri: foto }} style={styles.resultImage} />}

        <View style={styles.resultInfo}>
          <Text style={styles.resultMarca}>{identificacion.marca}</Text>
          <Text style={styles.resultModelo}>{identificacion.modelo}</Text>
          <Text style={styles.resultColorway}>{identificacion.colorway}</Text>

          <View style={styles.resultGrid}>
            <InfoChip
              label="AÑO"
              value={identificacion.anioLanzamiento ? String(identificacion.anioLanzamiento) : 'N/D'}
            />
            <InfoChip
              label="PRECIO ORIGINAL"
              value={identificacion.precioOriginal ? `$${identificacion.precioOriginal}` : 'N/D'}
            />
            <InfoChip
              label="PRECIO ACTUAL"
              value={identificacion.precioEstimadoActual ? `$${identificacion.precioEstimadoActual}` : 'N/D'}
              accent
            />
          </View>

          {identificacion.fuentePrecio && identificacion.fechaConsultaPrecio && (
            <Text style={styles.fuentePrecioTexto}>
              {identificacion.fuentePrecio === FUENTE_NO_CONFIRMADA
                ? '⚠️ Estimación sin confirmar · '
                : `Según ${identificacion.fuentePrecio} · `}
              {tiempoRelativo(identificacion.fechaConsultaPrecio)}
            </Text>
          )}
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={() => setPaso('formulario')}>
          <Text style={styles.primaryButtonText}>Añadir a mi colección</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={resetear}>
          <Text style={styles.secondaryButtonText}>Escanear otra</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // --- Paso 4: formulario para completar antes de guardar ---
  if (paso === 'formulario' && identificacion) {
    return (
      <ScrollView style={containerStyle} contentContainerStyle={{ gap: spacing.md }}>
        <Text style={typography.title}>Completa los datos</Text>
        <Text style={styles.subtitle}>
          {identificacion.marca} {identificacion.modelo}
        </Text>

        <View style={styles.formField}>
          <Text style={styles.formLabel}>Talla *</Text>
          <TextInput
            value={talla}
            onChangeText={setTalla}
            placeholder="Ej. 42 EU / 9 US"
            placeholderTextColor={colors.textSecondary}
            style={styles.formInput}
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.formLabel}>Estado</Text>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <TouchableOpacity
              style={[styles.estadoOption, estado === 'nuevo' && styles.estadoOptionActive]}
              onPress={() => setEstado('nuevo')}
            >
              <Text
                style={[
                  styles.estadoOptionText,
                  estado === 'nuevo' && styles.estadoOptionTextActive,
                ]}
              >
                Nuevo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.estadoOption, estado === 'usado' && styles.estadoOptionActive]}
              onPress={() => setEstado('usado')}
            >
              <Text
                style={[
                  styles.estadoOptionText,
                  estado === 'usado' && styles.estadoOptionTextActive,
                ]}
              >
                Usado
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formField}>
          <Text style={styles.formLabel}>Precio pagado ($)</Text>
          <TextInput
            value={precioPagado}
            onChangeText={setPrecioPagado}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={colors.textSecondary}
            style={styles.formInput}
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.formLabel}>Notas</Text>
          <TextInput
            value={notas}
            onChangeText={setNotas}
            placeholder="Ej. comprado en la reventa, edición limitada..."
            placeholderTextColor={colors.textSecondary}
            multiline
            style={[styles.formInput, { minHeight: 70, textAlignVertical: 'top' }]}
          />
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={guardarEnColeccion}>
          <Text style={styles.primaryButtonText}>Guardar en mi colección</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => setPaso('resultado')}>
          <Text style={styles.secondaryButtonText}>Atrás</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return null;
}

function InfoChip({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View style={styles.infoChip}>
      <Text style={typography.label}>{label}</Text>
      <Text style={[styles.infoChipValue, accent && { color: colors.accent }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    gap: spacing.md,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  frameGuide: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
  },
  frameCorner: {
    display: 'none',
  },
  frameText: {
    color: colors.textSecondary,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  primaryButtonText: {
    color: '#0B0B0D',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButton: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  analizandoImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.lg,
    opacity: 0.4,
  },
  analizandoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  analizandoText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  resultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultBadgeText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  resultImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  resultInfo: {
    gap: 2,
  },
  resultMarca: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  resultModelo: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  resultColorway: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  resultGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  fuentePrecioTexto: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  infoChip: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    gap: 4,
  },
  infoChipValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  formField: {
    gap: 6,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  formInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    color: colors.textPrimary,
    fontSize: 15,
  },
  estadoOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  estadoOptionActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  estadoOptionText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  estadoOptionTextActive: {
    color: '#0B0B0D',
  },
});
