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
import { useAuth } from '../../context/AuthContext';
import { validateEmail, validatePassword, validatePasswordConfirmation } from '../utils/validation';
import { handleError } from '../utils/errorHandler';
import { apiClient } from '../utils/apiClient';
import { useForm } from '../hooks/useForm';
import { FormInput } from '../components/form/FormInput';
import { PasswordStrengthIndicator } from '../components/form/PasswordStrengthIndicator';

export default function RegisterScreen() {
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
    const passwordValidation = validatePassword(values.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.error;
    }

    // Confirm password validation
    if (values.password) {
      const confirmValidation = validatePasswordConfirmation(values.password, values.confirmPassword);
      if (!confirmValidation.isValid) {
        errors.confirmPassword = confirmValidation.error;
      }
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
      confirmPassword: '',
    },
    validateForm
  );

  const onSubmit = async (formValues) => {
    try {
      // Make API request using our new apiClient
      await apiClient.post('/api/auth/register', {
        email: formValues.email,
        password: formValues.password,
      });

      // Handle successful registration
      handleError({ 
        type: 'SUCCESS',
        message: 'Registration successful! Please log in.'
      }, 'Success');
      
      await signIn(formValues.email, formValues.password);
      router.replace('/');

    } catch (error) {
      handleError(error);
      throw error; // Re-throw to prevent form from resetting
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
        autoComplete="new-password"
      />
      <PasswordStrengthIndicator password={values.password} />

      <FormInput
        label="Confirm Password"
        placeholder="Confirm your password"
        value={values.confirmPassword}
        onChangeText={(text) => handleChange('confirmPassword', text)}
        onBlur={() => handleBlur('confirmPassword')}
        error={errors.confirmPassword}
        touched={touched.confirmPassword}
        secureTextEntry
        editable={!isSubmitting}
        autoComplete="new-password"
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
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.loginButton} 
        onPress={() => router.back()}
        disabled={isSubmitting}
      >
        <Text style={styles.loginButtonText}>
          Already have an account? Login
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
  loginButton: {
    marginTop: 15,
    padding: 10,
  },
  loginButtonText: {
    color: '#007AFF',
    fontSize: 16,
    textAlign: 'center',
  },
});
