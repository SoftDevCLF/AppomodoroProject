import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  const handleStart = () => {
    navigation.navigate('Start New Pomodoro');
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
          <View style={styles.imageHomeContainer}>
            <Image
              source={require('../../assets/img/homepic.png')}
              style={styles.imageHome}
            />
          </View>
          <Text style={styles.text}>Welcome to Appomodoro Timer!</Text>
          <Pressable onPress={handleStart} style={styles.startButton}>
            <View style={styles.pressableStyle}>
              <Text style={styles.pressableText}>Get Started</Text>
            </View>
          </Pressable>
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
  imageHomeContainer: {
    marginBottom: 20,
  },
  imageHome: {
    width: 400,
    height: 400,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 35,
    textAlign: 'center',
    color: '#000000',
    fontFamily: 'PixelifySans-Bold',
  },
  pressableStyle: {
    marginTop: 20,
    backgroundColor: '#F87963',
    borderRadius: 10,
    padding: 10,
  },
  pressableText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'PressStart2P-Regular',
    paddingTop: 5,
  },
});
