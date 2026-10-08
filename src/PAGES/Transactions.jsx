import { useState } from "react";

function Transactions() {

  const user = JSON.parse(
    localStorage.getItem("loggedInUser")
  );

  const allTransactions = JSON.parse(
    localStorage.getItem("transactions") || "[]"
  );

  const [transactions] =
    useState(allTransactions);

  let displayedTransactions =
    transactions;

  // Members see only their transactions
  if (user.role === "member") {

    displayedTransactions =
      transactions.filter(
        (transaction) =>
          transaction.userId === user.id
      );

  }

  return (
    <div className="page-container">

      <h1>
        Transactions
      </h1>

      <p className="role-title">

        {user.role === "member"
          ? "Your borrowing history"
          : "Library transaction history"}

      </p>

      <div className="table-container">

        <table>

          <thead>

            <tr>

              <th>Date & Time</th>

              <th>Transaction</th>

              <th>Book</th>

              <th>Quantity</th>

              <th>User</th>

              <th>Role</th>

            </tr>

          </thead>

          <tbody>

            {displayedTransactions.map(
              (transaction) => (

                <tr key={transaction.id}>

                  <td>
                    {transaction.date}
                  </td>

                  <td>
                    <strong>
                      {transaction.type}
                    </strong>
                  </td>

                  <td>
                    {transaction.bookTitle}
                  </td>

                  <td>
                    {transaction.quantity}
                  </td>

                  <td>
                    {transaction.userName}
                  </td>

                  <td>
                    {transaction.userRole}
                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

      {displayedTransactions.length === 0 && (

        <div className="empty-state">
          No transactions yet.
        </div>

      )}

    </div>
  );
}

export default Transactions;