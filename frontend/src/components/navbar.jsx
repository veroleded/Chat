import React from 'react';
import { Navbar, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuth from '../hooks';
import routes from '../routes';

const Navb = () => {
  const { logOut, user } = useAuth();
  const { t } = useTranslation();
  return (
    <Navbar bg="dark" className="navbar-dark" expand="lg">
      <div className="container">
        <Navbar.Brand className="p-3" as={Link} to={routes.mainPathPage()}>
          {t('logo')}
        </Navbar.Brand>
        {!!user && (
          <Button onClick={logOut} as={Link} to={routes.loginPathPage()} className="btn-dark p-3 float-right">
            {t('logaut')}
          </Button>
        )}
      </div>
    </Navbar>
  );
};
export default Navb;
