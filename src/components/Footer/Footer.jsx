import React from "react";
import { Box, Typography, Link, IconButton, Grid2 } from "@mui/material";
import { Facebook, Pinterest, YouTube } from "@mui/icons-material";
import { ColumnStyle, TitleStyle, LinkStyle, IconButtonStyle } from "./styled";
import { css } from "@emotion/react";
import logo from "../../assets/logo.svg";
import BasePadding from "../BasePadding/BasePadding";

const Footer = () => {
  return (
    <BasePadding paddingLeftRightPercent={20} backgroundColor="#F5F5F5">
      <Grid2 container justifyContent="space-between" paddingTop="50px">
        <Grid2 item size={4} xs={12} md={3} css={ColumnStyle}>
          <div
            css={css`
              display: flex;
              align-items: center;
              margin-bottom: 10px;
            `}
          >
            <img
              src={logo}
              css={css`
                width: 39.3px;
                position: relative;
                height: 24px;
                overflow: hidden;
                flex-shrink: 0;
              `}
            />
            <div css={TitleStyle}>
              EduPress
            </div>
          </div>
          <Typography variant="body2" css={{ color: "#666" }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Typography>
        </Grid2>
        <Grid2 item xs={6} md={2} css={ColumnStyle}>
          <Typography variant="h6" css={TitleStyle}>
            Get Help
          </Typography>
          <Link to="#" css={LinkStyle}>
            Contact Us
          </Link>
          <br />
          <Link to="#" css={LinkStyle}>
            Latest Articles
          </Link>
          <br />
          <Link to="#" css={LinkStyle}>
            FAQ
          </Link>
        </Grid2>
        <Grid2 item xs={6} md={2} css={ColumnStyle}>
          <Typography variant="h6" css={TitleStyle}>
            Programs
          </Typography>
          <Link to="#" css={LinkStyle}>
            Art & Design
          </Link>
          <br />
          <Link to="#" css={LinkStyle}>
            Business
          </Link>
          <br />
          <Link to="#" css={LinkStyle}>
            IT & Software
          </Link>
          <br />
          <Link to="#" css={LinkStyle}>
            Languages
          </Link>
          <br />
          <Link to="#" css={LinkStyle}>
            Programming
          </Link>
        </Grid2>
        <Grid2 item size={3} xs={12} md={3} css={ColumnStyle}>
          <Typography variant="h6" css={TitleStyle}>
            Contact Us
          </Typography>
          <Typography variant="body2" css={{ color: "#666" }}>
            Address: 2321 New Design Str, Lorem Ipsum10, Hudson Yards, USA
            <br />
            <br />
            Tel: +1 (123) 2500-567-8988
            <br />
            Mail: supportlms@gmail.com
          </Typography>
          <Box mt={2}>
            <IconButton to="#" css={IconButtonStyle}>
              <Facebook />
            </IconButton>
            <IconButton to="#" css={IconButtonStyle}>
              <Pinterest />
            </IconButton>
            <IconButton to="#" css={IconButtonStyle}>
              <YouTube />
            </IconButton>
          </Box>
        </Grid2>
      </Grid2>
      <hr style={{opacity: '0.2'}}/>
      <Box textAlign="center" mt={4} sx={{paddingBottom: '20px'}}>
        <Typography variant="body2" css={{ color: "#666" }}>
          Copyright © 2024 LearnPress LMS | Powered by ThimPress
        </Typography>
      </Box>
    </BasePadding>
  );
};

export default Footer;
