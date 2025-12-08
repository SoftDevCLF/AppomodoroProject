import { View, TextInput, StyleSheet, Text, Pressable } from 'react-native';
import { useState } from 'react';

export default function TodoForm({ onAdd }) {
  const [text, setText] = useState('');

  function handleAdd() {
    if (text.trim().length === 0) return;
    onAdd(text);
    setText('');
  }

  return (
    <View>
      <Text style={styles.label}>Add a New Task </Text>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Add new task..."
          value={text}
          onChangeText={setText}
        />

        <Pressable onPress={handleAdd} style={styles.btn}>
          <Text style={styles.btnText}>Add</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 20,
    marginBottom: 10,
    marginTop: 10,
    fontFamily: 'PixelifySans-Bold',
  },
  container: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    borderColor: '#FFE1BD',
    borderWidth: 1,
    fontFamily: 'PixelifySans-Regular',
  },
  btn: {
    backgroundColor: '#F87963',
    padding: 10,
    borderRadius: 10,
  },
  btnText: {
    paddingTop: 5,
    fontSize: 10,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'PressStart2P-Regular',
  },
});
