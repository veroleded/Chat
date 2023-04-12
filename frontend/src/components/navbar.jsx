import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from 'react-router-dom';

const Navb = () => {
  return (
    <Navbar bg="dark" className="navbar-dark" expand="lg">
      <Navbar.Brand className="p-3" as={Link} to="/">
        Veroled's Chat
      </Navbar.Brand>
      <Nav className="mr-auto">
        asjdlakkskjd
      </Nav>
    </Navbar>
  );
};
export default Navb;