import { View, Text, ImageBackground, Image, Pressable } from 'react-native';
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
  const [sessionStartSeconds, setSessionStartSeconds] = useState(0);
  const [defaultPomodoro, setDefaultPomodoro] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [alarmSound, setAlarmSound] = useState('sound1.mp3');
  const intervalRef = useRef(null);

  const savePomodoroRecord = async (timerType, duration, breakType) => {
    try {
      const record = {
        emoji:
          timerType === 'pomodoro'
            ? '🍅'
            : breakType === 'longBreak'
            ? '😴'
            : '💤',

        title:
          timerType === 'pomodoro'
            ? 'Focus Session'
            : breakType === 'longBreak'
            ? 'Long Break'
            : 'Short Break',

        type: timerType,
        breakType,

        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),

        minutes: duration,
      };

      const existing = await AsyncStorage.getItem('recentPomodoros');
      const parsed = existing ? JSON.parse(existing) : [];

      const updated = [record, ...parsed].slice(0, 20);

      await AsyncStorage.setItem('recentPomodoros', JSON.stringify(updated));

      console.log('Saved recent record:', record);
    } catch (err) {
      console.log('Error saving pomodoro record:', err);
    }
  };

  const updateWeeklyStats = async (type, minutes) => {
    try {
      const today = new Date();
      const dayIndex = today.getDay();

      const existing = await AsyncStorage.getItem('weeklyStats');
      const stats = existing
        ? JSON.parse(existing)
        : {
            focused: 0,
            breaks: 0,
            streak: 0,
            daily: [0, 0, 0, 0, 0, 0, 0],
            lastActive: null,
          };

      if (type === 'pomodoro') {
        stats.focused += minutes;
        stats.daily[dayIndex] += 1;
      } else {
        stats.breaks += minutes;
      }

      const todayStr = today.toDateString();

      if (!stats.lastActive) {
        stats.streak = 1;
      } else {
        const diffDays =
          (new Date(todayStr) - new Date(stats.lastActive)) /
          (1000 * 60 * 60 * 24);

        if (diffDays === 1) stats.streak += 1;
        else if (diffDays > 1) stats.streak = 1;
      }

      stats.lastActive = todayStr;

      await AsyncStorage.setItem('weeklyStats', JSON.stringify(stats));
    } catch (err) {
      console.log('Error updating weekly stats:', err);
    }
  };

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const loadSettings = useCallback(async () => {
    try {
      const today = new Date().toDateString();
      const lastDate = await AsyncStorage.getItem('lastPomodoroDate');

      let shouldReset = lastDate !== today;

      if (shouldReset) {
        await AsyncStorage.setItem('pomodoroCount', '0');
        await AsyncStorage.setItem('lastPomodoroDate', today);
        setPomodoroCount(0);
      }

      const [
        savedPomodoro,
        savedShortBreak,
        savedLongBreak,
        savedAlarm,
        count,
      ] = await Promise.all([
        AsyncStorage.getItem('defaultPomodoro'),
        AsyncStorage.getItem('shortBreak'),
        AsyncStorage.getItem('longBreak'),
        AsyncStorage.getItem('alarmSound'),
        AsyncStorage.getItem('pomodoroCount'),
      ]);

      if (savedPomodoro) setDefaultPomodoro(parseInt(savedPomodoro, 10));
      if (savedShortBreak) setShortBreak(parseInt(savedShortBreak, 10));
      if (savedLongBreak) setLongBreak(parseInt(savedLongBreak, 10));
      if (savedAlarm) setAlarmSound(savedAlarm);

      // Only apply stored count if we DIDN’T reset today
      if (!shouldReset && count) {
        setPomodoroCount(parseInt(count, 10));
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useFocusEffect(
    useCallback(() => {
      loadSettings();
    }, [loadSettings]),
  );

  //Timer Effect
  useEffect(() => {
    if (!isRunning || isPaused) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);

          try {
            playAlarm(alarmSound);
          } catch (e) {
            console.log('Alarm failed safely');
          }

          if (timerType === 'pomodoro') {
            notifyTimesUp('work');

            const minutes = Math.max(1, Math.round(sessionStartSeconds / 60));

            savePomodoroRecord('pomodoro', minutes);
            updateWeeklyStats('pomodoro', minutes);

            setPomodoroCount(count => {
              const newCount = count + 1;
              AsyncStorage.setItem('pomodoroCount', newCount.toString());

              if (newCount % 4 === 0) {
                setTimerType('longBreak');
                setTimeLeft(longBreak * 60);
              } else {
                setTimerType('shortBreak');
                setTimeLeft(shortBreak * 60);
              }

              return newCount;
            });
          } else {
            notifyTimesUp('break');

            const minutes = timerType === 'longBreak' ? longBreak : shortBreak;

            savePomodoroRecord('break', minutes, timerType);
            updateWeeklyStats('break', minutes);

            setTimerType('pomodoro');
            setTimeLeft(defaultPomodoro * 60);
          }

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [
    isRunning,
    isPaused,
    timerType,
    defaultPomodoro,
    shortBreak,
    longBreak,
    alarmSound,
  ]);

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  //Timer Controls

  //Starts timer
  const handleStart = () => {
    setSessionStartSeconds(timeLeft);
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
                {/* <Pressable onPress={handleStop} style={styles.btnStop}>
                  <Text style={styles.btnText}>STOP</Text>
                </Pressable> */}
                <Pressable onPress={handlePause} style={styles.btnPauseResume}>
                  <Text style={styles.btnText}>
                    {isPaused ? 'RESUME' : 'PAUSE'}
                  </Text>
                </Pressable>
                <View style={styles.breakButtonGroup}>
                  <Pressable
                    onPress={handleBreak}
                    style={styles.btnPauseResume}
                  >
                    <Text style={styles.btnText}>BREAK</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                <Pressable
                  onPress={handleSkipBreak}
                  style={styles.btnPauseResume}
                >
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
