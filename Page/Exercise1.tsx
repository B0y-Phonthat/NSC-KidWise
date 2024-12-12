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

// const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
// const soundFiles = {
//     A: require('../assets/sounds/A.mp3'),
//     B: require('../assets/sounds/B.mp3'),
//     C: require('../assets/sounds/C.mp3'),
//     D: require('../assets/sounds/D.mp3'),
//     E: require('../assets/sounds/E.mp3'),
//     F: require('../assets/sounds/F.mp3'),
//     G: require('../assets/sounds/G.mp3'),
//     H: require('../assets/sounds/H.mp3'),
//     I: require('../assets/sounds/I.mp3'),
//     J: require('../assets/sounds/J.mp3'),
//     K: require('../assets/sounds/K.mp3'),
//     L: require('../assets/sounds/L.mp3'),
//     M: require('../assets/sounds/M.mp3'),
//     N: require('../assets/sounds/N.mp3'),
//     O: require('../assets/sounds/O.mp3'),
//     P: require('../assets/sounds/P.mp3'),
//     Q: require('../assets/sounds/Q.mp3'),
//     R: require('../assets/sounds/R.mp3'),
//     S: require('../assets/sounds/S.mp3'),
//     T: require('../assets/sounds/T.mp3'),
//     U: require('../assets/sounds/U.mp3'),
//     V: require('../assets/sounds/V.mp3'),
//     W: require('../assets/sounds/W.mp3'),
//     X: require('../assets/sounds/X.mp3'),
//     Y: require('../assets/sounds/Y.mp3'),
//     Z: require('../assets/sounds/Z.mp3'),
// }

// const Exercise1 = ({ setActiveSection }) => {
//   const [letterIndex, setLetterIndex] = useState(0);
//   const [recording, setRecording] = useState<Audio.Recording | null>(null);
//   const [score, setScore] = useState<number | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const { selectedTheme } = useTheme();
//   const { t } = useTranslation();
//   const [isSoundLoading, setIsSoundLoading] = useState(false);

//   const startRecording = useCallback(async () => {
//       try {
//           const permission = await Audio.requestPermissionsAsync();
//           if (permission.status === 'granted') {
//               await Audio.setAudioModeAsync({
//                   allowsRecordingIOS: true,
//                   playsInSilentModeIOS: true,
//               });
//               const { recording } = await Audio.Recording.createAsync(
//                   Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
//               );
//               setRecording(recording);
//           } else {
//               alert('Permission to access microphone is required!');
//           }
//       } catch (err) {
//           console.error('Failed to start recording', err);
//       }
//   }, []);

//   const stopRecording = useCallback(async () => {
//       try {
//           if (recording) {
//               await recording.stopAndUnloadAsync();
//               const uri = recording.getURI();
//               if (uri) {
//                   processAudio(uri);
//               }
//               setRecording(null);
//           }
//       } catch (err) {
//           console.error('Failed to stop recording', err);
//       }
//   }, [recording]);

//   const processAudio = async (uri: string) => {
//       setLoading(true);
//       const formData = new FormData();
//       formData.append('file', {
//           uri,
//           type: 'audio/webm',
//           name: 'audio.webm',
//       } as any);
//       formData.append('reference', letters[letterIndex]);

//       try {
//           const response = await axios.post('http://192.168.81.208:5000/evaluate_speech', formData, {
//               headers: { 'Content-Type': 'multipart/form-data' },
//           });
//           const newScore = response.data.combined_score;
//           setScore(newScore);
//           await storeScore(newScore);
//       } catch (error) {
//           console.error('Error processing audio', error);
//       } finally {
//           setLoading(false);
//       }
//   };

//   const storeScore = async (newScore: number) => {
//       try {
//           const highestScore = await AsyncStorage.getItem('highestScore');
//           const currentHighestScore = highestScore ? parseFloat(highestScore) : 0;

//           if (newScore > currentHighestScore) {
//               await AsyncStorage.setItem('highestScore', newScore.toString());
//           }

//           await AsyncStorage.setItem('currentScore', newScore.toString());

//           const scores = await AsyncStorage.getItem('dailyScores');
//           const parsedScores = scores ? JSON.parse(scores) : [];
//           const today = new Date().toISOString().split('T')[0];
//           parsedScores.push({ day: today, score: newScore });

//           await AsyncStorage.setItem('dailyScores', JSON.stringify(parsedScores));
//       } catch (error) {
//           console.error('Error storing score', error);
//       }
//   };

//   const playSentence = useCallback(async (sentence: string) => {
//       setIsSoundLoading(true);
//       try {
//           const { sound } = await Audio.Sound.createAsync(
//               soundFiles[sentence],
//               { shouldPlay: true }
//           );
//           await sound.playAsync();
//       } catch (error) {
//           Alert.alert('Error', 'Error playing sound');
//           console.error('Error playing sound', error);
//       } finally {
//           setIsSoundLoading(false);
//       }
//   }, []);

//   const renderBackButton = useMemo(() => (
//       <TouchableOpacity style={styles.backButton} onPress={() => setLetterIndex(prev => prev - 1)}>
//           <Icon name="arrow-back" size={24} color={selectedTheme.colors[0]} />
//           <Text style={[styles.backButtonText, { color: selectedTheme.colors[0] }]}>{t('Back')}</Text>
//       </TouchableOpacity>
//   ), [selectedTheme.colors, t]);

//   const renderForwardButton = useMemo(() => (
//       <TouchableOpacity style={styles.forwardButton} onPress={() => setLetterIndex(prev => prev + 1)}>
//           <Text style={[styles.forwardButtonText, { color: selectedTheme.colors[0] }]}>{t('Next')}</Text>
//           <Icon name="arrow-forward" size={24} color={selectedTheme.colors[0]} />
//       </TouchableOpacity>
//   ), [selectedTheme.colors, t]);

//   const renderQuitButton = useMemo(() => (
//       <TouchableOpacity style={styles.quitButton} onPress={() => setActiveSection("Tasks")}>
//           <Icon name="exit-outline" size={24} color={selectedTheme.colors[0]} />
//       </TouchableOpacity>
//   ), [selectedTheme.colors]);

//   return (
//       <View style={styles.container}>
//           <View style={styles.headerContainer}>
//               {renderQuitButton}
//               <Text style={[styles.exerciseTitle, { color: selectedTheme.colors[0] }]}>{t('EXERCISE_1_TITLE')}</Text>
//           </View>
//           <View style={styles.centerContainer}>
//               <View style={styles.rowContainer}>
//                   {letterIndex > 0 && renderBackButton}
//                   <View style={[styles.sentenceContainer, { backgroundColor: selectedTheme.colors[0] }]}>
//                       <Text style={styles.sentence}>{letters[letterIndex]}</Text>
//                   </View>
//                   {letterIndex < letters.length - 1 && renderForwardButton}
//               </View>
//               <View style={[styles.userSentenceContainer, { backgroundColor: selectedTheme.colors[1] }]}>
//                   <Text style={[styles.sentence, { color: "#FFFF" }]}>{t('USER_SENTENCE_PLACEHOLDER')}</Text>
//               </View>
//               <View style={styles.buttonContainer}>
//                   <TouchableOpacity onPress={startRecording} style={[styles.micButton, { backgroundColor: selectedTheme.colors[0] }]}>
//                       <Icon name="mic" size={24} color="#FFF" />
//                   </TouchableOpacity>
//                   <TouchableOpacity onPress={() => playSentence(letters[letterIndex])} style={[styles.speakerButton, { backgroundColor: selectedTheme.colors[0] }]}>
//                       <FontAwesome name="volume-up" size={24} color="#FFF" />
//                   </TouchableOpacity>
//               </View>
//               {recording && (
//                   <TouchableOpacity onPress={stopRecording} style={styles.stopButton}>
//                       <Text style={styles.stopButtonText}>{t('STOP')}</Text>
//                   </TouchableOpacity>
//               )}
//               {loading && (
//                   <Spinner visible={loading} textContent={"Processing..."} textStyle={{ color: "#FFF" }} />
//               )}
//               {score !== null && <Text style={[styles.score, { color: selectedTheme.colors[0] }]}>Score: {score}%</Text>}
//           </View>
//       </View>
//   );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#f6f6f6",
//     },
//     headerContainer: {
//         paddingTop: Platform.OS === 'android' ? 50 : 50,
//         paddingBottom: 20,
//         paddingHorizontal: 20,
//         flexDirection: 'row',
//         alignItems: 'center',
//         width: '100%',
//     },
//     backButton: {
//         flexDirection: "row",
//         alignItems: "center",
//     },
//     rowContainer: {
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "center",
//         width: "100%",
//         paddingHorizontal: 20,
//     },
//     exerciseTitle: {
//         fontSize: 32,
//         fontWeight: '700',
//         textAlign: 'center',
//         flex: 1,
//         flexWrap: 'wrap',
//     },
//     exerciseDescription: {
//         fontSize: 18,
//         textAlign: "center",
//     },
//     backButtonText: {
//         fontSize: 16,
//         marginLeft: 10,
//     }, buttonContainer: {
//         flexDirection: "row",
//         justifyContent: "center",
//         alignItems: "center",
//         marginTop: 20,
//     },
//     centerContainer: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     quitButton: {
//         flexDirection: "row",
//         alignItems: "center",
//     },
//     forwardButton: {
//         flexDirection: "row",
//         alignItems: "center",
//     },
//     forwardButtonText: {
//         fontSize: 16,
//         marginRight: 10,
//     },

//     sentenceContainer: {
//         borderRadius: 10,
//         padding: 15,
//         marginVertical: 20,
//         alignItems: "center",
//         width: "80%",
//     },
//     sentence: {
//         fontSize: 20,
//         fontWeight: "bold",
//         color: "#fff",
//         textAlign: "center",
//     },

//     userSentenceContainer: {
//         borderRadius: 10,
//         padding: 30,
//         marginVertical: 50,
//         alignItems: "center",
//         width: "80%",
//         alignSelf: "center",
//     },
//     micButton: {
//         borderRadius: 50,
//         padding: 10,
//         marginTop: 20,
//     },
//     speakerButton: {
//         borderRadius: 50,
//         padding: 10,
//         marginTop: 20,
//         marginLeft: 10,
//     },
//     stopButton: {
//         backgroundColor: "#e74c3c",
//         borderRadius: 50,
//         padding: 10,
//         marginTop: 20,
//     },
//     stopButtonText: {
//         color: "#FFF",
//         fontSize: 16,
//     },
//     score: {
//         fontSize: 24,
//         fontWeight: "700",
//         marginTop: 20,
//     },
// });

// export default React.memo(Exercise1);
