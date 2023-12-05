import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FileContainer from "./FileContainer";
import FileShowContainer from "./FileShowContainer";
import { useDispatch, useSelector } from "react-redux";
import { setBoolean } from "../features/Bool/boolSlice";
import { selectUid } from "../features/user/userSlice";
import { useLocation } from "react-router-dom";
import { selectDrive } from "../features/DriveState/DriveState";

function Drive() {
  const dispatch = useDispatch();
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const uid = useSelector(selectUid);
  const timestamp = useSelector(selectDrive);
  const [foldername, setfoldername] = useState(null);
  const location = useLocation();
  const currentURL = location.pathname.replace("/drive", "");

  useEffect(() => {
    fetchData();
  }, [timestamp]);

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
            filepath: currentURL,
          }),
        }
      );

      if (response.ok) {
        console.log("got files");
        const data = await response.json();

        setFolders(data.folders);
        setFiles(data.files);
      } else {
        console.log("not response okay");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const pathSegments = currentURL.split("/");
    const lastSegment = pathSegments.filter((segment) => segment !== "").pop();
    setfoldername(lastSegment);
  }, [uid, location]);

  return (
    <Container
      onClick={() => {
        dispatch(setBoolean({ modelBools: false }));
      }}>
      <Title>
        {foldername ? <span>{foldername}</span> : <span>My Guardian</span>}
        <ArrowDropDownIcon />
      </Title>
      <FileContent>
        {/* <SemiTitle>Suggested</SemiTitle>
        <GridContainer>
          {files?.map((data) => {
            return <FileList />;
          })}
        </GridContainer> */}
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
  );
}

export default Drive;

const Container = styled.div`
  flex-grow: 1;
  position: relative;
  display: flex;
  flex-direction: column;
`;
//padding: 15px 30px; in container before edit

const Title = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  padding-bottom: 13px;
  margin-top: 20px;

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
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin: 20px 0;
`;

const Margin = styled.div``;
