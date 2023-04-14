import { Modal, Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import leoProfanity from 'leo-profanity';
import { channelsSelectors } from '../../../slices/channelsSlice.js';
import { useApi } from '../../../hooks/index.jsx';

const ModalRename = ({ handleClose, id }) => {
  const { t } = useTranslation();
  const socketApi = useApi();
  const channels = useSelector(channelsSelectors.selectAll);
  const channelsName = channels.map((channel) => channel.name);
  const inputRef = useRef();

  const feedback = {
    notUnique: t('mainPage.modal.err_feedback_add'),
    emptyField: t('mainPage.modal.err_feedback_field'),
  };

  const validationSchema = Yup.object({
    channelName: Yup.string()
      .trim()
      .required(feedback.emptyField)
      .notOneOf(channelsName, feedback.notUnique)
      .required(feedback.notUnique),
  });

  const formik = useFormik({
    initialValues: { channelName: '' },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      const filteredName = leoProfanity.clean(values.channelName);
      try {
        await socketApi.renameChannel({ id, name: filteredName });
        toast.success(t('channelRename'));
        handleClose();
      } catch (err) {
        setSubmitting(false);
        inputRef.current.select();
        if (err.name === 'ValidationError') {
          formik.values.channelName = filteredName;
          setStatus(err.message);
        }
      }
    },
    validateOnBlur: false,
    validateOnChange: false,
  });

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <Modal show="show" onHide={handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>{t('mainPage.modal.renameChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Control
              className="mb-2"
              disabled={formik.isSubmitting}
              ref={inputRef}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.channelName}
              isInvalid={
                (formik.errors.channelName && formik.touched.channelName) || !!formik.status
              }
              name="channelName"
              id="name"
              autoFocus
            />
            <label className="visually-hidden" htmlFor="name">
              {t('channelName')}
            </label>
            <Form.Control.Feedback type="invalid">
              {t(formik.errors.channelName) || t(formik.status)}
            </Form.Control.Feedback>
            <div className="d-flex justify-content-end">
              <Button className="me-2" variant="secondary" type="button" onClick={handleClose}>
                {t('mainPage.modal.cancel')}
              </Button>
              <Button variant="dark" type="submit" disabled={formik.isSubmitting}>
                {t('mainPage.rename')}
              </Button>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalRename;
