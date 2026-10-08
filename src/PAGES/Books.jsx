
import { useEffect, useState } from "react";

function Books() {

  const user = JSON.parse(
    localStorage.getItem("loggedInUser")
  );

  const [books, setBooks] = useState([]);

  const [title, setTitle] = useState("");

  const [copies, setCopies] =
    useState(1);

  useEffect(() => {

    const storedBooks = JSON.parse(
      localStorage.getItem("books") || "[]"
    );

    setBooks(storedBooks);

  }, []);

  function saveBooks(updatedBooks) {

    localStorage.setItem(
      "books",
      JSON.stringify(updatedBooks)
    );

    setBooks(updatedBooks);
  }

  function addTransaction(
    type,
    book,
    quantity
  ) {

    const transactions =
      JSON.parse(
        localStorage.getItem(
          "transactions"
        ) || "[]"
      );

    const transaction = {

      id: Date.now(),

      type: type,

      bookId: book.id,

      bookTitle: book.title,

      quantity: quantity,

      userId: user.id,

      userName: user.name,

      userRole: user.role,

      date: new Date().toLocaleString()

    };

    transactions.unshift(transaction);

    localStorage.setItem(
      "transactions",
      JSON.stringify(transactions)
    );
  }

  /* ================= MEMBER BORROW ================= */

  function borrowBook(bookId) {

    const book = books.find(
      (b) => b.id === bookId
    );

    if (!book) return;

    if (book.available <= 0) {

      alert(
        "This book is currently unavailable."
      );

      return;
    }

    const users = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    const currentUser =
      users.find(
        (u) => u.id === user.id
      );

    if (!currentUser) {

      alert("Member account not found.");

      return;
    }

    const borrowedBooks =
      currentUser.borrowedBooks || [];

    if (borrowedBooks.length >= 5) {

      alert(
        "You can borrow a maximum of 5 books."
      );

      return;
    }

    const alreadyBorrowed =
      borrowedBooks.some(
        (b) => b.bookId === book.id
      );

    if (alreadyBorrowed) {

      alert(
        "You already borrowed this book."
      );

      return;
    }

    /* DECREASE AVAILABLE COPIES */

    const updatedBooks =
      books.map((b) => {

        if (b.id === book.id) {

          return {
            ...b,
            available:
              b.available - 1
          };

        }

        return b;

      });

    saveBooks(updatedBooks);

    /* ADD BOOK TO MEMBER */

    const borrowedBook = {

      bookId: book.id,

      title: book.title,

      borrowedAt:
        new Date().toLocaleString()

    };

    const updatedUsers =
      users.map((u) => {

        if (u.id === user.id) {

          return {
            ...u,
            borrowedBooks: [
              ...borrowedBooks,
              borrowedBook
            ]
          };

        }

        return u;

      });

    localStorage.setItem(
      "users",
      JSON.stringify(updatedUsers)
    );

    /* UPDATE LOGGED-IN MEMBER */

    const updatedCurrentUser = {
      ...user,
      borrowedBooks: [
        ...borrowedBooks,
        borrowedBook
      ]
    };

    localStorage.setItem(
      "loggedInUser",
      JSON.stringify(
        updatedCurrentUser
      )
    );

    /* CREATE TRANSACTION */

    addTransaction(
      "Book Borrowed",
      book,
      1
    );

    alert(
      `${book.title} borrowed successfully.`
    );
  }
  

  function addBook(e) {

    e.preventDefault();

    if (!title.trim()) {

      alert("Enter a book title.");

      return;
    }

    const numberOfCopies =
      Number(copies);

    if (numberOfCopies <= 0) {

      alert(
        "Copies must be greater than zero."
      );

      return;
    }

    const existingBook =
      books.find(
        (book) =>
          book.title.toLowerCase() ===
          title.trim().toLowerCase()
      );

    let updatedBooks;

    if (existingBook) {

      updatedBooks =
        books.map((book) => {

          if (
            book.id === existingBook.id
          ) {

            return {
              ...book,

              total:
                book.total +
                numberOfCopies,

              available:
                book.available +
                numberOfCopies
            };

          }

          return book;

        });

      addTransaction(
        "Books Added",
        {
          ...existingBook,
          total:
            existingBook.total +
            numberOfCopies
        },
        numberOfCopies
      );

    } else {

      const newBook = {

        id: Date.now(),

        title: title.trim(),

        total: numberOfCopies,

        available: numberOfCopies

      };

      updatedBooks = [
        ...books,
        newBook
      ];

      addTransaction(
        "Book Added",
        newBook,
        numberOfCopies
      );
    }

    saveBooks(updatedBooks);

    setTitle("");

    setCopies(1);

    alert(
      "Book successfully added."
    );
  }

  function removeCopy(bookId) {

    const book = books.find(
      (b) => b.id === bookId
    );

    if (!book) return;

    if (book.total <= 0) {

      alert("There are no copies to remove.");

      return;
    }

    if (book.available <= 0) {

      alert(
        "You cannot remove a copy while all copies are borrowed."
      );

      return;
    }

    const updatedBooks =
      books.map((b) => {

        if (b.id === bookId) {

          return {

            ...b,

            total:
              b.total - 1,

            available:
              b.available - 1

          };

        }

        return b;

      });

    saveBooks(updatedBooks);

    addTransaction(
      "Book Copy Removed",
      book,
      1
    );

  }


  function removeBook(bookId) {

    const book = books.find(
      (b) => b.id === bookId
    );

    if (!book) return;

    if (book.available !== book.total) {

      alert(
        "You cannot remove this book because some copies are currently borrowed."
      );

      return;
    }

    const confirmDelete =
      window.confirm(
        `Remove ${book.title} from the library?`
      );

    if (!confirmDelete) return;

    const updatedBooks =
      books.filter(
        (b) => b.id !== bookId
      );

    saveBooks(updatedBooks);

    addTransaction(
      "Book Removed",
      book,
      book.total
    );

  }

  return (
    <div className="page-container">

      <h1>Books</h1>

      <p className="role-title">

        {user.role === "member" &&
          "Browse and borrow books"}

        {user.role === "librarian" &&
          "Manage library books"}

      </p>

      {/* LIBRARIAN ADD FORM */}

      {user.role === "librarian" && (

        <div className="management-card">

          <h2>
            Add Books
          </h2>

          <form
            onSubmit={addBook}
            className="book-form"
          >

            <input
              type="text"
              placeholder="Book title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />

            <input
              type="number"
              min="1"
              value={copies}
              onChange={(e) =>
                setCopies(e.target.value)
              }
            />

            <button
              type="submit"
              className="primary-button"
            >
              Add Book
            </button>

          </form>

        </div>

      )}

      {/* BOOK TABLE */}

      <div className="table-container">

        <table>

          <thead>

            <tr>

              <th>Book</th>

              <th>Total Copies</th>

              <th>Available</th>

              <th>Status</th>

              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {books.map((book) => (

              <tr key={book.id}>

                <td>
                  <strong>
                    {book.title}
                  </strong>
                </td>

                <td>
                  {book.total}
                </td>

                <td>
                  {book.available}
                </td>

                <td>

                  {book.available === 0 ? (

                    <span className="status-unavailable">
                      Unavailable
                    </span>

                  ) : (

                    <span className="status-available">
                      Available
                    </span>

                  )}

                </td>

                <td>

                  {/* MEMBER */}

                  {user.role === "member" && (

                    <button
                      className="primary-button small-button"
                      disabled={
                        book.available === 0
                      }
                      onClick={() =>
                        borrowBook(book.id)
                      }
                    >
                      {book.available === 0
                        ? "Unavailable"
                        : "Borrow"}
                    </button>

                  )}

                  {/* LIBRARIAN */}

                  {user.role === "librarian" && (

                    <div className="button-group">

                      <button
                        className="secondary-button"
                        onClick={() =>
                          addCopies(book)
                        }
                      >
                        + Add Copy
                      </button>

                      <button
                        className="warning-button"
                        onClick={() =>
                          removeCopy(book.id)
                        }
                      >
                        - Remove Copy
                      </button>

                      <button
                        className="danger-button"
                        onClick={() =>
                          removeBook(book.id)
                        }
                      >
                        Remove Book
                      </button>

                    </div>

                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {books.length === 0 && (

        <div className="empty-state">
          No books are currently available.
        </div>

      )}

    </div>
  );
}

export default Books;
function addCopies(book) {

  const amount =
    Number(
      window.prompt(
        `How many copies of ${book.title} do you want to add?`,
        "1"
      )
    );

  if (!amount || amount <= 0) {
    return;
  }

  const updatedBooks =
    books.map((b) => {

      if (b.id === book.id) {

        return {
          ...b,
          total: b.total + amount,
          available: b.available + amount
        };

      }

      return b;

    });

  saveBooks(updatedBooks);

  addTransaction(
    "Books Added",
    book,
    amount
  );

  alert(
    `${amount} copies added to ${book.title}.`
  );
}