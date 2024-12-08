import { css } from "@emotion/react";
import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: fit-content;
  padding: 100px 0;
  background-color: #f9f9f9;
  color: black;
`;

export const PaymentBox = styled.div`
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 600px;
  text-align: center;
`;

export const PaymentMethodContainer = styled.div`
  margin: 20px 0;
`;

export const TransferDetails = styled.div`
  text-align: left;
  margin-top: 20px;

  img {
    margin: 30px 0;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
`;
