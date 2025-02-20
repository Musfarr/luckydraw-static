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
    path: "/create-campaign",
    component: <CreateCampaign />,
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
    path: "/campaign-report/:id",
    component: <CampaignReport />,
    footer: <Footer extraPadding="70px" />,
    padding: true,
  },
  {
    path: "/Units",
    component: <Units />,
    footer: <Footer extraPadding="70px" />,
    padding: true,
  },
];
