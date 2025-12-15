import React, { useState } from 'react';
import { View, Text, Pressable, ImageBackground } from 'react-native';
import PomodoroRow from './pomodoro-row';
import EmptyState from './empty-state';

const DEFAULT_VISIBLE = 5;

export default function RecentPomodorosList({ pomodoros, styles, bgImage }) {
    const [visibleCount, setVisibleCount] = useState(DEFAULT_VISIBLE);

    const totalCount = pomodoros.length;
    const visiblePomodoros = pomodoros.slice(0, visibleCount);

    const badgeCount = Math.min(totalCount, visibleCount);
    const showBadge = totalCount > 0;
    const canToggle = totalCount > DEFAULT_VISIBLE;

  

    return (
        <ImageBackground
        source={bgImage}
        style={styles.card}
        imageStyle={styles.cardBgImageStyle}
        resizeMode="cover"
        >
        {/* Header */}
        <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Recent pomodoros</Text>
            {showBadge && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                        last <Text style={styles.numText}>{badgeCount}</Text>
                    </Text>
                </View>
            )}

        </View>

        {/* Content */}
        <View style={styles.recentList}>
            {pomodoros.length === 0 ? (
                <EmptyState
                    emoji="🍅"
                    title="No pomodoros yet"
                    description="Start a focus session to see it here."
                    styles={styles}
                />
            ) : (
            visiblePomodoros.map((item, index) => (
                <PomodoroRow key={index} item={item} styles={styles} />
            ))
            )}
        </View>

        {/* See more / less */}
        {canToggle && (
            <Pressable
            onPress={() =>
                setVisibleCount(
                visibleCount === DEFAULT_VISIBLE ? 10 : DEFAULT_VISIBLE
                )
            }
            style={styles.seeMore}
            >
            <Text style={styles.seeMoreText}>
                {visibleCount === DEFAULT_VISIBLE ? 'See more' : 'See less'}
            </Text>
            </Pressable>
        )}
        </ImageBackground>
    );
}