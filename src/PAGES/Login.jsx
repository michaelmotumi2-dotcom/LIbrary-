import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams
} from "react-router-dom";

function Login() {

  const { role } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /*
    If no role is supplied,
    show the three different login choices.
  */

  if (!role) {

    return (
      <div className="home-page">

        <div className="home-card">

          <div className="library-icon">
            
          </div>

          <h1>Community Library</h1>

          <p className="home-subtitle">
            Choose your account type
          </p>

          <div className="role-buttons">

            <Link
              to="/login/member"
              className="role-card"
            >
              <span></span>
              <h2>Member Login</h2>
              <p>
                View and borrow books
              </p>
            </Link>

            <Link
              to="/login/librarian"
              className="role-card"
            >
              <span></span>
              <h2>Librarian Login</h2>
              <p>
                Add and manage books
              </p>
            </Link>

            <Link
              to="/login/admin"
              className="role-card"
            >
              <span></span>
              <h2>Admin Login</h2>
              <p>
                Manage members and records
              </p>
            </Link>

          </div>

        </div>

      </div>
    );
  }

  function handleLogin(e) {

    e.preventDefault();

    const users = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    const user = users.find(
      (u) =>
        u.email.toLowerCase() ===
          email.toLowerCase() &&
        u.password === password &&
        u.role === role
    );

    if (!user) {

      alert(
        `No ${role} account found with those login details.`
      );

      return;
    }

    const loginTime =
      new Date().toLocaleString();

    // Update last login
    const updatedUsers = users.map((u) => {

      if (u.id === user.id) {

        return {
          ...u,
          lastLogin: loginTime
        };

      }

      return u;

    });

    localStorage.setItem(
      "users",
      JSON.stringify(updatedUsers)
    );

    // Store currently logged-in user
    const loggedInUser = {
      ...user,
      lastLogin: loginTime
    };

    localStorage.setItem(
      "loggedInUser",
      JSON.stringify(loggedInUser)
    );

    navigate("/dashboard");
  }

  const roleName =
    role.charAt(0).toUpperCase() +
    role.slice(1);

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="library-icon">
          
        </div>

        <h1>
          {roleName} Login
        </h1>

        <p className="auth-description">
          Sign in as a {role}.
        </p>

        <form onSubmit={handleLogin}>

          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button
            type="submit"
            className="primary-button"
          >
            Login as {roleName}
          </button>

        </form>

        <div className="auth-links">

          <Link to="/">
            ← Back to account types
          </Link>

          <Link to={`/register/${role}`}>
            Create {roleName} Account
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;