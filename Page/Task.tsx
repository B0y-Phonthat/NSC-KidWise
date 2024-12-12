import React, { useState, useCallback, useMemo, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Animated, Image, Platform} from 'react-native';
import { Audio } from 'expo-av';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next'; // Assuming you use react-i18next for translations
import Spinner from 'react-native-loading-spinner-overlay';
import { useTheme } from '../Page/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const flashcards = [
  { question: 'What color is the sky?', options: ['Blue', 'Green', 'Red'], answer: 'Blue', image: require('../assets/images/sky.png') },
  { question: 'What sound does a cat make?', options: ['Bark', 'Meow', 'Quack'], answer: 'Meow', image: require('../assets/images/cat.png') },
  { question: 'What is the color of grass?', options: ['Green', 'Yellow', 'Purple'], answer: 'Green', image: require('../assets/images/grass.png') },
  { question: 'What is 1 + 1?', options: ['1', '2', '3'], answer: '2', image: require('../assets/images/math.png') },
  { question: 'What do you drink that comes from cows?', options: ['Juice', 'Milk', 'Water'], answer: 'Milk', image: require('../assets/images/milk.png') },
  { question: 'What color is a banana?', options: ['Blue', 'Yellow', 'Red'], answer: 'Yellow', image: require('../assets/images/banana.png') },
  { question: 'What animal barks?', options: ['Cat', 'Dog', 'Duck'], answer: 'Dog', image: require('../assets/images/dog.png') },
  { question: 'What do bees make?', options: ['Honey', 'Butter', 'Jam'], answer: 'Honey', image: require('../assets/images/bee.png') },
  { question: 'What color is an apple?', options: ['Red', 'Blue', 'Purple'], answer: 'Red', image: require('../assets/images/apple.png') },
  { question: 'What animal lives in a pond and quacks?', options: ['Dog', 'Cat', 'Duck'], answer: 'Duck', image: require('../assets/images/duck.png') },
];

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const soundFiles = {
  A: require('../assets/sounds/A.mp3'),
  B: require('../assets/sounds/B.mp3'),
  C: require('../assets/sounds/C.mp3'),
  D: require('../assets/sounds/D.mp3'),
  E: require('../assets/sounds/E.mp3'),
  F: require('../assets/sounds/F.mp3'),
  G: require('../assets/sounds/G.mp3'),
  H: require('../assets/sounds/H.mp3'),
  I: require('../assets/sounds/I.mp3'),
  J: require('../assets/sounds/J.mp3'),
  K: require('../assets/sounds/K.mp3'),
  L: require('../assets/sounds/L.mp3'),
  M: require('../assets/sounds/M.mp3'),
  N: require('../assets/sounds/N.mp3'),
  O: require('../assets/sounds/O.mp3'),
  P: require('../assets/sounds/P.mp3'),
  Q: require('../assets/sounds/Q.mp3'),
  R: require('../assets/sounds/R.mp3'),
  S: require('../assets/sounds/S.mp3'),
  T: require('../assets/sounds/T.mp3'),
  U: require('../assets/sounds/U.mp3'),
  V: require('../assets/sounds/V.mp3'),
  W: require('../assets/sounds/W.mp3'),
  X: require('../assets/sounds/X.mp3'),
  Y: require('../assets/sounds/Y.mp3'),
  Z: require('../assets/sounds/Z.mp3'),
  "I love my mom.": require('../assets/sounds/sentence_1.mp3'),
  "The cat is on the mat.": require('../assets/sounds/sentence_2.mp3'),
  "We are going to the park.": require('../assets/sounds/sentence_3.mp3'),
  "He likes to play with his toys.": require('../assets/sounds/sentence_4.mp3'),
  "She reads a book every night.": require('../assets/sounds/sentence_5.mp3'),
  "The sun is shining bright.": require('../assets/sounds/sentence_6.mp3'),
  "The dog barks at strangers.": require('../assets/sounds/sentence_7.mp3'),
  "The baby is sleeping in the crib.": require('../assets/sounds/sentence_8.mp3'),
  "They are having a picnic.": require('../assets/sounds/sentence_9.mp3'),
  "We are friends forever.": require('../assets/sounds/sentence_10.mp3')
}

const sentences = [
  "I love my mom.",
  "The cat is on the mat.",
  "We are going to the park.",
  "He likes to play with his toys.",
  "She reads a book every night.",
  "The sun is shining bright.",
  "The dog barks at strangers.",
  "The baby is sleeping in the crib.",
  "They are having a picnic.",
  "We are friends forever."
];

const subtitles = [
  "ไอ-เลิฟท์-มาย-มัม",
  "เดอะ-แคท-อิส-ออน-เดอะ-แมท",
  "วี-อาร์-โกอิ้ง-ทู-เดอะ-พาร์ค",
  "ฮี-ไลค์ส-ทู-เพลย์-วิธ-ฮิส-ทอยส์",
  "ชี-รีดส์-อะ-บุ๊ค-เอฟวรี-ไนท์",
  "เดอะ-ซัน-อิส-ชายน์นิ่ง-ไบรท์",
  "เดอะ-ด็อก-บาร์คส์-แอท-สเตรนเจอร์ส",
  "เดอะ-เบบี้-อิส-สลีปพิง-อิน-เดอะ-คริบ",
  "เดย์-อาร์-แฮฟวิ่ง-อะ-พิกนิก",
  "วี-อาร์-เฟรนส์-ฟอร์เอฟเวอร์"
];

const Task = () => {
  const [activeSection, setActiveSection] = useState<string>("Tasks");
  const [currentCard, setCurrentCard] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const { t } = useTranslation();
  const { selectedTheme } = useTheme();
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [score, setScore] = useState<number | null>(null);
  const [isSoundLoading, setIsSoundLoading] = useState(false);

  const handleNextCard = useCallback(() => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
    } else {
      Alert.alert('Quiz Completed', `Your final score is ${quizScore}/${flashcards.length}`, [{ text: 'Restart', onPress: () => setCurrentCard(0) }]);
      setQuizScore(0);
    }
  }, [currentCard, quizScore]);

  const handleAnswer = useCallback((option: string) => {
    if (option === flashcards[currentCard].answer) {
      setQuizScore(prevScore => prevScore + 1);
      Alert.alert('Correct!', 'Good job!', [{ text: 'Next', onPress: handleNextCard }]);
    } else {
      Alert.alert('Oops!', 'Try again!', [{ text: 'OK' }]);
    }
  }, [currentCard, handleNextCard]);

  const startRecording = useCallback(async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
      } else {
        alert('Permission to access microphone is required!');
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }, []);

  const stopRecording = useCallback(async (referenceText: string) => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        if (uri) {
          processAudio(uri, referenceText, setScore, setLoading);
        }
        setRecording(null);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  }, [recording]);

  const processAudio = async (uri: string, referenceText: string, setScore: (score: number) => void, setLoading: (loading: boolean) => void) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'audio/webm',
      name: 'audio.webm',
    } as any);
    formData.append('reference_text', referenceText);

    try {
      const response = await axios.post('http://192.168.81.208:5000/speech2text', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { accuracy } = response.data;
      setScore(accuracy);
    } catch (error) {
      console.error('Error processing audio', error);
    } finally {
      setLoading(false);
    }
  };

  const playSentence = useCallback(async (sentence: string) => {
    setIsSoundLoading(true);
    try {
      const sound = new Audio.Sound();
      await sound.playAsync();
      await sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      Alert.alert('Error', 'Error playing sound');
      console.error('Error playing sound', error);
    } finally {
      setIsSoundLoading(false);
    }
  }, []);

  const renderQuitButton = useMemo(() => (
    <TouchableOpacity style={styles.quitButton} onPress={() => setActiveSection("Tasks")}>
      <Icon name="exit-outline" size={24} color={selectedTheme.colors[0]} />
    </TouchableOpacity>
  ), [selectedTheme.colors]);

  const TaskItem = useCallback(({ title, description, onSelect }: { title: string; description: string; onSelect: () => void; }) => (
    <TouchableOpacity style={[styles.taskItem, { backgroundColor: selectedTheme.colors[0] }]} onPress={onSelect}>
      <Text style={styles.taskTitle}>{title}</Text>
      <Text style={styles.taskDescription}>{description}</Text>
    </TouchableOpacity>
  ), [selectedTheme.colors]);

  const TasksSection = useMemo(() => {
    const tasks = [
      { title: t('EXERCISE_1_TITLE'), description: t('EXERCISE_1_DESCRIPTION'), onSelect: () => setActiveSection("Exercise 1") },
      { title: t('EXERCISE_2_TITLE'), description: t('EXERCISE_2_DESCRIPTION'), onSelect: () => setActiveSection("Exercise 2") },
    ];

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: selectedTheme.colors[0], textAlign: 'center', flex: 1 }]}>{t('TASKS_TITLE')}</Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={[styles.contentTitle, { color: selectedTheme.colors[0] }]}>{t('TASKS_SUBTITLE')}</Text>
          {tasks.map((task, index) => (
            <TaskItem key={index} title={task.title} description={task.description} onSelect={task.onSelect} />
          ))}
        </View>
      </View>
    );
  }, [selectedTheme.colors, t, TaskItem]);

  const MinigamesSection = useMemo(() => {
    const minigames = [
      { title: t('Minigame 1: Flashcard Quiz!'), description: t('Test your child\'s vocabulary with our interactive Flashcard Quiz!'), onSelect: () => setActiveSection("Minigame 1") },
    ];

    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={[styles.contentTitle, { color: selectedTheme.colors[0] }]}>{t('Minigames')}</Text>
          {minigames.map((minigame, index) => (
            <TaskItem key={index} title={minigame.title} description={minigame.description} onSelect={minigame.onSelect} />
          ))}
        </View>
      </View>
    );
  }, [selectedTheme.colors, t, TaskItem]);

  const Minigame1 = useMemo(() => (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {renderQuitButton}
        <Text style={[styles.exerciseTitle, { color: selectedTheme.colors[0] }]}>{t('Minigame 1: Flashcard Quiz!')}</Text>
      </View>
      <View style={styles.centerContainer}>
        <Image source={flashcards[currentCard].image} style={styles.image} />
        <Text style={styles.question}>
          {flashcards[currentCard].question}
        </Text>
        {flashcards[currentCard].options.map((option, index) => (
          <Animated.View key={index} style={{ transform: [{ scale: bounceAnim }] }}>
            <TouchableOpacity style={styles.optionButton} onPress={() => handleAnswer(option)}>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
        <Text style={[styles.score, { color: selectedTheme.colors[0] }]}>Score: {quizScore}</Text>
      </View>
    </View>
  ), [selectedTheme.colors, t, currentCard, bounceAnim, handleAnswer, quizScore, renderQuitButton]);

  const Exercise1 = ({ setActiveSection }) => {
    const [letterIndex, setLetterIndex] = useState(0);
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [score, setScore] = useState<number | null>(null);
    const { selectedTheme } = useTheme();
    const { t } = useTranslation();
  
    const startRecording = useCallback(async () => {
      try {
        const permission = await Audio.requestPermissionsAsync();
        if (permission.status === 'granted') {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
          });
          const { recording } = await Audio.Recording.createAsync(
            Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
          );
          setRecording(recording);
        } else {
          alert('Permission to access microphone is required!');
        }
      } catch (err) {
        console.error('Failed to start recording', err);
      }
    }, []);
  
    const stopRecording = useCallback(async () => {
      try {
        if (recording) {
          await recording.stopAndUnloadAsync();
          const uri = recording.getURI();
          if (uri) {
            processAudio(uri, letters[letterIndex], setScore, setLoading);
          }
          setRecording(null);
        }
      } catch (err) {
        console.error('Failed to stop recording', err);
      }
    }, [recording]);
  
    const playLetter = useCallback(async (letter: string) => {
      try {
        const sound = new Audio.Sound();
        await sound.loadAsync(soundFiles[letter]);
        await sound.playAsync();
        await sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            sound.unloadAsync();
          }
        });
      } catch (error) {
        Alert.alert('Error', 'Error playing sound');
        console.error('Error playing sound', error);
      }
    }, []);
  
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.quitButton} onPress={() => setActiveSection("Tasks")}>
            <Icon name="exit-outline" size={24} color={selectedTheme.colors[0]} />
          </TouchableOpacity>
          <Text style={[styles.exerciseTitle, { color: selectedTheme.colors[0] }]}>{t('EXERCISE_1_TITLE')}</Text>
        </View>
        <View style={styles.centerContainer}>
          <View style={styles.rowContainer}>
            {letterIndex > 0 && (
              <TouchableOpacity style={styles.backButton} onPress={() => setLetterIndex(prev => prev - 1)}>
                <Icon name="arrow-back" size={24} color={selectedTheme.colors[0]} />
                <Text style={[styles.backButtonText, { color: selectedTheme.colors[0] }]}>{t('Back')}</Text>
              </TouchableOpacity>
            )}
            <View style={[styles.sentenceContainer, { backgroundColor: selectedTheme.colors[0] }]}>
              <Text style={styles.sentence}>{letters[letterIndex]}</Text>
            </View>
            {letterIndex < letters.length - 1 && (
              <TouchableOpacity style={styles.forwardButton} onPress={() => setLetterIndex(prev => prev + 1)}>
                <Text style={[styles.forwardButtonText, { color: selectedTheme.colors[0] }]}>{t('Next')}</Text>
                <Icon name="arrow-forward" size={24} color={selectedTheme.colors[0]} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.userSentenceContainer}>
            <Text style={styles.userSentencePlaceholder}>{t('USER_SENTENCE_PLACEHOLDER')}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={startRecording} style={[styles.micButton, { backgroundColor: selectedTheme.colors[0] }]}>
              <Icon name="mic" size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => stopRecording(letters[letterIndex])} style={[styles.stopButton, { backgroundColor: selectedTheme.colors[0] }]}>
              <Text style={styles.stopButtonText}>{t('STOP')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => playLetter(letters[letterIndex])} style={[styles.speakerButton, { backgroundColor: selectedTheme.colors[0] }]}>
              <FontAwesome name="volume-up" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
          {loading && <ActivityIndicator size="large" color="#0000ff" />}
          {score !== null && <Text style={[styles.score, { color: selectedTheme.colors[0] }]}>Score: {score}%</Text>}
        </View>
      </View>
    );
  };

  const Exercise2 = ({ setActiveSection }) => {
    const [sentenceIndex, setSentenceIndex] = useState(0);
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [score, setScore] = useState<number | null>(null);
    const { selectedTheme } = useTheme();
    const { t } = useTranslation();
    const [isSoundLoading, setIsSoundLoading] = useState(false);
  
    const startRecording = useCallback(async () => {
      try {
        const permission = await Audio.requestPermissionsAsync();
        if (permission.status === 'granted') {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
          });
          const { recording } = await Audio.Recording.createAsync(
            Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
          );
          setRecording(recording);
        } else {
          alert('Permission to access microphone is required!');
        }
      } catch (err) {
        console.error('Failed to start recording', err);
      }
    }, []);
  
    const stopRecording = useCallback(async (referenceText: string) => {
      try {
        if (recording) {
          await recording.stopAndUnloadAsync();
          const uri = recording.getURI();
          if (uri) {
            processAudio(uri, referenceText, setScore, setLoading);
          }
          setRecording(null);
        }
      } catch (err) {
        console.error('Failed to stop recording', err);
      }
    }, [recording]);
  
    const playSentence = useCallback(async (sentence: string) => {
      setIsSoundLoading(true);
      try {
        const sound = new Audio.Sound();
        await sound.loadAsync(soundFiles[sentence]);
        await sound.playAsync();
        await sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            sound.unloadAsync();
          }
        });
      } catch (error) {
        Alert.alert('Error', 'Error playing sound');
        console.error('Error playing sound', error);
      } finally {
        setIsSoundLoading(false);
      }
    }, []);
  
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.quitButton} onPress={() => setActiveSection("Tasks")}>
            <Icon name="exit-outline" size={24} color={selectedTheme.colors[0]} />
          </TouchableOpacity>
          <Text style={[styles.exerciseTitle, { color: selectedTheme.colors[0] }]}>{t('EXERCISE_2_TITLE')}</Text>
        </View>
        <View style={styles.centerContainer}>
          <View style={styles.rowContainer}>
            <View style={[styles.sentenceContainer, { backgroundColor: selectedTheme.colors[0] }]}>
              <Text style={styles.sentence}>{sentences[sentenceIndex]}</Text>
              <Text style={styles.subtitle}>{subtitles[sentenceIndex]}</Text>
            </View>
          </View>
          <View style={styles.userSentenceContainer}>
            <Text style={styles.userSentencePlaceholder}>{t('USER_SENTENCE_PLACEHOLDER')}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={startRecording} style={[styles.micButton, { backgroundColor: selectedTheme.colors[0] }]}>
              <Icon name="mic" size={24} color="#FFF" />
            </TouchableOpacity>
            {recording && (
              <TouchableOpacity onPress={() => stopRecording(sentences[sentenceIndex])} style={[styles.stopButton, { backgroundColor: selectedTheme.colors[0] }]}>
                <Text style={styles.stopButtonText}>{t('STOP')}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => setSentenceIndex((prev) => (prev + 1) % sentences.length)} style={[styles.speakerButton, { backgroundColor: selectedTheme.colors[0] }]}>
              <MaterialCommunityIcons name="restart" size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => playSentence(sentences[sentenceIndex])} style={[styles.speakerButton, { backgroundColor: selectedTheme.colors[0] }]}>
              <FontAwesome name="volume-up" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
          {loading && <ActivityIndicator size="large" color="#0000ff" />}
          {score !== null && <Text style={[styles.score, { color: selectedTheme.colors[0] }]}>Score: {score}%</Text>}
        </View>
      </View>
    );
  };
  
  const renderSection = useMemo(() => {
    switch (activeSection) {
      case "Tasks":
        return (
          <ScrollView>
            {TasksSection}
            {MinigamesSection}
          </ScrollView>
        );
      case "Exercise 1":
        return <Exercise1 setActiveSection={setActiveSection} />;
      case "Exercise 2":
        return <Exercise2 setActiveSection={setActiveSection} />;
      case "Minigame 1":
        return Minigame1;
      default:
        return <View style={styles.centeredContainer}><Text>{t('TASK')}</Text></View>;
    }
  }, [activeSection, t, setActiveSection]);

  return (
    <View style={styles.container}>
      {renderSection}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
  },
  headerContainer: {
    paddingTop: Platform.OS === 'android' ? 50 : 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    marginLeft: 10,
  },
  quitButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  forwardButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  forwardButtonText: {
    fontSize: 16,
    marginRight: 10,
  },
  contentContainer: {
    padding: 20,
  },
  centeredContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  taskItem: {
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },
  taskTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  taskDescription: {
    color: "white",
    fontSize: 14,
    marginTop: 5,
  },
  exerciseTitle: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    flex: 1,
    flexWrap: 'wrap',
  },
  exerciseDescription: {
    fontSize: 18,
    textAlign: "center",
  },
  sentenceContainer: {
    borderRadius: 10,
    padding: 15,
    marginVertical: 20,
    alignItems: "center",
    width: "80%",
  },
  sentence: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "400",
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
  userSentenceContainer: {
    borderRadius: 10,
    padding: 30,
    marginVertical: 50,
    alignItems: "center",
    width: "80%",
    alignSelf: "center",
    backgroundColor: "#e0e0e0",
  },
  userSentencePlaceholder: {
    fontSize: 18,
    fontWeight: "400",
    color: "#a0a0a0",
    textAlign: "center",
  },
  micButton: {
    borderRadius: 50,
    padding: 10,
    marginTop: 20,
  },
  speakerButton: {
    borderRadius: 50,
    padding: 10,
    marginTop: 20,
    marginLeft: 10,
  },
  stopButton: {
    backgroundColor: "#e74c3c",
    borderRadius: 50,
    padding: 10,
    marginTop: 20,
  },
  stopButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  score: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  question: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    width: '100%',
  },
  optionText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Task;
