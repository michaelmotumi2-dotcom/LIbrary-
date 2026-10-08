import { useState } from "react";

function Users() {

  const [users, setUsers] = useState(
    JSON.parse(
      localStorage.getItem("users") || "[]"
    )
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    membershipId: ""
  });

  const members = users.filter(
    (user) => user.role === "member"
  );

  function handleChange(e) {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  }

  function addMember(e) {

    e.preventDefault();

    const emailExists = users.some(
      (user) =>
        user.email.toLowerCase() ===
        form.email.toLowerCase()
    );

    if (emailExists) {

      alert(
        "That email is already registered."
      );

      return;
    }

    const newMember = {

      id: Date.now(),

      name: form.name,

      email: form.email,

      password: form.password,

      membershipId:
        form.membershipId,

      role: "member",

      registeredAt:
        new Date().toLocaleString(),

      lastLogin: "Never",

      borrowedBooks: []

    };

    const updatedUsers = [
      ...users,
      newMember
    ];

    localStorage.setItem(
      "users",
      JSON.stringify(updatedUsers)
    );

    setUsers(updatedUsers);

    setForm({
      name: "",
      email: "",
      password: "",
      membershipId: ""
    });

    alert(
      "Member added successfully."
    );
  }

  function removeMember(id) {

    const member =
      users.find(
        (user) => user.id === id
      );

    if (!member) return;

    const confirmDelete =
      window.confirm(
        `Remove ${member.name} from the library?`
      );

    if (!confirmDelete) {
      return;
    }

    const updatedUsers =
      users.filter(
        (user) => user.id !== id
      );

    localStorage.setItem(
      "users",
      JSON.stringify(updatedUsers)
    );

    setUsers(updatedUsers);

    alert(
      "Member removed successfully."
    );
  }

  return (
    <div className="page-container">

      <h1>
        Member Management
      </h1>

      <p className="role-title">
        Administrator only
      </p>

      {/* ADD MEMBER */}

      <div className="management-card">

        <h2>
          Add New Member
        </h2>

        <form
          onSubmit={addMember}
          className="member-form"
        >

          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="membershipId"
            placeholder="Membership ID"
            value={form.membershipId}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="primary-button"
          >
            Add Member
          </button>

        </form>

      </div>

      {/* MEMBERS */}

      <div className="table-container">

        <table>

          <thead>

            <tr>

              <th>Name</th>

              <th>Email</th>

              <th>Membership ID</th>

              <th>Registered</th>

              <th>Last Login</th>

              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {members.map((member) => (

              <tr key={member.id}>

                <td>
                  {member.name}
                </td>

                <td>
                  {member.email}
                </td>

                <td>
                  {member.membershipId}
                </td>

                <td>
                  {member.registeredAt}
                </td>

                <td>
                  {member.lastLogin}
                </td>

                <td>

                  <button
                    className="danger-button"
                    onClick={() =>
                      removeMember(member.id)
                    }
                  >
                    Remove
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {members.length === 0 && (

        <div className="empty-state">
          No members registered.
        </div>

      )}

    </div>
  );
}

export default Users;