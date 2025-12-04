import { View, Text, StyleSheet } from 'react-native';
import { DrawerItemList } from '@react-navigation/drawer';

export default function CustomDrawer(props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Menu</Text>
      </View>
      <DrawerItemList {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff6e7',
    flex: 1,
  },
  header: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#F87963',
  },
  headerText: {
    color: '#fa5032ff',
    fontSize: 40,
    fontFamily: 'PixelifySans-Bold',
    padding: 10,
  },
});
