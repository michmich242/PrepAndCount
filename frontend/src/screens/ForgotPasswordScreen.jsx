import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import API_URL from '../../config/config';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSent(true);
      } else {
        Alert.alert('Error', data.message || 'Failed to send reset email');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      Alert.alert('Error', 'An error occurred while sending reset email');
    }
  };

  if (isSent) {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/prepAndCountLogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.successText}>
          Password reset instructions have been sent to your email.
        </Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.replace('/(auth)/')}
        >
          <Text style={styles.buttonText}>Return to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/prepAndCountLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.description}>
        Enter your email address and we'll send you instructions to reset your password.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Send Reset Instructions</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace('/(auth)/')}>
        <Text style={styles.linkText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  successText: {
    fontSize: 18,
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 10,
  },
});
