import React, { useRef, useState } from "react";
import { AttachFile, Close } from "@mui/icons-material";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { selectFileBool, setBoolean } from "../features/Bool/boolSlice";
import { setDrive } from "../features/DriveState/DriveState";
import { selectUid } from "../features/user/userSlice";
import { useLocation } from "react-router-dom";

function FileModel() {
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const FileRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const location = useLocation();
  const File = useSelector(selectFileBool);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const uid = useSelector(selectUid);
  const currentURL = location.pathname;
  const modifiedurl = currentURL.replace("/drive", "");

  const Submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append(selectedFile.name, selectedFile);
      formData.append("filepath", modifiedurl + selectedFile.name);
      formData.append("username", uid);

      const response = await fetch(
        "https://guardiancloud-jt5nilkupq-uc.a.run.app/upload",
        {
          method: "POST",
          body: formData,
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
    setSelectedImage(null);
    setSelectedFile(null);
    dispatch(setBoolean({ photo: false }));
  };

  const SelectFiles = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
    const Reader = new FileReader();

    if (e.target.files[0]) {
      Reader.readAsDataURL(e.target.files[0]);

      Reader.onload = (Event) => {
        setSelectedImage(Event.target.result);
      };
    }
  };

  return (
    <Container show={File}>
      <CloseIcon>
        <Close onClick={() => dispatch(setBoolean({ file: false }))} />
      </CloseIcon>
      <Wrapper>
        <FileContainer>
          {selectedImage ? (
            <div className="fileshow" style={{ overflow: "hidden" }}>
              <pre>{selectedImage}</pre>
            </div>
          ) : (
            <PaperclipContainer>
              <AttachFile onClick={() => FileRef.current.click()} />
            </PaperclipContainer>
          )}
          <input type="file" hidden ref={FileRef} onChange={SelectFiles} />
        </FileContainer>
        {/* <TextContainer>
          <input
            type="text"
            placeholder="Enter file name"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </TextContainer> */}
        <ButtonContainer>
          <button onClick={Submit}>Submit</button>
        </ButtonContainer>
      </Wrapper>
    </Container>
  );
}

export default FileModel;

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
  transform: ${(props) => (props.show ? "translateY(0)" : "translateY(100%)")};
`;

const Wrapper = styled.form`
  height: 400px;
  width: 400px;
  background-color: white;
  border-radius: 20px;
  position: relative;
  z-index: 999;
`;

const FileContainer = styled.div`
  height: 50%;
  margin-bottom: 20px;
  width: 100%;
`;

const TextContainer = styled.div`
  border-bottom: 1px solid black;
  margin: 0 20px;
  margin-top: 27px;
  input {
    display: flex;
    border: none;
    font-size: 18px;
    text-transform: capitalize;
    width: 100%;
    border: none;
    :focus {
      outline: none;
    }
  }
`;

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 30px;
  right: 30px;
  button {
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    border: none;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 /0.05);
    background-color: #3b82f6;
    color: white;
    transition: all 200ms ease-out;

    :hover {
      transform: scale(1.001);
    }

    :active {
      transform: scale(1.009);
    }
  }
`;

const PaperclipContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  .MuiSvgIcon-root {
    width: 2.5rem !important;
    height: 2.5rem;
    color: rgba(0, 0, 0, 0.5);
    cursor: pointer;
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
