import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { stopAlarm } from './soundPlayer';

export async function notifyTimesUp() {
  const enabled = await AsyncStorage.getItem('notifications');
  if (enabled === 'true') {
    Alert.alert('Now, you can start your break!', '', 
      [ {text: "OK", onPress: () => stopAlarm()}], //stop alarm when alart is closed
      {cancelable : false }
    );
  }
}
