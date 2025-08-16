import LoadingScreen from "@/components/loading";
import { buildPrompt, getRecommendations } from "@/service/gemini/geminiApi";
import { Product, Recommendation } from "@/types";
import { CategoryIcon } from "@/utils/getIcon";
import { Feather } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { MotiView } from "moti";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Image, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import productsData from "../db/db.json";


/**
 * Results Screen - result.jsx
 * Displays the results of the product search.
 * @path /app/results
 * @returns JSX.Element
 */
export default function ResultsScreen() {
  const { query } = useLocalSearchParams();

  // State for recommendations
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  // UI States
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  // Filter states
  const [searchText, setSearchText] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceSort, setPriceSort] = useState<"none" | "asc" | "desc">("none");
  const [showOnlyTopPicks, setShowOnlyTopPicks] = useState(false);

  const fetchRecommendations = useCallback(async () => {
    const prompt = buildPrompt(
      Array.isArray(query) ? query.join(" ") : query ?? "",
      productsData as Product[]
    );
    const aiRecommendations = await getRecommendations(prompt);
    setRecommendations(aiRecommendations);
    setLoading(false);
  }, [query]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const filteredRecommendations = useMemo(() => {
    let filtered = [...recommendations];

    // Search filter
    if (searchText.trim()) {
      filtered = filtered.filter(item =>
        item.product.product_name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.product.brand.toLowerCase().includes(searchText.toLowerCase()) ||
        item.product.category?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // AI Top Pick filter
    if (showOnlyTopPicks) {
      filtered = filtered.filter(item => item.isTopPick);
    }

    // Price sorting
    if (priceSort === "asc") {
      filtered.sort((a, b) => (a.product.price || 0) - (b.product.price || 0));
    } else if (priceSort === "desc") {
      filtered.sort((a, b) => (b.product.price || 0) - (a.product.price || 0));
    }

    return filtered;
  }, [recommendations, searchText, priceSort, showOnlyTopPicks]);

  if (loading) {
    return (
      <LoadingScreen />
    );
  }

  const formatPrice = (price: number) => `₹${price.toLocaleString("en-IN")}`;

  const clearAllFilters = () => {
    setSearchText("");
    setPriceSort("none");
    setShowOnlyTopPicks(false);
  };

  const activeFiltersCount = (searchText ? 1 : 0) + (priceSort !== "none" ? 1 : 0) + (showOnlyTopPicks ? 1 : 0);

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="px-6 pt-16 pb-4 bg-black">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Feather name="arrow-left-circle" size={28} color="white" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-white text-lg opacity-80 font-bold-serif">
              Results for
            </Text>
            <Text className="text-white text-sm font-semi-bold font-serif"
              numberOfLines={2}>
              {query}
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View className="bg-white rounded-lg flex-row items-center px-3 py-1 mb-3">
          <Feather name="search" size={20} color="#666" />
          <TextInput
            placeholder="Search in results..."
            value={searchText}
            placeholderTextColor="#999999"
            selectionColor="#00000050"
            onChangeText={setSearchText}
            className="flex-1 ml-2 text-gray-800 font-serif h-12"
          />
          {searchText ? (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <Feather name="x" size={18} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filter Controls */}
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => setShowFilters(true)}
            className="bg-white rounded-lg px-3 py-2 flex-row items-center"
          >
            <Ionicons name="options" size={20} color="black" />
            <Text className="text-black ml-2 font-serif">Filters</Text>
            {activeFiltersCount > 0 && (
              <View className="bg-red-500 rounded-full w-5 h-5 ml-2 items-center justify-center">
                <Text className="text-white text-xs font-bold">{activeFiltersCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <Text className="text-white font-serif">
            {filteredRecommendations.length} of {recommendations.length} results
          </Text>
        </View>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <View className="flex-row flex-wrap mt-2">

            {priceSort !== "none" && (
              <View className="bg-orange-500 rounded-full px-3 py-1 mr-2 mb-1 flex-row items-center">
                <Text className="text-white text-sm font-serif">
                  Price: {priceSort === "asc" ? "Low to High" : "High to Low"}
                </Text>
                <TouchableOpacity onPress={() => setPriceSort("none")} className="ml-1">
                  <Feather name="x-circle" size={14} color="white" />
                </TouchableOpacity>
              </View>
            )}
            {showOnlyTopPicks && (
              <View className="bg-orange-500 rounded-full px-3 py-1 mr-2 mb-1 flex-row items-center">
                <Text className="text-white text-sm font-serif">AI Top Picks</Text>
                <TouchableOpacity onPress={() => setShowOnlyTopPicks(false)} className="ml-1">
                  <Feather name="x-circle" size={14} color="white" />
                </TouchableOpacity>
              </View>
            )}
            {/* <TouchableOpacity onPress={() => clearAllFilters()} className="">
              <Entypo name="cross" size={20} color="#f87171" />
              <Text className="text-red-400 text-lg font-serif text-end">Clear All</Text>
            </TouchableOpacity> */}
          </View>
        )}
      </View>

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFilters(false)}
      >
        <View className="flex-1 bg-black/80 justify-end">
          <View className="bg-white rounded-t-xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold-serif">Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Feather name="x" size={24} color="#999999" />
              </TouchableOpacity>
            </View>

            {/* Price Sort */}
            <View className="mb-6">
              <Text className="text-lg font-bold-serif mb-3">Sort by Price</Text>
              <View className="gap-2">
                {[
                  { value: "none", label: "Default" },
                  { value: "asc", label: "Price: Low to High" },
                  { value: "desc", label: "Price: High to Low" }
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => setPriceSort(option.value as any)}
                    className={`p-3 rounded-lg border ${priceSort === option.value ? "bg-blue-50 border-blue-500" : "border-gray-300"
                      }`}
                  >
                    <Text className={`font-serif ${priceSort === option.value ? "text-blue-700 font-semibold" : "text-gray-800"
                      }`}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* AI Top Pick Filter */}
            <View className="mb-6">
              <Text className="text-lg font-bold-serif mb-3">AI Recommendations</Text>
              <TouchableOpacity
                onPress={() => setShowOnlyTopPicks(!showOnlyTopPicks)}
                className={`p-3 rounded-lg border flex-row items-center ${showOnlyTopPicks ? "bg-orange-50 border-orange-500" : "border-gray-300"
                  }`}
              >
                <View className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${showOnlyTopPicks ? "bg-orange-500 border-orange-500" : "border-gray-400"
                  }`}>
                  {showOnlyTopPicks && <Feather name="check" size={14} color="white" />}
                </View>
                <Text className={`font-serif ${showOnlyTopPicks ? "text-orange-700 font-semibold" : "text-gray-800"
                  }`}>
                  Show only AI Top Picks
                </Text>
              </TouchableOpacity>
            </View>

            {/* Apply/Clear Buttons */}
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={clearAllFilters}
                className="flex-1 bg-gray-200 p-3 rounded-lg"
              >
                <Text className="text-center font-semibold font-serif text-gray-800">
                  Clear All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowFilters(false)}
                className="flex-1 bg-black p-3 rounded-lg"
              >
                <Text className="text-center font-semibold font-serif text-white">
                  Apply Filters
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Results */}
      <FlatList
        data={filteredRecommendations}
        keyExtractor={(item) => item.product.product_name}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        ListEmptyComponent={
          <View className="py-20 items-center">
            <Text className="text-gray-500 font-serif text-lg mb-2">No results found</Text>
            <Text className="text-gray-400 font-serif text-center">
              Try adjusting your filters or search terms
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isExpanded = expanded[item.product.product_name];
          return (
            <View
              style={{
                backgroundColor: "#fff",
                padding: 20,
                borderRadius: 12,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 4,
                marginBottom: 16,
              }}
            >
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-lg font-bold-serif flex-1 pr-2">
                  {item.product.product_name}
                </Text>

                {item.isTopPick && (
                  <LinearGradient
                    colors={["#ff4500", "#ff6347", "#ff4500"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      borderRadius: 999,
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      flexDirection: "row",
                      alignItems: "center",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      source={require("../assets/images/ai_ivt.png")}
                      style={{ width: 16, height: 16, marginRight: 4, zIndex: 2 }}
                    />
                    <Text
                      className="text-white text-xs font-semibold font-bold-serif"
                      style={{ zIndex: 2 }}
                    >
                      AI Top Pick
                    </Text>
                    <MotiView
                      from={{ translateX: -200 }}
                      animate={{ translateX: 200 }}
                      transition={{
                        loop: true,
                        repeatReverse: false,
                        duration: 2000,
                        type: 'timing',
                      }}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 1,
                      }}
                    >
                      <LinearGradient
                        colors={[
                          "transparent",
                          "rgba(255,255,255,0.3)",
                          "rgba(255,255,255,0.6)",
                          "rgba(255,255,255,0.3)",
                          "transparent",
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                          flex: 1,
                          width: '200%',
                          transform: [{ skewX: '-20deg' }],
                        }}
                      />
                    </MotiView>
                  </LinearGradient>
                )}
              </View>

              {/* Brand & Price */}
              <Text className="text-gray-600 font-serif mb-2">
                {item.product.price && (
                  <Text className="text-black mb-2 font-bold-serif">
                    {formatPrice(item.product.price)}
                  </Text>
                )} by <Text className="font-bold-serif">
                  {item.product.brand}
                </Text>
              </Text>

              {/* Description */}
              <TouchableOpacity
                onPress={() =>
                  setExpanded((prev) => ({
                    ...prev,
                    [item.product.product_name]: !isExpanded,
                  }))
                }
              >
                <Text className="text-gray-800 font-serif mb-3">
                  {isExpanded
                    ? item.product.description
                    : item.product.description?.length > 80
                      ? item.product.description.slice(0, 80) + "..."
                      : item.product.description}
                </Text>
              </TouchableOpacity>

              {/* AI Reason */}
              <View
                style={{
                  backgroundColor: "#000",
                  padding: 10,
                  borderRadius: 8,
                }}
              >
                <Image
                  source={require("../assets/images/ai_ivt.png")}
                  style={{ width: 20, height: 20, marginBottom: 4 }}
                />
                <Text className="text-white font-serif text-sm">
                  {item.reason}
                </Text>
              </View>

              {/* Category Badge */}
              {item.product.category && (
                <View
                  className="bg-black rounded-full px-2 py-1 mt-4 flex-row items-center"
                  style={{ alignSelf: "flex-start" }}
                >
                  <CategoryIcon category={item.product.category} size={16} color="#fff" />
                  <Text className="text-white ml-2 font-serif text-sm">{item.product.category}</Text>
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}