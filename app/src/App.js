import React, { useEffect } from "react";
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
import { Layout } from "./Layout/Layout";
import { useSelector } from "react-redux";
import { selectUid } from "./features/user/userSlice";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/drive/*" element={<Drive />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
        <Model />
        <PhotoModel />
        <FolderModel />
        <PhotoDisplay />
      </Layout>
    </Router>
  );
}

// function DriveComponent() {
//   const location = useLocation();

//   return (
//     <>
//       {location.pathname === "/drive" && <Header />}
//       <Container>
//         <Sidebar />
//         <Drive />
//       </Container>
//     </>
//   );
// }

export default App;

const Container = styled.div`
  display: flex;
`;
