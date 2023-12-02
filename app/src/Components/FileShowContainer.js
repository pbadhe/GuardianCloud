import React from "react";
import styled from "styled-components";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { selectUid } from "../features/user/userSlice";

function FileShowContainer({ title, id }) {
  const location = useLocation();
  const currenturl = location.pathname;

  const modifiedUrl = currenturl.replace("/drive", "");
  const uid = useSelector(selectUid);

  const CallUrl = async (e) => {
    console.log(currenturl);
    console.log(modifiedUrl);
    console.log("Title", { title });
    console.log(uid);
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
            filepath: modifiedUrl + "/" + { title }.title,
          }),
        }
      );
      console.log(response);

      if (response.ok) {
        console.log("got files");
        const data = await response.json();
        const jsonString = JSON.stringify(data, null, 2);
        console.log(jsonString);
        const jsonData = JSON.parse(jsonString);

        const url = jsonData.fileurl;
        console.log(url);
        const newTab = window.open(url);

        // Optionally, set the new tab's title
        newTab.document.title = "JSON Data";
      } else {
        console.log("not response okay");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  return (
    <Container onClick={CallUrl}>
      <FileOpenIcon />
      <span>{title}</span>
    </Container>
  );
}

export default FileShowContainer;

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
