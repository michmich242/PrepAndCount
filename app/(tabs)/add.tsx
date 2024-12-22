import { Image, StyleSheet, Platform } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import {View, Text} from 'react-native'
import { SafeAreaView } from 'react-native';

export default function AddScreen() {
  return (
    <SafeAreaView style={styles.titleContainer}>
    <Text style={styles.textStyle}>This is the adding food part</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  textStyle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});


