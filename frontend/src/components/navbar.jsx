import React from "react";
import { Navbar, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';
import useAuth from "../hooks";
import { useTranslation } from "react-i18next";

const Navb = () => {
  const { logOut, user } = useAuth();
  const { t } = useTranslation();
  return (
    <Navbar bg="dark" className="navbar-dark" expand="lg">
      <Navbar.Brand className="p-3" as={Link} to="/">
        Veroled's Chat
      </Navbar.Brand>
      {!!user && <Button onClick={logOut} as={Link} to="login" className='btn-dark p-3'>{t('logaut')}</Button>}
    </Navbar>
  );
};
export default Navb;