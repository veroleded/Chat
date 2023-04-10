import { Modal, Form, FormGroup, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useFormik } from "formik";
import _ from 'lodash';
import { actions as channelsActions, channelsSelectors } from '../../../slices/channelsSlice.js';


const ModalAdd = ({ handleClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [validityForm, setValidityForm] = useState(null);
  const [feedbackType, setFeedbackType] = useState(null);
  const channels = useSelector(channelsSelectors.selectAll);

  const feedback = {
    notUnique: t('mainPage.modal.err_feedback_add'),
    emptyField: t('mainPage.modal.err_feedback_field'),
  }

  const formik = useFormik({
    initialValues: { text: '' },
    onSubmit:  (values) => {
      const newChannelName = values.text.trim();
      const matches = channels.find((channel) => channel.name === newChannelName)
      if (matches) {
        setValidityForm('is-invalid');
        setFeedbackType('notUnique');
      } else if (newChannelName === '') {
        setValidityForm('is-invalid');
        setFeedbackType('emptyField');
      } else {
        const id = _.uniqueId('channel');
        const newChannel = { id: id, name: newChannelName, removable: true };
        dispatch(channelsActions.addChannel(newChannel));
        dispatch(channelsActions.setCurrentChannelId(id));
        handleClose();
      }
    }
  })

  return (
    <Modal show='show' onHide={handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>{t('mainPage.modal.addChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <Form.Control
              variant="dark"
              type='text'
              name='text'
              className={validityForm}
              values={formik.values.text}
              onChange={formik.handleChange}
              autoFocus
              onFocus={() => setValidityForm(null)}
            />
            <Form.Control.Feedback type="invalid">
              {feedback[feedbackType]}
            </Form.Control.Feedback>
          </FormGroup>
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <Button variant="secondary" className="m-2" onClick={handleClose}>
              {t('mainPage.modal.cancel')}
            </Button>
            <Button type="submit" className="m-2" variant='dark'>
              {t('mainPage.add')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalAdd;