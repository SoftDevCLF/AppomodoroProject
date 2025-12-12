import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Pressable,
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NewPomodoroScreen() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [timerType, setTimerType] = useState('pomodoro');
  const intervalRef = useRef(null);

  
  const savePomodoroRecord = async (timerType, duration) => {
    try {
      const record = {
        emoji: timerType === 'pomodoro' ? '🍅' : '💤',
        title: timerType === 'pomodoro' ? 'Focus Session' : 'Break',
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        minutes: duration,
      };

      const existing = await AsyncStorage.getItem('recentPomodoros');
      const parsed = existing ? JSON.parse(existing) : [];

      const updated = [record, ...parsed].slice(0, 20);

      await AsyncStorage.setItem(
        'recentPomodoros',
        JSON.stringify(updated)
      );

      console.log('Saved recent record:', record);
    } catch (err) {
      console.log('Error saving pomodoro record:', err);
    }
  };


const updateWeeklyStats = async (type) => {
  try {
    const today = new Date();
    const dayIndex = today.getDay();

    const existing = await AsyncStorage.getItem('weeklyStats');
    const stats = existing
      ? JSON.parse(existing)
      : { focused: 0, breaks: 0, streak: 0, daily: [0,0,0,0,0,0,0], lastActive: null };


    if (type === 'pomodoro') {
      stats.daily[dayIndex] += 1;    
      stats.focused += 25;           
    } else {
      stats.breaks += 1;
    }


    const todayStr = today.toDateString();

    if (!stats.lastActive) {
      stats.streak = 1;
    } else {
      const lastDate = new Date(stats.lastActive);
      const diffDays = Math.floor(
        (today - lastDate) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        stats.streak += 1;
      } else if (diffDays > 1) {
        stats.streak = 1;
      }
    } 

    stats.lastActive = todayStr;

    await AsyncStorage.setItem('weeklyStats', JSON.stringify(stats));
  } catch (err) {
    console.log('Error updating weekly stats:', err);
  }
};


  useEffect(() => {
    const loadSettings = async () => {
      try {
        const defaultPomodoro = await AsyncStorage.getItem('defaultPomodoro');
        const count = await AsyncStorage.getItem('pomodoroCount');
        if (defaultPomodoro) {
          setTimeLeft(parseInt(defaultPomodoro) * 60);
        }
        if (count) {
          setPomodoroCount(parseInt(count));
        }
      } catch (error) {
        console.log('Error loading settings:', error);
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    if (isRunning && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;

          if (newTime <= 0) {
            setIsRunning(false);

            const handleSessionComplete = async () => {

              const duration =
                timerType === 'pomodoro'
                  ? parseInt((await AsyncStorage.getItem('defaultPomodoro')) || 25)
                  : parseInt((await AsyncStorage.getItem('shortBreak')) || 5);

              await savePomodoroRecord(timerType, duration);

              await updateWeeklyStats(timerType, duration);

            if (timerType === 'pomodoro') {
              setPomodoroCount(currentCount => {
                const newCount = currentCount + 1;
                AsyncStorage.setItem('pomodoroCount', newCount.toString()).catch(err => {
                  console.log('Error saving count:', err);
                });
                return newCount;
              });
              AsyncStorage.getItem('defaultPomodoro').then(val => {
                setTimeLeft((val ? parseInt(val) : 25) * 60);
              }).catch(() => {
                setTimeLeft(25 * 60);
              });
            } else {
              setTimerType('pomodoro');
              AsyncStorage.getItem('defaultPomodoro').then(val => {
                setTimeLeft((val ? parseInt(val) : 25) * 60);
              }).catch(() => {
                setTimeLeft(25 * 60);
              });
            }};
            handleSessionComplete(console.log("SESSION COMPLETE - saving stats now..."));

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
  }, [isRunning, isPaused, timerType]);

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
    if (timerType === 'pomodoro') {
      const val = await AsyncStorage.getItem('defaultPomodoro');
      setTimeLeft((val ? parseInt(val) : 25) * 60);
    } else if (timerType === 'shortBreak') {
      const val = await AsyncStorage.getItem('shortBreak');
      setTimeLeft((val ? parseInt(val) : 5) * 60);
    } else {
      const val = await AsyncStorage.getItem('longBreak');
      setTimeLeft((val ? parseInt(val) : 15) * 60);
    }
    setTimerType('pomodoro');
  };

  const handleBreak = async () => {
    setIsRunning(false);
    setIsPaused(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const shortBreak = await AsyncStorage.getItem('shortBreak');
    setTimeLeft((shortBreak ? parseInt(shortBreak) : 5) * 60);
    setTimerType('shortBreak');
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
                <View style={styles.btnGroup}>
                  <Pressable onPress={handlePause} style={styles.btnControl}>
                    <Text style={styles.btnText}>
                      {isPaused ? 'RESUME' : 'PAUSE'}
                    </Text>
                  </Pressable>
                  <Pressable onPress={handleBreak} style={styles.btnControl}>
                    <Text style={styles.btnText}>BREAK</Text>
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
  btnGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 10,
    marginBottom: 25,
    width: '100%',
    flexWrap: 'wrap',
  },
  btnControl: {
    width: 112,
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
  },
});