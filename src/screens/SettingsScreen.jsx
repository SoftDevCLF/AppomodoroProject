import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Switch,
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const [defaultPomodoro, setDefaultPomodoro] = useState('25');
  const [shortBreak, setShortBreak] = useState('5');
  const [longBreak, setLongBreak] = useState('15');
  const [alarmSound, setAlarmSound] = useState('sound1.mp3');
  const [notifications, setNotifications] = useState(true);
  const [showHelpModal, setShowHelpModal] = useState(false);


  useEffect(() => {
    const loadSettings = async () => {
      try {
        const pomodoro = await AsyncStorage.getItem('defaultPomodoro');
        const sBreak = await AsyncStorage.getItem('shortBreak');
        const lBreak = await AsyncStorage.getItem('longBreak');
        const sound = await AsyncStorage.getItem('alarmSound');
        const notif = await AsyncStorage.getItem('notifications');
        if (pomodoro) setDefaultPomodoro(pomodoro);
        if (sBreak) setShortBreak(sBreak);
        if (lBreak) setLongBreak(lBreak);
        if (sound) setAlarmSound(sound);
        if (notif !== null) setNotifications(notif === 'true');
      } catch (error) {
        console.log('Error loading settings:', error);
      }
    };
    loadSettings();
  }, []);

  const handleSetPomodoro = async () => {
    const value = parseInt(defaultPomodoro, 10);
    if (value >= 25 && value <= 50) {
      await AsyncStorage.setItem('defaultPomodoro', defaultPomodoro);
    }
  };

  const handleSetShortBreak = async () => {
    const value = parseInt(shortBreak, 10);
    if (value >= 5 && value <= 10) {
      await AsyncStorage.setItem('shortBreak', shortBreak);
    }
  };

  const handleSetLongBreak = async () => {
    const value = parseInt(longBreak, 10);
    if (value >= 15 && value <= 20) {
      await AsyncStorage.setItem('longBreak', longBreak);
    }
  };

  const handleAlarmSoundChange = async value => {
    setAlarmSound(value);
    await AsyncStorage.setItem('alarmSound', value);
  };

  const handleNotificationsChange = async value => {
    setNotifications(value);
    await AsyncStorage.setItem('notifications', value.toString());
  };

  const faqs = [
    {
      id: 1,
      question: 'What is the Pomodoro Technique?',
      answer:
        'The Pomodoro Technique is a time management method using twenty-five minute focused work intervals "pomodoros" followed by short breaks.',
    },
    {
      id: 2,
      question: 'How do I change the timer duration?',
      answer:
        'On the settings page adjust the Default Pomodoro, Short Break, or Long Break duration using the input fields.',
    },
    {
      id: 3,
      question: 'Can I customize alarm sounds?',
      answer:
        'Yes! In Settings, select from the available alarm sounds: Classic, Chimes, or Waves.',
    },
    {
      id: 4,
      question: 'What If I miss a notification?',
      answer:
        'Make sure to enable notifications in Settings to ensure you never miss a timer alert.',
    },
    {
      id: 5,
      question: 'How do I track my productivity stats?',
      answer:
        'Visit the Stats screen to view your completed pomodoros, break times, and productivity trends.',
    },
    {
      id: 5,
      question: 'How do I track my productivity stats?',
      answer:
        'Visit the Stats screen to view your completed pomodoros, break times, and productivity trends.',
    },
    {
      id: 5,
      question: 'How do I track my productivity stats?',
      answer:
        'Visit the Stats screen to view your completed pomodoros, break times, and productivity trends.',
    },
    {
      id: 5,
      question: 'How do I track my productivity stats?',
      answer:
        'Visit the Stats screen to view your completed pomodoros, break times, and productivity trends.',
    },
    {
      id: 6,
      question: 'What is the tasks section for?',
      answer:
        'The tasks section is where you can manage custom tasks and it functions like a simple to-do list.',
    }

  ];

  return (
    <View style={styles.frame}>
      <ScrollView contentContainerStyle={styles.scrollViewStyle}>
        <View style={styles.title}>
          <Image
            source={require('../../assets/img/logo1.png')}
            style={styles.logoStyle}
          />
          <Text style={styles.titleText}>Settings</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.label}>Set Default Pomodoro</Text>
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              value={defaultPomodoro}
              onChangeText={setDefaultPomodoro}
              placeholder="25-50 minutes"
              keyboardType="numeric"
              placeholderTextColor="#5e5c5c"
            />
            <Pressable onPress={handleSetPomodoro} style={styles.setButton}>
              <Text style={styles.setButtonText}>Set</Text>
            </Pressable>
          </View>

          <Text style={styles.label}>Set Short Break</Text>
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              value={shortBreak}
              onChangeText={setShortBreak}
              placeholder="5-10 minutes"
              keyboardType="numeric"
              placeholderTextColor="#5e5c5c"
            />
            <Pressable onPress={handleSetShortBreak} style={styles.setButton}>
              <Text style={styles.setButtonText}>Set</Text>
            </Pressable>
          </View>

          <Text style={styles.label}>Set Long Break</Text>
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              value={longBreak}
              onChangeText={setLongBreak}
              placeholder="15-20 minutes"
              keyboardType="numeric"
              placeholderTextColor="#5e5c5c"
            />
            <Pressable onPress={handleSetLongBreak} style={styles.setButton}>
              <Text style={styles.setButtonText}>Set</Text>
            </Pressable>
          </View>

          <Text style={styles.label}>Select Alarm Sound</Text>
          <View style={styles.selectContainer}>
            <Pressable
              style={[
                styles.selectOption,
                alarmSound === 'sound1.mp3' && styles.selectOptionActive,
              ]}
              onPress={() => handleAlarmSoundChange('sound1.mp3')}
            >
              <Text style={styles.selectOptionText}>Classic</Text>
            </Pressable>
            <Pressable
              style={[
                styles.selectOption,
                alarmSound === 'sound2.mp3' && styles.selectOptionActive,
              ]}
              onPress={() => handleAlarmSoundChange('sound2.mp3')}
            >
              <Text style={styles.selectOptionText}>Chimes</Text>
            </Pressable>
            <Pressable
              style={[
                styles.selectOption,
                alarmSound === 'sound3.mp3' && styles.selectOptionActive,
              ]}
              onPress={() => handleAlarmSoundChange('sound3.mp3')}
            >
              <Text style={styles.selectOptionText}>Waves</Text>
            </Pressable>
          </View>

          <View style={styles.switchContainer}>
            <Switch
              value={notifications}
              onValueChange={handleNotificationsChange}
              trackColor={{ false: '#767577', true: '#f87963' }}
              thumbColor={notifications ? '#f44527' : '#f4f3f4'}
            />
            <Text style={styles.switchLabel}>Notifications</Text>
          </View>
          <Pressable
            style={styles.helpButton}
            onPress={() => setShowHelpModal(true)}
          >
            <Text style={styles.helpButtonText}>Help & Support</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal
        visible={showHelpModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowHelpModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Help & Support</Text>
              <Pressable
                onPress={() => setShowHelpModal(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    backgroundColor: '#FFE1BD',
    padding: 12,
  },
  scrollViewStyle: {
    flexGrow: 1,
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff6e7',
    padding: 10,
    borderRadius: 12,
    marginBottom: 14,
  },
  logoStyle: {
    width: 50,
    height: 50,
  },
  titleText: {
    fontSize: 30,
    color: '#000000',
    fontFamily: 'PixelifySans-Bold',
  },
  content: {
    backgroundColor: '#fff6e7',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  label: {
    fontSize: 18,
    fontFamily: 'PixelifySans-Bold',
    color: '#3E2723',
    marginBottom: 8,
  },
  inputGroup: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 2,
    borderColor: '#f4b871',
    borderRadius: 12,
    padding: 12,
    fontFamily: 'PressStart2P-Regular',
    fontSize: 14,
    backgroundColor: '#fff',
  },
  setButton: {
    backgroundColor: '#ffdede',
    color: '#861d0a',
    borderRadius: 5,
    borderWidth: 3,
    borderColor: '#f44527',
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'center',
    height: 50,
  },
  setButtonText: {
    color: '#861d0a',
    fontFamily: 'PixelifySans-Bold',
    fontSize: 18,
  },
  selectContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  selectOption: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#f4b871',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  selectOptionActive: {
    backgroundColor: '#ffdede',
    borderColor: '#f44527',
  },
  selectOptionText: {
    fontFamily: 'PressStart2P-Regular',
    fontSize: 10,
    color: '#3E2723',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  switchLabel: {
    fontSize: 18,
    fontFamily: 'PixelifySans-Bold',
    color: '#3E2723',
  },
  helpButton: {
    backgroundColor: '#ffdede',
    color: '#861d0a',
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#f44527',
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  helpButtonText: {
    color: '#861d0a',
    fontFamily: 'PixelifySans-Bold',
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff6e7',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#f4b871',
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'PixelifySans-Bold',
    color: '#3E2723',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffdede',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#f44527',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#861d0a',
    fontFamily: 'PixelifySans-Bold',
  },
  searchBar: {
    margin: 15,
    padding: 12,
    borderWidth: 2,
    borderColor: '#f4b871',
    borderRadius: 10,
    backgroundColor: '#fff',
    fontFamily: 'PressStart2P-Regular',
    fontSize: 12,
    color: '#3E2723',
  },
  faqList: {
    paddingHorizontal: 15,
    maxHeight: 300,
  },
  faqItem: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#f4b871',
  },
  faqQuestion: {
    fontSize: 18,
    fontFamily: 'PixelifySans-Bold',
    color: '#3E2723',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    fontFamily: 'PixelifySans-Bold',
    color: '#5e5c5c',
    lineHeight: 18,
  },
  noResultsText: {
    fontSize: 14,
    fontFamily: 'PixelifySans-Bold',
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  contactSection: {
    paddingHorizontal: 15,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: '#f4b871',
  },
  contactTitle: {
    fontSize: 16,
    fontFamily: 'PixelifySans-Bold',
    color: '#3E2723',
    marginBottom: 10,
  },
  contactButton: {
    backgroundColor: '#ffdede',
    borderWidth: 3,
    borderColor: '#f44527',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#861d0a',
    fontFamily: 'PixelifySans-Bold',
    fontSize: 14,
  },
});