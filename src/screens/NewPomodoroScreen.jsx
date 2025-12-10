import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Pressable,
} from 'react-native';
import { useState, useEffect, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function NewPomodoroScreen() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [timerType, setTimerType] = useState('pomodoro');
  const [defaultPomodoro, setDefaultPomodoro] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const intervalRef = useRef(null);

  const loadSettings = useCallback(async () => {
    try {
      const savedPomodoro = await AsyncStorage.getItem('defaultPomodoro');
      const savedShortBreak = await AsyncStorage.getItem('shortBreak');
      const savedLongBreak = await AsyncStorage.getItem('longBreak');
      const count = await AsyncStorage.getItem('pomodoroCount');

      if (savedPomodoro) {
        const pomVal = parseInt(savedPomodoro, 10);
        setDefaultPomodoro(pomVal);
        if (!isRunning && timerType === 'pomodoro') {
          setTimeLeft(pomVal * 60);
        }
      }
      if (savedShortBreak) {
        const shortVal = parseInt(savedShortBreak, 10);
        setShortBreak(shortVal);
        if (!isRunning && timerType === 'shortBreak') {
          setTimeLeft(shortVal * 60);
        }
      }
      if (savedLongBreak) {
        const longVal = parseInt(savedLongBreak, 10);
        setLongBreak(longVal);
        if (!isRunning && timerType === 'longBreak') {
          setTimeLeft(longVal * 60);
        }
      }
      if (count) {
        setPomodoroCount(parseInt(count, 10));
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  }, [isRunning, timerType]);

  //Load settings on mount
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  //Reload settings when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadSettings();
    }, [loadSettings]),
  );

  useEffect(() => {
    if (isRunning && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;

          if (newTime <= 0) {
            setIsRunning(false);

            if (timerType === 'pomodoro') {
              setPomodoroCount(currentCount => {
                const newCount = currentCount + 1;
                AsyncStorage.setItem('pomodoroCount', newCount.toString()).catch(err => {
                  console.log('Error saving count:', err);
                });
                return newCount;
              });
              setTimeLeft(defaultPomodoro * 60);
            } else if (timerType === 'shortBreak') {
              setTimerType('pomodoro');
              setTimeLeft(defaultPomodoro * 60);
            } else {
              setTimerType('pomodoro');
              setTimeLeft(defaultPomodoro * 60);
            }
            return 0;
          }

          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, isPaused, timerType, defaultPomodoro, timeLeft]);

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = async () => {
    setIsRunning(false);
    setIsPaused(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimerType('pomodoro');
    setTimeLeft(defaultPomodoro * 60);
  };

  const handleBreak = async () => {
    setIsRunning(false);
    setIsPaused(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimeLeft(shortBreak * 60);
    setTimerType('shortBreak');
  };

  const handleLongBreak = () => {
    setIsRunning(false);
    setIsPaused(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimeLeft(longBreak * 60);
    setTimerType('longBreak');
  };

  return (
    <View style={styles.frame}>
      <ImageBackground
        source={require('../../assets/img/bg.png')}
        style={styles.backgroundImage}
        imageStyle={styles.imageStyle}
        resizeMode="cover"
      >
        <View style={styles.content}>
          <Text style={styles.count}>
            Pomodoro count: <Text style={styles.countNum}>{pomodoroCount}</Text>
          </Text>

          <Text style={styles.timerLabel}>
            {timerType === 'pomodoro'
              ? 'Focus Time'
              : timerType === 'shortBreak'
              ? 'Short Break'
              : 'Long Break'}
          </Text>

          <View style={styles.hero}>
            <Image
              source={require('../../assets/img/newpomodoro.png')}
              style={styles.tomato}
            />
          </View>

          <View style={styles.timerBox}>
            <Text style={styles.timerDigits}>{formatTime(timeLeft)}</Text>
          </View>

          <View style={styles.cta}>
            {!isRunning ? (
              <Pressable onPress={handleStart} style={styles.btnStart}>
                <Text style={styles.btnText}>START</Text>
              </Pressable>
            ) : (
              <>
                <Pressable onPress={handleStop} style={styles.btnStop}>
                  <Text style={styles.btnText}>STOP</Text>
                </Pressable>
                <Pressable onPress={handlePause} style={styles.btnPauseResume}>
                  <Text style={styles.btnText}>
                    {isPaused ? 'RESUME' : 'PAUSE'}
                  </Text>
                </Pressable>
                <View style={styles.breakButtonGroup}>
                  <Pressable onPress={handleBreak} style={styles.btnControl}>
                    <Text style={styles.btnText}>SHORT BREAK</Text>
                  </Pressable>
                  <Pressable onPress={handleLongBreak} style={styles.btnControl}>
                    <Text style={styles.btnText}>LONG BREAK</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    backgroundColor: '#FFE1BD',
    padding: 12,
  },
  backgroundImage: {
    flex: 1,
    overflow: 'hidden',
  },
  imageStyle: {
    borderRadius: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  count: {
    fontFamily: 'PixelifySans-Bold',
    fontSize: 22,
    color: '#3E2723',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  countNum: {
    fontWeight: '600',
    fontStyle: 'italic',
    fontSize: 30,
  },
  timerLabel: {
    fontFamily: 'PixelifySans-Bold',
    fontSize: 18,
    color: '#8F2A1E',
    textAlign: 'center',
    marginBottom: 10,
  },
  hero: {
    marginTop: 10,
    marginBottom: 20,
  },
  tomato: {
    width: 210,
    height: 210,
    resizeMode: 'contain',
  },
  timerBox: {
    width: '80%',
    maxWidth: 320,
    height: 100,
    marginVertical: 12,
    backgroundColor: '#fff9f2',
    borderWidth: 4,
    borderColor: '#E7B983',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerDigits: {
    fontFamily: 'PressStart2P-Regular',
    fontSize: 50,
    letterSpacing: 4,
    color: '#3E2723',
    textAlign: 'center',
    includeFontPadding: false,
  },
  cta: {
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  btnStart: {
    width: 240,
    height: 54,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#ED5345',
    backgroundColor: '#FFE4E4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  btnStop: {
    width: 240,
    height: 54,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#ED5345',
    backgroundColor: '#FFE4E4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  btnPauseResume: {
    width: 240,
    height: 54,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#ED5345',
    backgroundColor: '#FFE4E4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  btnGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
    marginBottom: 25,
    width: '100%',
    flexWrap: 'wrap',
  },
  breakButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 25,
    width: '100%',
  },
  btnControl: {
    width: 110,
    height: 54,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#ED5345',
    backgroundColor: '#FFE4E4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  btnText: {
    color: '#8F2A1E',
    fontFamily: 'PixelifySans-Bold',
    fontSize: 20,
    letterSpacing: 1,
    textAlign: 'center',
  },
});