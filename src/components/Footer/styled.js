/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

export const ColumnStyle = css`
  margin-bottom: 20px;
`;

export const TitleStyle = css`
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
  margin: 0;
  font-size: 28px;
`;

export const LinkStyle = css`
  color: #333;
  text-decoration: none;
  transition: color 0.3s ease, text-decoration 0.3s ease;
  cursor: pointer;
  &:hover {
    color: #FF782D;
  }
`;

export const IconButtonStyle = css`
  color: #333;
  margin-right: 8px;
  &:hover {
    color: #FF782D;
  }
`;
