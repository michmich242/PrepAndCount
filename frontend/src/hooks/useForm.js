import { useState, useCallback } from 'react';

export const useForm = (initialValues = {}, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle field change
  const handleChange = useCallback((field, value) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // If field has been touched, validate it
    if (touched[field] && validate) {
      const validationErrors = validate({ ...values, [field]: value });
      setErrors(prev => ({ ...prev, [field]: validationErrors[field] }));
    }
  }, [touched, values, validate]);

  // Handle field blur
  const handleBlur = useCallback((field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    if (validate) {
      const validationErrors = validate(values);
      setErrors(prev => ({ ...prev, [field]: validationErrors[field] }));
    }
  }, [values, validate]);

  // Handle form submission
  const handleSubmit = useCallback(async (onSubmit) => {
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);

      // If there are errors, mark all fields as touched
      if (Object.keys(validationErrors).length > 0) {
        setTouched(
          Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {})
        );
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate]);

  // Reset form
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
  };
};
