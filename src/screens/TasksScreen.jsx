import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useState, useEffect } from 'react';
import taskData from '../../assets/data/tasks-data.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ItemList from '../components/tasks/item-list';
import TodoForm from '../components/tasks/todo-form';

console.log('ItemList:', ItemList);
console.log('TodoForm:', TodoForm);

export default function TasksScreen() {
  const [task, setTask] = useState(taskData);
  function addNewTask(taskTitle) {
    const newTask = {
      id: Math.random().toString(36).substring(2, 9),
      title: taskTitle,
      completed: false,
    };
    setTask(prevTasks => [...prevTasks, newTask]);
  }

  function completeTask(taskId) {
    setTask(
      task.map(taskItem =>
        taskItem.id === taskId
          ? { ...taskItem, completed: !taskItem.completed }
          : taskItem,
      ),
    );
  }

  function deleteTask(id) {
    setTask(task.filter(t => t.id !== id));
  }

  function deleteAllTasks() {
    Alert.alert(
      'Delete All Tasks',
      'Are you sure you want to delete all tasks?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => setTask([]),
        },
      ],
      { cancelable: true },
    );
  }

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        if (storedTasks) {
          setTask(JSON.parse(storedTasks));
        } else {
          setTask(taskData);
        }
      } catch (error) {
        console.log('Error loading tasks:', error);
      }
    };
    loadTasks();
  }, []);

  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem('tasks', JSON.stringify(task));
      } catch (error) {
        console.log('Error saving tasks:', error);
      }
    };
    saveTasks();
  }, [task]);

  return (
    <View style={styles.frame}>
      <ScrollView contentContainerStyle={styles.scrollViewStyle}>
        <View style={styles.title}>
          <Image
            source={require('../../assets/img/newtasktomato.png')}
            style={styles.logoStyle}
          />
          <Text style={styles.text}>New Task</Text>
        </View>
        <ImageBackground
          source={require('../../assets/img/bg.png')}
          style={styles.backgroundImage}
          imageStyle={styles.imageStyle}
          resizeMode="cover"
        >
          <View style={styles.innerContent}>
            <TodoForm onAdd={addNewTask} />

            <ItemList
              tasks={task}
              onToggle={completeTask}
              onDelete={deleteTask}
              onDeleteAll={deleteAllTasks}
            />
          </View>
        </ImageBackground>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    backgroundColor: '#FFE1BD',
    padding: 12,
  },
  scrollViewStyle: { flexGrow: 1 },
  backgroundImage: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  logoStyle: {
    width: 50,
    height: 50,
  },
  imageStyle: {
    borderRadius: 20,
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff6e7',
    padding: 10,
    borderRadius: 12,
    marginBottom: 14,
  },
  text: {
    fontSize: 28,
    color: '#000000',
    fontFamily: 'PixelifySans-Bold',
  },
  innerContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    margin: 12,
  },
});
