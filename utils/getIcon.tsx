import { Feather, MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import React from 'react';

type CategoryIconProps = {
  category: string;
  size?: number;
  color?: string;
};

export function CategoryIcon({ category, size = 24, color = "#000" }: CategoryIconProps) {
  let IconComponent: any = Ionicons;
  let iconName: string = "bag-check";

  switch (category) {
    case "Healthtech and Wellness":
      IconComponent = MaterialCommunityIcons;
      iconName = "heart-pulse";
      break;
    case "Personal Care":
      IconComponent = MaterialCommunityIcons;
      iconName = "hair-dryer";
      break;
    case "Entertainment":
      IconComponent = FontAwesome5;
      iconName = "gamepad";
      break;
    case "Kitchen Appliances":
      IconComponent = MaterialCommunityIcons;
      iconName = "chef-hat";
      break;
    case "Home Improvement":
      IconComponent = Ionicons;
      iconName = "home";
      break;
    case "Travel & Lifestyle":
      IconComponent = FontAwesome5;
      iconName = "suitcase-rolling";
      break;
    case "Smart Mobility":
      IconComponent = MaterialCommunityIcons;
      iconName = "electric-scooter";
      break;
    case "Security & Surveillance":
      IconComponent = Feather;
      iconName = "shield";
      break;
    default:
      IconComponent = Feather;
      iconName = "help-circle";
  }

  return <IconComponent name={iconName} size={size} color={color} />;
}
