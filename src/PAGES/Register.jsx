import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams
} from "react-router-dom";

function Register() {

  const { role } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    membershipId: ""
  });

  function handleChange(e) {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  }

  function handleRegister(e) {

    e.preventDefault();

    const users = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    const emailExists = users.some(
      (user) =>
        user.email.toLowerCase() ===
        form.email.toLowerCase()
    );

    if (emailExists) {

      alert("That email is already registered.");

      return;
    }

    const registrationTime =
      new Date().toLocaleString();

    const newUser = {

      id: Date.now(),

      name: form.name.trim(),

      email: form.email.trim(),

      password: form.password,

      membershipId:
        form.membershipId.trim(),

      role: role,

      registeredAt:
        registrationTime,

      lastLogin: "Never",

      borrowedBooks: []

    };

    users.push(newUser);

    localStorage.setItem(
      "users",
      JSON.stringify(users)
    );

    alert(
      `${role} account created successfully.`
    );

    navigate(`/login/${role}`);
  }

  const roleName =
    role.charAt(0).toUpperCase() +
    role.slice(1);

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="library-icon">
          📚
        </div>

        <h1>
          Create {roleName} Account
        </h1>

        <form onSubmit={handleRegister}>

          <label>Full Name</label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label>Email</label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <label>
            Membership ID
          </label>

          <input
            type="text"
            name="membershipId"
            value={form.membershipId}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="primary-button"
          >
            Create {roleName} Account
          </button>

        </form>

        <div className="auth-links">

          <Link to={`/login/${role}`}>
            Already have an account? Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Register;