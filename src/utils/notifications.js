import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { stopAlarm } from './soundPlayer';

export async function notifyTimesUp(sessionType) {
  const enabled = await AsyncStorage.getItem('notifications');
  if (enabled === 'true') {
    let message = '';

    if (sessionType === 'work') {
      message = 'Now, you can start your break!';
    } else if (sessionType === 'break') {
      message = 'Continue working hard 💪🏾!';
    } else {
      message = 'Session finished!';
    }

    Alert.alert(
      message,
      '',
      [{ text: "OK", onPress: () => stopAlarm() }], // stop alarm when alert is closed
      { cancelable: false }
    );
  }
}
