import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function AppHeader() {
  const navigation = useNavigation();

  return (
    <View style={styles.frame}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.toggleDrawer()}
          style={styles.touchableOpacityStyle}
        >
          <Image
            source={require('../../assets/img/menu.png')}
            style={styles.menuIcon}
          />
        </TouchableOpacity>
        <Image
          source={require('../../assets/img/logo1.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Appomodoro Timer</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    backgroundColor: '#FFE1BD',
  },
  container: {
    backgroundColor: '#fff6e7',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 5,
    marginHorizontal: 12,
    borderRadius: 12,
  },
  logo: {
    width: 57,
    height: 57,
  },
  title: {
    fontSize: 28,
    fontFamily: 'PixelifySans-Bold',
    color: '#fa5032ff',
  },
  menuScreen: {
    marginLeft: 12,
    backgroundColor: '#FFE1BD',
  },
  menuIcon: {
    width: 42,
    height: 42,
  },
  touchableOpacityStyle: {
    backgroundColor: '#fff6e7',
    paddingLeft: 5,
    paddingVertical: 12,
  },
});
