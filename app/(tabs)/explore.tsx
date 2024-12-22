import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ScrollView } from 'react-native';
import { View, Text } from 'react-native';

export default function TabTwoScreen() {
  return (

    <View style= {styles.container}>

    <ScrollView contentContainerStyle={styles.scrollView}>

    <Text style={styles.Centeredtext}> Hello Guys </Text>
    </ScrollView>
    </View>

  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',

  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  Centeredtext: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});
