import React from "react";
//import './App.css';
import styled from "styled-components";
import Header from "./Components/Header";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import Drive from "./Components/Drive";
import Login from "./Components/Login";
import Signup from "./Components/Signup";

function App() {
  // const navigate = useNavigate();

  // const isDriveRoute = () => {
  //   return navigate().location.pathname === "/drive";
  // };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/drive"
          element={
            <>
              {({ location }) => location.pathname === "/drive" && <Header />}
              <Container>
                <Sidebar />
                <Drive />
              </Container>
            </>
          }
        />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;

const Container = styled.div`
  display: flex;
`;
