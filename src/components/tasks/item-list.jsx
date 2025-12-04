import { Pressable, StyleSheet, Text, View } from 'react-native';
import Item from './item';

export default function ItemList({ tasks, onToggle, onDelete, onDeleteAll }) {
  const uncompletedTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <View>
      <View style={styles.taskSummary}>
        <Text style={styles.taskCount}>You have </Text>
        <Text style={styles.taskNumber}>{tasks.length}</Text>
        <Text style={styles.taskCount}> tasks</Text>
      </View>
      {tasks.length === 0 && <Text>No tasks</Text>}
      {uncompletedTasks.length > 0 && (
        <View>
          <View style={styles.taskSummary}>
            <Text style={styles.uncompleted}>Uncompleted: </Text>
            <Text style={styles.numberUncompleted}>
              {uncompletedTasks.length}
            </Text>
          </View>
          <View style={styles.list}>
            {uncompletedTasks.map(task => (
              <Item
                key={task.id}
                item={task}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </View>
        </View>
      )}
      {completedTasks.length > 0 && (
        <View>
          <View style={styles.taskSummary}>
            <Text style={styles.completed}>Completed: </Text>
            <Text style={styles.numberUncompleted}>
              {completedTasks.length}
            </Text>
          </View>
          <View style={styles.list}>
            {completedTasks.map(task => (
              <Item
                key={task.id}
                item={task}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </View>
        </View>
      )}
      {tasks.length > 0 && (
        <Pressable onPress={onDeleteAll} style={styles.deleteAllBtn}>
          <Text style={styles.deleteAllText}>Delete All Tasks</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  taskSummary: {
    flexDirection: 'row',
  },
  taskCount: {
    fontSize: 20,
    marginBottom: 10,
    fontFamily: 'PixelifySans-Bold',
  },
  taskNumber: {
    paddingTop: 6,
    fontSize: 15,
    marginBottom: 10,
    fontFamily: 'PressStart2P-Regular',
  },
  uncompleted: {
    fontSize: 20,
    marginVertical: 10,
    fontFamily: 'PixelifySans-Bold',
  },
  numberUncompleted: {
    paddingTop: 16,
    fontSize: 15,
    marginBottom: 10,
    fontFamily: 'PressStart2P-Regular',
  },
  completed: {
    fontSize: 20,
    marginVertical: 10,
    fontFamily: 'PixelifySans-Bold',
  },
  list: {
    marginVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    borderColor: '#ffe5b4ff',
  },
  deleteAllBtn: {
    backgroundColor: '#ff6b6b',
    padding: 10,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: 'center',
  },
  deleteAllText: {
    color: 'white',
    fontFamily: 'PixelifySans-Bold',
    fontSize: 18,
  },
});
