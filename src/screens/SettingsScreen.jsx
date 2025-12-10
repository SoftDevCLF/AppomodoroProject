import {
  View,
  Text,
  TextInput,
  Pressable,
  Switch,
  ScrollView,
  Image,
  Modal,
  Linking,
} from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/SettingsScreen.styles';

export default function SettingsScreen() {
  const [defaultPomodoro, setDefaultPomodoro] = useState('25');
  const [shortBreak, setShortBreak] = useState('5');
  const [longBreak, setLongBreak] = useState('15');
  const [alarmSound, setAlarmSound] = useState('sound1.mp3');
  const [notifications, setNotifications] = useState(true);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showResourcesModal, setShowResourcesModal] = useState(false);
  const [pomodoroError, setPomodoroError] = useState('');
  const [shortBreakError, setShortBreakError] = useState('');
  const [longBreakError, setLongBreakError] = useState('');


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
      setPomodoroError('');
    } else {
      setPomodoroError('Please stay within 25-50 minutes');
    }
  };

  const handleSetShortBreak = async () => {
    const value = parseInt(shortBreak, 10);
    if (value >= 5 && value <= 10) {
      await AsyncStorage.setItem('shortBreak', shortBreak);
      setShortBreakError('');
    } else {
      setShortBreakError('Please stay within 5-10 minutes');
    }
  };

  const handleSetLongBreak = async () => {
    const value = parseInt(longBreak, 10);
    if (value >= 15 && value <= 20) {
      await AsyncStorage.setItem('longBreak', longBreak);
      setLongBreakError('');
    } else {
      setLongBreakError('Please stay within 15-20 minutes');
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
      id: 6,
      question: 'How do I track my productivity stats?',
      answer:
        'Visit the Stats screen to view your completed pomodoros, break times, and productivity trends.',
    },
    {
      id: 7,
      question: 'How do I track my productivity stats?',
      answer:
        'Visit the Stats screen to view your completed pomodoros, break times, and productivity trends.',
    },
    {
      id: 8,
      question: 'How do I track my productivity stats?',
      answer:
        'Visit the Stats screen to view your completed pomodoros, break times, and productivity trends.',
    },
    {
      id: 9,
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
            source={require('../../assets/img/settingstomato.png')}
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
          {pomodoroError ? (
            <Text style={styles.errorText}>{pomodoroError}</Text>
          ) : null}

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
          {shortBreakError ? (
            <Text style={styles.errorText}>{shortBreakError}</Text>
          ) : null}

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
          {longBreakError ? (
            <Text style={styles.errorText}>{longBreakError}</Text>
          ) : null}

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
          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.helpButton}
              onPress={() => setShowHelpModal(true)}
            >
              <Text style={styles.helpButtonText}>Help & Support</Text>
            </Pressable>
            <Pressable
              style={styles.resourceButton}
              onPress={() => setShowResourcesModal(true)}
            >
              <Text style={styles.helpButtonText}>Resources</Text>
            </Pressable>
          </View>
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

            <ScrollView style={styles.faqList}>
              {faqs.map(faq => (
                <View key={faq.id} style={styles.faqItem}>
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                </View>
              ))}
            </ScrollView>

          </View>
        </View>
      </Modal>

      <Modal
        visible={showResourcesModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowResourcesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Resources</Text>
              <Pressable
                onPress={() => setShowResourcesModal(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>

            <ScrollView style={styles.faqList}>
              <View style={styles.faqItem}>
                <Text style={styles.faqQuestion}>Pomodoro Technique Guide</Text>
                <Pressable
                  onPress={() =>
                    Linking.openURL(
                      'https://en.wikipedia.org/wiki/Pomodoro_Technique',
                    )
                  }
                >
                  <Text style={styles.resourceLinkText}>
                    Learn More →
                  </Text>
                </Pressable>
              </View>
              <View style={styles.faqItem}>
                <Text style={styles.faqQuestion}>
                  Time Management Tips
                </Text>
                <Pressable
                  onPress={() =>
                    Linking.openURL(
                      'https://summer.harvard.edu/blog/8-time-management-tips-for-students/',
                    )
                  }
                >
                  <Text style={styles.resourceLinkText}>
                    Explore →
                  </Text>
                </Pressable>
              </View>
              <View style={styles.faqItem}>
                <Text style={styles.faqQuestion}>Productivity Guide</Text>
                <Pressable
                  onPress={() =>
                    Linking.openURL(
                      'https://www.youtube.com/watch?v=lbtte7iTS9g',
                    )
                  }
                >
                  <Text style={styles.resourceLinkText}>
                    Check it out →
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

