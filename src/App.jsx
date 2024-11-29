import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { routes } from "./routes";
import UserBasePage from "./pages/BasePage/UserBasePage";
import userServices from "./services/userServices";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./redux/userStore";
import { useEffect } from "react";
import { handleGetAccessToken } from "./services/axiosJWT";
import DashBoardLayout from "./components/Layouts/DashBoardLayout";

function App() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleGetUserProfile = async (accessToken) => {
    try {
      const data = await userServices.getUserProfile(accessToken);
      dispatch(setUser({ ...data, accessToken: accessToken }));
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    const accessToken = handleGetAccessToken();
    if (accessToken) {
      handleGetUserProfile(accessToken);
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {routes.map((route) => {
            const Page = route.page;
            if (!route.adminManage) {
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <UserBasePage>
                      <Page />
                    </UserBasePage>
                  }
                />
              );
            } else
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <DashBoardLayout>
                      <Page />
                    </DashBoardLayout>
                  }
                />
              );
          })}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
