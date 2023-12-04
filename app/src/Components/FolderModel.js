import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { selectFolderBool, setBoolean } from "../features/Bool/boolSlice";
import { useLocation } from "react-router-dom";
import { selectUid } from "../features/user/userSlice";
import { setDrive } from "../features/DriveState/DriveState";

function FolderModel() {
  const folderBool = useSelector(selectFolderBool);
  const dispatch = useDispatch();
  const [folderNames, setFolderNames] = useState("");
  const [loading, setLoading] = useState(false);
  const uid = useSelector(selectUid);
  const location = useLocation();
  const currenturl = location.pathname;

  const modifiedUrl = currenturl.replace("/drive", "");

  const Submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    if (folderNames.length < 1) return;
    try {
      console.log(modifiedUrl + folderNames);
      const response = await fetch(
        "https://guardiancloud-jt5nilkupq-uc.a.run.app/createfolder",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: uid,
            filepath: modifiedUrl + folderNames,
          }),
        }
      );
      if (response.ok) {
        dispatch(setDrive({ timestamp: new Date().getTime() }));
        console.log("folder created");
      } else {
        console.log("not created");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
    setLoading(false);
    dispatch(setBoolean({ folderBool: false }));
    setFolderNames("");
  };
  return (
    <Container folder={folderBool}>
      <div></div>
      <Wrapper onSubmit={Submit}>
        <Title>New Folder</Title>
        <InputContainer>
          <input
            type="text"
            value={folderNames}
            onChange={(e) => setFolderNames(e.target.value)}
            placeholder="create Folder"
          />
        </InputContainer>
        <Button>
          <button onClick={() => dispatch(setBoolean({ folderBool: false }))}>
            Cancel
          </button>
          <button className="create" disabled={loading} onClick={Submit}>
            {loading ? "Creating" : "CreateFolder"}
          </button>
        </Button>
      </Wrapper>
    </Container>
  );
}

export default FolderModel;

const Container = styled.div`
  z-index: 9999;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 200ms ease-out;
  transform: ${(props) =>
    props.folder ? "translateY(0)" : "translateY(100%)"};
`;

const Wrapper = styled.div`
  width: 500px;
  height: 130px;
  background-color: white;
  border-radius: 20px;
  position: relative;
`;

const Title = styled.span`
  font-size: 20px;
  margin: 20px;
  margin-top: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  margin: 20px;
  input {
    border: none;
    flex: 1;
    :focus {
      outline: none;
    }
  }
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
`;

const Button = styled.div`
  position: absolute;
  bottom: 5px;
  right: 10px;
  display: flex;
  align-items: center;

  button {
    padding: 10px 20px;
    border-radius: 4px;
    font-weight: 500;
    background-color: #ef4444;
    border: none;
    color: white;
    margin: 0 15px;
    cursor: pointer;
  }

  .create {
    background-color: #3b82f6;
  }
`;
const CloseIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;

  svg {
    cursor: pointer;
    width: 2rem;
    height: 2rem;
    color: white;
  }
`;
