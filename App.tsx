// Punto de entrada de la app: envuelve todo con el proveedor de la colección
// (para que cualquier pantalla pueda leer/guardar sneakers) y monta la navegación.

import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CollectionProvider } from './context/CollectionContext';
import { RootNavigator } from './navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <CollectionProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </CollectionProvider>
    </SafeAreaProvider>
  );
}
