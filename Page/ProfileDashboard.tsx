import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../Page/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Correctly import useNavigation

const ProfileDashboard: React.FC = ({ route }) => {
  const { width: screenWidth } = useWindowDimensions();
  const { profileName, profileAvatar } = route.params;
  const [highestScore, setHighestScore] = useState<number>(0);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [dailyScores, setDailyScores] = useState<number[]>([]);
  const [days, setDays] = useState<string[]>([]);
  const { selectedTheme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation(); // Use navigation hook

  useEffect(() => {
    loadScores();
  }, []);

  const loadScores = async () => {
    const highest = await AsyncStorage.getItem('highestScore');
    const current = await AsyncStorage.getItem('currentScore');
    const scores = await AsyncStorage.getItem('dailyScores');
    const parsedScores = scores ? JSON.parse(scores) : [];

    setHighestScore(highest ? parseFloat(highest) : 0);
    setCurrentScore(current ? parseFloat(current) : 0);
    setDailyScores(parsedScores.map((item: any) => item.score));
    setDays(parsedScores.map((item: any) => item.day));
  };

  const renderBackButton = () => (
    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back" size={24} color={selectedTheme.colors[0]} />
      <Text style={[styles.backButtonText, { color: selectedTheme.colors[0] }]}>{t('BACK')}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f6f6f6" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          {renderBackButton()}
        </View>
        <View style={styles.avatarContainer}>
          <Image source={profileAvatar ? { uri: profileAvatar } : require('../assets/images/Profile_logo.png')} style={styles.profileIcon} />
          <Text style={styles.profileName}>{profileName}</Text>
        </View>
        <View style={[styles.dashboardContainer, { backgroundColor: selectedTheme.colors[1] }]}>
          <Text style={styles.dashboardTitle}>{t('USER_DASHBOARD')}</Text>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{t('PERFORMANCE_OVERVIEW')}</Text>
            <View style={styles.sectionContent}>
              {/* Add BarChart here */}
            </View>
            <View style={styles.sectionContent}>
              <Text>{t('WATCH_TIME_DURATION')}:</Text>
              {/* Add charts or graphs here */}
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{t('SCORES')}</Text>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionContent}>{t('HIGHEST_SCORE')}: {highestScore}</Text>
              <Text style={styles.sectionContent}>{t('RECENT_SCORE')}: {currentScore}</Text>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{t('ACHIEVEMENTS')}</Text>
            <View style={styles.sectionContent}>
              <Text>{t('BADGES_AWARDS')}</Text>
              {/* Add badges or awards here */}
            </View>
            <View style={styles.sectionContent}>
              <Text>{t('PROGRESS_TRACKER')}</Text>
              {/* Add progress tracker here */}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'web' ? 40 : 20,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    width: "100%",
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: "#3498db",
    borderWidth: 2,
  },
  profileName: {
    fontSize: 24,
    color: "black",
    marginVertical: 10,
  },
  actionContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  actionButton: {
    width: 140,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginHorizontal: 10,
  },
  actionButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  dashboardContainer: {
    width: '100%',
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  dashboardTitle: {
    fontSize: 20,
    color: "white",
    marginBottom: 20,
  },
  sectionContainer: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,   
    color: "white",
    marginBottom: 10,
  },
  sectionContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 18,
    color: "white",
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    marginLeft: 5,
  },
});

export default ProfileDashboard;
