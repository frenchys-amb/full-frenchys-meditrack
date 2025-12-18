import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";

// Dashboard y demás
import Dashboard from "./components/Dashboard/Dashboard";
import SidebarTop from "./components/Dashboard/SidebarTop";
import AmbulanceList from "./components/Ambulance/AmbulanceList/AmbulanceList";
import StorageCheckList from "./components/Storage/StorageCheckList";
import MedicationExpensesPage from "./components/Medication/MedicationExpensesPage";
import AmbulanceCheckForm from "./components/Ambulance/AmbulanceCheckForm";
import MedicationExpensesForm from "./components/Medication/MedicationExpenseForm";
import TransferForm from "./components/Transfer/TransferForm";
import AmbulanceCheckList from "./components/Ambulance/AmbulanceCheck/AmbulanceChecksList";
import AmbulanceEquipment from "./components/Ambulance/AmbulanceEquipment";
import AmbulanceCurrentInventory from "./components/Ambulance/AmbulanceInventory/AmbulanceCurrentInventory";
import ActivityLog from "./components/ActivityLog/ActivityLog";
import QRList from "./pages/QRList";

// Auth
import Login from "./components/Auth/Login";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import RecommendedList from "./components/Recommended/RecommendedList";

// 🔹 Wrappers para pasar la unidad a los componentes
function AmbulanceEquipmentWrapper() {
  const { unit } = useParams();
  return <AmbulanceEquipment ambulance={unit} />;
}

function AmbulanceCheckListWrapper() {
  const { unit } = useParams();
  return <AmbulanceCheckList unit={unit} />;
}

function AmbulanceCurrentInventoryWrapper() {
  const { unit } = useParams();
  return <AmbulanceCurrentInventory unit={unit} />;
}

export default function App() {
  return (
    <div className="app-wrapper">

      <Router>
        <Routes>
          {/* 🔹 Login público */}
          <Route path="/login" element={<Login />} />

          {/* 🔹 Formularios públicos */}
          <Route path="/ambulance-check-form" element={<AmbulanceCheckForm />} />
          <Route path="/medications-form" element={<MedicationExpensesForm />} />
          <Route path="/transfer" element={<TransferForm />} />

          {/* 🔹 Todo lo demás requiere login */}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <SidebarTop />
                <div className="app-body">
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/ambulances" element={<AmbulanceList />} />
                    <Route path="/storage" element={<StorageCheckList />} />
                    <Route path="/medications" element={<MedicationExpensesPage />} />
                    <Route path="/activity-log" element={<ActivityLog />} />
                    <Route path="/qr-list" element={<QRList />} />
                    <Route path="/recomendations" element={<RecommendedList />} />

                    {/* Rutas con unidad */}
                    <Route path="/ambulances/:unit/checks" element={<AmbulanceCheckListWrapper />} />
                    <Route path="/ambulances/:unit/equipment" element={<AmbulanceEquipmentWrapper />} />
                    <Route path="/ambulances/:unit/current" element={<AmbulanceCurrentInventoryWrapper />} />
                  </Routes>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}
