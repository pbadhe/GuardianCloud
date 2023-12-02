// FolderView.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { setBoolean } from "../features/Bool/boolSlice"; // Import your Redux actions
import { selectUid } from "../features/user/userSlice"; // Import your Redux selectors
import Header from "./Header";
import Sidebar from "./Sidebar";
import FileContainer from "./FileContainer";
import FileShowContainer from "./FileContainer";

const FolderView = ({ folderName }) => {
  const dispatch = useDispatch();
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const uid = useSelector(selectUid);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://guardiancloud-jt5nilkupq-uc.a.run.app/list",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: uid,
              filepath: `/${folderName}`, // Use the provided folderName in the API call
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setFolders(data.folders);
          setFiles(data.files);
        } else {
          console.log("Not a successful response");
        }
      } catch (error) {
        console.error("Error during folder content fetch:", error);
      }
    };

    fetchData();
  }, [uid, folderName]);

  return (
    <>
      <Header></Header>
      <Sidebar></Sidebar>
      <Container onClick={() => dispatch(setBoolean({ modelBools: false }))}>
        <Title>
          <span>{folderName}</span>
          <ArrowDropDownIcon />
        </Title>
        <FileContent>
          <Margin>
            <SemiTitle>Folder</SemiTitle>
            <GridContainer>
              {folders?.map((data) => (
                <FileContainer title={data} />
              ))}
            </GridContainer>
          </Margin>
          <Margin>
            <SemiTitle>Files</SemiTitle>
            <GridContainer>
              {files?.map((data) => (
                <FileShowContainer title={data} />
              ))}
            </GridContainer>
          </Margin>
        </FileContent>
      </Container>
    </>
  );
};

export default FolderView;

const Container = styled.div`
  flex-grow: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 15px 30px;
`;

const Title = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  padding-bottom: 13px;

  svg {
    margin-left: 10px;
    color: #5f6368;
  }

  span {
    font-family: Google Sans, Roboto, RobotoDraft, Helvetica, Arial, sans-serif;
    font-weight: 400;
    font-size: 18px;
    color: #202124;
  }
`;

const FileContent = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  overflow-y: scroll;
  flex-grow: 1;
  max-height: 100vh;
  margin-bottom: 30px;

  ::-webkit-scrollbar {
    width: 15px;
  }

  ::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 20px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    transition: all 200ms ease-out;
    max-height: 100px;

    :hover {
      background-color: rgba(0, 0, 0, 0.3);
    }
  }
`;

const SemiTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  text-transform: capitalize;
  color: #5f6368;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 20px 0;
`;

const Margin = styled.div``;
