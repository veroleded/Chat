import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as yup from 'yup';
import { useFormik  } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import routes from '../routes.js';
import useAuth from '../hooks/index.jsx';
import { useRef } from 'react';

const Registration = () => {
  const inputRef = useRef();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [registrationFailed, setRegistrationFailed] = useState(false);
  const [validity, setValidity] = useState(null);
  const auth = useAuth();

  useEffect(() => {
    if (auth.user) navigate('/');
  }, [])
  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .trim()
      .required('signup.required')
      .min(3, 'signup.usernameConstraints')
      .max(20, 'signup.usernameConstraints'),
    password: yup
      .string()
      .trim()
      .required('signup.required')
      .min(6, 'signup.passMin'),
    confirmPassword: yup
      .string()
      .test('confirmPassword', 'signup.mustMatch', (value, context) => value === context.parent.password),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setRegistrationFailed(false);

      try {
        const res = await axios.post(
          routes.signupPath(),
          { username: values.username, password: values.password },
        );
        auth.logIn(res.data);
        navigate('/');
      } catch (err) {
        if (!err.isAxiosError) {
          throw err;
        }

        if (err.response.status === 409) {
          setRegistrationFailed(true);
          inputRef.current.select();
          return;
        }

        throw err;
      }
    },
  });

  return (
    <div className="container-fluid">
      <div className="row justify-content-center pt-5">
          <Form onSubmit={formik.handleSubmit} className="w-50">
            <h1 className="text-center mb-4">{t('signup.header')}</h1>
            <Form.Group className="form-floating mb-3">
              <Form.Control
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
                placeholder={t('signup.usernameConstraints')}
                name="username"
                id="username"
                autoComplete="username"
                isInvalid={
                  (formik.errors.username && formik.touched.username)
                  || registrationFailed
                }
                required
                ref={inputRef}
              />
              <Form.Label htmlFor="username">{t('signup.username')}</Form.Label>
              <Form.Control.Feedback type="invalid" tooltip placement="right">
                {t(formik.errors.username)}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="form-floating mb-3">
              <Form.Control
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                placeholder={t('signup.passMin')}
                name="password"
                id="password"
                aria-describedby="passwordHelpBlock"
                isInvalid={
                  (formik.errors.password && formik.touched.password)
                  || registrationFailed
                }
              required
                autoComplete="new-password"
              />
              <Form.Control.Feedback type="invalid" tooltip>
                {t(formik.errors.password)}
              </Form.Control.Feedback>
              <Form.Label htmlFor="password">{t('signup.password')}</Form.Label>
            </Form.Group>

            <Form.Group className="form-floating mb-4">
              <Form.Control
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
                placeholder={t('signup.mustMatch')}
                name="confirmPassword"
                id="confirmPassword"
                isInvalid={
                  (formik.errors.confirmPassword && formik.touched.confirmPassword)
                  || registrationFailed
                }
                required
                autoComplete="new-password"
              />
              <Form.Control.Feedback type="invalid" tooltip>
                {registrationFailed
                  ? t('signup.alreadyExists')
                  : t(formik.errors.confirmPassword)}
              </Form.Control.Feedback>
              <Form.Label htmlFor="confirmPassword">{t('signup.confirm')}</Form.Label>

            </Form.Group>
            <Button type="submit" variant="dark" className="w-100">{t('signup.submit')}</Button>
          </Form>
          <div class="text-center m-3">
            <span>{t('signup.haveAccount')} </span>
            <a href="/login" className='text-dark'>{t('signup.login')}</a>
          </div>
      </div>
    </div>
  );
  
};

export default Registration;