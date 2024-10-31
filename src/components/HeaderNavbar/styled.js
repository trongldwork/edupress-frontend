import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";

export const HeaderContentWrapper = styled.div`
  height: 72px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export const LogoWrapper = styled.div`
  height: fit-content;
  display: flex;
  align-items: center;
`;

export const NavListWrapper = styled.div`
  display: flex;
  height: 100%;
`;

export const NavBox = styled(NavLink)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 0 20px;
  text-decoration: none;
  &:hover{
    background-color: #F5F5F5;
    color: #FF782D;
  }
  &.active {
    background-color: #F5F5F5;
  }  
  `
  
  export const NavItem = styled(NavLink)`
  color: black;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  &:hover{
    color: #FF782D;
  }
  &.active {
    background-color: #F5F5F5;
    color: #FF782D;
  }
`;

export const AccountHeader = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`

