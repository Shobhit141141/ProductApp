export default {
  expo: {
    name: "canvasai",
    slug: "canvasai",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/logo.png",
    scheme: "canvasai",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/logo.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      permissions: [
        "android.permission.RECORD_AUDIO",
        "android.permission.MODIFY_AUDIO_SETTINGS"
      ],
      package: "com.anonymous.canvasai"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/ai.png",
          imageWidth: 180,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            image: "./assets/images/ai_ivt.png",
            resizeMode: "contain",
            imageWidth: 180,
            backgroundColor: "#000000"
          }
        }
      ],
     
    ],
    experiments: {
      typedRoutes: true
    },
    splash: {
      image: "./assets/images/ai.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
      dark: {
        image: "./assets/images/ai_ivt.png",
        resizeMode: "contain",
        backgroundColor: "#000000"
      }
    },
    extra: {
      router: {},
      eas: {
        projectId: "4a348f62-7f68-4e25-af25-78bfab953079"
      },
      expoName: process.env.EXPO_NAME || "canvasai",
      geminiApiKey: process.env.GEMINI_API_KEY || "default-key",
      environment: process.env.NODE_ENV || "development"
    },
    owner: "adamnil8267",
     updates: {
      url: "https://u.expo.dev/4a348f62-7f68-4e25-af25-78bfab953079", // project update URL
    },
    runtimeVersion: {
      policy: "appVersion", // keeps OTA updates tied to app version
    },
  }
};