import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";
import AddCredential from "./pages/AddCredential";
import ViewCredentials from "./pages/ViewCredentials";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import EditCredential from "./pages/EditCredential";


function App() {

  return (

    <BrowserRouter>

      <Routes>

    
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
        

        <Route path="/dashboard" element={
        <ProtectedRoute>
        <Dashboard/>
        </ProtectedRoute>
         }/>
          
          <Route path="/add-credential" element={
          <ProtectedRoute>
          <AddCredential/>
          </ProtectedRoute>
}/>


           <Route path="/credentials" element={
           <ProtectedRoute>
           <ViewCredentials/>
           </ProtectedRoute>
}/>
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>
<Route
  path="/edit-credential/:id"
  element={
    <ProtectedRoute>
      <EditCredential/>
    </ProtectedRoute>
  }
/>

        <Route path="/forgot-password" element={<ForgotPassword/>}/>


        <Route path="/verify-otp" element={<VerifyOtp/>}/>


        <Route path="/reset-password" element={<ResetPassword/>}/>

      </Routes>

    </BrowserRouter>

  );
}

export default App;