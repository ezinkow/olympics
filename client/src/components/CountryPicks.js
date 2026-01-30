import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import toast, { Toaster } from "react-hot-toast";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

const BUDGET_LIMIT = 150;

export default function CountryPicks({ authInfo }) {
  const [countries, setCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [name, setName] = useState(authInfo?.name || "SELECT YOUR NAME");
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(!!authInfo);
  const [names, setNames] = useState([]);
  const [sortBy, setSortBy] = useState("price");

  /* -------------------- DATA FETCH -------------------- */
  useEffect(() => {
    async function fetchCountries() {
      try {
        const res = await axios.get("/api/countrypools");
        setCountries(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCountries();
  }, []);

  useEffect(() => {
    async function fetchNames() {
      try {
        const res = await axios.get("/api/names");
        setNames(res.data.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (err) {
        console.error(err);
      }
    }
    fetchNames();
  }, []);

  /* -------------------- DERIVED -------------------- */
  const totalSpend = useMemo(() => {
    return selectedCountries.reduce(
      (sum, c) => sum + Number(c.price || 0),
      0
    );
  }, [selectedCountries]);

  const remainingBudget = BUDGET_LIMIT - totalSpend;

  const sortedCountries = useMemo(() => {
    const list = [...countries];

    switch (sortBy) {
      case "price":
        return list.sort(
          (a, b) => Number(b.price || 0) - Number(a.price || 0)
        );
      case "name":
      default:
        return list.sort((a, b) =>
          a.country_name.localeCompare(b.country_name)
        );
    }
  }, [countries, sortBy]);

  /* -------------------- HANDLERS -------------------- */
  const handleNameSelect = (event) => {
    setName(event);
    setAuthenticated(false);
    setPassword("");
    setSelectedCountries([]);
  };

  const handleVerifyPassword = async () => {
    if (!name || name === "SELECT YOUR NAME")
      return toast.error("Please select your name");
    if (!password) return toast.error("Please enter password");

    try {
      const res = await axios.post("/api/names/verify", { name, password });
      if (res.data.success) {
        setAuthenticated(true);
        toast.success("Password verified!");
      } else {
        toast.error("Incorrect password");
      }
    } catch {
      toast.error("Verification failed");
    }
  };

  const toggleCountry = (country) => {
    if (!authenticated) return;

    const isSelected = selectedCountries.some(
      (c) => c.country_name === country.country_name
    );

    if (isSelected) {
      setSelectedCountries((prev) =>
        prev.filter((c) => c.country_name !== country.country_name)
      );
      return;
    }

    if (totalSpend + Number(country.price || 0) > BUDGET_LIMIT) {
      toast.error(`Budget exceeded ($${BUDGET_LIMIT} max)`);
      return;
    }

    setSelectedCountries((prev) => [...prev, country]);
  };

  const handleClearSelections = () => {
    setSelectedCountries([]);
    toast("Selections cleared");
  };

  const handleSubmit = async () => {
    if (!authenticated) return toast.error("Verify password first");

    const payload = selectedCountries.map((c) => ({
      name,
      country_name: c.country_name,
      price: c.price,
    }));

    try {
      await axios.post("/api/olympic-rosters", payload);
      toast.success("Countries submitted!");
      setSelectedCountries([]);
      setAuthenticated(false);
      setPassword("");
      setName("SELECT YOUR NAME");
    } catch {
      toast.error("Submission failed");
    }
  };

  /* -------------------- RENDER -------------------- */
  return (
    <div
      style={{
        padding: "16px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <Toaster />

      {/* AUTH */}
      {!authenticated && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerifyPassword();
          }}
          style={{ display: "flex", gap: "8px", marginBottom: "16px" }}
        >
          <DropdownButton title={name} onSelect={handleNameSelect}>
            {names.map((n) => (
              <Dropdown.Item key={n.name} eventKey={n.name}>
                {n.name}
              </Dropdown.Item>
            ))}
          </DropdownButton>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit">Verify</Button>
        </form>
      )}

      {/* STICKY BUDGET + SORT */}
      {authenticated && (
        <div
          style={{
            position: "sticky",
            top: "60px", // below fixed navbar
            zIndex: 100,
            background: "#fff",
            padding: "12px",
            borderBottom: "1px solid #ddd",
            boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              marginBottom: "8px",
              padding: "8px",
              background: "#f9fafb",
              borderRadius: "6px",
              border: "1px solid #e5e7eb",
            }}
          >
            <strong>Budget:</strong>{" "}
            ${Math.round(totalSpend * 10) / 10} / ${BUDGET_LIMIT}
            <span
              style={{
                marginLeft: "8px",
                color: remainingBudget < 0 ? "red" : "green",
              }}
            >
              (${Math.round(remainingBudget * 10) / 10} remaining)
            </span>
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <strong>Sort:</strong>
            {["price", "name"].map((mode) => (
              <button
                key={mode}
                onClick={() => setSortBy(mode)}
                style={{
                  padding: "4px 8px",
                  borderRadius: "6px",
                  border:
                    sortBy === mode
                      ? "2px solid #4f46e5"
                      : "1px solid #ccc",
                  backgroundColor: sortBy === mode ? "#eef2ff" : "#fff",
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TWO COLUMN LAYOUT */}
      {authenticated && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 300px",
            gap: "16px",
            alignItems: "start",
          }}
        >
          {/* COUNTRY LIST */}
          <div style={{ border: "1px solid #ddd", borderRadius: "8px" }}>
            {sortedCountries.map((country) => {
              const isSelected = selectedCountries.some(
                (c) => c.country_name === country.country_name
              );

              const disabled =
                !isSelected &&
                Number(country.price || 0) > remainingBudget;

              return (
                <label
                  key={country.country_name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 12px",
                    borderBottom: "1px solid #eee",
                    background: isSelected ? "#e0e7ff" : "#fff",
                    cursor: disabled ? "not-allowed" : "pointer",
                    opacity: disabled ? 0.5 : 1,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={disabled}
                      onChange={() => toggleCountry(country)}
                    />
                    <strong>{country.country_name}</strong>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      fontSize: "14px",
                    }}
                  >
                    <span>🥇 {country.gold || 0}</span>
                    <span>🥈 {country.silver || 0}</span>
                    <span>🥉 {country.bronze || 0}</span>
                    <strong>
                      ${Math.round(Number(country.price || 0) * 10) / 10}
                    </strong>
                  </div>
                </label>
              );
            })}
          </div>

          {/* STICKY ROSTER */}
          <div
            style={{
              position: "sticky",
              top: "140px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "12px",
              background: "#fff",
              height: "fit-content",
            }}
          >
            <h3>Your Countries</h3>

            {selectedCountries.length === 0 ? (
              <p>No countries selected.</p>
            ) : (
              selectedCountries.map((c) => (
                <div key={c.country_name}>
                  {c.country_name} — $
                  {Math.round(Number(c.price || 0) * 10) / 10}
                </div>
              ))
            )}

            {selectedCountries.length > 0 && (
              <>
                <Button
                  variant="secondary"
                  onClick={handleClearSelections}
                  style={{ marginTop: "8px", width: "100%" }}
                >
                  Clear Selections
                </Button>

                <Button
                  onClick={handleSubmit}
                  style={{ marginTop: "8px", width: "100%" }}
                >
                  Submit Countries
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
