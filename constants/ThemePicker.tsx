import React from 'react';
import { View, TouchableOpacity, StyleSheet, LayoutAnimation, LayoutAnimationConfig, Text } from 'react-native';

interface Theme {
  name: string;
  background: string;
}

interface ThemePickerProps {
  themes: Theme[];
  selectedTheme: string;
  onSelected: (theme: string) => void;
  holderStyle?: object;
  selectorStyle?: object;
}

const animations: LayoutAnimationConfig = {
  duration: 100,
  create: {
    type: LayoutAnimation.Types.linear,
  },
  update: {
    type: LayoutAnimation.Types.linear,
    springDamping: 0.7,
  },
};

const ThemePicker: React.FC<ThemePickerProps> = ({ themes, selectedTheme, onSelected, holderStyle, selectorStyle }) => {
  return (
    <View style={[styles.holder, holderStyle]}>
      {themes.map((theme, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.selector, selectorStyle, { borderWidth: selectedTheme === theme.name ? 2 : 1 }]}
          onPress={() => {
            LayoutAnimation.configureNext(animations);
            onSelected(theme.name);
          }}
        >
          <Text style={styles.themeName}>{theme.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  holder: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selector: {
    margin: 4,
    borderColor: '#000',
    padding: 8,
  },
  themeName: {
    fontSize: 16,
  },
});

export default ThemePicker;
