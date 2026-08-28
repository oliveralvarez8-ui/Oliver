// Hook que calcula estadísticas derivadas de la colección
// (total de pares, valor estimado, marca más coleccionada, última añadida).
// Vive en su propio hook para no repetir esta lógica en cada pantalla que la necesite.

import { useMemo } from 'react';
import { Sneaker } from '../types/sneaker';

export interface CollectionStats {
  totalPares: number;
  valorTotalEstimado: number;
  marcaFavorita: string | null;
  ultimaAnadida: Sneaker | null;
}

export function useCollectionStats(sneakers: Sneaker[]): CollectionStats {
  return useMemo(() => {
    if (sneakers.length === 0) {
      return {
        totalPares: 0,
        valorTotalEstimado: 0,
        marcaFavorita: null,
        ultimaAnadida: null,
      };
    }

    const valorTotalEstimado = sneakers.reduce(
      (suma, s) => suma + s.precioEstimadoActual,
      0
    );

    // Cuenta cuántos pares hay de cada marca para saber cuál es la más frecuente.
    const conteoPorMarca = new Map<string, number>();
    for (const s of sneakers) {
      conteoPorMarca.set(s.marca, (conteoPorMarca.get(s.marca) ?? 0) + 1);
    }
    let marcaFavorita: string | null = null;
    let maxConteo = 0;
    for (const [marca, conteo] of conteoPorMarca) {
      if (conteo > maxConteo) {
        maxConteo = conteo;
        marcaFavorita = marca;
      }
    }

    // La colección se guarda con las más nuevas primero (ver addSneaker),
    // así que la primera de la lista es la última añadida.
    const ultimaAnadida = sneakers[0];

    return {
      totalPares: sneakers.length,
      valorTotalEstimado,
      marcaFavorita,
      ultimaAnadida,
    };
  }, [sneakers]);
}
