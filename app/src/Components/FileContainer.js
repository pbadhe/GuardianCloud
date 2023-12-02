import React, { useState } from "react";
import styled from "styled-components";
import { Folder } from "@mui/icons-material";
import FolderView from "./Folder_show";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function FileContainer({ title }) {
  const [isFolderViewOpen, setIsFolderViewOpen] = useState(false);
  const location = useLocation();
  const currenturl = location.pathname;
  const navigate = useNavigate();

  const handleClick = () => {
    setIsFolderViewOpen(true);
  };

  const handleCloseFolderView = () => {
    setIsFolderViewOpen(false);
  };

  return (
    <Container>
      <ClickableContent
        onContextMenu={() => {
          alert("right click");
        }}
        onClick={() => {
          navigate(currenturl + title + "/");
        }}>
        <Folder />
        <span>{title}</span>
      </ClickableContent>

      {isFolderViewOpen && (
        <FolderViewContainer>
          <FolderView folderName={title} />
          <CloseButton onClick={handleCloseFolderView}>Close</CloseButton>
        </FolderViewContainer>
      )}
    </Container>
  );
}

export default FileContainer;

const Container = styled.div`
  width: 287.5px;
  height: 48px;
  display: flex;
  align-items: center;
  border: 1px solid rgba(0, 0, 0, 0.35);
  border-radius: 4px;

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

const ClickableContent = styled.div`
  /* Your styles for the clickable content */
  cursor: pointer;
`;

const FolderViewContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CloseButton = styled.button`
  /* Your styles for the close button */
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;
