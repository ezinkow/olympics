import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

export default function CountryPoolsTable() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios.get("/api/medaltable").then((res) => {
      setCountries(res.data);
    });
  }, []);

  // Sort by total score descending
  const sortedCountries = useMemo(() => {
    return [...countries].sort(
      (a, b) => Number(b.score || 0) - Number(a.score || 0)
    );
  }, [countries]);

  return (
    <div style={{ padding: "16px" }}>
      <h2 style={{ marginBottom: "16px" }}>
        🌍 Medal Table
      </h2>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "700px",
          }}
        >
          <thead>
            <tr style={{ background: "#0f766e", color: "#fff" }}>
              <th style={thStyle}>Rank</th>
              <th style={thStyle}>Country</th>
              <th style={thStyle}>🥇 Gold</th>
              <th style={thStyle}>🥈 Silver</th>
              <th style={thStyle}>🥉 Bronze</th>
              <th style={thStyle}>Score</th>
            </tr>
          </thead>

          <tbody>
            {sortedCountries.map((c, idx) => (
              <tr
                key={c.id || idx}
                style={{
                  background: idx % 2 === 0 ? "#f9fafb" : "#ffffff",
                }}
              >
                <td style={tdStyle}>
                  {idx === 0 && "🥇 "}
                  {idx === 1 && "🥈 "}
                  {idx === 2 && "🥉 "}
                  {idx + 1}
                </td>

                <td style={{ ...tdStyle, fontWeight: 600 }}>
                  {c.country_name}
                </td>

                <td style={tdStyle}>{c.gold || 0}</td>
                <td style={tdStyle}>{c.silver || 0}</td>
                <td style={tdStyle}>{c.bronze || 0}</td>

                <td style={{ ...tdStyle, fontWeight: 700 }}>
                  {c.score || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* -------------------- STYLES -------------------- */
const thStyle = {
  padding: "8px",
  textAlign: "left",
  borderBottom: "2px solid #e5e7eb",
};

const tdStyle = {
  padding: "8px",
  borderBottom: "1px solid #e5e7eb",
};
