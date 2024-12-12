import React from 'react';
import { View, Text } from 'react-native';
import { Entypo, FontAwesome5, MaterialCommunityIcons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { useTheme } from '../Page/ThemeContext';

const IconComponents = {
  Entypo,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
  AntDesign,
};

interface CustomTabBarIconProps {
  name: string;
  type: keyof typeof IconComponents;
  focused: boolean;
}

const CustomTabBarIcon: React.FC<CustomTabBarIconProps> = ({ name, type, focused }) => {
  const { selectedTheme } = useTheme();
  const color = focused ? selectedTheme.colors[0] : "#111";

  const IconComponent = IconComponents[type];

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <IconComponent name={name} size={24} color={color} />
    </View>
  );
};

export default CustomTabBarIcon;
