import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // ✅ استوردنا التوستر
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import PrivateRoute from "./components/common/PrivateRoute";
import CustomerList from "./pages/Customers/CustomerList";
import UserList from "@/pages/Users/UserList";
import InquiryList from "./pages/Inquiry/InquiryList";
import "react-datepicker/dist/react-datepicker.css";
import RoleList from "@/pages/Roles/RoleList";
import MeasurementAssignmentRequests from "@/pages/measurement/MeasurementAssignmentRequests";
import MyMeasurements from "./pages/measurement/MyMeasurement";
import MeasurementApprovalList from "@/pages/measurement/MeasurementApprovalList";


export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* صفحات محمية داخل AppLayout */}
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />
            <Route path="/form-elements" element={<FormElements />} />
            <Route path="/basic-tables" element={<BasicTables />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/inquiries" element={<InquiryList />} />
            <Route path="/roles" element={<RoleList />} />
            <Route path="/measurement/assignment-requests" element={<MeasurementAssignmentRequests />} />
            <Route path="/measurement/my-measurements" element={<MyMeasurements />} />
            <Route path="/measurement/approvals" element={<MeasurementApprovalList />} />


          </Route>
        </Route>

        {/* صفحات عامة (خارج AppLayout) */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* 🔥 نضيف التوستر هون تحت كل الرواتر */}
      <Toaster position="top-right" />
    </Router>
  );
}
