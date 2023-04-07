import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFound = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lcation = useLocation();

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="text-center">
          <h1 className="display-1 fw-bold">404</h1>
          <p className="fs-3"> <span className="text-danger">{t('notFoundPage.ops')}</span>{t('notFoundPage.notFound')}</p>
          <p className="lead">
            {t('notFoundPage.message')}
          </p>
          <button type="button" onClick={() => navigate('/')} className="btn btn-dark">{t('notFoundPage.button')}</button>
      </div>
    </div>
  );
};

export default NotFound;