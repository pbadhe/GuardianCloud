import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Folder } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import "./FileContainer.css";
import { useDispatch, useSelector } from "react-redux";
import { selectUid } from "../features/user/userSlice";
import { setDrive } from "../features/DriveState/DriveState";

function FileContainer({ title }) {
  const location = useLocation();
  const currenturl = location.pathname;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const uid = useSelector(selectUid);
  const modifiedUrl = currenturl.replace("/drive", "");

  const [activeFile, setActiveFile] = useState(null);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    top: 0,
    left: 0,
  });

  const contextMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(e.target)
      ) {
        // Clicked outside the context menu, close it
        setContextMenuVisible(false);
        setActiveFile(null);
      }
    };

    const handleScroll = () => {
      // Scrolled, close the context menu
      setContextMenuVisible(false);
      setActiveFile(null);
    };

    // Add event listeners when the component mounts
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("scroll", handleScroll);

    // Remove event listeners when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleContextMenu = (e) => {
    e.preventDefault();

    if (activeFile) {
      setActiveFile(null);
      setContextMenuVisible(false);
    }

    // Calculate the position for the context menu
    const position = {
      top: e.clientY + "px",
      left: e.clientX + "px",
    };

    // Set the position and make the context menu visible
    setContextMenuPosition(position);
    setContextMenuVisible(true);

    setActiveFile(title);
  };

  const handleMenuItemClick = async (option) => {
    if (option == "Option 3") {
      console.log("option3 url:", modifiedUrl + { title }.title + "/");
      try {
        const response = await fetch(
          "https://guardiancloud-jt5nilkupq-uc.a.run.app/deletefolder",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: uid,
              filepath: modifiedUrl + { title }.title + "/",
            }),
          }
        );
        if (response.ok) {
          // Optionally, set the new tab's title
          dispatch(setDrive({ timestamp: new Date().getTime() }));
        } else {
          console.log("Not able to delete the folder");
        }
      } catch (error) {
        console.error("Error during login:", error);
      }
    }

    // Close the context menu
    setContextMenuVisible(false);
    setActiveFile(null);
  };

  return (
    <div>
      <Container
        onContextMenu={handleContextMenu}
        onClick={() => {
          navigate(currenturl + title + "/");
        }}>
        <ClickableContent>
          <Folder />
          <span>{title}</span>
        </ClickableContent>
      </Container>

      {contextMenuVisible && (
        <div
          className="custom-context-menu"
          style={{
            top: contextMenuPosition.top,
            left: contextMenuPosition.left,
          }}
          ref={contextMenuRef}>
          <div onClick={() => handleMenuItemClick("Option 1")}>Secure</div>
          <div onClick={() => handleMenuItemClick("Option 2")}>Update</div>
          <div onClick={() => handleMenuItemClick("Option 3")}>Delete</div>
        </div>
      )}
    </div>
  );
}

export default FileContainer;

const Container = styled.div`
  width: fit-content;
  min-width: 200px;
  height: 48px;
  display: flex;
  align-items: center;
  border: 1px solid rgba(0, 0, 0, 0.35);
  border-radius: 4px;
  margin-bottom: 10px;

  svg {
    height: 28px;
    width: 24px;
    color: rgba(95, 99, 104);
    margin-left: 4px;
  }

  span {
    font-size: 13px;
    margin-left: 10px;
    text-transform: capitalize;
  }
`;

const ClickableContent = styled.div`
  /* Your styles for the clickable content */
  cursor: pointer;
  display: flex;
  align-items: center;
`;
