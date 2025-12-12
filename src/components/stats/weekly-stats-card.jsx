import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  Pressable,
} from 'react-native';

export default function WeeklyStatsCard({
  weeklyStats,
  styles,
  bgImage,
  onReset,
  breakMinutesPerSession = 5,
}) {
  const maxCount = Math.max(...weeklyStats.daily, 1);

  const focusedMinutes = weeklyStats.focused;
  const breakMinutes = weeklyStats.breaks * breakMinutesPerSession;

  const getDayLabel = index => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[index];
  };

  return (
    <ImageBackground
      source={bgImage}
      style={styles.card}
      imageStyle={styles.cardBgImageStyle}
      resizeMode="cover"
    >
      {/* Header */}
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Weekly stats</Text>
        <View style={styles.streakBadge}>
          <Text style={styles.streakText}>
            Streak:{' '}
            <Text style={styles.numText}>
              {weeklyStats.streak}
            </Text>
            🔥
          </Text>
        </View>
      </View>

      {/* Chart */}
      <View style={styles.chartBox}>
        <View style={styles.barsContainer}>
          {weeklyStats.daily.map((count, index) => {
            const height = (count / maxCount) * 100;

            return (
              <View key={index} style={styles.bar}>
                {count > 0 && (
                  <Text style={styles.countLabel}>
                    {count}
                  </Text>
                )}

                <View
                  style={[
                    styles.barFill,
                    { height: Math.min(height, 80) + '%' },
                  ]}
                />

                <Text style={styles.barLabel}>
                  {getDayLabel(index)}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Totals */}
      <View style={styles.totals}>
        <Text style={styles.totalsText}>
          Focused:{' '}
          <Text style={styles.totalsBold}>
            {focusedMinutes} min
          </Text>{' '}
          Breaks:{' '}
          <Text style={styles.totalsBold}>
            {breakMinutes} min
          </Text>
        </Text>
      </View>

      {/* Reset */}
      {/* <Pressable onPress={onReset} style={styles.resetButton}>
        <Text style={styles.resetText}>Reset Stats</Text>
      </Pressable> */}
    </ImageBackground>
  );
}