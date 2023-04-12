import { Modal, Form, FormGroup, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { actions as channelsActions, channelsSelectors } from '../../../slices/channelsSlice.js';
import socket from "../../../initSocket.js";

const ModalRemove = ({ handleClose ,id}) => {
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('removeChannel' , {id});
    handleClose();
  };

  return(
    <Modal show='show' onHide={handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>{t('mainPage.modal.removeChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <p>{t('mainPage.modal.removeQuestion')}</p>
          </FormGroup>
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <Button variant="secondary" className="m-2" onClick={handleClose}>
              {t('mainPage.modal.cancel')}
            </Button>
            <Button type="submit" className="m-2" variant='danger'>
              {t('mainPage.remove')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalRemove;