// import React, { useState } from "react";
// import { analyzeEmployee } from "../api";
// import ResultCard from "./ResultCard";

// const EmployeeForm = () => {
//   const [formData, setFormData] = useState({});
//   const [result, setResult] = useState(null);

//   // const handleChange = (e) => {
//   //   setFormData({ ...formData, [e.target.name]: Number(e.target.value) });
//   // };
//   const handleChange = (e) => {
//   const { name, value } = e.target;

//   if (name === "JobRole") {
//     // keep JobRole as string
//     setFormData({ ...formData, [name]: value });
//   } else {
//     // convert other fields to numbers
//     setFormData({ ...formData, [name]: Number(value) });
//   }
// };

//   // const handleSubmit = async () => {
//   //   const res = await analyzeEmployee(formData);
//   //   setResult(res);
//   // };
//   const handleSubmit = async () => {
//   try {
//     const response = await analyzeEmployee(formData);

//     console.log("Backend Response:", response);

//     setResult(response);
//   } catch (error) {
//     console.error(error);
//   }
// };

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Analyze Employee</h2>

//       {[
//         "Age",
//         "MonthlyIncome",
//         "DailyRate",
//         "HourlyRate",
//         "MonthlyRate",
//         "JobLevel",
//         "YearsWithCurrManager",
//         "PercentSalaryHike",
//         "TrainingTimesLastYear",
//         "YearsSinceLastPromotion"
//       ].map((field) => (
//         <input
//           key={field}
//           type="number"
//           name={field}
//           placeholder={field}
//           onChange={handleChange}
//         />
//       ))}
//       <input
//         type="text"
//         name="JobRole"
//         placeholder="JobRole (e.g. Manager)"
//         onChange={handleChange}
//       />

//       <button onClick={handleSubmit}>Analyze</button>

//       {result && <ResultCard result={result} />}
//     </div>
//   );
// };

// export default EmployeeForm;



import React, { useState } from "react";
import { analyzeEmployee } from "../api";
import ResultCard from "./ResultCard";
import EmptyState from "./EmptyState";
import "./EmployeeForm.css";

const EmployeeForm = () => {
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "JobRole") {
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: Number(value) });
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await analyzeEmployee(formData);
      setResult(response);
    } catch (error) {
      console.error(error);
    }
  };

  const fields = [
    "Age",
    "MonthlyIncome",
    "DailyRate",
    "HourlyRate",
    "MonthlyRate",
    "JobLevel",
    "YearsWithCurrManager",
    "PercentSalaryHike",
    "TrainingTimesLastYear",
    "YearsSinceLastPromotion"
  ];

  return (
    <div className="main-layout">

      {/* <div className="sidebar">HR Dashboard</div> */}

      <div className="content">

        {/* LEFT SIDE → FORM */}
        <div className="form-section">
          <div className="glass-card">
            <h2 className="title">🚀 Employee Analyzer</h2>

            <div className="grid">
              {fields.map((field) => (
                <input
                  key={field}
                  type="number"
                  name={field}
                  placeholder={field}
                  onChange={handleChange}
                  className="input"
                />
              ))}

              <input
                type="text"
                name="JobRole"
                placeholder="JobRole (e.g. Manager)"
                onChange={handleChange}
                className="input"
              />
            </div>

            <button onClick={handleSubmit} className="btn">
              Analyze
            </button>
          </div>
        </div>

        {/* RIGHT SIDE → RESULT */}
        <div className="result-section">
          {result ? <ResultCard result={result} /> : <EmptyState />}
        </div>

      </div>
    </div>
  );
};

export default EmployeeForm;