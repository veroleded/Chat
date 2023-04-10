import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { useFormik  } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import routes from '../routes.js';
import useAuth from '../hooks/index.jsx';

const loginPage = ( {props }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [validity, setValidity] = useState(null);
  const auth = useAuth();

  const loginSchema = Yup.object({
    username: Yup.string().max(15, t('loginPage.err_message.usernameMax')).required(t('loginPage.err_message.usernameRequired')),
    password: Yup.string().min(5, t('loginPage.err_message.passwordMin')).required(t('loginPage.err_message.passwordRequired')),
  });

  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(routes.loginPath(), values);
        localStorage.setItem('userId', response.data.token);
        auth.logIn();
        navigate('/');
      } catch(e) {
        setValidity('is-invalid');
      }
    }
  });

  return (
    <div className="container-fluid">
      <div className="row justify-content-center pt-5">
        <div className="col-sm-4">
            <h2 className="text-center">{
              t('loginPage.login')}
            </h2>
          </div> 
          <Form onSubmit={formik.handleSubmit}>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>{t('loginPage.name')}</Form.Label>
              <Form.Control
                type="text"
                autoFocus
                className={validity}
                name="username"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
                placeholder={t('loginPage.placeholder_name')}
              />
              {formik.touched.username && formik.errors.username 
                ? (<p className='feedback m-0 position-absolute small text-danger'>{formik.errors.username}</p>)
                : null}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>{t('loginPage.password')}</Form.Label>
              <Form.Control
                type="password"
                requared="true"
                className={validity}
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                placeholder={t('loginPage.placeholder_password')}
              />
              <Form.Control.Feedback type="invalid">{
                t('loginPage.err_feedback_msge')}
              </Form.Control.Feedback>
              {formik.touched.password && formik.errors.password
                ? (<p className='feedback m-0 position-absolute small text-danger'>{formik.errors.password}</p>)
                : null}
            </Form.Group>
            <Form.Group>
              
            </Form.Group> 
            <div className="p-3 row">
              <Button className="btn-dark" variant="primary" type="submit">
                {t('loginPage.submit')}
              </Button>
            </div>
          </Form>
        </div>
      </div>
  );
  
};

export default loginPage;