import {
  View,
  Text,
  ImageBackground,
  Image,
  Pressable,
} from 'react-native';
import { useState, useEffect, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import styles from '../styles/NewPomorodoScreen.styles';
import { playAlarm } from '../utils/soundPlayer';
import { notifyTimesUp } from '../utils/notifications';

export default function NewPomodoroScreen() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [timerType, setTimerType] = useState('pomodoro');
  const [defaultPomodoro, setDefaultPomodoro] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [alarmSound, setAlarmSound] = useState('sound1.mp3');
  const intervalRef = useRef(null);


// Daily reset effect
useEffect(() => {
  const resetDailyPomodoro = async () => {
    try {
      const today = new Date().toDateString();
      const lastDate = await AsyncStorage.getItem('lastPomodoroDate');

      if (lastDate !== today) {
        // It's a new day: reset the Pomodoro count
        setPomodoroCount(0);
        await AsyncStorage.setItem('pomodoroCount', '0');
        await AsyncStorage.setItem('lastPomodoroDate', today);
      }
    } catch (error) {
      console.log('Error resetting daily Pomodoro count:', error);
    }
  };

  resetDailyPomodoro();
}, []);


  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const loadSettings = useCallback(async () => {
    try {
      //Get all settings and Pomodoro data from AsyncStorage
      const [savedPomodoro, savedShortBreak, savedLongBreak, savedAlarm, count] =
        await Promise.all([
          AsyncStorage.getItem('defaultPomodoro'),
          AsyncStorage.getItem('shortBreak'),
          AsyncStorage.getItem('longBreak'),
          AsyncStorage.getItem('alarmSound'),
          AsyncStorage.getItem('pomodoroCount'),
        ]);



      if (savedPomodoro) {
        const pomVal = parseInt(savedPomodoro, 10);
        setDefaultPomodoro(pomVal);
        if (!isRunning && timerType === 'pomodoro') setTimeLeft(pomVal * 60);
      }
      if (savedShortBreak) {
        const shortVal = parseInt(savedShortBreak, 10);
        setShortBreak(shortVal);
        if (!isRunning && timerType === 'shortBreak') setTimeLeft(shortVal * 60);
      }
      if (savedLongBreak) {
        const longVal = parseInt(savedLongBreak, 10);
        setLongBreak(longVal);
        if (!isRunning && timerType === 'longBreak') setTimeLeft(longVal * 60);
      }
      if (savedAlarm) setAlarmSound(savedAlarm);
      if (count) setPomodoroCount(parseInt(count, 10));
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  }, [isRunning, timerType]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useFocusEffect(
    useCallback(() => {
      loadSettings();
    }, [loadSettings])
  );


  //Timer Effect
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {

          if (prev <= 0) return 0;

          const newTime = prev - 1;

          if (newTime === 0) {
            // Play alarm and show alert
            playAlarm(alarmSound);
             if (timerType === 'pomodoro') {
                notifyTimesUp('work');
              } else {
                notifyTimesUp('break');
              }

            //Update pomodoro count if needed
            if (timerType === 'pomodoro') {
              //Increment pomodoro count
              setPomodoroCount(current => {
                const newCount = current + 1;
                AsyncStorage.setItem('pomodoroCount', newCount.toString());
                // Automatically start next break
                if (newCount % 4 === 0) {
                  setTimerType('longBreak');
                  setTimeLeft(longBreak * 60);
                } else {
                  setTimerType('shortBreak');
                  setTimeLeft(shortBreak * 60);
                }
                setIsPaused(false); //start break
                return newCount;
              });
            } else {
              //Break ends start new pomodoro
               setTimerType('pomodoro');
                setTimeLeft(defaultPomodoro * 60);
            }
          }
          return newTime;
        });
      }, 1000);
    } else {
      clearTimer();
    }
    return () => clearTimer();
  }, [isRunning, isPaused, timerType, defaultPomodoro, shortBreak, longBreak, alarmSound, pomodoroCount]);

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  //Timer Controls

  //Starts timer
  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  //Pauses timer
  const handlePause = () => setIsPaused(prev => !prev);


  //Stops the timer entirely 
  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    clearTimer();
    setTimerType('pomodoro');
    setTimeLeft(defaultPomodoro * 60);
  };

  //Changes to a short break timer
  const handleBreak = () => {
    setIsRunning(false);
    setIsPaused(false);
    clearTimer();

    if ((pomodoroCount + 1) % 4 === 0) {
    // Long break after every 4th pomodoro
    setTimerType('longBreak');
    setTimeLeft(longBreak * 60);
  } else {
    // Otherwise, short break
    setTimerType('shortBreak');
    setTimeLeft(shortBreak * 60);
  }
  };

  //Skip break handler
  const handleSkipBreak = () => {
    setIsRunning(false);
    setIsPaused(false);
    clearTimer();

    //Increase pomodoro count
     // Increase pomodoro count
  setPomodoroCount(current => {
    const newCount = current + 1;
    AsyncStorage.setItem('pomodoroCount', newCount.toString());
    return newCount;
  });

  // Reset to pomodoro
  setTimerType('pomodoro');
  setTimeLeft(defaultPomodoro * 60);
};

  return (

    <View style={styles.frame}>
      {/*Settings Page styles*/}
      <ImageBackground
        source={require('../../assets/img/bg.png')}
        style={styles.backgroundImage}
        imageStyle={styles.imageStyle}
        resizeMode="cover"
      >
        <View style={styles.content}>
            <View style={styles.container}>
              <Text style={styles.count}>Pomodoro count:</Text>
              <Text style={styles.countNum}>{pomodoroCount}</Text>
            </View>


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

          {/*Controls*/}
          <View style={styles.cta}>
            {!isRunning ? (
              <Pressable onPress={handleStart} style={styles.btnStart}>
                <Text style={styles.btnText}>START</Text>
              </Pressable>
            ) : timerType === 'pomodoro' ? (
              <>
                <Pressable onPress={handleStop} style={styles.btnStop}>
                  <Text style={styles.btnText}>STOP</Text>
                </Pressable>
                <Pressable onPress={handlePause} style={styles.btnPauseResume}>
                  <Text style={styles.btnText}>{isPaused ? 'RESUME' : 'PAUSE'}</Text>
                </Pressable>
                <View style={styles.breakButtonGroup}>
                  <Pressable onPress={handleBreak} style={styles.btnPauseResume}>
                    <Text style={styles.btnText}>BREAK</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                <Pressable onPress={handleSkipBreak} style={styles.btnPauseResume}>
                  <Text style={styles.btnText}>SKIP THE BREAK</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </ImageBackground>
    </View>

  );
}
