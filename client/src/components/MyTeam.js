import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import toast, { Toaster } from "react-hot-toast";

export default function MyTeam() {
    const [names, setNames] = useState([]);
    const [name, setName] = useState("SELECT YOUR NAME");
    const [password, setPassword] = useState("");
    const [authenticated, setAuthenticated] = useState(false);
    const [team, setTeam] = useState([]);
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
        setTeam([]);
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
                fetchTeam();
            } else {
                toast.error("Incorrect password");
            }
        } catch {
            toast.error("Verification failed");
        }
    };

    // Fetch user's team
    const fetchTeam = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/olympicteams/getmyteam", {
                params: { name },
            });
            setTeam(res.data || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load team");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "16px", maxWidth: "800px", margin: "0 auto" }}>
            <Toaster />

            <h2 style={{ marginBottom: "16px" }}>📝 My Olympic Team</h2>

            {!authenticated && (
                <div className="team-auth-row">
                    <Dropdown onSelect={handleNameSelect}>
                        <Dropdown.Toggle className="team-dropdown-toggle">
                            {name}
                        </Dropdown.Toggle>

                        <Dropdown.Menu
                            popperConfig={{
                                strategy: "fixed",
                            }}
                        >
                            {names.map((n) => (
                                <Dropdown.Item key={n.name} eventKey={n.name}>
                                    {n.name}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="team-password"
                    />

                    <Button className="team-verify-btn" onClick={handleVerifyPassword}>
                        Verify
                    </Button>
                </div>
            )}

            {authenticated && (
                <div>
                    <h3>{name}'s Team</h3>
                    {loading && <p>Loading...</p>}

                    {!loading && team.length === 0 && <p>No countries selected yet.</p>}

                    {!loading &&
                        team.length > 0 &&
                        team.map((c, idx) => (
                            <div key={idx} style={{ padding: "4px 0" }}>
                                {c.country_name} - ${c.price}
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}
