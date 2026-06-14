import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const loginUser = async () => {
    const response = await fetch(
      "http://localhost:5001/api/users/login",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data =
      await response.json();

    if (data.success) {
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert("Login Successful");
      window.location.href = "/";
    } else {
      alert("Invalid Credentials");
    }
  };

return (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#111",
      color: "white",
    }}
  >
    <div
      style={{
        width: "400px",
        textAlign: "center",
      }}
    >
      <h1>🔐 Login</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "10px",
        }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "10px",
        }}
      />

      <button
        onClick={loginUser}
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: "green",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Login
      </button>

      <p style={{ marginTop: "15px" }}>
        New User?
        <Link to="/register"> Register Here</Link>
      </p>
    </div>
  </div>
);
}

export default Login;