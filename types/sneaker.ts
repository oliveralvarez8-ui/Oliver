// Tipos compartidos por toda la app.
// Definirlos en un solo sitio evita errores al pasar datos entre pantallas.

export type Estado = 'nuevo' | 'usado';

// Una zapatilla del catálogo (lo que "conoce" el escáner antes de que el usuario la guarde).
export interface SneakerInfo {
  id: string;
  marca: string;
  modelo: string;
  colorway: string;
  anioLanzamiento: number;
  precioOriginal: number;
  precioEstimadoActual: number;
  imagen: string; // require(...) de una imagen local o una URL
  // De dónde sale precioEstimadoActual y cuándo se consultó (fase 4: viene de
  // una búsqueda web real, o de la propia estimación de Claude si no se pudo
  // confirmar). Opcionales porque las entradas antiguas del catálogo local no
  // los tienen.
  fuentePrecio?: string;
  fechaConsultaPrecio?: string; // ISO date string
}

// Una zapatilla ya guardada en la colección del usuario.
// Extiende SneakerInfo añadiendo los datos que el usuario introduce a mano.
export interface Sneaker extends SneakerInfo {
  talla: string;
  estado: Estado;
  precioPagado: number;
  foto: string; // uri de la foto que tomó/eligió el usuario
  notas: string;
  fechaAnadida: string; // ISO date string
}

// Datos que pide el formulario "Añadir a mi colección" tras identificar una zapatilla.
export type NuevaSneakerInput = Pick<
  Sneaker,
  'talla' | 'estado' | 'precioPagado' | 'notas' | 'foto'
>;
