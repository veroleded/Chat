import { Modal, Form, FormGroup, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { actions as channelsActions, channelsSelectors } from '../../../slices/channelsSlice.js';
import socket from "../../../initSocket.js";


const ModalRename = ({ handleClose, id }) => {
  const { t } = useTranslation();
  const [validityForm, setValidityForm] = useState(null);
  const channels = useSelector(channelsSelectors.selectAll);
  const channelsName = channels.map((channel) => channel.name);

  const feedback = {
    notUnique: t('mainPage.modal.err_feedback_add'),
    emptyField: t('mainPage.modal.err_feedback_field'),
  }
  const validationSchema = Yup.object({
    channelName: Yup.string()
      .min(1).required(feedback.emptyField).notOneOf(channelsName, feedback.notUnique),
  })
  const formik = useFormik({
    initialValues: { channelName: '' },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const newChannelName = values.channelName.trim();
        socket.emit('renameChannel', {id, name: newChannelName});
        handleClose();
    }
  })

  return (
    <Modal show='show' onHide={handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>{t('mainPage.modal.renameChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <Form.Control
              variant="dark"
              type='text'
              name='channelName'
              values={formik.values.text}
              onChange={formik.handleChange}
              autoFocus
              onFocus={() => setValidityForm(null)}
            />
            {formik.touched.channelName && formik.errors.channelName 
            ? (<p className='feedback m-0 position-absolute small text-danger'>{formik.errors.channelName}</p>)
              : null}
          </FormGroup>
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <Button variant="secondary" className="m-4" onClick={handleClose}>
              {t('mainPage.modal.cancel')}
            </Button>
            <Button type="submit" className="m-4" variant='dark'>
              {t('mainPage.rename')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalRename;