import axios from "axios";

export const analyzeEmployee = async (data) => {
  const response = await axios.post(
    "http://127.0.0.1:8000/analyze",
    data
  );
  return response.data;
};