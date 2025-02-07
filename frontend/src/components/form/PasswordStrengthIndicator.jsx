import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const strengthLevels = {
  0: { label: 'Very Weak', color: '#ff3b30' },
  1: { label: 'Weak', color: '#ff9500' },
  2: { label: 'Medium', color: '#ffcc00' },
  3: { label: 'Strong', color: '#34c759' },
  4: { label: 'Very Strong', color: '#248f3f' },
};

export const PasswordStrengthIndicator = ({ password }) => {
  const strength = useMemo(() => {
    let score = 0;

    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    // Complexity checks
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return Math.min(4, score);
  }, [password]);

  const { label, color } = strengthLevels[strength];

  return (
    <View style={styles.container}>
      <View style={styles.barsContainer}>
        {[0, 1, 2, 3, 4].map((level) => (
          <View
            key={level}
            style={[
              styles.bar,
              {
                backgroundColor: level <= strength ? color : '#e1e1e1',
              },
            ]}
          />
        ))}
      </View>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    marginBottom: 10,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  bar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 2,
  },
  label: {
    fontSize: 12,
    textAlign: 'right',
  },
});
