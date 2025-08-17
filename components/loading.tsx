import BadgeComponent from "@/components/BadgeStrip";
import { View as MotiView } from "moti";
import { View, Image, Text } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, Feather, FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const badges = [
  { text: "Smartphones", icon: <Feather name="smartphone" size={16} color="#666" /> },
  { text: "Laptops", icon: <Entypo name="laptop" size={16} color="#666" /> },
  { text: "Headphones", icon: <Ionicons name="headset" size={16} color="#666" /> },
  { text: "Watches", icon: <Feather name="watch" size={16} color="#666" /> },
  { text: "Cameras", icon: <Entypo name="camera" size={16} color="#666" /> },
  { text: "Gaming", icon: <Entypo name="game-controller" size={16} color="#666" /> },
  { text: "Fitness", icon: <MaterialCommunityIcons name="dumbbell" size={16} color="#666" /> },
];

const createRepeatedBadges = (startIndex: number, count: number) => {
  const selected = [];
  for (let i = 0; i < count; i++) {
    selected.push(badges[(startIndex + i) % badges.length]);
  }
  return [...selected, ...selected, ...selected];
};

/**
 * Loading Screen Component - loading.tsx
 * Displays a loading animation with badge strips.
 * @path /components/loading
 * @returns TSX.Element
 */
function LoadingScreen() {
  const topStrips = [
    { start: 0, reverse: false },
    { start: 1, reverse: true },
    { start: 3, reverse: false },
    { start: 4, reverse: true },
    { start: 5, reverse: false },
    { start: 3, reverse: true },

  ];

  const bottomStrips = [
    { start: 2, reverse: true },
    { start: 0, reverse: false },
    { start: 1, reverse: true },
    { start: 3, reverse: false },
    { start: 4, reverse: true },
    { start: 5, reverse: false },
    { start: 1, reverse: true },

  ];

  const renderStrip = (
    strip: { start: number; reverse: boolean },
    keyPrefix: string,
    top: boolean,
    positionIndex: number
  ) => {

    return (
      <View
        key={`${keyPrefix}`}
        style={{
          position: 'absolute',
          [top ? 'top' : 'bottom']: positionIndex * 50 + (top ? 40 : 0),
          left: 0,
          right: 0,
          height: 50,
          zIndex: 1,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }} className={`
         ${strip.reverse ? 'translate-x-[-50px]' : 'flex-row'}
        `}>
          {createRepeatedBadges(strip.start, 6).map((badge, index) => (
            <View key={`${keyPrefix}-${index}`} style={{ marginRight: 6 }}>
              <BadgeComponent badge={badge} />
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flex: 1, backgroundColor: 'white' }} className="relative pt-16">
        {/* Top Strips */}
        {topStrips.map((strip, index) => renderStrip(strip, `top${index}`, true, index))}
        {/* Top Gradient Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.6)']}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 700,
            zIndex: 3,
          }}
          pointerEvents="none"
        />
        {/* Center loader */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent',
          zIndex: 10
        }}>
          <MotiView
            from={{ rotateY: "0deg" }}
            animate={{ rotateY: "360deg" }}
            transition={{
              loop: true,
              repeatReverse: false,
              duration: 2000,
              type: 'timing',
            }}
          >
            <Image source={require("../assets/images/ai.png")} className="w-16 h-16" style={{
              zIndex: 10
            }} />
          </MotiView>
          <Text style={{ marginTop: 16, color: '#666', fontSize: 16, fontWeight: '400', zIndex: 10 }} className="font-serif">
            Finding the best product for you...
          </Text>
        </View>

        {/* Bottom Strips */}
        {bottomStrips.map((strip, index) => renderStrip(strip, `bottom${index}`, false, index))}

        {/* Bottom Gradient Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.6)']}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 800,
            zIndex: 3,
          }}
          pointerEvents="none"
        />
      </View>
    </GestureHandlerRootView>
  );
}

export default LoadingScreen;