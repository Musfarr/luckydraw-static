import CreateCampaign from "../pages/Camapign/CreateCampaign";
import CampaignReport from "../pages/Camapign/CampaignReport";
import SplashScreen from "../components/loader/SplashScreen/SplashScreen";
import Footer from "../components/common/Footer/Footer";
import NotFound from "../pages/404/NotFound";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Units from "../pages/Units/Units";
import SurveyCall from "../pages/SurveyCall/SurveyCall";
import AuditSurvey from "../pages/AuditSurvey/AuditSurvey";
import AdminHome from "../pages/AdminHome/AdminHome";
import AddUser from "../pages/AddUser/AddUser";
import AgentList from "../pages/AgentList/AgentList";
import AgentProfile from "../pages/AgentProfile/AgentProfile";
import CreateSurvey from "../pages/CreateSurvey/CreateSurvey";

export const publicRoutes = [
  {
    path: "/",
    component: <Login />,
  },
];
export const protectedRoutesWithoutSidebarLayout = [
  {
    path: "/welcome",
    component: <SplashScreen />,
  },
  {
    path: "*",
    component: <NotFound />,
  },
];
export const protectedRoutesWithSidebarLayout = [
  {
    path: "/dashboard",
    component: <Dashboard />,
    footer: <Footer extraPadding="70px" />,
    padding: true,
  },
  {
    path: "/survey-calls",
    component: <SurveyCall />,
    footer: <Footer extraPadding="70px" />,
    padding: true,
  },
  {
    path: "/audit-survey",
    component: <AuditSurvey />,
    footer: <Footer extraPadding="70px" />,
    padding: true,
  },
  {
    path: "/admin-home",
    component: <AdminHome />,
    footer: <Footer extraPadding="70px" />,
    padding: true,
    headerBtn: true,
  },
  {
    path: "/add-user",
    component: <AddUser />,
    footer: <Footer extraPadding="70px" />,
    padding: true,
    headerBtn: true,
  },
  {
    path: "/agent-list",
    component: <AgentList />,
    footer: <Footer extraPadding="70px" />,
    padding: true,
    headerBtn: true,
  },
  {
    path: "/agent-profile",
    component: <AgentProfile />,
    footer: <Footer extraPadding="70px" />,
    padding: true,
    headerBtn: true,
  },
  {
    path: "/create-survey",
    component: <CreateSurvey />,
    footer: <Footer extraPadding="70px" />,
    padding: true,
    headerBtn: true,
  },
];
