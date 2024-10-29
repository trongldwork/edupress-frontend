import React from "react";
import { css } from "@emotion/react";
import BasePadding from "../BasePadding/BasePadding";
import logo from "../../assets/logo.svg";
import {
  AccountHeader,
  HeaderContentWrapper,
  LogoWrapper,
  NavBox,
  NavItem,
  NavListWrapper,
} from "./styled";
import { } from "@mui/material";
import { useSelector } from "react-redux";
import AccountMenu from "../AccountMenu/AccountMenu";

function UserHeader() {
  const user = useSelector((state) => state.user);

  return (
    <>
      <BasePadding paddingLeftRightPercent={20} backgroundColor="white">
        <HeaderContentWrapper>
          <LogoWrapper>
            <img
              src={logo}
              css={css`
                width: 39.3px;
                position: relative;
                height: 30px;
                overflow: hidden;
                flex-shrink: 0;
              `}
            />
            <span
              css={css`
                font-size: 28px;
                font-weight: bold;
                color: black;
              `}
            >
              EduPress
            </span>
          </LogoWrapper>

          <NavListWrapper>
            <NavBox to="/">
              <NavItem to="/">Home</NavItem>
            </NavBox>
            <NavBox to="/courses">
              <NavItem to="/courses">Courses</NavItem>
            </NavBox>
            <NavBox to="/blog">
              <NavItem to="/blog">Blog</NavItem>
            </NavBox>
            <NavBox to="/page">
              <NavItem to="/page">Page</NavItem>
            </NavBox>
          </NavListWrapper>

          {user?.accessToken ? (
            <AccountHeader>
              <AccountMenu user={user} />
            </AccountHeader>
          ) : (
            <AccountHeader>
              <NavBox to="/sign-in">
                <NavItem to="/sign-in">Sign In</NavItem>
              </NavBox>
              <NavBox to="/sign-up">
                <NavItem to="/sign-up">Sign Up</NavItem>
              </NavBox>
            </AccountHeader>
          )}
        </HeaderContentWrapper>
      </BasePadding>
    </>
  );
}

export default UserHeader;
