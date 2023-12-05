import React from "react";
import styled from "styled-components";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { selectUid } from "../features/user/userSlice";
import { useEffect, useRef, useState } from "react";
import { setDrive } from "../features/DriveState/DriveState";
import { setEnterEmail } from "../features/Bool/boolSlice";

function FileShowContainer({ title, id }) {
  const location = useLocation();
  const currenturl = location.pathname;
  const dispatch = useDispatch();
  const modifiedUrl = currenturl.replace("/drive", "");
  const uid = useSelector(selectUid);

  const [activeFile, setActiveFile] = useState(null);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    top: 0,
    left: 0,
  });

  const contextMenuRef = useRef(null);

  const CallUrl = async (e) => {
    try {
      const response = await fetch(
        "https://guardiancloud-jt5nilkupq-uc.a.run.app/download",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            request: "getfileurl",
            username: uid,
            filepath: modifiedUrl + { title }.title,
          }),
        }
      );

      if (response.ok) {
        console.log("got files");
        const data = await response.json();
        const jsonString = JSON.stringify(data, null, 2);
        const jsonData = JSON.parse(jsonString);

        const url = jsonData.fileurl;
        const newTab = window.open(url);

        // Optionally, set the new tab's title
        newTab.document.title = "JSON Data";
      } else {
        console.log("File not opened");
      }
    } catch (error) {
      console.error("File not opened exception", error);
    }
  };

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
    if (option === "Option 3") {
      console.log("option3 url:", modifiedUrl + { title }.title + "/");
      try {
        const response = await fetch(
          "https://guardiancloud-jt5nilkupq-uc.a.run.app/deletefile",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: uid,
              filepath: modifiedUrl + { title }.title,
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
    } else if (option === "Option 1") {
      //console.log("in otion 1");
      dispatch(
        setEnterEmail({
          enteremail: true,
          filepath: modifiedUrl + { title }.title,
        })
      );
    } else if (option === "Option 2") {
      console.log("Option 2");
      console.log("Uid", uid);
      console.log("url", modifiedUrl + { title }.title);
      try {
        const response = await fetch(
          "https://guardiancloud-jt5nilkupq-uc.a.run.app/revokefileaccess",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: uid,
              filepath: modifiedUrl + { title }.title,
            }),
          }
        );
        if (response.ok) {
          // Optionally, set the new tab's title
          dispatch(setDrive({ timestamp: new Date().getTime() }));
          const data = await response.json();
          alert(data.message);
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
      <Container onContextMenu={handleContextMenu} onClick={CallUrl}>
        <FileOpenIcon />
        <span>{title}</span>
      </Container>

      {contextMenuVisible && (
        <div
          className="custom-context-menu"
          style={{
            top: contextMenuPosition.top,
            left: contextMenuPosition.left,
          }}
          ref={contextMenuRef}>
          <div onClick={() => handleMenuItemClick("Option 1")}>Share</div>
          <div onClick={() => handleMenuItemClick("Option 2")}>Revoke</div>
          <div onClick={() => handleMenuItemClick("Option 3")}>Delete</div>
        </div>
      )}
    </div>
  );
}

export default FileShowContainer;

const Container = styled.div`
  width: fit-content;
  min-width: 200px;
  height: 48px;
  display: flex;
  align-items: center;
  border: 1px solid rgba(0, 0, 0, 0.35);
  border-radius: 4px;
  margin-bottom: 10px;
  cursor: pointer;

  svg {
    height: 24px;
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
