import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  useWindowDimensions,
  Platform,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import Video_Thumbnail from "../assets/images/KidWise-Vid_thumbnail.png";
import { useTheme } from '../Page/ThemeContext';
import { useTranslation } from 'react-i18next';
import Phonetic_Thumbnail from "../assets/images/PhoneticTN_by_KidWise.png";

type VideoItem = {
  id: string;
  uri: string;
  thumbnail: any;
  title: string;
  description: string;
};

type VideoData = {
  beginner: VideoItem[];
  intermediate: VideoItem[];
  advanced: VideoItem[];
};

const VideoItem = ({ item, onPress }: { item: VideoItem; onPress: () => void; }) => {
  const { width: screenWidth } = useWindowDimensions();
  const { selectedTheme } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} style={[styles.videoItem, { backgroundColor: selectedTheme.colors[1] }]}>
      <Image
        source={item.thumbnail}
        style={[styles.thumbnail, { height: screenWidth * 0.2 }]}
      />
      <View style={styles.videoInfo}>
        <Text style={[styles.videoTitle, { color: "#ffffff" }]}>{item.title}</Text>
        <Text style={[styles.videoDescription, { color: "#ffffff" }]}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const VideoSection = ({
  title,
  videos,
  activeVideo,
  onVideoPress,
}: {
  title: string;
  videos: VideoItem[];
  activeVideo: string | null;
  onVideoPress: (uri: string) => void;
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const { selectedTheme } = useTheme();
  return (
    <View style={styles.videoSection}>
      <Text style={[styles.sectionTitle, { color: selectedTheme.colors[0] }]}>{title}</Text>
      {activeVideo ? (
        <Video
          source={{ uri: activeVideo }}
          style={[styles.video, { height: screenWidth * 0.56 }]}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
        />
      ) : (
        <FlatList
          data={videos}
          renderItem={({ item }) => (
            <VideoItem item={item} onPress={() => onVideoPress(item.uri)} />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const Home = () => {
  const { selectedTheme } = useTheme();
  const { t } = useTranslation();
  const [activeVideo, setActiveVideo] = useState<{
    [key in keyof VideoData]: string | null;
  }>({
    beginner: null,
    intermediate: null,
    advanced: null,
  });

  const handleVideoPress = (section: keyof VideoData, uri: string) => {
    setActiveVideo({ ...activeVideo, [section]: uri });
  };

  const sections = [
    { title: t("BEGINNER"), section: "beginner" },
    { title: t("INTERMEDIATE"), section: "intermediate" },
    { title: t("ADVANCED"), section: "advanced" },
  ];

  const videoData: VideoData = {
    beginner: [
      {
        id: "1",
        uri: "../assets/Video/Phonetic_by_KidWise.mp4",
        thumbnail: Phonetic_Thumbnail,
        title: t("VIDEOS.beginner.1.title"),
        description: t("VIDEOS.beginner.1.description"),
      },
    ],
    intermediate: [
      {
        id: "1",
        uri: "https://www.example.com/intermediate1.mp4",
        thumbnail: Video_Thumbnail,
        title: t("VIDEOS.intermediate.1.title"),
        description: t("VIDEOS.intermediate.1.description"),
      },
    ],
    advanced: [
      {
        id: "1",
        uri: "https://www.example.com/advanced1.mp4",
        thumbnail: Video_Thumbnail,
        title: t("VIDEOS.advanced.1.title"),
        description: t("VIDEOS.advanced.1.description"),
      },
    ],
  };

  return (
    <FlatList
      data={sections}
      renderItem={({ item }) => (
        <VideoSection
          title={item.title}
          videos={videoData[item.section as keyof VideoData]}
          activeVideo={activeVideo[item.section as keyof VideoData]}
          onVideoPress={(uri) => handleVideoPress(item.section as keyof VideoData, uri)}
        />
      )}
      keyExtractor={(item) => item.section}
      contentContainerStyle={[styles.container, { backgroundColor: selectedTheme.colors[2] }]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 50,
    paddingHorizontal: Platform.OS === "web" ? 20 : 10,
  },
  videoSection: {
    marginVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  video: {
    width: "100%",
    backgroundColor: "black",
    borderRadius: 10,
  },
  videoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  thumbnail: {
    width: "40%",
    borderRadius: 10,
    marginRight: 10,
    resizeMode: "cover",
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  videoDescription: {
    fontSize: 16,
    fontWeight: "300",
  },
});

export default Home;
