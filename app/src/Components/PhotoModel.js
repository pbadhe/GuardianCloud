import React, { useRef, useState } from "react";
import { CameraAlt, Close } from "@mui/icons-material";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { selectPhotoBool, setBoolean } from "../features/Bool/boolSlice";

function PhotoModel() {
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const ImageRef = useRef(null);

  const Photo = useSelector(selectPhotoBool);

  const dispatch = useDispatch();

  const SelectImages = (e) => {
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
          <input type="file" hidden ref={ImageRef} onChange={SelectImages} />
        </ImageContainer>
        <TextContainer>
          <input
            type="text"
            placeholder="Enter photo Title"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </TextContainer>
        <ButtonContainer>
          <button>Submit</button>
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
