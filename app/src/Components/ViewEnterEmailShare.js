import React, { useState, useEffect } from "react";
import {
  selectEmailBool,
  selectFilepath,
  setBoolean,
  setEnterEmail,
} from "../features/Bool/boolSlice";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Close, FileCopy } from "@mui/icons-material";
import { selectUid } from "../features/user/userSlice";

function ViewEnterEmailShare() {
  const [email, setEmail] = useState(null);
  const [shareableUrl, setShareableUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const emailbool = useSelector(selectEmailBool);
  const dispatch = useDispatch();
  const filepath = useSelector(selectFilepath);
  const uid = useSelector(selectUid);

  const Submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    console.log("Email is:", email);
    console.log("owner is", uid);
    console.log("filepath", filepath);

    try {
      const response = await fetch(
        "https://guardiancloud-jt5nilkupq-uc.a.run.app/share",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            useremail: email,
            owner: uid,
            filepath: filepath,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setShareableUrl(data.shareable_url);
      } else {
        console.log("Not able to delete the folder");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
    setLoading(false);
  };

  const handleCopyToClipboard = () => {
    // Copy shareableUrl to clipboard logic here
    navigator.clipboard.writeText(shareableUrl);
    // You may want to provide some feedback to the user that the URL is copied.
    // For example, show a tooltip or update the state to display a message.
  };
  const handleclose = () => {
    dispatch(setEnterEmail(false));
    setEmail("");
    setShareableUrl(null);
  };

  console.log("emailbool", emailbool);
  return (
    <Container show={emailbool}>
      <CloseIcon>
        <Close onClick={handleclose} />
      </CloseIcon>
      <Wrapper>
        <div>
          <div className="title">Please enter Email to Share</div>
          <TextContainer>
            <label class="labelClass">Email address:</label>
            <input
              type="text"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </TextContainer>
        </div>
        <ButtonContainer>
          <button className="close" onClick={{ handleclose }}>
            Close
          </button>
          <button onClick={Submit}>{loading ? "Sharing" : "Share"}</button>
        </ButtonContainer>

        {shareableUrl && (
          <div className="url_parent">
            <label className="label_share">Shareable Url:</label>
            <div className="url-container">
              <input
                type="text"
                className="shareable_url"
                value={shareableUrl}
                readOnly
              />
              <FileCopy className="icon" onClick={handleCopyToClipboard} />
            </div>
          </div>
        )}
      </Wrapper>
    </Container>
  );
}

export default ViewEnterEmailShare;

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
  height: 320px;
  width: 300px;
  background-color: white;
  border-radius: 20px;
  position: relative;
  z-index: 999;
  .title {
    font-size: 22px;
    font-weight: bold;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-top: 20px;
  }
  .sendOtp {
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
  .shareable_url {
    font-family: "Roboto", sans-serif;
    font-size: 14px;
    font-weight: bold;
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 4px;
    flex-grow: 1; /* Allow the input to grow and take available space */
    margin-right: 5px; /* Add some spacing between the input and the icon */
  }
  .url_parent {
    margin: 20px;
  }
  .label_share {
    font-size: 14px;
    font-weight: bold;
  }
  .url-container {
    display: flex;
    align-items: center;
    margin-top: 5px;
  }
  .icon {
    cursor: pointer;
    width: 24px;
    height: 24px;
    color: #4caf50; /* You can adjust the color as needed */
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 20px;
  margin-top: 27px;
  input {
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  .labelClass {
    font-family: "Roboto", sans-serif;
    font-size: 14px;
    font-weight: bold;
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
  .close {
    background-color: #c70039 !important;
    color: #060606;
    margin-right: 10px !important;
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

const CopyButton = styled.button`
  margin-top: 10px;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 /0.05);
  background-color: #4caf50; // You can adjust the color as needed
  color: white;
  display: flex;
  align-items: center;

  svg {
    margin-right: 8px;
  }

  :hover {
    background-color: #45a049; // Adjust the hover color
  }

  :active {
    transform: scale(1.1);
  }
`;
