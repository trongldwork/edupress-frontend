import styled from "@emotion/styled";
import BasePadding from "../../components/BasePadding/BasePadding";
import { Tab } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";

export const BreadcrumbWrapper = styled.div`
  padding: 12px 20%;
  background-color: #f5f5f5;
`;

export const HeroBannerWrapper = styled.div`
  background-color: black;
  padding: 40px 20%;
  display: flex;
  justify-content: space-between;
`;

export const CoureInfoWrapper = styled.div`
  width: 100%;
`;
export const InfoWrapper = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const SubInfoWrapper = styled.div`
  display: flex;
  gap: 25px;
  flex-wrap: wrap;
`;

export const SubInfo = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  width: fit-content;
`;

export const CategoryName = styled.div`
  color: white;
  border: none;
  border-radius: 10px;
  padding: 8px 12px;
  background-color: #555555;
  width: fit-content;
  font-weight: 500;
`;

export const CourseRegisterCard = styled.div`
  width: 35%;
  border-radius: 20px;
  border: 1px solid #EAEAEA;
  z-index: 100;
  background-color: white;
  overflow: hidden;

  img {
    width: 100%;
  }
`;

export const TabMenu = styled(Tab)({
  flex: 1,
  '&.Mui-selected': {
    color: 'primary',
    backgroundColor: '#EAEAEA',
  },
  '&:hover': {
    backgroundColor: '#f4f4f4',
    color: 'black',
    border: 'none'
  },
});


export const TabPanelItem = styled(TabPanel)`
  padding: 30px;
  background-color: #F5F5F5;
`
export const TabPanelContentWrapper = styled.div`
  background-color: #F5F5F5;
`

export const VideosInLessonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`
export const VideoInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 10px;
  justify-content: space-between;
`

export const VideoTitleWrapper = styled.div`
  color: black;
  display: flex;
  align-items: center;
`

export const ReviewsWrapper = styled.div`
  padding: 10px 15px;
`
export const ReviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 10px 0px;
  border-top: 1px solid #EAEAEA;
  width: 100%;
  .review {
    color : #555555;
  }
  .time {
    color: #555555;
  }
`

export const HeaderReviewWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;

  .name-wrapper{
    .user-name{
      color: black;
      font-weight: bold;
    }
    display: flex;
    align-items: center;
  }

`

