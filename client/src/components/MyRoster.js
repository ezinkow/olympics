import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import toast, { Toaster } from "react-hot-toast";

export default function MyRoster() {
  const [names, setNames] = useState([]);
  const [name, setName] = useState("SELECT YOUR NAME");
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all names for dropdown
  useEffect(() => {
    async function loadNames() {
      try {
        const res = await axios.get("/api/names");
        setNames(res.data.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (err) {
        console.error(err);
      }
    }
    loadNames();
  }, []);

  // Handle name selection
  const handleNameSelect = (selectedName) => {
    setName(selectedName);
    setAuthenticated(false);
    setPassword("");
    setRoster([]);
  };

  // Verify password
  const handleVerifyPassword = async () => {
    if (!name || name === "SELECT YOUR NAME") {
      return toast.error("Please select your name");
    }
    if (!password) return toast.error("Please enter password");

    try {
      const res = await axios.post("/api/names/verify", { name, password });
      if (res.data.success) {
        setAuthenticated(true);
        toast.success("Password verified!");
        fetchRoster();
      } else {
        toast.error("Incorrect password");
      }
    } catch {
      toast.error("Verification failed");
    }
  };

  // Fetch user's roster
  const fetchRoster = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/olympic-rosters/getmyroster", {
        params: { name },
      });
      setRoster(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load roster");
    } finally {
      setLoading(false);
    }
  };

  return (
    <table className="table-wrapper" style={{ padding: "16px", maxWidth: "800px", margin: "0 auto" }}>
      <Toaster />

      <h2 style={{ marginBottom: "16px" }}>📝 My Olympic Roster</h2>

      {!authenticated && (
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
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
            style={{ flex: 1, padding: "4px 6px", borderRadius: "6px", border: "1px solid #ccc" }}
          />

          <Button onClick={handleVerifyPassword}>Verify</Button>
        </div>
      )}

      {authenticated && (
        <div>
          <h3>{name}'s Roster</h3>
          {loading && <p>Loading...</p>}

          {!loading && roster.length === 0 && <p>No countries selected yet.</p>}

          {!loading &&
            roster.length > 0 &&
            roster.map((c, idx) => (
              <div key={idx} style={{ padding: "4px 0" }}>
                {c.country_name} - ${c.price}
              </div>
            ))}
        </div>
      )}
    </table>
  );
}
