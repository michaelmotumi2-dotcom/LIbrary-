import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import Login from "./PAGES/Login";
import Register from "./PAGES/Register";
import Dashboard from "./PAGES/Dashboard";
import Books from "./PAGES/Books";
import Transactions from "./PAGES/Transactions";
import Users from "./PAGES/Users";

import ProtectedRoute from "./Components/ProtectedRoute";
import Navbar from "./Components/Navbar";

import "./App.css";

function App() {

  useEffect(() => {

    // Create the five starting books
    const existingBooks = localStorage.getItem("books");

    if (!existingBooks) {

      const initialBooks = [
        {
          id: 1,
          title: "Math Book",
          total: 5,
          available: 5
        },
        {
          id: 2,
          title: "Economy Book",
          total: 5,
          available: 5
        },
        {
          id: 3,
          title: "Business Book",
          total: 5,
          available: 5
        },
        {
          id: 4,
          title: "Geography Book",
          total: 5,
          available: 5
        },
        {
          id: 5,
          title: "Societal Book",
          total: 5,
          available: 5
        }
      ];

      localStorage.setItem(
        "books",
        JSON.stringify(initialBooks)
      );
    }

    // Create transactions storage
    if (!localStorage.getItem("transactions")) {
      localStorage.setItem("transactions", JSON.stringify([]));
    }

    // Create users storage
    if (!localStorage.getItem("users")) {
      localStorage.setItem("users", JSON.stringify([]));
    }

  }, []);

  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* HOME / ROLE SELECTION */}
        <Route path="/" element={<Login />} />

        {/* REGISTRATION */}
        <Route
          path="/register/:role"
          element={<Register />}
        />

        {/* ROLE LOGIN */}
        <Route
          path="/login/:role"
          element={<Login />}
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* BOOKS */}
        <Route
          path="/books"
          element={
            <ProtectedRoute
              allowedRoles={["member", "librarian"]}
            >
              <Books />
            </ProtectedRoute>
          }
        />

        {/* TRANSACTIONS */}
        <Route
          path="/transactions"
          element={
            <ProtectedRoute
              allowedRoles={[
                "member",
                "librarian",
                "admin"
              ]}
            >
              <Transactions />
            </ProtectedRoute>
          }
        />

        {/* ADMIN MEMBERS */}
        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Users />
            </ProtectedRoute>
          }
        />

        {/* UNKNOWN PAGE */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;