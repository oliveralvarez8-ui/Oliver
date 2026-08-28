// Este archivo define un "Context" de React: una forma de compartir datos
// (la colección de sneakers) entre pantallas sin tener que pasarlos manualmente
// de componente en componente ("prop drilling").
//
// Además de guardar los datos en memoria, los persiste en el almacenamiento
// local del teléfono con AsyncStorage, para que la colección siga ahí
// aunque el usuario cierre la app.

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sneaker } from '../types/sneaker';

const STORAGE_KEY = '@sneakvault/collection';

interface CollectionContextValue {
  sneakers: Sneaker[];
  isLoading: boolean;
  addSneaker: (sneaker: Sneaker) => Promise<void>;
  updateSneaker: (id: string, cambios: Partial<Sneaker>) => Promise<void>;
  removeSneaker: (id: string) => Promise<void>;
}

const CollectionContext = createContext<CollectionContextValue | undefined>(
  undefined
);

export function CollectionProvider({ children }: { children: React.ReactNode }) {
  const [sneakers, setSneakers] = useState<Sneaker[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Al arrancar la app, carga la colección guardada previamente.
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setSneakers(JSON.parse(raw));
        }
      } catch (error) {
        console.warn('No se pudo cargar la colección guardada', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Guarda en AsyncStorage cada vez que cambia la lista.
  const persist = useCallback(async (lista: Sneaker[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    } catch (error) {
      console.warn('No se pudo guardar la colección', error);
    }
  }, []);

  const addSneaker = useCallback(
    async (sneaker: Sneaker) => {
      setSneakers((prev) => {
        const next = [sneaker, ...prev];
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const updateSneaker = useCallback(
    async (id: string, cambios: Partial<Sneaker>) => {
      setSneakers((prev) => {
        const next = prev.map((s) => (s.id === id ? { ...s, ...cambios } : s));
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const removeSneaker = useCallback(
    async (id: string) => {
      setSneakers((prev) => {
        const next = prev.filter((s) => s.id !== id);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  return (
    <CollectionContext.Provider
      value={{ sneakers, isLoading, addSneaker, updateSneaker, removeSneaker }}
    >
      {children}
    </CollectionContext.Provider>
  );
}

// Hook de conveniencia para usar el contexto desde cualquier pantalla:
// const { sneakers, addSneaker } = useCollection();
export function useCollection() {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error('useCollection debe usarse dentro de un CollectionProvider');
  }
  return context;
}
