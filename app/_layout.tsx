import { Stack } from "expo-router";
import { IBMPlexMono_400Regular, IBMPlexMono_600SemiBold } from "@expo-google-fonts/ibm-plex-mono";
import { RobotoSerif_400Regular, RobotoSerif_700Bold, useFonts } from "@expo-google-fonts/roboto-serif";
import SplashScreen from "expo-splash-screen";


import "../global.css"
import { useCallback, useEffect } from "react";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    IBMPlexMono_400Regular,
    IBMPlexMono_600SemiBold,
    RobotoSerif_400Regular,
    RobotoSerif_700Bold,
  });

  const prepare = useCallback(async () => {
    await SplashScreen.preventAutoHideAsync();
    await new Promise((resolve) => setTimeout(resolve, 30000));
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    prepare();
  }, [prepare]);

  if (!fontsLoaded) return null;

  return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="results" />
      </Stack>
  );
}
