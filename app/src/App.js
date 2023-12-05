import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Drive from "./Components/Drive";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Model from "./Components/Model";
import FolderModel from "./Components/FolderModel";
import PhotoModel from "./Components/PhotoModel";
import PhotoDisplay from "./Components/photoDisplay";
import { Layout } from "./Layout/Layout";
import FileModel from "./Components/FileModel";
import ViewSharableLink from "./Components/ViewSharableLink";
import ViewEnterEmailShare from "./Components/ViewEnterEmailShare";

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
        <FileModel />
        <ViewSharableLink />
        <ViewEnterEmailShare />
      </Layout>
    </Router>
  );
}

export default App;
