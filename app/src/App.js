import React from "react";
//import './App.css';
import styled from "styled-components";
import Header from "./Components/Header";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import Drive from "./Components/Drive";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Model from "./Components/Model";
import FolderModel from "./Components/FolderModel";
import PhotoModel from "./Components/PhotoModel";
import PhotoDisplay from "./Components/photoDisplay";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/drive" element={<DriveComponent />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <Model />
      <PhotoModel />
      <FolderModel />
      <PhotoDisplay />
    </Router>
  );
}

function DriveComponent() {
  const location = useLocation();

  return (
    <>
      {location.pathname === "/drive" && <Header />}
      <Container>
        <Sidebar />
        <Drive />
      </Container>
    </>
  );
}

export default App;

const Container = styled.div`
  display: flex;
`;
