import Home from "../pages/HomePage/Home"
import SignIn from "../pages/Auth/SignIn"
import NotFoundPage from "../pages/NotFoundPage"
import SignUp from "../pages/Auth/SignUp"

export const routes = [
    {
        path: '/sign-in',
        page: SignIn,
        adminManage: false
    },
    {
        path: '/sign-up',
        page: SignUp,
        adminManage: false
    },
    {
        path: '/',
        page: Home,
        adminManage: false
    },
    { 
        path: '*',
        page: NotFoundPage
    }
]