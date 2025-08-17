import { Text, View } from "react-native";
import { Badge } from "@/types";

/**
 * Badge Component - BadgeStrip.tsx
 * Displays a badge with an icon and text.
 * @path /components/BadgeStrip
 * @returns TSX.Element
 */
const BadgeComponent = ({ badge }: { badge: Badge }) => {

  return (
    <View style={{
      backgroundColor: '#f5f5f5',
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginHorizontal: 8,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#e0e0e0',
    }}>
      {badge.icon}
      <Text style={{
        marginLeft: 8,
        color: '#666',
        fontSize: 14,
        fontWeight: '500',
      }}>
        {badge.text}
      </Text>
    </View>
  );
};

export default BadgeComponent;