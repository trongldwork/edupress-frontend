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
import BlogPage from "../pages/BlogPage/BlogPage"
import { Title } from "@mui/icons-material"
import ReviewCourseRegister from "../pages/Admin/ReviewCourseRegister/ReviewCourseRegister"
import UserManagePage from "../pages/Admin/UserManage/UserManagePage"
import EditCourseDetails from "../pages/CourseEdit/EditCourseDetails"
import ForgotPassword from "../pages/ResetPassword/ForgotPassword"
import VerifyOTP from "../pages/ResetPassword/VerifyOTP"
import ResetPassword from "../pages/ResetPassword/ResetPassword"
import PaymentPage from "../pages/PaymentPage/PaymentPage"

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
        path: '/blog',
        page: BlogPage,
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
        path: '/payment',
        page: PaymentPage,
        adminManage: false
    },
    {
        path: '/course/:courseId/edit',
        page: EditCourseDetails,
        adminManage: false
    },
    { 
        path: '*',
        page: NotFoundPage,
        adminManage: false
    },
    { 
        path: '/account/recovery',
        page: ForgotPassword,
        adminManage: false
    },
    { 
        path: '/account/recovery/otp',
        page: VerifyOTP,
        adminManage: false
    },
    { 
        path: '/account/recovery/reset-password',
        page: ResetPassword,
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
    },
    {
        path: '/admin/user-management',
        page: UserManagePage,
        showInDashBoardLayout: true,
        title: 'Quản lý người dùng',
        adminManage: true
    }
]