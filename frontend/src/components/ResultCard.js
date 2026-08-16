// import React from "react";
// import { Bar } from "react-chartjs-2";
// import FactorsChart from "./Factorschart";

// const ResultCard = ({ result }) => {

//   if (!result || !result.top_factors) {
//     return <p>No result available</p>;
//   }

//   const chartData = {
//     labels: Object.keys(result.top_factors),
//     datasets: [
//       {
//         label: "Feature Impact",
//         data: Object.values(result.top_factors)
//       }
//     ]
//   };

//   return (
//     <div style={{ marginTop: "20px" }}>
//       <h3>Prediction: {result.prediction}</h3>

//       <h4>Recommendations:</h4>

//       {result.recommendations && result.recommendations.length > 0 ? (
//         <ul>
//           {result.recommendations.map((rec, i) => (
//             <li key={i}>{rec}</li>
//           ))}
//         </ul>
//       ) : (
//         <p>No recommendations available</p>
//       )}

//       <h4>Top Feature Impacts</h4>

//       <FactorsChart factors={result.top_factors} />
//     </div>
//   );
// };

// export default ResultCard;

import React from "react";
import "./ResultCard.css";
import FactorsChart from "./Factorschart";

const ResultCard = ({ result }) => {

  // 🔊 Speak Recommendations
  const speakRecommendations = (recommendations) => {
    if (!recommendations || recommendations.length === 0) return;

    // Stop any ongoing speech (IMPORTANT)
    window.speechSynthesis.cancel();

    const text =
      "Here are the AI recommendations. " +
      recommendations.join(". ");

    const speech = new SpeechSynthesisUtterance(text);

    // Settings for better AI feel
    speech.rate = 0.9;
    speech.pitch = 1.1;
    speech.volume = 1;

    // Try to use better voice
    const voices = window.speechSynthesis.getVoices();

    // Filter only English voices
    const englishVoices = voices.filter(v => v.lang.startsWith("en"));

    // Prefer a good quality voice
    const selectedVoice =
      englishVoices.find(v => v.name.includes("Google")) ||
      englishVoices.find(v => v.name.includes("Microsoft")) ||
      englishVoices[1];

    if (selectedVoice) {
      speech.voice = selectedVoice;
    }
   
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="result-card">
      <h2 className="result-title">📊 AI Analysis Result</h2>

      {/* Prediction */}
      <div className="prediction">
        <h3>Prediction:</h3>
        <span className={`badge ${result.prediction.toLowerCase()}`}>
          {result.prediction}
        </span>
      </div>

      {/* Top Factors */}
      <div className="factors">
        <h3>Top Factors</h3>
        <ul>
          {Object.entries(result.top_factors).map(([key, value]) => (
            <li key={key}>
              <strong>{key}</strong>: {value.toFixed(3)}
            </li>
          ))}
        </ul>
      </div>

      {/* Recommendations */}
      <div className="recommendations">
        <h3>Recommendations</h3>
        <ul>
          {result.recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>

      {/* 🔊 Speak Button */}
      <button
        className="speak-btn"
        onClick={() => speakRecommendations(result.recommendations)}
      >
        🔊 Speak Recommendations
      </button>
      <h4>Top Feature Impacts</h4>

      <FactorsChart factors={result.top_factors} />
    </div>
  );
};

export default ResultCard;