// import React, { useState, useCallback, useMemo, useRef } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import FontAwesome from '@expo/vector-icons/FontAwesome';
// import { Audio } from 'expo-av';
// import Spinner from 'react-native-loading-spinner-overlay';
// import { useTheme } from '../Page/ThemeContext';
// import { useTranslation } from 'react-i18next';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { MaterialCommunityIcons } from '@expo/vector-icons';

// const sentences = [
//     "I love my mom.",
//     "The cat is on the mat.",
//     "We are going to the park.",
//     "He likes to play with his toys.",
//     "She reads a book every night.",
//     "The sun is shining bright.",
//     "The dog barks at strangers.",
//     "The baby is sleeping in the crib.",
//     "They are having a picnic.",
//     "We are friends forever."
// ];

// const subtitles = [
//     "ไอ-เลิฟท์-มาย-มัม",
//     "เดอะ-แคท-อิส-ออน-เดอะ-แมท",
//     "วี-อาร์-โกอิ้ง-ทู-เดอะ-พาร์ค",
//     "ฮี-ไลค์ส-ทู-เพลย์-วิธ-ฮิส-ทอยส์",
//     "ชี-รีดส์-อะ-บุ๊ค-เอฟวรี-ไนท์",
//     "เดอะ-ซัน-อิส-ชายน์นิ่ง-ไบรท์",
//     "เดอะ-ด็อก-บาร์คส์-แอท-สเตรนเจอร์ส",
//     "เดอะ-เบบี้-อิส-สลีปพิง-อิน-เดอะ-คริบ",
//     "เดย์-อาร์-แฮฟวิ่ง-อะ-พิกนิก",
//     "วี-อาร์-เฟรนส์-ฟอร์เอฟเวอร์"
// ];

// const soundFiles = {
//     "I love my mom.": require('../assets/sounds/sentence_1.mp3'),
//     "The cat is on the mat.": require('../assets/sounds/sentence_2.mp3'),
//     "We are going to the park.": require('../assets/sounds/sentence_3.mp3'),
//     "He likes to play with his toys.": require('../assets/sounds/sentence_4.mp3'),
//     "She reads a book every night.": require('../assets/sounds/sentence_5.mp3'),
//     "The sun is shining bright.": require('../assets/sounds/sentence_6.mp3'),
//     "The dog barks at strangers.": require('../assets/sounds/sentence_7.mp3'),
//     "The baby is sleeping in the crib.": require('../assets/sounds/sentence_8.mp3'),
//     "They are having a picnic.": require('../assets/sounds/sentence_9.mp3'),
//     "We are friends forever.": require('../assets/sounds/sentence_10.mp3')
//   };

//   const Exercise2 = ({ setActiveSection }) => {
//     const [sentenceIndex, setSentenceIndex] = useState(0);
//     const [recording, setRecording] = useState<Audio.Recording | null>(null);
//     const [score, setScore] = useState<number | null>(null);
//     const [loading, setLoading] = useState<boolean>(false);
//     const { selectedTheme } = useTheme();
//     const { t } = useTranslation();
//     const [isSoundLoading, setIsSoundLoading] = useState(false);

//     const startRecording = useCallback(async () => {
//         try {
//             const permission = await Audio.requestPermissionsAsync();
//             if (permission.status === 'granted') {
//                 await Audio.setAudioModeAsync({
//                     allowsRecordingIOS: true,
//                     playsInSilentModeIOS: true,
//                 });
//                 const { recording } = await Audio.Recording.createAsync(
//                     Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
//                 );
//                 setRecording(recording);
//             } else {
//                 alert('Permission to access microphone is required!');
//             }
//         } catch (err) {
//             console.error('Failed to start recording', err);
//         }
//     }, []);

//     const stopRecording = useCallback(async () => {
//         try {
//             if (recording) {
//                 await recording.stopAndUnloadAsync();
//                 const uri = recording.getURI();
//                 if (uri) {
//                     processAudio(uri);
//                 }
//                 setRecording(null);
//             }
//         } catch (err) {
//             console.error('Failed to stop recording', err);
//         }
//     }, [recording]);

//     const processAudio = async (uri: string) => {
//         setLoading(true);
//         const formData = new FormData();
//         formData.append('file', {
//             uri,
//             type: 'audio/webm', // Ensure the type matches the recorded audio format
//             name: 'audio.webm',
//         });
//         formData.append('reference_text', sentences[sentenceIndex]); // Send the reference text

//         try {
//             const response = await axios.post('http://192.168.81.208:5000/evaluate_speech', formData, {
//                 headers: { 'Content-Type': 'multipart/form-data' },
//             });
//             console.log('Response:', response.data);
//             const newScore = response.data.combined_score;
//             setScore(newScore);
//             await storeScore(newScore);
//         } catch (error) {
//             console.error('Error processing audio', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const storeScore = async (newScore: number) => {
//         try {
//             const highestScore = await AsyncStorage.getItem('highestScore');
//             const currentHighestScore = highestScore ? parseFloat(highestScore) : 0;

//             if (newScore > currentHighestScore) {
//                 await AsyncStorage.setItem('highestScore', newScore.toString());
//             }

//             await AsyncStorage.setItem('currentScore', newScore.toString());

//             const scores = await AsyncStorage.getItem('dailyScores');
//             const parsedScores = scores ? JSON.parse(scores) : [];
//             const today = new Date().toISOString().split('T')[0];
//             parsedScores.push({ day: today, score: newScore });

//             await AsyncStorage.setItem('dailyScores', JSON.stringify(parsedScores));
//         } catch (error) {
//             console.error('Error storing score', error);
//         }
//     };

//     const playSentence = useCallback(async (sentence: string) => {
//         setIsSoundLoading(true);
//         try {
//             const { sound } = await Audio.Sound.createAsync(
//                 soundFiles[sentence],
//                 { shouldPlay: true }
//             );
//             await sound.playAsync();
//         } catch (error) {
//             Alert.alert('Error', 'Error playing sound');
//             console.error('Error playing sound', error);
//         } finally {
//             setIsSoundLoading(false);
//         }
//     }, []);

//     const renderQuitButton = useMemo(() => (
//         <TouchableOpacity style={styles.quitButton} onPress={() => setActiveSection("Tasks")}>
//             <Icon name="exit-outline" size={24} color={selectedTheme.colors[0]} />
//         </TouchableOpacity>
//     ), [selectedTheme.colors]);

//     return (
//         <View style={styles.container}>
//             <View style={styles.headerContainer}>
//                 {renderQuitButton}
//                 <Text style={[styles.exerciseTitle, { color: selectedTheme.colors[0] }]}>{t('EXERCISE_2_TITLE')}</Text>
//             </View>
//             <View style={styles.centerContainer}>
//                 <View style={styles.rowContainer}>
//                     <View style={[styles.sentenceContainer, { backgroundColor: selectedTheme.colors[0] }]}>
//                         <Text style={styles.sentence}>{sentences[sentenceIndex]}</Text>
//                         <Text style={styles.subtitle}>{subtitles[sentenceIndex]}</Text>
//                     </View>
//                 </View>
//                 <View style={[styles.userSentenceContainer, { backgroundColor: selectedTheme.colors[1] }]}>
//                     <Text style={[styles.sentence, { color: "#FFFF" }]}>{t('USER_SENTENCE_PLACEHOLDER')}</Text>
//                 </View>
//                 <View style={styles.buttonContainer}>
//                     <TouchableOpacity onPress={startRecording} style={[styles.micButton, { backgroundColor: selectedTheme.colors[0] }]}>
//                         <Icon name="mic" size={24} color="#FFF" />
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={() => setSentenceIndex((prev) => (prev + 1) % sentences.length)} style={[styles.speakerButton, { backgroundColor: selectedTheme.colors[0] }]}>
//                         <MaterialCommunityIcons name="restart" size={24} color="#FFF" />
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={() => playSentence(sentences[sentenceIndex])} style={[styles.speakerButton, { backgroundColor: selectedTheme.colors[0] }]}>
//                         <FontAwesome name="volume-up" size={24} color="#FFF" />
//                     </TouchableOpacity>
//                 </View>
//                 {recording && (
//                     <TouchableOpacity onPress={stopRecording} style={styles.stopButton}>
//                         <Text style={styles.stopButtonText}>{t('STOP')}</Text>
//                     </TouchableOpacity>
//                 )}
//                 {loading && (
//                     <Spinner visible={loading} textContent={"Processing..."} textStyle={{ color: "#FFF" }} />
//                 )}
//                 {score !== null && <Text style={[styles.score, { color: selectedTheme.colors[0] }]}>Score: {score}%</Text>}
//             </View>
//         </View>
//     );
// };

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: "#f6f6f6",
//     },
//     headerContainer: {
//       paddingTop: Platform.OS === 'android' ? 50 : 50,
//       paddingBottom: 20,
//       paddingHorizontal: 20,
//       flexDirection: 'row',
//       alignItems: 'center',
//       width: '100%',
//     },
//     exerciseTitle: {
//       fontSize: 32,
//       fontWeight: '700',
//       textAlign: 'center',
//       flex: 1,
//       flexWrap: 'wrap',
//     },
//     centerContainer: {
//       flex: 1,
//       justifyContent: "center",
//       alignItems: "center",
//     },
//     rowContainer: {
//       flexDirection: "row",
//       alignItems: "center",
//       justifyContent: "center",
//       width: "100%",
//       paddingHorizontal: 20,
//     },
//     sentenceContainer: {
//       borderRadius: 10,
//       padding: 15,
//       marginVertical: 20,
//       alignItems: "center",
//       width: "80%",
//     },
//     sentence: {
//       fontSize: 20,
//       fontWeight: "bold",
//       color: "#fff",
//       textAlign: "center",
//     },
//     subtitle: {
//       fontSize: 18,
//       fontWeight: "400",
//       color: "#fff",
//       textAlign: "center",
//       marginTop: 20,
//     },
//     userSentenceContainer: {
//       borderRadius: 10,
//       padding: 30,
//       marginVertical: 50,
//       alignItems: "center",
//       width: "80%",
//       alignSelf: "center",
//     },
//     micButton: {
//       borderRadius: 50,
//       padding: 10,
//       marginTop: 20,
//     },
//     speakerButton: {
//       borderRadius: 50,
//       padding: 10,
//       marginTop: 20,
//       marginLeft: 10,
//     },
//     quitButton: {
//         flexDirection: "row",
//         alignItems: "center",
//     },
//     stopButton: {
//       backgroundColor: "#e74c3c",
//       borderRadius: 50,
//       padding: 10,
//       marginTop: 20,
//     },
//     stopButtonText: {
//       color: "#FFF",
//       fontSize: 16,
//     },
//     score: {
//       fontSize: 24,
//       fontWeight: "700",
//       marginTop: 20,
//     },
//     buttonContainer: {
//       flexDirection: "row",
//       justifyContent: "center",
//       alignItems: "center",
//       marginTop: 20,
//     },
//   });
  
//   export default React.memo(Exercise2);
