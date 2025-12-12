import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function notifyTimesUp() {
  const enabled = await AsyncStorage.getItem('notifications');
  if (enabled === 'true') {
    Alert.alert('Times Up!', 'Your timer has finished.');
  }
}
