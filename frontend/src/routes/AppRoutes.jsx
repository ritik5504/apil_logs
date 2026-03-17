import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyEmail from "../pages/auth/VerifyRegister";
import LoginWithOtp from "../pages/auth/LoginWithOtp";
import VerifyLoginOtp from "../pages/auth/VerifyLoginOtp";

//project
import ProjectCreate from "../pages/project/Project.create";
import ProjectList from "../pages/project/Project.list";

//Event 
import ProjectIngest from "../pages/Event/Event.ingest";

import ProjectDetail from "../pages/project/ProjectDetail";


import Dashboard from "../pages/Dashboard";
import Landing from "../pages/Landing";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/login/otp" element={<LoginWithOtp />} />
      <Route path="/login/otp/verify" element={<VerifyLoginOtp />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>}/>
      <Route path="/create" element={ <ProtectedRoute> <ProjectCreate/> </ProtectedRoute> } />
      <Route path="/list" element={ <ProtectedRoute> <ProjectList/> </ProtectedRoute> } />
      <Route path="/projects/:projectId/ingest" element={<ProtectedRoute><ProjectIngest /></ProtectedRoute>} />
      <Route path="/project/:projectId" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>}

/>

      
    </Routes>
  );
};

export default AppRoutes;
