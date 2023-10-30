import React from "react";
//import './App.css';
import styled from "styled-components";
import Header from "./Components/Header";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import Drive from "./Components/Drive";

function App() {
  return (
    <Router>
      <Header />
      <Container>
        <Sidebar>
          <Routes>
            <Route path="/" element={<Drive />} />
          </Routes>
        </Sidebar>
      </Container>
    </Router>
  );
}

export default App;

const Container = styled.div`
  display: flex;
`;
