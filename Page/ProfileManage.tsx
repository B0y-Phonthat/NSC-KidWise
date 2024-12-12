import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, TextInput, Modal, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome, Feather } from '@expo/vector-icons'; // Import icon libraries
import { useTheme } from '../Page/ThemeContext'; // Import the ThemeContext
import { useTranslation } from 'react-i18next'; // Import translation hook

type Profile = {
  id: string;
  name: string;
  avatar: string | null;
};

const ProfileManage: React.FC = () => {
  const { selectedTheme } = useTheme(); // Use the selected theme
  const { t } = useTranslation(); // Use translation hook
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [newProfileName, setNewProfileName] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const navigation = useNavigation();

  const handleAddProfile = () => {
    setCurrentProfile(null);
    setNewProfileName('');
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    if (currentProfile) {
      setProfiles((prevProfiles) =>
        prevProfiles.map((profile) =>
          profile.id === currentProfile.id ? { ...profile, name: newProfileName, avatar: currentProfile.avatar } : profile
        )
      );
    } else {
      const newProfile: Profile = {
        id: String(profiles.length + 1),
        name: newProfileName,
        avatar: null,
      };
      setProfiles((prevProfiles) => [...prevProfiles, newProfile]);
    }
    setIsEditing(false);
  };

  const handleDeleteProfile = (id: string) => {
    setProfiles((prevProfiles) => prevProfiles.filter((profile) => profile.id !== id));
  };

  const handleEditProfile = (profile: Profile) => {
    setCurrentProfile(profile);
    setNewProfileName(profile.name);
    setIsEditing(true);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setCurrentProfile((prevProfile) => prevProfile && { ...prevProfile, avatar: result.assets[0].uri });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.header, { color: selectedTheme.colors[0] }]}>{t('Manage Profiles')}</Text>
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.profileItem, { backgroundColor: selectedTheme.colors[1] }]}>
            <TouchableOpacity onPress={() => navigation.navigate('ProfileDashboard', { profileName: item.name, profileAvatar: item.avatar })}>
              <View style={styles.profileInfo}>
                <Image source={item.avatar ? { uri: item.avatar } : require('../assets/images/Profile_logo.png')} style={styles.avatar} />
                <Text style={[styles.profileText, { color: selectedTheme.colors[3] }]}>{item.name}</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => handleEditProfile(item)} style={[styles.iconButton, { backgroundColor: selectedTheme.colors[2] }]}>
                <Feather name="edit" size={24} color={selectedTheme.colors[0]} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteProfile(item.id)} style={[styles.iconButton, { backgroundColor: selectedTheme.colors[3] }]}>
                <FontAwesome name="trash" size={24} color={selectedTheme.colors[0]} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.flatListContainer}
      />
      <TouchableOpacity onPress={handleAddProfile} style={[styles.addButton, { backgroundColor: selectedTheme.colors[2] }]}>
        <Text style={[styles.addButtonText, { color: selectedTheme.colors[0] }]}>+</Text>
      </TouchableOpacity>
      {isEditing && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isEditing}
          onRequestClose={() => {
            setIsEditing(!isEditing);
          }}
        >
          <View style={styles.modalView}>
            <TextInput
              placeholder={t('Enter profile name')}
              value={newProfileName}
              onChangeText={setNewProfileName}
              style={[styles.input, { borderColor: selectedTheme.colors[3] }]}
            />
            <TouchableOpacity onPress={pickImage}>
              <Image source={currentProfile?.avatar ? { uri: currentProfile.avatar } : require('../assets/images/Profile_logo.png')} style={styles.avatarModal} />
              <Text style={[styles.changeAvatarText, { color: selectedTheme.colors[2] }]}>{t('Change Avatar')}</Text>
            </TouchableOpacity>
            <Button title={t('Save')} onPress={handleSaveProfile} />
            <Button title={t('Cancel')} onPress={() => setIsEditing(false)} />
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Set background to white
  },
  flatListContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: '700',
    marginVertical: 50,
    textAlign: 'center',
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 15,
    marginVertical: 10,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileText: {
    fontSize: 18,
    marginLeft: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#ccc',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    borderRadius: 15,
    padding: 10,
    marginHorizontal: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center', // Centered horizontally
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 32,
    fontWeight: '700',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  avatarModal: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#ccc',
    marginBottom: 10,
  },
  changeAvatarText: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    width: 200,
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});

export default ProfileManage;
