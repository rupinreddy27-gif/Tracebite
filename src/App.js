import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Batches from "./pages/Batches";
import NewBatch from "./pages/NewBatch";
import BatchDetail from "./pages/BatchDetail";
import SearchTrace from "./pages/SearchTrace";
import QATemplates from "./pages/QATemplates";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/batches" element={<Batches />} />
        <Route path="/batches/new" element={<NewBatch />} />
        <Route path="/batches/:id" element={<BatchDetail />} />
        <Route path="/search" element={<SearchTrace />} />
        <Route path="/qa-templates" element={<QATemplates />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
