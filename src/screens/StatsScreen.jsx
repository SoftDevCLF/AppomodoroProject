import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import RecentPomodorosList from '../components/stats/recent-pomodoro-list';
import WeeklyStatsCard from '../components/stats/weekly-stats-card';


const cardBg = require('../../assets/img/bg.png')

export default function StatsScreen() {
  const [recentPomodoros, setRecentPomodoros] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState({
    focused: 0,
    breaks: 0,
    streak: 0,
    daily: [0, 0, 0, 0, 0, 0, 0],
  });

  useEffect(() => {
    loadStats();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadStats();
    }, [])
  );

  const loadStats = async () => {
    try {
      const recent = await AsyncStorage.getItem('recentPomodoros');
      const weekly = await AsyncStorage.getItem('weeklyStats');

      if (recent) {
        setRecentPomodoros(JSON.parse(recent));
      }

      if (weekly) {
        setWeeklyStats(JSON.parse(weekly));
      }

    } catch (error) {
      console.log('Error loading stats:', error);
    }
  };

  return (
    <View style={styles.frame}>
      <ScrollView contentContainerStyle={styles.scrollViewStyle}>
        <View style={styles.title}>
          <Image
            source={require('../../assets/img/statstomato.png')}
            style={styles.logoStyle}
          />
          <Text style={styles.titleText}>Stats / History</Text>
        </View>


        {/* Recent Pomodoros */}
          <RecentPomodorosList
            pomodoros={recentPomodoros}
            styles={styles}
            bgImage={cardBg}
          />


        {/* Weekly Stats */}
          <WeeklyStatsCard
            weeklyStats={weeklyStats}
            styles={styles}
            bgImage={cardBg}
          />
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

  scrollViewStyle: {
    flexGrow: 1,
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

  logoStyle: {
    width: 50,
    height: 50,
  },

  titleText: {
    fontSize: 30,
    color: '#000000',
    fontFamily: 'PixelifySans-Bold',
  },

  card: {
    backgroundColor: '#fff6e7',
    borderRadius: 12,
    padding: 20,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#E7B983',
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  cardTitle: {
    fontSize: 18,
    color: '#5a341a',
    fontFamily: 'PixelifySans-Bold',
  },

  badge: {
    marginLeft: 'auto',
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#ffe9d7',
    borderWidth: 2,
    borderColor: '#E7B983',
    borderRadius: 10,
  },

  badgeText: {
    fontSize: 13,
    fontFamily: 'PixelifySans-Regular',
    color: '#3E2723',
  },

  streakBadge: {
    marginLeft: 'auto',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ffe9d7',
    borderWidth: 2,
    borderColor: '#E7B983',
    borderRadius: 10,
  },

  streakText: {
    fontSize: 13,
    fontFamily: 'PixelifySans-Regular',
    color: '#3E2723',
  },

  numText: {
    fontFamily: 'PressStart2P-Regular',
    fontSize: 13,
  },
  
  chartBox: {
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#E7B983',
    borderRadius: 14,
    padding: 16,
    marginTop: 10,
    marginBottom: 18,
  },

  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 210,
    gap: 16,
  },
  
  bar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },

  barFill: {
    width: 28,
    minHeight: 8,
    backgroundColor: '#FF8D6B',
    borderWidth: 3,
    borderColor: '#D49C63',
    borderRadius: 10,
    marginBottom: 4,
  },

  barLabel: {
    fontSize: 15,
    fontFamily: 'PixelifySans-Regular',
    color: '#3E2723',
    marginTop: 4,
  },

  cardBgImage: {
    flex: 1,
    height: '100%',
    width: '100%',
  },

  cardBgImageStyle: {
    borderRadius: 20,
  },

  countLabel: {
    fontSize: 12,
    fontFamily: 'PressStart2P-Regular',
    color: '#3E2723',
    marginBottom: 6,
  },

  totals: {
    marginTop: 12,
    alignItems: 'center',
  },

  totalsText: {
    fontSize: 14,
    fontFamily: 'PixelifySans-Regular',
  color: '#3E2723',
  },

  totalsBold: {
    fontFamily: 'PressStart2P-Regular', 
    fontSize: 12,                       
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
    opacity: 0.85,
  },

  emptyEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },

  emptyTitle: {
    fontFamily: 'PixelifySans-Bold',
    fontSize: 18,
    color: '#3E2723',
    marginBottom: 4,
  },

  emptyText: {
    fontFamily: 'PixelifySans-Regular',
    fontSize: 13,
    color: '#3E2723',
    opacity: 0.7,
    textAlign: 'center',
  },

  seeMore: {
    marginTop: 10,
    alignSelf: 'center',
  },

  seeMoreText: {
    fontFamily: 'PixelifySans-Bold',
    fontSize: 14,
    color: '#E36B3D',
  },

  recentList: {
    gap: 12, 
  },
});