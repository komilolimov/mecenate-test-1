import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FeedTier } from '../../store/feedStore';
import { useAppTheme } from '../../theme/useAppTheme';

interface TabsProps {
  activeTab: FeedTier;
  onTabChange: (tab: FeedTier) => void;
}

export const Tabs = ({ activeTab, onTabChange }: TabsProps) => {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const tabs: { id: FeedTier; label: string }[] = [
    { id: 'all', label: 'Все' },
    { id: 'free', label: 'Бесплатные' },
    { id: 'paid', label: 'Платные' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabButton, isActive && styles.activeTabButton]}
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xs,
    borderRadius: theme.radius.round,
    marginHorizontal: theme.spacing.l,
    marginVertical: theme.spacing.m,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: theme.radius.round,
  },
  activeTabButton: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.textSecondary,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
});