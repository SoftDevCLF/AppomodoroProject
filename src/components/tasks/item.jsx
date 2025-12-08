import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
export default function Item({ item, onToggle, onDelete }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onToggle(item.id)}>
        <Text style={styles.checkbox}>{item.completed ? '☑' : '☐'}</Text>
      </TouchableOpacity>

      <Text style={[styles.itemName, item.completed && styles.crossText]}>
        {item.title}
      </Text>

      <TouchableOpacity onPress={() => onDelete(item.id)}>
        <Text style={styles.delete}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  checkbox: {
    fontSize: 26,
  },
  itemName: {
    fontSize: 20,
    flex: 1,
    fontFamily: 'PixelifySans-Regular',
  },
  crossText: {
    textDecorationLine: 'line-through',
  },
  delete: {
    fontSize: 26,
  },
});
