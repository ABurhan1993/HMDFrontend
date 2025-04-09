import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [forecast, setForecast] = useState([]);
  
  useEffect(() => {
    axios.get("https://mhdbackend.onrender.com/weatherforecast")  // عوّض الرابط هنا بالـ Backend
      .then((response) => {
        setForecast(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  return (
    <div className="App">
      <h1>Weather Forecast</h1>
      <ul>
        {forecast.map((item, index) => (
          <li key={index}>
            {item.date}: {item.temperatureC}°C, {item.summary}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
