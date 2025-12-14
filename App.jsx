import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



// Screens
import HomeScreen from './src/screens/HomeScreen';
import TasksScreen from './src/screens/TasksScreen';
import NewPomodoroScreen from './src/screens/NewPomodoroScreen';
import StatsScreen from './src/screens/StatsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Components for Drawer Menu and Header
import CustomDrawer from './src/components/CustomDrawer';
import AppHeader from './src/components/AppHeader';

const Drawer = createDrawerNavigator();

export default function App() {
  const drawerContent = props => <CustomDrawer {...props} />;

  const header = ({ navigation }) => <AppHeader navigation={navigation} />;
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <NavigationContainer>
        <Drawer.Navigator
          drawerContent={drawerContent}
          screenOptions={({ navigation }) => ({
            drawerActiveTintColor: '#F87963',
            drawerInactiveTintColor: '#fdb9b9ff',
            drawerLabelStyle: styles.drawerLabelStyle,
            drawerStyle: styles.drawerStyle,
            header: () => header({ navigation }),
          })}
        >
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen
            name="Start New Pomodoro"
            component={NewPomodoroScreen}
          />
          <Drawer.Screen name="Tasks" component={TasksScreen} />
          <Drawer.Screen name="Stats" component={StatsScreen} />
          <Drawer.Screen name="Settings" component={SettingsScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#FFE1BD',
  },
  textScreen: {
    fontSize: 20,
    fontFamily: 'PixelifySans-Bold',
  },
  drawerLabelStyle: {
    fontFamily: 'PixelifySans',
    fontSize: 20,
  },
  drawerStyle: {
    height: screenHeight * 0.5,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: '#fff6e7',
    borderWidth: 2,
    borderColor: '#F87963',
    overflow: 'hidden',
  },
});
