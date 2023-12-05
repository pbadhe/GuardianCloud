import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import styled from "styled-components";
import { useLocation } from "react-router-dom";

export const Layout = (props) => {
  const location = useLocation();
  return (
    <>
      <Header />
      <Container>
        {location.pathname !== "/" && location.pathname !== "/signup" && (
          <Sidebar />
        )}
        {[props.children]}
      </Container>
      ;
    </>
  );
};

const Container = styled.div`
  display: flex;
`;
