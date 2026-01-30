import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function Scoreboard() {
  const [users, setUsers] = useState([]);
  const scrollRef = useRef(null);
  const topScrollRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get("/api/scoreboard");
        setUsers(res.data || []);
      } catch (err) {
        console.error("Failed to load scoreboard:", err);
      }
    }
    load();
  }, []);

  /** Sync horizontal scroll */
  useEffect(() => {
    if (!scrollRef.current || !topScrollRef.current) return;

    const main = scrollRef.current;
    const top = topScrollRef.current;

    const syncFromMain = () => (top.scrollLeft = main.scrollLeft);
    const syncFromTop = () => (main.scrollLeft = top.scrollLeft);

    main.addEventListener("scroll", syncFromMain);
    top.addEventListener("scroll", syncFromTop);

    return () => {
      main.removeEventListener("scroll", syncFromMain);
      top.removeEventListener("scroll", syncFromTop);
    };
  }, []);

  const renderCountries = (countries) => {
    if (!countries) return null;
    const mid = Math.ceil(countries.length / 2);
    const col1 = countries.slice(0, mid);
    const col2 = countries.slice(mid);

    const renderCol = (col) =>
      col.map((c, i) => (
        <div key={i}>
          {c.country_name} — <strong>{c.points}</strong> pts — ${c.price}
        </div>
      ));

    return (
      <div
        style={{
          display: "flex",
          gap: "16px",
          maxHeight: "120px",
          overflowY: "auto",
        }}
      >
        <div style={{ flex: 1 }}>{renderCol(col1)}</div>
        <div style={{ flex: 1 }}>{renderCol(col2)}</div>
      </div>
    );
  };

  return (
    <div style={{ padding: "16px" }}>
      <h2 style={{ marginBottom: "12px" }}>🌍 Olympic Pool Scoreboard</h2>

      {/* Sticky top scrollbar */}
      <div
        ref={topScrollRef}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          overflowX: "auto",
          overflowY: "hidden",
          height: "14px",
          marginBottom: "10px",
        }}
      >
        <div style={{ width: `${users.length * 276}px`, height: "1px" }} />
      </div>

      {/* Main scroll container */}
      <div ref={scrollRef} style={{ overflowX: "auto" }}>
        <div style={{ display: "flex", gap: "16px" }}>
          {users.length === 0 && <div>No entries yet.</div>}

          {users.map((user, idx) => (
            <div
              key={user.name}
              style={{
                minWidth: "260px",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                background: "#f9fafb",
              }}
            >
              {/* Header */}
              <div
                style={{
                  position: "sticky",
                  top: 0,
                  background: "#fff",
                  borderBottom: "1px solid #e5e7eb",
                  padding: "10px",
                  textAlign: "center",
                  fontWeight: 600,
                  zIndex: 5,
                }}
              >
                {idx === 0 && "🥇 "}
                {idx === 1 && "🥈 "}
                {idx === 2 && "🥉 "}
                {user.name}
                <div style={{ fontSize: "13px", color: "#2563eb" }}>
                  Total: {user.total} pts — ${user.totalPrice || 0}
                </div>
              </div>

              {/* Countries */}
              <div style={{ padding: "10px" }}>{renderCountries(user.countries)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
