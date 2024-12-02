import Home from "../pages/HomePage/Home"
import SignIn from "../pages/Auth/SignIn"
import NotFoundPage from "../pages/NotFoundPage"
import CoursesPage from "../pages/CourseListPage/CoursesPage"
import SignUp from "../pages/Auth/SignUp"
import CourseDetailsPage from "../pages/CouseDetailsPage/CourseDetailsPage"
import ProfilePage from "../pages/ProfilePage/ProfilePage"
import MyCourses from "../pages/MyCourse/MyCourses"
import AdminHomePage from "../pages/Admin/AdminHomePage"
import ListCoursePage from "../pages/Admin/CourseManage/ListCoursePage"
import { Title } from "@mui/icons-material"
import ReviewCourseRegister from "../pages/Admin/ReviewCourseRegister/ReviewCourseRegister"
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
        path: '/courses',
        page: CoursesPage,
        adminManage: false
    },
    {
        path: '/course/:urlSlug',
        page: CourseDetailsPage,
        adminManage: false
    },
    {
        path: '/course/:urlSlug',
        page: CourseDetailsPage,
        adminManage: false
    },
    {
        path: '/user/profile',
        page: ProfilePage,
        adminManage: false
    },
    {
        path: '/my-courses',
        page: MyCourses,
        adminManage: false
    },
    { 
        path: '*',
        page: NotFoundPage,
        adminManage: false
    },
    { 
        path: '/admin/dashboard',
        page: AdminHomePage,
        showInDashBoardLayout: true,
        title: 'DashBoard',
        adminManage: true
    },
    { 
        path: '/admin/course-management',
        page: ListCoursePage,
        showInDashBoardLayout: true,
        title: 'Quản lý khoá học',
        adminManage: true
    },
    { 
        path: '/admin/review-course-register',
        page: ReviewCourseRegister,
        showInDashBoardLayout: true,
        title: 'Duyệt đăng ký khóa học',
        adminManage: true
    }
]