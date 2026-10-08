import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("loggedInUser") || "null"
  );

  function logout() {

    localStorage.removeItem("loggedInUser");

    navigate("/");
  }

  if (!user) {
    return null;
  }

  return (
    <nav className="navbar">

      <div className="brand">
        📚 Community Library
      </div>

      <div className="nav-links">

        {/* MEMBER NAVIGATION */}
        {user.role === "member" && (
          <>
            <Link to="/dashboard">
              Dashboard
            </Link>

            <Link to="/books">
              Books
            </Link>

            <Link to="/transactions">
              My Transactions
            </Link>
          </>
        )}

        {/* LIBRARIAN NAVIGATION */}
        {user.role === "librarian" && (
          <>
            <Link to="/dashboard">
              Dashboard
            </Link>

            <Link to="/books">
              Manage Books
            </Link>

            <Link to="/transactions">
              Transactions
            </Link>
          </>
        )}

        {/* ADMIN NAVIGATION */}
        {user.role === "admin" && (
          <>
            <Link to="/dashboard">
              Admin Dashboard
            </Link>

            <Link to="/users">
              Members
            </Link>

            <Link to="/transactions">
              Transactions
            </Link>
          </>
        )}

        <span className="user-info">
          {user.name}
        </span>

        <button
          onClick={logout}
          className="logout-button"
        >
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;