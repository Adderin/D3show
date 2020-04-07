import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
  display: block;
  flex-direction: column;
  position: relative;
`;

export const ControlsBlock = styled.div`
  grid-template-columns: 300px 80px 80px 80px 100px;
  display: grid;
  gap: 10px;
  margin-bottom: 20px;
  //position: absolute;
  top: 30px;
  left: 30px;
  background-color: rgba(255, 255, 255, 0.2);
`;

export const GraphWrapper = styled.div`
  position: relative;
  z-index: 2;
`;
