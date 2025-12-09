import { useState, useEffect } from "react";

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    if (darkMode) {
      document.body.style.backgroundColor = "#1f2937"; // dark bg
      document.body.style.color = "#f9fafb"; // light text
    } else {
      document.body.style.backgroundColor = "#f9fafb"; // light bg
      document.body.style.color = "#1f2937"; // dark text
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      style={{
        padding: "6px 12px",
        borderRadius: "6px",
        cursor: "pointer",
        backgroundColor: darkMode ? "#374151" : "#e5e7eb",
        color: darkMode ? "#fbbf24" : "#1f2937",
        border: "none",
      }}
    >
      {darkMode ? "Light Mode" : "Dark Mode"}
    </button>
  );
};

export default ThemeToggle;
