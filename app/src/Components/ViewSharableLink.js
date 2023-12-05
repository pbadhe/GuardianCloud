import React, { useState } from "react";
import { selectViewLinkBool, setBoolean } from "../features/Bool/boolSlice";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Close } from "@mui/icons-material";

function ViewSharableLink() {
  const [sharableLink, setSharableLink] = useState(null);
  const [showLink, setShowLink] = useState(null);
  const [email, setEmail] = useState(null);
  const [error, setError] = useState(null);
  const [error1, setError1] = useState(null);
  const viewLinkBool = useSelector(selectViewLinkBool);
  const [enterOtp, setenterOtp] = useState(false);
  const [enteredOtp, setenteredOtp] = useState(null);

  const [receivedOtp, setreceivedOtp] = useState(null);
  const dispatch = useDispatch();

  const Submit = (e) => {
    e.preventDefault();
    if (enteredOtp === receivedOtp) {
      console.log("Showlink", showLink);
      const url = showLink;
      const newTab = window.open(url);
      newTab.document.title = "Shared File";
      dispatch(setBoolean({ viewLink: false }));
      setSharableLink("");
      setEmail("");
      setenteredOtp("");
      setError("");
    } else {
      console.log("Error");
      setError1("Entered OTP does not match try sending OTP again");
    }
  };

  const sendOTP = async (e) => {
    e.preventDefault();
    setenterOtp(true);
    console.log("Email", email);
    console.log("sharableLink", sharableLink);
    try {
      const response = await fetch(
        "https://guardiancloud-jt5nilkupq-uc.a.run.app/getfileaccess",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            useremail: email,
            shareable_url: sharableLink,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data.otp);
        setreceivedOtp(data.otp);

        setShowLink(data.temporary_signed_url);
      } else {
        const data = await response.json();
        setError(data.message);
        setSharableLink("");
        setEmail("");
        setenteredOtp("");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleclose = () => {
    dispatch(setBoolean({ viewLink: false }));
    setSharableLink("");
    setEmail("");
    setenteredOtp("");
    setError("");
  };

  return (
    <Container show={viewLinkBool}>
      <CloseIcon>
        <Close onClick={handleclose} />
      </CloseIcon>
      <Wrapper>
        <div>
          <div className="title">Please enter the below details</div>
          <TextContainer>
            <label class="labelClass">Shared Link:</label>
            <input
              type="text"
              placeholder="Enter shared Link"
              value={sharableLink}
              onChange={(e) => setSharableLink(e.target.value)}
            />
            <label class="labelClass">Email:</label>
            <input
              type="email"
              placeholder="Enter your email "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button class="sendOtp" onClick={sendOTP}>
              Send OTP
            </button>
            {enterOtp && (
              <div className="enter_otp">
                <label class="labelClass">Enter Received OTP:</label>
                <input
                  type="text"
                  placeholder="Enter the OTP received on Email"
                  value={enteredOtp}
                  onChange={(e) => setenteredOtp(e.target.value)}
                />
              </div>
            )}

            {error && <p className="error-message">{error}</p>}
            {error1 && <p className="error-message">{error1}</p>}
          </TextContainer>
        </div>

        <ButtonContainer>
          <button className="close" onClick={{ handleclose }}>
            Close
          </button>
          <button onClick={Submit}>Submit</button>
        </ButtonContainer>
      </Wrapper>
    </Container>
  );
}

export default ViewSharableLink;

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
  height: 500px;
  width: 450px;
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
  .enter_otp {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
  }
  .error-message {
    color: red;
    font-size: 14px;
    margin-top: 5px;
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
