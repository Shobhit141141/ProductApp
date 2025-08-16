import { useState, useEffect } from "react";
import { Image, View, TextInput, Text, TouchableOpacity, Dimensions } from "react-native";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, Entypo, Feather, FontAwesome, FontAwesome5, FontAwesome6, Fontisto, MaterialIcons } from "@expo/vector-icons";
import { MotiView } from "moti";
import Constants from "expo-constants";
const dummyPrompts = [
  "I need a lightweight laptop for travel",
  "Looking for a noise-cancelling headphone",
  "A fitness tracker with heart rate monitor",
  "Smartphone with best camera under 50k",
  "Budget-friendly tablet for reading",
  "Lightweight laptop for students",
  "Portable charger with fast charging",
  "Smartwatch for outdoor activities",
  "Wireless earbuds with long battery life",
  "Ergonomic office chair for back support",
  "4K monitor for graphic design",
  "Gaming mouse with programmable buttons",
  "Bluetooth speaker for parties",
  "Compact camera for vlogging",
  "Home security camera system",
  "Robot vacuum for small apartments",
  "Electric scooter for city commute",
  "Adjustable standing desk",
  "Portable projector for presentations",
  "Smart thermostat for energy saving",
  "High-capacity power bank",
  "Noise-isolating headphones for work",
];

/**
 * Home Screen - index.tsx
 * Entry Point - Displays the home screen with a search bar and recent searches.
 * @path /app/index.tsx or /app
 * @returns TSX.Element
 */
export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load recent searches from AsyncStorage
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("recentSearches");
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    })();
  }, []);

  // Start animation when placeholder is empty
  useEffect(() => {
    if (query.length > 0) {
      return;
    }

    const currentPrompt = dummyPrompts[promptIndex];

    if (charIndex < currentPrompt.length) {
      const timeout = setTimeout(() => {
        setPlaceholder((prev) => prev + currentPrompt[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 20);
      return () => clearTimeout(timeout);
    } else {
      const pause = setTimeout(() => {
        setCharIndex(0);
        setPlaceholder("");
        setPromptIndex((prev) => (prev + 1) % dummyPrompts.length);
      }, 1500);
      return () => clearTimeout(pause);
    }
  }, [charIndex, promptIndex, query.length]);

  // Save query to AsyncStorage
  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Please enter a search query.");
      return;
    }
    router.push({ pathname: "./results", params: { query } });
    let updatedSearches = recentSearches.filter((item) => item !== query);
    updatedSearches = [query, ...updatedSearches].slice(0, 3);
    setRecentSearches(updatedSearches);
    await AsyncStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const handleDelete = async (item: string) => {
    const updatedSearches = recentSearches.filter((search) => search !== item);
    setRecentSearches(updatedSearches);
    await AsyncStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };
  const name = Constants.expoConfig?.extra?.expoName || "CanvasAi";
  return (
    <View className="flex-1 bg-white pt-14 px-6">
      {/* Logo */}
      <MotiView
        from={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          type: "timing",
          duration: 300,
        }}
        className="flex-row items-center mb-8"
      >
        <View className="w-12 h-12 justify-center items-center mr-2">
          <Image
            source={require("../assets/images/ai.png")}
            style={{ width: 32, height: 32, resizeMode: "contain" }}
          />
        </View>
        <Text className="text-2xl font-bold-serif text-black">{name}</Text>

        {/* Socials */}
        <View className="flex-row ml-auto gap-2">
          <Link href="https://www.linkedin.com/in/shobhitconnects">
            <AntDesign name="linkedin-square" size={28} color="black" />
          </Link>
          <Link href="https://github.com/Shobhit141141">
            <FontAwesome name="github-square" size={28} color="black" />
          </Link>
        </View>
      </MotiView>

      <View className="mt-28 flex-col justify-end  mb-8">

        {/* Title */}
        <Text className="text-4xl font-bold-serif mb-6 text-black">
          Describe your need
        </Text>

        {/* Input */}
        <TextInput
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            setError(null);
          }}
          placeholder={"Try... " + placeholder}
          placeholderTextColor="#999999"
          multiline
          numberOfLines={4}
          selectionColor={"#00000050"}
          className={`border ${error ? "border-red-500" : "border-gray-300"} p-4 rounded-xl mb-4 hadow-md font-serif h-40`}
          textAlignVertical="top"

        />

        {/* Error */}
        {error && (
          <View className="flex-row items-center mb-2 gap-1">
            <Feather name="alert-circle" size={16} color="#ef4444" />
            <Text className="text-red-500 font-serif">{error}</Text>
          </View>
        )}

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <View className="mb-2">
            <Text className="font-semibold mb-2 text-gray-600 font-bold-serif" >
              Recent Searches:
            </Text>
            <View className="flex-row flex-wrap">
              {recentSearches.map((item, index) => (
                <View
                  key={index}
                  className="bg-gray-200 px-4 py-1 rounded-full mr-2 mb-2 flex-row items-center gap-2 "
                >
                  <TouchableOpacity
                    className="flex"
                    onPress={() => { setQuery(item); setError(null) }}
                    style={{ maxWidth: '94%' }}
                  >
                    <Text
                      className="text-gray-800 font-serif"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.length > 35 ? item.slice(0, 35) + "..." : item}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleDelete(item)}>
                    <Feather name="x" size={16} color="#1f2937" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

        )}
        {/* Search Button */}
        <View className="flex-row justify-between space-x-4">
          <TouchableOpacity
            className="bg-black rounded-xl p-4 flex-1 items-center shadow-lg flex-row justify-center gap-2"
            onPress={handleSearch}
          >
            <Feather name="search" size={16} color="#fff" />
            <Text className="text-white font-semibold font-bold-serif">Find Products</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer Image */}
      {/* <View className="flex items-center justify-center mt-8 my-auto">
        <Image source={require("../assets/images/db_purple.png")} className="w-full h-[260px] object-contain my-auto" />
      </View> */}


      {/* Add 4x4 grid with this apps feature */}
      {/* <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          paddingHorizontal: 0,
          paddingTop: 16,
        }}
      >
        {[
          {
            name: "Feature 1",
            icon: <Image source={require("../assets/images/ai_ivt.png")} className="w-12 h-12" />,
            bg: "#000000" // Pure black
          },
          {
            name: "Feature 2",
            icon: <FontAwesome name="bolt" size={50} color="white" />,
            bg: "#000000" // Dark gray
          },
          {
            name: "Feature 3",
            icon: <Ionicons name="ios-rocket" size={50} color="white" />,
            bg: "#000000" // Medium dark gray
          },
          {
            name: "Feature 4",
            icon: <Entypo name="shop" size={50} color="white" />,
            bg: "#000000" // Lighter dark gray
          },
        ].map((feature, index) => (
          <TouchableOpacity
            key={index}
            style={{
              backgroundColor: feature.bg,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
              marginBottom: 16,
              width: itemWidth,
              height: itemWidth, // Square items
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            {feature.icon}
            <Text
              className="text-white font-semibold mt-2 text-center text-lg font-bold-serif"
            >
              {feature.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View> */}

      {/* Categories */}
      <View className="flex-row flex-wrap items-start justify-center gap-2">
        {[
          {
            name: "Health",
            icon: <MaterialIcons name="health-and-safety" size={16} color="#9ca3af" />,
            query: "Looking for the best health products including supplements, wellness gadgets, and personal care items for daily routine"
          },
          {
            name: "Fitness",
            icon: <FontAwesome5 name="dumbbell" size={16} color="#9ca3af" />,
            query: "Find top fitness equipment, home gym accessories, smartwatches, and trackers to stay fit and active every day"
          },
          {
            name: "Tech",
            icon: <FontAwesome6 name="server" size={16} color="#9ca3af" />,
            query: "Search for latest tech gadgets, laptops, smartphones, smart devices, headphones, and innovative electronics for daily use"
          },
          {
            name: "Entertainment",
            icon: <Entypo name="game-controller" size={16} color="#9ca3af" />,
            query: "Looking for entertainment gadgets including gaming consoles, headphones, smart TVs, streaming devices, and fun electronics"
          },
          {
            name: "Kitchen",
            icon: <MaterialIcons name="soup-kitchen" size={16} color="#9ca3af" />,
            query: "Find kitchen appliances, cookware, coffee makers, blenders, and gadgets that make cooking easier and enjoyable"
          },
          {
            name: "Home",
            icon: <Entypo name="home" size={16} color="#9ca3af" />,
            query: "Search for home essentials, decor, furniture, smart home devices, and products that make living spaces comfortable"
          },
          {
            name: "Travel",
            icon: <Fontisto name="plane" size={16} color="#9ca3af" />,
            query: "Looking for travel gear, luggage, backpacks, portable chargers, travel-friendly gadgets, and accessories for trips"
          },
          {
            name: "Security",
            icon: <MaterialIcons name="security" size={16} color="#9ca3af" />,
            query: "Find home and personal security devices including cameras, smart locks, alarms, and safety gadgets for protection"
          },
          {
            name: "Education",
            icon: <MaterialIcons name="school" size={16} color="#9ca3af" />,
            query: "Looking for educational tools, e-learning gadgets, books, study devices, and learning aids for students and teachers"
          },
          // {
          //   name: "Lifestyle",
          //   icon: <FontAwesome5 name="redhat" size={14} color="#9ca3af" />,
          //   query: "Search for lifestyle products including wellness, fashion, accessories, home decor, and gadgets that enhance daily living"
          // },
          // {
          //   name: "Finance",
          //   icon: <MaterialCommunityIcons name="finance" size={16} color="#9ca3af" />,
          //   query: "Find financial gadgets, budgeting tools, smart wallets, fintech devices, and products to manage money efficiently"
          // },
          // {
          //   name: "Art",
          //   icon: <FontAwesome name="paint-brush" size={14} color="#9ca3af" />,
          //   query: "Looking for art supplies, painting tools, craft materials, drawing gadgets, and creative products for artists and hobbyists"
          // },
        ].map((cat, index) => (
          <TouchableOpacity
            key={index}
            className="rounded-xl flex-row items-center justify-center px-4 py-2 shadow-lg border-2 border-gray-400 mb-2 gap-2"
            onPress={() => { setQuery(cat.query); setError(null) }}
          >
            {cat.icon}
            <Text className="text-gray-400 font-semibold text-[10.5px] text-center font-bold-serif">{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>




      {/* Footer credit */}
      <View className="absolute bottom-4 left-0 right-0 flex-row items-center justify-center gap-2"
      >
        <Image source={require("../assets/images/gemini.png")} className="w-5 h-5" />
        <MaskedView
          maskElement={
            <Text className="text-sm font-bold-serif text-center" style={{ textAlign: 'center' }}  >
              Powered by Gemini
            </Text>
          }
        >
          <LinearGradient
            colors={['#d43df2', '#3d9bf2', '#8b5cf6']} // gradient colors
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text className="text-sm font-bold-serif text-center" style={{ opacity: 0 }}>
              Powered by Gemini
            </Text>
          </LinearGradient>
        </MaskedView>
      </View>
    </View>
  );
}
