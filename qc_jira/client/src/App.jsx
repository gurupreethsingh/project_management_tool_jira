import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Homepage from "./pages/common_pages/Homepage";

import Login from "./pages/common_pages/Login";
import Register from "./pages/common_pages/Register";
import Dashboard from "./pages/common_pages/Dashboard";
import PageNotFound from "./pages/common_pages/PageNotFound";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/common_pages/Profile";
import UpdateProfile from "./pages/common_pages/UpdateProfile";
import AllUsers from "./pages/admin_pages/AllUsers";
// contact pages
import ContactUs from "./pages/contact_pages/ContactUs";
import AllMessages from "./pages/contact_pages/AllMessages";
import AllReplies from "./pages/contact_pages/AllReplies";
import ReplyMessage from "./pages/contact_pages/ReplyMessage";
// common pages
import PrivacyPolicy from "./pages/common_pages/PrivacyPolicy";
import AboutUs from "./pages/common_pages/AboutUs";
import Careers from "./pages/common_pages/Careers";
import NewsLetter from "./components/NewsLetter";
import WorkWithUs from "./components/WorkWithUs";
import Projects from "./pages/common_pages/Projects";
import ExploreSolutions from "./pages/common_pages/ExploreSolutions";
import WebApps from "./pages/common_pages/WebApps";
import Blockchain from "./pages/common_pages/Blockchain";
import QaAutomation from "./pages/common_pages/QaAutomation";
import AiSystems from "./pages/common_pages/AiSystems";

// header and footer.
import Header from "./components/Header";
import Footer from "./components/Footer";

// blog pages.
import AllBlogs from "./pages/blog_pages/AllBlogs";
import AddBlog from "./pages/blog_pages/AddBlog";
import SingleBlog from "./pages/blog_pages/SingleBlog";
// subscription pages.
import Subscriptions from "./pages/subscription_pages/Subscriptions";
// super admin pages
import SuperAdminDashboard from "./pages/superadmin_pages/SuperAdminDashboard";
// admin pages
import AdminDashboard from "./pages/admin_pages/AdminDashboard";
// qa lead pages
import QaDashboard from "./pages/tester_dashboard/QaDashboard";
// test engineer pages.
import TestEngineerDashboard from "./pages/tester_dashboard/TestEngineerDashboard";
// developer pages.
import DeveloperDashboard from "./pages/developer_pages/DeveloperDashboard";
// project pages.
import CreateProject from "./pages/project_pages/CreateProject";
import AllProjects from "./pages/project_pages/AllProjects";
import SingleProject from "./pages/project_pages/SingleProject";
// scenario pages.
import AddScenario from "./pages/scenario_pages/AddScenario";
import AllScenarios from "./pages/scenario_pages/AllScenarios";
import SingleScenario from "./pages/scenario_pages/SingleScenario";
// admin pages.
import AllAdmins from "./pages/admin_pages/AllAdmins";
// developer pages.
import AllDevelopers from "./pages/developer_pages/AllDevelopers";
// test engineer pages.
import AllTestEngineers from "./pages/tester_dashboard/AllTestEngineers";
// test case pages
import AddTestCase from "./pages/tester_dashboard/AddTestCase";
import AllTestCases from "./pages/tester_dashboard/AllTestCases";
import SingleTestCase from "./pages/tester_dashboard/SingleTestCase";
import TestCaseDetail from "./pages/tester_dashboard/TestCaseDetail";
import TestCaseDashboard from "./pages/tester_dashboard/TestCaseDashboard";
import TraceabilityMatrix from "./pages/tester_dashboard/TraceabilityMatrix";
// task pages.
import AssignTask from "./pages/task_pages/AssignTask";
import ViewAllTasks from "./pages/task_pages/ViewAllTasks";
import ViewAssignedTasks from "./pages/task_pages/ViewAssignedTasks";
import TaskHistory from "./pages/task_pages/TaskHistory";
// defect pages.
import AddDefect from "./pages/defect_report_pages/AddDefect";
import AllDefects from "./pages/defect_report_pages/AllDefects";
import SingleDefect from "./pages/defect_report_pages/SingleDefect";
import AssignDefect from "./pages/developer_pages/AssignDefect";
import DeveloperAssignedDefects from "./pages/developer_pages/DeveloperAssignedDefects";
import BugHistory from "./pages/defect_report_pages/BugHistory";
// project pages.
import AllAssignedProjects from "./pages/project_pages/AllAssignedProjects";
import ProjectManagerDashboard from "./pages/project_manager_pages/ProjectManagerDashboard";
import DeveloperLeadDashboard from "./pages/developer_pages/DeveloperLeadDashboard";
import CreateRequirement from "./pages/requirement_pages/CreateRequirement";
// event pages
import CreateEvent from "./pages/event_pages/CreateEvent";
import UserEvents from "./pages/event_pages/UserEvents";
import AllEvents from "./pages/event_pages/AllEvents";
import SingleEvent from "./pages/event_pages/SingleEvent";
import SingleUserEvent from "./pages/event_pages/SingleUserEvent";
import UpdateEvent from "./pages/event_pages/UpdateEvent";
// attendance pages
import GetAllAttendance from "./pages/attendence_pages/GetAllAttendance";
import CreateAttendance from "./pages/attendence_pages/CreateAttendance";
import SingleAttendance from "./pages/attendence_pages/SingleAttendance";
import EditAttendance from "./pages/attendence_pages/EditAttendance";
// notification pages
import CreateNotification from "./pages/notification_pages/CreateNotification";
import AllNotifications from "./pages/notification_pages/AllNotifications";
import UserNotifications from "./pages/notification_pages/UserNotifications";
import UserNotificationDetail from "./pages/notification_pages/UserNotificationDetail";
// requirement pages.
import AllRequirements from "./pages/requirement_pages/AllRequirements";
import SingleModuleRequirements from "./pages/requirement_pages/SingleModuleRequirements";
import SingleRequirement from "./pages/requirement_pages/SingleRequirement";
import UpdateRequirement from "./pages/requirement_pages/UpdateRequirement";
import TopArrow from "./components/common_components/TopArrow";
import SingleUser from "./pages/user_pages/SingleUser";
import UpdateBlog from "./pages/blog_pages/UpdateBlog";
import Breadcrumb from "./components/common_components/Breadcrumb";

/** Match the “PageTitle” pattern from your sample */
/** Layout wrapper: sets <title> and shows Breadcrumb for this page */
const PageTitle = ({ title, children }) => {
  useEffect(() => {
    document.title = title ? `${title} | ECODERS` : "ECODERS";
  }, [title]);

  return (
    <>
      {/* Breadcrumb bar (shared across all routes that use PageTitle) */}
      <div className="bg-slate-50">
        <div className="mx-auto container px-4 sm:px-6 lg:px-8">
          <Breadcrumb pageTitle={title} />
        </div>
      </div>

      {/* Actual page content */}
      {children}
    </>
  );
};

function HeaderSpacer() {
  return <div className="h-16 md:h-20" />;
}

function App() {
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  return (
    <Router>
      <Header />
      <HeaderSpacer />
      <Routes>
        <Route
          path="/"
          element={
            <PageTitle title="Home">
              <Homepage />
            </PageTitle>
          }
        />
        <Route
          path="/home"
          element={
            <PageTitle title="Home">
              <Homepage />
            </PageTitle>
          }
        />
        <Route
          path="/homepage"
          element={
            <PageTitle title="Home">
              <Homepage />
            </PageTitle>
          }
        />

        <Route
          path="/projects"
          element={
            <PageTitle title="Projects">
              <Projects />
            </PageTitle>
          }
        />

        <Route
          path="/explore-solutions"
          element={
            <PageTitle title="Explore Solutions">
              <ExploreSolutions />
            </PageTitle>
          }
        />

        <Route
          path="/ai-systems"
          element={
            <PageTitle title="AI Systems">
              <AiSystems />
            </PageTitle>
          }
        />

        <Route
          path="/blockchain"
          element={
            <PageTitle title="Blockchain">
              <Blockchain />
            </PageTitle>
          }
        />

        <Route
          path="/web-apps"
          element={
            <PageTitle title="Web & Mobile Apps">
              <WebApps />
            </PageTitle>
          }
        />

        <Route
          path="/qa-automation"
          element={
            <PageTitle title="QA Automation">
              <QaAutomation />
            </PageTitle>
          }
        />

        <Route
          path="/login"
          element={
            <PageTitle title="Login">
              <Login />
            </PageTitle>
          }
        />
        <Route
          path="/register"
          element={
            <PageTitle title="Register">
              <Register />
            </PageTitle>
          }
        />

        <Route
          path="/contact"
          element={
            <PageTitle title="Contact Us">
              <ContactUs />
            </PageTitle>
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <PageTitle title="Privacy Policy">
              <PrivacyPolicy />
            </PageTitle>
          }
        />
        <Route
          path="/about-us"
          element={
            <PageTitle title="About Us">
              <AboutUs />
            </PageTitle>
          }
        />

        <Route
          path="/careers"
          element={
            <PageTitle title="Careers">
              <Careers />
            </PageTitle>
          }
        />

        <Route
          path="/all-blogs"
          element={
            <PageTitle title="All Blogs">
              <AllBlogs />
            </PageTitle>
          }
        />
        <Route
          path="/single-blog/:slug/:id"
          element={
            <PageTitle title="Single Blog">
              <SingleBlog />
            </PageTitle>
          }
        />
        <Route
          path="/add-blog"
          element={
            <PrivateRoute allowedRoles={["admin", "superadmin"]}>
              <PageTitle title="Add Blog">
                <AddBlog />
              </PageTitle>
            </PrivateRoute>
          }
        />

        <Route
          path="/update-blog/:slug/:id"
          element={
            <PageTitle title="Update Blog">
              <UpdateBlog />
            </PageTitle>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <PageTitle title="Dashboard">
                <Dashboard />
              </PageTitle>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <PrivateRoute>
              <PageTitle title="Profile">
                <Profile />
              </PageTitle>
            </PrivateRoute>
          }
        />
        <Route
          path="/update-profile/:id"
          element={
            <PrivateRoute>
              <PageTitle title="Update Profile">
                <UpdateProfile />
              </PageTitle>
            </PrivateRoute>
          }
        />

        <Route
          path="/all-users"
          element={
            <PrivateRoute allowedRoles={["admin", "superadmin"]}>
              <PageTitle title="All Users">
                <AllUsers />
              </PageTitle>
            </PrivateRoute>
          }
        />

        <Route
          path="/single-user/:id"
          element={
            <PrivateRoute allowedRoles={["admin", "superadmin"]}>
              <PageTitle title="Single User">
                <SingleUser />
              </PageTitle>
            </PrivateRoute>
          }
        />

        <Route
          path="/all-subscriptions"
          element={
            <PrivateRoute allowedRoles={["admin", "superadmin"]}>
              <PageTitle title="Subscriptions">
                <Subscriptions />
              </PageTitle>
            </PrivateRoute>
          }
        />

        <Route
          path="/super-admin-dashboard"
          element={
            <PrivateRoute allowedRoles={["superadmin"]}>
              <PageTitle title="Super Admin Dashboard">
                <SuperAdminDashboard />
              </PageTitle>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute allowedRoles={["admin", "superadmin"]}>
              <PageTitle title="Admin Dashboard">
                <AdminDashboard />
              </PageTitle>
            </PrivateRoute>
          }
        />
        <Route
          path="/qa-dashboard"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "project_manager",
              ]}
            >
              <PageTitle title="QA Dashboard">
                <QaDashboard />
              </PageTitle>
            </PrivateRoute>
          }
        />
        <Route
          path="/test-engineer-dashboard"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "project_manager",
              ]}
            >
              <PageTitle title="Test Engineer Dashboard">
                <TestEngineerDashboard />
              </PageTitle>
            </PrivateRoute>
          }
        />
        <Route
          path="/developer-dashboard"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <PageTitle title="Developer Dashboard">
                <DeveloperDashboard />
              </PageTitle>
            </PrivateRoute>
          }
        />

        <Route
          path="/create-project"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "developer_lead",
                "project_manager",
              ]}
            >
              <PageTitle title="Create Project">
                <CreateProject />
              </PageTitle>
            </PrivateRoute>
          }
        />
        <Route
          path="/all-projects"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <PageTitle title="All Projects">
                <AllProjects />
              </PageTitle>
            </PrivateRoute>
          }
        />
        <Route
          path="/single-project/:projectId"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <PageTitle title="Single Project">
                <SingleProject />
              </PageTitle>
            </PrivateRoute>
          }
        />

        <Route
          path="/single-project/:projectId/add-scenario"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <PageTitle title="Add Scenario">
                <AddScenario />
              </PageTitle>
            </PrivateRoute>
          }
        />
        <Route
          path="/single-project/:projectId/view-all-scenarios"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <PageTitle title="View Scenarios">
                <AllScenarios />
              </PageTitle>
            </PrivateRoute>
          }
        />
        <Route
          path="/single-project/:projectId/scenario-history/:scenarioId"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <PageTitle title="Scenario History">
                <SingleScenario />
              </PageTitle>
            </PrivateRoute>
          }
        />

        {/* add test case */}
        <Route
          path="/single-project/:projectId/scenario/:scenarioId/add-test-case"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <PageTitle title="Add Test Case">
                <AddTestCase />
              </PageTitle>
            </PrivateRoute>
          }
        />
        {/* all test cases for a project */}
        <Route
          path="/single-project/:projectId/all-test-cases"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <PageTitle title="All Test Cases">
                <AllTestCases />
              </PageTitle>
            </PrivateRoute>
          }
        />
        {/* get test case by id */}
        <Route
          path="/get-test-case/:id"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <PageTitle title="Single Test Case">
                <SingleTestCase />
              </PageTitle>
            </PrivateRoute>
          }
        />
        {/* test case detail (update) */}
        <Route
          path="/test-case-detail/:id"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <PageTitle title="Test Case Detail">
                <TestCaseDetail />
              </PageTitle>
            </PrivateRoute>
          }
        />
        {/* test case dashboard */}
        <Route
          path="/test-case-dashboard"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <PageTitle title="Test Case Dashboard">
                <TestCaseDashboard />
              </PageTitle>
            </PrivateRoute>
          }
        />
        {/* traceability matrix */}
        <Route
          path="/single-project/:projectId/traceability-matrix"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <PageTitle title="Traceability Matrix">
                <TraceabilityMatrix />
              </PageTitle>
            </PrivateRoute>
          }
        />

        {/* assign task */}
        <Route
          path="/projects/:projectId/assign-task"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "developer_lead",
                "project_manager",
              ]}
            >
              <PageTitle title="Assign Task">
                <AssignTask />
              </PageTitle>
            </PrivateRoute>
          }
        />
        {/* view all tasks in project */}
        <Route
          path="/single-project/:projectId/view-all-tasks"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <PageTitle title="All Tasks">
                <ViewAllTasks />
              </PageTitle>
            </PrivateRoute>
          }
        />

        {/* defects */}
        <Route
          path="/single-project/:projectId/add-defect"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <PageTitle title="Add Defect">
                <AddDefect />
              </PageTitle>
            </PrivateRoute>
          }
        />
        <Route
          path="/single-project/:projectId/all-defects"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <PageTitle title="All Defects">
                <AllDefects />
              </PageTitle>
            </PrivateRoute>
          }
        />
        <Route
          path="/single-project/:projectId/defect/:defectId"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <PageTitle title="Defect Details">
                <SingleDefect />
              </PageTitle>
            </PrivateRoute>
          }
        />
        <Route
          path="/bug-history/:defectId"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <PageTitle title="Bug History">
                <BugHistory />
              </PageTitle>
            </PrivateRoute>
          }
        />
        <Route
          path="/single-project/:projectId/assign-defect/:defectId"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "developer_lead",
                "project_manager",
              ]}
            >
              <PageTitle title="Assign Defect">
                <AssignDefect />
              </PageTitle>
            </PrivateRoute>
          }
        />
        <Route
          path="/single-project/:projectId/developer/:developerId/view-assigned-defects"
          element={
            <PrivateRoute
              allowedRoles={[
                "superadmin",
                "admin",
                "project_manager",
                "qa_lead",
                "developer_lead",
                "developer",
              ]}
            >
              <PageTitle title="Developer Assigned Defects">
                <DeveloperAssignedDefects />
              </PageTitle>
            </PrivateRoute>
          }
        />

        {/* assigned projects & tasks */}
        <Route
          path="/user-assigned-projects/:userId"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <PageTitle title="Assigned Projects">
                <AllAssignedProjects />
              </PageTitle>
            </PrivateRoute>
          }
        />
        <Route
          path="/single-project/:projectId/user-assigned-tasks/:userId"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "test_engineer",
                "developer",
                "developer_lead",
                "project_manager",
              ]}
            >
              <PageTitle title="Assigned Tasks">
                <ViewAssignedTasks />
              </PageTitle>
            </PrivateRoute>
          }
        />
        <Route
          path="/single-project/:projectId/single-task/:taskId"
          element={
            <PrivateRoute
              allowedRoles={[
                "superadmin",
                "admin",
                "project_manager",
                "qa_lead",
                "test_lead",
              ]}
            >
              <PageTitle title="Task History">
                <TaskHistory />
              </PageTitle>
            </PrivateRoute>
          }
        />

        {/* PM & Dev Lead Dashboards */}
        <Route
          path="/project-manager-dashboard"
          element={
            <PrivateRoute
              allowedRoles={["superadmin", "admin", "project_manager"]}
            >
              <PageTitle title="Project Manager Dashboard">
                <ProjectManagerDashboard />
              </PageTitle>
            </PrivateRoute>
          }
        />
        <Route
          path="/developer-lead-dashboard"
          element={
            <PrivateRoute
              allowedRoles={[
                "superadmin",
                "admin",
                "project_manager",
                "developer_lead",
              ]}
            >
              <PageTitle title="Developer Lead Dashboard">
                <DeveloperLeadDashboard />
              </PageTitle>
            </PrivateRoute>
          }
        />

        {/* requirements */}
        <Route
          path="/create-requirement/:projectId"
          element={
            <PrivateRoute
              allowedRoles={[
                "superadmin",
                "admin",
                "project_manager",
                "customer",
              ]}
            >
              <PageTitle title="Create Requirement">
                <CreateRequirement />
              </PageTitle>
            </PrivateRoute>
          }
        />
        <Route
          path="/all-requirements/:projectId"
          element={
            <PrivateRoute>
              <PageTitle title="All Requirements">
                <AllRequirements />
              </PageTitle>
            </PrivateRoute>
          }
        />
        <Route
          path="/all-requirements/:projectId/module/:moduleName"
          element={
            <PrivateRoute>
              <PageTitle title="Requirements by Module">
                <AllRequirements />
              </PageTitle>
            </PrivateRoute>
          }
        />

        <Route
          path="/module-requirements/:projectId/:moduleName"
          element={
            <PrivateRoute>
              <PageTitle title="Single Requirement">
                <SingleModuleRequirements />
              </PageTitle>
            </PrivateRoute>
          }
        />

        <Route
          path="/single-requirement/:id"
          element={
            <PrivateRoute>
              <PageTitle title="Single Requirement">
                <SingleRequirement />
              </PageTitle>
            </PrivateRoute>
          }
        />
        <Route
          path="/update-requirement/:id"
          element={
            <PrivateRoute
              allowedRoles={["superadmin", "admin", "project_manager"]}
            >
              <PageTitle title="Update Requirement">
                <UpdateRequirement />
              </PageTitle>
            </PrivateRoute>
          }
        />

        {/* events */}
        <Route
          path="/create-event"
          element={
            <PrivateRoute allowedRoles={["superadmin"]}>
              <PageTitle title="Create Event">
                <CreateEvent />
              </PageTitle>
            </PrivateRoute>
          }
        />

        <Route
          path="/all-events"
          element={
            <PrivateRoute allowedRoles={["superadmin"]}>
              <PageTitle title="All Events">
                <AllEvents />
              </PageTitle>
            </PrivateRoute>
          }
        />

        <Route
          path="/single-event/:id"
          element={
            <PrivateRoute allowedRoles={["superadmin"]}>
              <PageTitle title="Single Event">
                <SingleEvent />
              </PageTitle>
            </PrivateRoute>
          }
        />

        <Route
          path="/update-event/:id"
          element={
            <PrivateRoute allowedRoles={["superadmin"]}>
              <PageTitle title="Update Event">
                <UpdateEvent />
              </PageTitle>
            </PrivateRoute>
          }
        />

        <Route
          path="/user-events"
          element={
            <PrivateRoute>
              <PageTitle title="User Events">
                <UserEvents />
              </PageTitle>
            </PrivateRoute>
          }
        />

        <Route
          path="/single-user-event/:id"
          element={
            <PrivateRoute>
              <PageTitle title="Single User Event">
                <SingleUserEvent />
              </PageTitle>
            </PrivateRoute>
          }
        />

        {/* attendance */}
        <Route
          path="/create-attendance"
          element={
            <PrivateRoute>
              <PageTitle title="Create Attendance">
                <CreateAttendance />
              </PageTitle>
            </PrivateRoute>
          }
        />
        <Route
          path="/view-all-attendance"
          element={
            <PrivateRoute
              allowedRoles={["superadmin", "admin", "project_manager"]}
            >
              <PageTitle title="All Attendance">
                <GetAllAttendance />
              </PageTitle>
            </PrivateRoute>
          }
        />
        <Route
          path="/get-single-attendance/:id"
          element={
            <PrivateRoute
              allowedRoles={["superadmin", "admin", "project_manager"]}
            >
              <PageTitle title="Attendance">
                <SingleAttendance />
              </PageTitle>
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-attendance/:id"
          element={
            <PrivateRoute
              allowedRoles={["superadmin", "admin", "project_manager"]}
            >
              <PageTitle title="Edit Attendance">
                <EditAttendance />
              </PageTitle>
            </PrivateRoute>
          }
        />

        {/* notifications */}
        <Route
          path="/create-notification"
          element={
            <PrivateRoute
              allowedRoles={["superadmin", "admin", "project_manager"]}
            >
              <PageTitle title="Create Notification">
                <CreateNotification />
              </PageTitle>
            </PrivateRoute>
          }
        />
        <Route
          path="/all-notifications"
          element={
            <PrivateRoute>
              <PageTitle title="All Notifications">
                <AllNotifications />
              </PageTitle>
            </PrivateRoute>
          }
        />
        <Route
          path="/user-notifications"
          element={
            <PrivateRoute>
              <PageTitle title="My Notifications">
                <UserNotifications />
              </PageTitle>
            </PrivateRoute>
          }
        />
        <Route
          path="/user-notifications/:notificationId"
          element={
            <PrivateRoute>
              <PageTitle title="Notification">
                <UserNotificationDetail />
              </PageTitle>
            </PrivateRoute>
          }
        />

        {/* contact/messages */}
        <Route
          path="/all-messages"
          element={
            <PrivateRoute
              allowedRoles={["admin", "superadmin", "project_manager"]}
            >
              <PageTitle title="All Messages">
                <AllMessages />
              </PageTitle>
            </PrivateRoute>
          }
        />
        <Route
          path="/reply-message/:id"
          element={
            <PrivateRoute
              allowedRoles={[
                "admin",
                "superadmin",
                "qa_lead",
                "developer_lead",
                "project_manager",
              ]}
            >
              <PageTitle title="Reply Message">
                <ReplyMessage setUnreadMessagesCount={setUnreadMessagesCount} />
              </PageTitle>
            </PrivateRoute>
          }
        />
        <Route
          path="/all-replies"
          element={
            <PrivateRoute allowedRoles={["admin", "superadmin"]}>
              <PageTitle title="All Replies">
                <AllReplies />
              </PageTitle>
            </PrivateRoute>
          }
        />

        {/* 404s */}
        <Route
          path="/page-not-found"
          element={
            <PageTitle title="404 Not Found">
              <PageNotFound />
            </PageTitle>
          }
        />
        <Route
          path="/*"
          element={
            <PageTitle title="404 Not Found">
              <PageNotFound />
            </PageTitle>
          }
        />
      </Routes>

      {/* keep your existing sections under routes */}
      <WorkWithUs />
      <NewsLetter />
      <Footer />
      <TopArrow scrollTargetId="app-scroll" />
    </Router>
  );
}

export default App;
