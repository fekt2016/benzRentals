import { Outlet } from "react-router-dom";
// import Header from "./Header";
// import Sidebar from "./Sidebar";
import { styled } from "styled-components";
import Header from "./Header";
import Footer from "../Layout/Footer";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: top;
`;
const Main = styled.div`
  margin-top: 4rem;
  padding: 1rem;
`;

export default function MainLayout() {
  return (
    <Container>
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </Container>
  );
}
