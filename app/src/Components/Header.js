import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SearchIcon from "@mui/icons-material/Search";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import AppsIcon from "@mui/icons-material/Apps";
import { Avatar } from "@mui/material";
import "./Header.css";
import { useDispatch, useSelector } from "react-redux";
import { selectUid, setLogOut } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { setBoolean } from "../features/Bool/boolSlice";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const uid = useSelector(selectUid);
  const [name, setname] = useState(null);

  const handleLogoutClick = () => {
    dispatch(setLogOut({ uid: null }));
    navigate("/");
  };

  const handleLogoutClic = async () => {
    try {
      const response = await fetch(
        "https://guardiancloud-jt5nilkupq-uc.a.run.app/getuserdetails",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: uid,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setname(data.firstname);
      } else {
        console.log("In error");
        // Unsuccessful login, show error message
      }
    } catch (error) {
      console.log("In error");
      console.error("Error during login:", error);
    }
  };

  useEffect(() => {
    handleLogoutClic(); // Call handleLogoutClic when the component mounts
  });

  return (
    <Container>
      <Wrapper>
        <Logo>
          <img src="img/icon.png" alt="" />
          <span>Guardian-Cloud</span>
        </Logo>
        <InputContiner>
          <SearchContainer>
            <ButtonGroup>
              <SearchIcon></SearchIcon>
            </ButtonGroup>
            <input type="text" placeholder="Search in GuardianCloud" />
          </SearchContainer>
        </InputContiner>
        <RightContainer>
          <LeftSection>
            {/* <HelpOutlineIcon />
            <SettingsIcon /> */}
            <div
              className="viewlink"
              onClick={() => dispatch(setBoolean({ viewLink: true }))}>
              View Shared Link{" "}
            </div>
          </LeftSection>
          <RightSection>
            <div className="name_class">
              Welcome, <b>{name}!</b>
            </div>
            <div className="dropdown">
              <Avatar className=".dropbtn" />
              <div className="dropdown-content">
                <a onClick={handleLogoutClick}>Logout</a>
              </div>
            </div>
          </RightSection>
        </RightContainer>
      </Wrapper>
    </Container>
  );
}

export default Header;
const Container = styled.div`
  position: sticky;
  top: 0px;
  z-index: 999;
  background-color: #ffffff;
  padding: 2px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 20px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 40px;
    height: 40px;
  }

  span {
    font-family: "Product Sans", Arial, sans-serif;
    color: #5f6368;
    font-size: 22px;
    padding-left: 8px;
  }
`;

const InputContiner = styled.div`
  flex: 1;
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SearchContainer = styled.div`
  width: 64%;
  height: 50px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.09);
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 /0.05);

  svg {
    margin-left: 10px;
    color: #5f6368;
  }

  input {
    font-size: 16px;
    width: 90%;
    height: 80%;
    font-family: Sans, Roboto, RobotoDraft, Helvetica, Arial, sans-serif;
    margin: 0 auto;
    border: none;
    background-color: transparent;
    :focus {
      outline: none;
    }
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;

  svg {
    color: #5f6368;
    padding: 5px;
    cursor: pointer;
    border-radius: 50%;
    transition: all 200ms ease-out;
    :hover {
      background-color: rgba(0, 0, 0, 0.09);
    }
  }

  .app {
    margin-right: 15px;
  }
  .name_class {
    margin-right: 10px;
  }
`;

const LeftSection = styled(RightSection)`
  svg {
    margin: 0 10px;
  }
`;

const ButtonGroup = styled.div``;
