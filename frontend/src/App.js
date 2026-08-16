import React from "react";
import EmployeeForm from "./components/EmployeeForm";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <div style={{ display: "flex" }}>
      <Dashboard />
      <EmployeeForm />
    </div>
  );
}

export default App;