import { Link } from "react-router-dom";

function Dashboard() {

  const user = JSON.parse(
    localStorage.getItem("loggedInUser")
  );

  const books = JSON.parse(
    localStorage.getItem("books") || "[]"
  );

  const users = JSON.parse(
    localStorage.getItem("users") || "[]"
  );

  const transactions = JSON.parse(
    localStorage.getItem("transactions") || "[]"
  );

  const totalCopies = books.reduce(
    (sum, book) =>
      sum + Number(book.total),
    0
  );

  const availableCopies = books.reduce(
    (sum, book) =>
      sum + Number(book.available),
    0
  );

  /* ================= MEMBER ================= */

  if (user.role === "member") {

    const myBorrowedBooks =
      user.borrowedBooks || [];

    return (
      <div className="page-container">

        <h1>
          Welcome, {user.name}
        </h1>

        <p className="role-title">
          Member Dashboard
        </p>

        <div className="dashboard-grid">

          <div className="stat-card">
            <span></span>
            <h3>Total Books</h3>
            <strong>{totalCopies}</strong>
          </div>

          <div className="stat-card">
            <span></span>
            <h3>Available Books</h3>
            <strong>{availableCopies}</strong>
          </div>

          <div className="stat-card">
            <span></span>
            <h3>My Borrowed Books</h3>
            <strong>
              {myBorrowedBooks.length}
            </strong>
          </div>

        </div>

        <div className="dashboard-actions">

          <Link
            to="/books"
            className="action-button"
          >
            View Books & Borrow
          </Link>

          <Link
            to="/transactions"
            className="action-button"
          >
            My Transactions
          </Link>

        </div>

      </div>
    );
  }

  /* ================= LIBRARIAN ================= */

  if (user.role === "librarian") {

    return (
      <div className="page-container">

        <h1>
          Welcome, {user.name}
        </h1>

        <p className="role-title">
          Librarian Dashboard
        </p>

        <div className="dashboard-grid">

          <div className="stat-card">
            <span></span>
            <h3>Book Titles</h3>
            <strong>
              {books.length}
            </strong>
          </div>

          <div className="stat-card">
            <span></span>
            <h3>Total Copies</h3>
            <strong>
              {totalCopies}
            </strong>
          </div>

          <div className="stat-card">
            <span></span>
            <h3>Available Copies</h3>
            <strong>
              {availableCopies}
            </strong>
          </div>

        </div>

        <div className="dashboard-actions">

          <Link
            to="/books"
            className="action-button"
          >
            Manage Books
          </Link>

          <Link
            to="/transactions"
            className="action-button"
          >
            View Transactions
          </Link>

        </div>

      </div>
    );
  }

  /* ================= ADMIN ================= */

  if (user.role === "admin") {

    const members = users.filter(
      (u) => u.role === "member"
    );

    return (
      <div className="page-container">

        <h1>
          Welcome, {user.name}
        </h1>

        <p className="role-title">
          Administrator Dashboard
        </p>

        <div className="dashboard-grid">

          <div className="stat-card">
            <span></span>
            <h3>Total Members</h3>
            <strong>
              {members.length}
            </strong>
          </div>

          <div className="stat-card">
            <span></span>
            <h3>Total Book Copies</h3>
            <strong>
              {totalCopies}
            </strong>
          </div>

          <div className="stat-card">
            <span></span>
            <h3>Total Transactions</h3>
            <strong>
              {transactions.length}
            </strong>
          </div>

        </div>

        <div className="dashboard-actions">

          <Link
            to="/users"
            className="action-button"
          >
            Manage Members
          </Link>

          <Link
            to="/transactions"
            className="action-button"
          >
            View All Transactions
          </Link>

        </div>

      </div>
    );
  }

  return null;
}

export default Dashboard;