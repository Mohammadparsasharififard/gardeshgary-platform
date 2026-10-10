import { useState, useCallback, useMemo } from 'react';

export interface ContactFormState {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  consultationType: string;
  preferredTime: string;
}

export type ContactFormErrors = Partial<Record<keyof ContactFormState, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^0\d{10}$|^\+98\d{10}$|^0098\d{10}$/;

const EMPTY: ContactFormState = {
  name: '',
  phone: '',
  email: '',
  subject: '',
  message: '',
  consultationType: '',
  preferredTime: '',
};

/**
 * useContactForm — controlled form state with field-level validation.
 *
 * Validation strategy:
 *  - empty fields are not flagged until `touched` (after blur or submit)
 *  - once a field is touched, it re-validates on every change
 *  - `validateAll` runs full validation (called by submit handler)
 *
 * Returns state, errors, touched map, and handlers for change/blur/submit.
 */
export function useContactForm() {
  const [values, setValues] = useState<ContactFormState>(EMPTY);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactFormState, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateField = useCallback(
    (name: keyof ContactFormState, value: string): string | undefined => {
      switch (name) {
        case 'name':
          if (!value.trim()) return 'نام و نام خانوادگی الزامی است';
          if (value.trim().length < 3) return 'نام باید حداقل ۳ نویسه باشد';
          return undefined;
        case 'phone': {
          if (!value.trim()) return 'شماره تماس الزامی است';
          const digits = value.replace(/[\s-()]/g, '');
          if (!PHONE_RE.test(digits)) return 'شماره تماس معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)';
          return undefined;
        }
        case 'email':
          if (!value.trim()) return undefined; // optional
          if (!EMAIL_RE.test(value.trim())) return 'قالب ایمیل نامعتبر است';
          return undefined;
        case 'subject':
          if (!value) return 'انتخاب موضوع الزامی است';
          return undefined;
        case 'message':
          if (!value.trim()) return 'متن پیام الزامی است';
          if (value.trim().length < 10) return 'پیام باید حداقل ۱۰ نویسه باشد';
          return undefined;
        case 'consultationType':
          if (!value) return 'انتخاب نوع مشاوره الزامی است';
          return undefined;
        case 'preferredTime':
          return undefined; // optional
      }
    },
    [],
  );

  const validateAll = useCallback((): boolean => {
    const next: ContactFormErrors = {};
    (Object.keys(values) as (keyof ContactFormState)[]).forEach((k) => {
      const err = validateField(k, values[k]);
      if (err) next[k] = err;
    });
    setErrors(next);
    // Mark everything touched so all errors show
    const allTouched: Partial<Record<keyof ContactFormState, boolean>> = {};
    (Object.keys(values) as (keyof ContactFormState)[]).forEach((k) => { allTouched[k] = true; });
    setTouched(allTouched);
    return Object.keys(next).length === 0;
  }, [values, validateField]);

  const handleChange = useCallback(
    (name: keyof ContactFormState, value: string) => {
      setValues((prev) => ({ ...prev, [name]: value }));
      // Re-validate if the field has been touched
      if (touched[name]) {
        const err = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: err }));
      }
    },
    [touched, validateField],
  );

  const handleBlur = useCallback(
    (name: keyof ContactFormState) => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      const err = validateField(name, values[name]);
      setErrors((prev) => ({ ...prev, [name]: err }));
    },
    [values, validateField],
  );

  const reset = useCallback(() => {
    setValues(EMPTY);
    setErrors({});
    setTouched({});
    setSubmitting(false);
    setSubmitted(false);
  }, []);

  const submit = useCallback(
    async (onSuccess?: () => void) => {
      const valid = validateAll();
      if (!valid) return false;
      setSubmitting(true);
      // Simulate network latency — real backend would go here
      await new Promise((r) => setTimeout(r, 1400));
      setSubmitting(false);
      setSubmitted(true);
      onSuccess?.();
      return true;
    },
    [validateAll],
  );

  const isValid = useMemo(() => {
    const required: (keyof ContactFormState)[] = ['name', 'phone', 'subject', 'message', 'consultationType'];
    return required.every((k) => !validateField(k, values[k]));
  }, [values, validateField]);

  return {
    values,
    errors,
    touched,
    submitting,
    submitted,
    isValid,
    handleChange,
    handleBlur,
    submit,
    reset,
  };
}

export default useContactForm;
