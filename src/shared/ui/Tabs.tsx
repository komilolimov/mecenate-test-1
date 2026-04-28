import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FeedTier } from '../api/types';
import { useAppTheme, AppTheme } from '../theme/useAppTheme';

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
            <Text 
              style={[styles.tabText, isActive && styles.activeTabText]} 
              numberOfLines={1}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const createStyles = (theme: AppTheme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    padding: 8, 
    borderRadius: 24, 
    marginHorizontal: 16, 
    marginVertical: theme.spacing.m,
    marginTop: 60
  },
  tabButton: {
    flex: 1, 
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  activeTabButton: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 13, 
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
});