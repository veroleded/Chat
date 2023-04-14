import { Modal, Form, FormGroup, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useApi } from "../../../hooks/index.jsx";
import { toast } from "react-toastify";

const ModalRemove = ({ handleClose ,id}) => {
  const { t } = useTranslation();
  const socketApi = useApi();
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await socketApi.removeChannel({id});
      toast.success(t('channelRemove'));
      handleClose();
    } catch(e) {
      console.error(e);
    }
    setLoading(false);
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
            <Button variant="secondary" className="me-2" onClick={handleClose}>
              {t('mainPage.modal.cancel')}
            </Button>
            <Button type="submit" className="me-2" disabled={loading} variant='danger'>
              {t('mainPage.remove')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalRemove;