import React, { useRef, useState } from "react";
import { CameraAlt, Close } from "@mui/icons-material";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { selectPhotoBool, setBoolean } from "../features/Bool/boolSlice";
import { selectUid } from "../features/user/userSlice";
import { setDrive } from "../features/DriveState/DriveState";
import { useLocation } from "react-router-dom";

function PhotoModel() {
  const [selectedFile, setSelectedFile] = useState(null);
  const ImageRef = useRef(null);
  const uid = useSelector(selectUid);
  const location = useLocation();
  const [selectedImage, setSelectedImage] = useState(null);

  const Photo = useSelector(selectPhotoBool);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
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

      console.log("uid", uid);
      console.log("filepath:", modifiedurl + selectedFile.name);
      console.log("formdata", formData);
      console.log("name", selectedFile.name);

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

    setSelectedFile(null);
    setSelectedImage(null);
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
    <Container show={Photo}>
      <CloseIcon>
        <Close onClick={() => dispatch(setBoolean({ photo: false }))} />
      </CloseIcon>
      <Wrapper>
        <ImageContainer>
          {selectedImage ? (
            <img src={selectedImage} alt="" />
          ) : (
            <CameraContainer>
              <CameraAlt onClick={() => ImageRef.current.click()} />
            </CameraContainer>
          )}
          <input type="file" hidden ref={ImageRef} onChange={SelectFiles} />
        </ImageContainer>
        {/* <TextContainer>
          <input
            type="text"
            placeholder="Enter photo Title"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </TextContainer> */}
        <ButtonContainer>
          <button onClick={Submit} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </ButtonContainer>
      </Wrapper>
    </Container>
  );
}

export default PhotoModel;

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

const ImageContainer = styled.div`
  height: 50%;
  margin-bottom: 20px;
  width: 100%;
  img {
    width: 100%;
    height: 100%;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
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

const CameraContainer = styled.div`
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
