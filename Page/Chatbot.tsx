import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  ImageBackground,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../Page/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useBackground } from './BackgroundContext';

const Chatbot: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [messages, setMessages] = useState<Array<{ sender: string; content: string }>>([]);
  const { selectedTheme } = useTheme();
  const { t } = useTranslation();
  const { backgroundImage } = useBackground(); // Use background context

  const sendMessage = async (message: string): Promise<string> => {
    try {
      const res = await axios.post("http://192.168.199.171:5005/webhooks/rest/webhook", { sender: "user", message });
      return res.data?.[0]?.text ?? "Error: No response from server";
    } catch (error) {
      console.error(error);
      return "Error: Could not send message";
    }
  };

  const handleSubmit = async () => {
    if (inputValue.trim() === "") return;

    const userMessage = { sender: "user", content: inputValue };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await sendMessage(inputValue);
      const botMessage = { sender: "bot", content: response };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setInputValue("");
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: selectedTheme.colors[0] }]}>{t('CHATBOT')}</Text>
        </View>
        <ScrollView style={styles.chatContainer} contentContainerStyle={styles.chatContentContainer}>
          {messages.map((message, index) => (
            <View
              key={index}
              style={[
                styles.chatMessage,
                message.sender === "user"
                  ? styles.userMessageContainer
                  : styles.botMessageContainer,
              ]}
            >
              <Text style={[styles.messageText, { color: selectedTheme.colors[0] }]}>
                {message.content}
              </Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputContainerWrapper}>
          <LinearGradient
            colors={['#e3d5ff', '#ffe7e7']}
            start={[0, 0]}
            end={[0, 1]}
            style={styles.gradientBorder}
          >
            <View style={styles.inputContainer}>
              <TextInput
                placeholder={t('type_your_message')}
                placeholderTextColor={selectedTheme.colors[0]}
                value={inputValue}
                onChangeText={setInputValue}
                style={[styles.input, { color: selectedTheme.colors[0] }]}
              />
              <TouchableOpacity
                style={[styles.sendButton, { backgroundColor: selectedTheme.colors[0] }]}
                onPress={handleSubmit}
              >
                <FontAwesome name="send-o" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    padding: Platform.OS === "web" ? 50 : 50,
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  chatContentContainer: {
    padding: 10,
  },
  chatMessage: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    maxWidth: "80%",
    borderRadius: 20,
    padding: 10,
    flexWrap: "wrap",
  },
  userMessageContainer: {
    alignSelf: "flex-end",
    backgroundColor: "white",  // Changed to grey
    flexDirection: "row-reverse",
  },
  botMessageContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#D3D3D3",
    flexDirection: "row",
  },
  messageText: {
    fontSize: 14,
    flexShrink: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  inputContainerWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 25,
  },
  gradientBorder: {
    borderRadius: 20,
    padding: 2,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    borderRadius: 50,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});

export default Chatbot;
