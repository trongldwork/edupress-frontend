import styled from "@emotion/styled";

export const HeroBannerWrapper = styled.div`
  width: 100%;
  height: fit-content;
  position: relative;
`;

export const HeroBannerContent = styled.div`
  position: absolute;
  top: 50%;
  left: 32%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 400px;
`;

export const CategoriesWrapper = styled.div`
  width: 100%;
  margin-top: 30px;
`;

export const CategoryHeaderWrapper = styled.div`
  width: 100%;
  font-size: 32px;
  font-weight: 600;
  color: black;
`;

export const CoursesWrapper = styled.div`
  width: 100%;
  margin-top: 30px;
  padding-bottom: 30px;
`;

export const CoursesHeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;
