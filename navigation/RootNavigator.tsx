// Configura toda la navegación de la app:
// - Barra inferior con 3 pestañas: Inicio, Colección, Escáner.
// - La pestaña Colección es en realidad un "stack" (pila) de 2 pantallas,
//   para poder entrar al detalle de una zapatilla y volver atrás.
// - Todo eso vive dentro de un stack raíz que además tiene la pantalla
//   "Plans" (planes de SneakVault Pro), presentada como modal: se abre sola
//   la primera vez que se abre la app, y también desde el botón PRO de Inicio.

import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, DarkTheme, createNavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, Grid2x2, Camera } from 'lucide-react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { CollectionScreen } from '../screens/CollectionScreen';
import { SneakerDetailScreen } from '../screens/SneakerDetailScreen';
import { ScannerScreen } from '../screens/ScannerScreen';
import { PlansScreen } from '../screens/PlansScreen';
import { LegalScreen } from '../screens/LegalScreen';
import { colors } from '../constants/theme';

const Tab = createBottomTabNavigator();
const CollectionStack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();

// Clave en AsyncStorage para saber si ya se mostró el paywall alguna vez.
const YA_VIO_PLANES_KEY = '@sneakvault/ya_vio_planes';

// Referencia a la navegación que se puede usar fuera de un componente de pantalla
// (aquí, para abrir "Plans" en cuanto la navegación esté lista, sin esperar
// a que el usuario toque nada).
export const navigationRef = createNavigationContainerRef();

// Sub-navegador de la pestaña Colección: lista -> detalle.
function CollectionStackNavigator() {
  return (
    <CollectionStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        headerShadowVisible: false,
      }}
    >
      <CollectionStack.Screen
        name="CollectionList"
        component={CollectionScreen}
        options={{ headerShown: false }}
      />
      <CollectionStack.Screen
        name="SneakerDetail"
        component={SneakerDetailScreen}
        options={{ title: 'Detalle' }}
      />
    </CollectionStack.Navigator>
  );
}

// Las 3 pestañas de siempre.
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Inicio') return <Home color={color} size={size} />;
          if (route.name === 'Colección') return <Grid2x2 color={color} size={size} />;
          return <Camera color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Colección" component={CollectionStackNavigator} />
      <Tab.Screen name="Escáner" component={ScannerScreen} />
    </Tab.Navigator>
  );
}

// Tema oscuro para que los fondos de navegación (headers, tab bar) combinen con la app.
const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.surface,
    border: colors.border,
    text: colors.textPrimary,
    primary: colors.accent,
  },
};

export function RootNavigator() {
  // En cuanto la navegación está lista, comprobamos si es la primera vez
  // que se abre la app. Si lo es, mostramos el paywall antes de que el
  // usuario toque nada, y lo marcamos como visto para no repetirlo solo.
  const handleReady = async () => {
    try {
      const yaVisto = await AsyncStorage.getItem(YA_VIO_PLANES_KEY);
      if (!yaVisto && navigationRef.isReady()) {
        navigationRef.navigate('Plans' as never);
        await AsyncStorage.setItem(YA_VIO_PLANES_KEY, 'true');
      }
    } catch (error) {
      console.warn('No se pudo comprobar si ya se mostró el paywall', error);
    }
  };

  return (
    <NavigationContainer ref={navigationRef} theme={navTheme} onReady={handleReady}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="MainTabs" component={MainTabs} />
        <RootStack.Screen
          name="Plans"
          component={PlansScreen}
          options={{ presentation: 'modal' }}
        />
        <RootStack.Screen
          name="Legal"
          component={LegalScreen}
          options={{ presentation: 'modal' }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
