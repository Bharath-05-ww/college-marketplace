import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, User, Mail, Lock } from "lucide-react";
import "../css/Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const registerUser = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "http://localhost:5000/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        alert(data.message || "Registration Failed");
        return;
      }

      alert("Registration Successful!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Registration Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-wrap">
            <UserPlus size={20} />
          </div>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join CampusCart to buy and sell college gear</p>
        </div>

        <form className="auth-form" onSubmit={registerUser}>
          <div className="auth-form-group">
            <label className="auth-label">Username</label>
            <div className="auth-input-wrapper">
              <User size={16} className="auth-input-icon" />
              <input
                type="text"
                className="auth-input"
                placeholder="e.g. jdoe23"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Email Address</label>
            <div className="auth-input-wrapper">
              <Mail size={16} className="auth-input-icon" />
              <input
                type="email"
                className="auth-input"
                placeholder="you@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrapper">
              <Lock size={16} className="auth-input-icon" />
              <input
                type="password"
                className="auth-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;