import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  Text,
  LayoutAnimation,
  Platform,
  ImageBackground,
} from 'react-native';
import { Entypo, Ionicons } from '@expo/vector-icons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RNPickerSelect from 'react-native-picker-select';
import { useTheme } from '../Page/ThemeContext';
import { useLanguage } from '../Page/LanguageContext';
import { useTranslation } from 'react-i18next';
import i18n from "../i18n/i18n";
import bg_img1 from "../assets/images/background.jpg";
import bg_img2 from "../assets/images/background_02.jpg";

interface Theme {
  name: string;
  colors: string[];
  accentColor: string;
  hoverState: string;
  gradientBackground: string;
}

interface Background {
  name: string;
  image: any;
}

const themes = [
  { name: "Blue", colors: ["#3F9FFA", "#96E5FC"] },
  { name: "Orange", colors: ["#FFB347", "#FFCC67"] },
  { name: "Green", colors: ["#4CAF50", "#81C784", "#A5D6A7"] },
  { name: "Purple", colors: ["#9C27B0", "#BA68C8", "#CE93D8"] },
  { name: "Red", colors: ["#F44336", "#E57373", "#FFCDD2"] },
  { name: "Yellow", colors: ["#FFEB3B", "#FFF176", "#FFF59D"] },
  { name: "Pink", colors: ["#E91E63", "#F06292", "#F8BBD0"] },
  { name: "Teal", colors: ["#009688", "#4DB6AC", "#80CBC4"] },
  { name: "Light Blue", colors: ["#03A9F4", "#4FC3F7", "#81D4FA"] },
  { name: "Amber", colors: ["#FFC107", "#FFD54F", "#FFE082"] },
];

const backgrounds: Background[] = [
  { name: "Cat", image: bg_img1 },
  { name: "KidWise", image: bg_img2 },
];

const Setting: React.FC = () => {
  const { t } = useTranslation();
  const { selectedTheme, setSelectedTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [backgroundImage, setBackgroundImage] = useState(bg_img1); // Default image

  const selectTheme = (themeName: string) => {
    const selected = themes.find((theme) => theme.name === themeName);
    if (selected) {
      LayoutAnimation.configureNext({
        duration: 100,
        create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
        update: { type: LayoutAnimation.Types.easeInEaseOut },
      });
      setSelectedTheme(selected);
    }
  };

  const selectBackground = (backgroundName: string) => {
    const selected = backgrounds.find((bg) => bg.name === backgroundName);
    if (selected) {
      setBackgroundImage(selected.image); // Update background image
    }
  };

  const selectLanguage = (lang: string) => {
    setLanguage(lang);
    i18n.changeLanguage(lang); // Change the language
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={[styles.header, { color: selectedTheme.colors[0] }]}>{t('SETTINGS')}</Text>
          </View>
          <ScrollView>
            <View style={styles.section}>
              <View style={styles.sectionBody}>
                <View style={[styles.row, styles.rowFirst]}>
                  <View style={styles.rowIcon}>
                    <Entypo name="language" size={24} color={selectedTheme.colors[0]} />
                  </View>
                  <Text style={[styles.rowLabel, { color: selectedTheme.colors[0] }]}>{t('language')}</Text>
                  <View style={styles.rowSpacer} />
                  <RNPickerSelect
                    onValueChange={selectLanguage}
                    items={[
                      { label: t('English'), value: 'en' },
                      { label: t('Thai'), value: 'th' }
                    ]}
                    style={{
                      ...pickerSelectStyles,
                      inputIOS: { ...pickerSelectStyles.inputIOS, color: selectedTheme.colors[0] },
                      inputAndroid: { ...pickerSelectStyles.inputAndroid, color: selectedTheme.colors[0] },
                    }}
                    value={language}
                    useNativeAndroidPickerStyle={false}
                    Icon={() => <AntDesign name="down" size={24} color={selectedTheme.colors[0]} />}
                  />
                </View>
                <View style={styles.row}>
                  <View style={styles.rowIcon}>
                    <Ionicons name="color-palette-sharp" size={24} color={selectedTheme.colors[0]} />
                  </View>
                  <Text style={[styles.rowLabel, { color: selectedTheme.colors[0] }]}>{t('theme')}</Text>
                  <View style={styles.rowSpacer} />
                  <RNPickerSelect
                    onValueChange={selectTheme}
                    items={themes.map((theme) => ({ label: t(`themes.${theme.name}`), value: theme.name }))}
                    style={{
                      ...pickerSelectStyles,
                      inputIOS: { ...pickerSelectStyles.inputIOS, color: selectedTheme.colors[0] },
                      inputAndroid: { ...pickerSelectStyles.inputAndroid, color: selectedTheme.colors[0] },
                    }}
                    value={selectedTheme.name}
                    useNativeAndroidPickerStyle={false}
                    Icon={() => <AntDesign name="down" size={24} color={selectedTheme.colors[0]} />}
                  />
                </View>
                <View style={styles.row}>
                  <View style={styles.rowIcon}>
                    <Ionicons name="image" size={24} color={selectedTheme.colors[0]} />
                  </View>
                  <Text style={[styles.rowLabel, { color: selectedTheme.colors[0] }]}>{t('background')}</Text>
                  <View style={styles.rowSpacer} />
                  <RNPickerSelect
                    onValueChange={selectBackground}
                    items={backgrounds.map((bg) => ({ label: t(`backgrounds.${bg.name}`), value: bg.name }))}
                    style={{
                      ...pickerSelectStyles,
                      inputIOS: { ...pickerSelectStyles.inputIOS, color: selectedTheme.colors[0] },
                      inputAndroid: { ...pickerSelectStyles.inputAndroid, color: selectedTheme.colors[0] },
                    }}
                    value={backgroundImage}
                    useNativeAndroidPickerStyle={false}
                    Icon={() => <AntDesign name="down" size={24} color={selectedTheme.colors[0]} />}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 20,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#FFF',
    marginRight: 10,
    height: 40,
  },
  inputAndroid: {
    fontSize: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#FFF',
    marginRight: 10,
    height: 40,
  },
  iconContainer: {
    top: 10,
    right: 12,
  },
});

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  headerContainer: {
    padding: Platform.OS === "web" ? 50 : 50,
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    fontSize: 32,
    fontWeight: "700",
  },
  section: {
    paddingTop: 12,
  },
  sectionBody: {
    paddingLeft: 24,
    backgroundColor: "transparent",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e3e3e3",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingRight: 16,
    height: 50,
    borderTopWidth: 1,
    borderColor: "#e3e3e3",
  },
  rowFirst: {
    borderTopWidth: 0,
  },
  rowIcon: {
    width: 30,
    height: 30,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    marginRight: 12,
  },
  rowLabel: {
    fontSize: 20,
    fontWeight: "500",
    color: "#000",
  },
  rowSpacer: {
    flexGrow: 1,
  },
});

export default Setting;
