import React from 'react';
import { View, Text } from 'react-native';

export default function EmptyState({
  emoji,
  title,
  description,
  styles,
}) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>{emoji}</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyText}>{description}</Text>
    </View>
  );
}