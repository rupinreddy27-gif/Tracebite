import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Batches from "./pages/Batches";
import NewBatch from "./pages/NewBatch";
import BatchDetail from "./pages/BatchDetail";
import SearchTrace from "./pages/SearchTrace";
import QATemplates from "./pages/QATemplates";
import Admin from "./pages/Admin";

function PrivateRoute({ children }) {
  const user = localStorage.getItem("loggedInUser");
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/dashboard" element={<PrivateRoute><Navbar /><Dashboard /></PrivateRoute>} />
        <Route path="/batches" element={<PrivateRoute><Navbar /><Batches /></PrivateRoute>} />
        <Route path="/batches/new" element={<PrivateRoute><Navbar /><NewBatch /></PrivateRoute>} />
        <Route path="/batches/:id" element={<PrivateRoute><Navbar /><BatchDetail /></PrivateRoute>} />
        <Route path="/search" element={<PrivateRoute><Navbar /><SearchTrace /></PrivateRoute>} />
        <Route path="/qa-templates" element={<PrivateRoute><Navbar /><QATemplates /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><Navbar /><Admin /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}