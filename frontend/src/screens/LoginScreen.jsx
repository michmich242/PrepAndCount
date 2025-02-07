import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { useAuth } from '../../context/AuthContext';
import { validateEmail } from '../utils/validation';
import { handleError } from '../utils/errorHandler';
import { apiClient } from '../utils/apiClient';
import { useForm } from '../hooks/useForm';
import { FormInput } from '../components/form/FormInput';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const validateForm = (values) => {
    const errors = {};
    
    // Email validation
    const emailValidation = validateEmail(values.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error;
    }

    // Password validation
    if (!values.password) {
      errors.password = 'Password is required';
    }

    return errors;
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm(
    {
      email: '',
      password: '',
    },
    validateForm
  );

  const onSubmit = async (formValues) => {
    try {
      const response = await apiClient.post('/api/auth/login', {
        email: formValues.email,
        password: formValues.password,
      });

      if (response.token) {
        await signIn(response.token);
        router.replace('(tabs)');
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/prepAndCountLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <FormInput
        label="Email"
        placeholder="Enter your email"
        value={values.email}
        onChangeText={(text) => handleChange('email', text)}
        onBlur={() => handleBlur('email')}
        error={errors.email}
        touched={touched.email}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isSubmitting}
        autoComplete="email"
      />

      <FormInput
        label="Password"
        placeholder="Enter your password"
        value={values.password}
        onChangeText={(text) => handleChange('password', text)}
        onBlur={() => handleBlur('password')}
        error={errors.password}
        touched={touched.password}
        secureTextEntry
        editable={!isSubmitting}
        autoComplete="password"
      />

      <TouchableOpacity 
        style={[
          styles.button,
          isSubmitting && styles.buttonDisabled,
          Object.keys(errors).length > 0 && styles.buttonDisabled
        ]} 
        onPress={() => handleSubmit(onSubmit)}
        disabled={isSubmitting || Object.keys(errors).length > 0}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <GoogleSignInButton />

      <TouchableOpacity 
        style={styles.registerButton} 
        onPress={() => router.push('/register')}
        disabled={isSubmitting}
      >
        <Text style={styles.registerButtonText}>
          Don't have an account? Register
        </Text>
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
    width: 150,
    height: 150,
  },
  button: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  registerButton: {
    marginTop: 15,
    padding: 10,
  },
  registerButtonText: {
    color: '#007AFF',
    fontSize: 16,
    textAlign: 'center',
  },
});
