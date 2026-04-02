import React, { useEffect, useState } from "react";

export default function Stats() {
  const [students, setStudents] = useState(0);
  const [tests, setTests] = useState(0);
  const [average, setAverage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStudents(prev => (prev < 1200 ? prev + 5 : prev));
      setTests(prev => (prev < 350 ? prev + 2 : prev));
      setAverage(prev => (prev < 7.5 ? +(prev + 0.1).toFixed(1) : prev));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="stats fade-in">
      <div className="stats-container">
        <div className="stat-card">
          <h2>{students}</h2>
          <p>Students Trained</p>
        </div>
        <div className="stat-card">
          <h2>{tests}</h2>
          <p>Tests Completed</p>
        </div>
        <div className="stat-card">
          <h2>{average}</h2>
          <p>Average Band</p>
        </div>
      </div>
    </section>
  );
}