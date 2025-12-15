import { View, Text, StyleSheet } from "react-native";

export default function PomodoroRow({ item }) {
  return (
    <View style={styles.recentRow}>
      <View style={styles.recentLeft}>
        <Text style={styles.emoji}>{item.emoji}</Text>
        <View>
          <Text style={styles.recentTitle}>{item.title}</Text>
          <Text style={styles.recentMeta}>
            Today <Text style={styles.numSmall}>{item.time}</Text>
          </Text>
        </View>
      </View>
      <Text style={styles.recentMins}>
        <Text style={styles.numSmall}>{item.minutes} mins</Text> 
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
    numSmall: {
    fontFamily: 'PressStart2P-Regular',
    fontSize: 11,
  },

  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#E7B983',
    borderRadius: 14,
    padding: 12,
  },

  recentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },

  emoji: {
    fontSize: 20,
  },

  recentTitle: {
    fontSize: 22,
    fontFamily: 'PixelifySans-Bold',
    color: '#3E2723',
  },

  recentMeta: {
    fontSize: 12,
    fontFamily: 'PixelifySans-Regular',
    color: '#3E2723',
    opacity: 0.8,
    marginTop: 3,
  },

  recentMins: {
    fontSize: 18,
    fontFamily: 'PixelifySans-Regular',
    color: '#3E2723',
  },

});