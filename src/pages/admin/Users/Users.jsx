import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/routesPath";
import { getUsers } from "../../../services/userService";
import "./users.css";

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getUsers()
      .then((data) => {
        if (!cancelled) setUsers(data);
      })
      .catch((loadError) => {
        if (!cancelled) setError(loadError.message || "Unable to load users");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const openUserDetails = (userId) => navigate(`${ROUTES.ADMIN_USERS}/${userId}`);

  return (
    <section className="users-content">
      <div className="dashboard-card users-card">
        <div className="users-heading">
          <h1>Users</h1>
          <span>{users.length} registered</span>
        </div>
        {error && <p className="users-error" role="alert">{error}</p>}
        {loading ? (
          <p role="status">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="users-empty">No registered users yet.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Date of Birth</th>
                  <th>Gender</th>
                  <th>Approval Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="user-table-row"
                    tabIndex={0}
                    onDoubleClick={() => openUserDetails(user.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") openUserDetails(user.id);
                    }}
                  >
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.mobileNumber}</td>
                    <td>{user.dateOfBirth}</td>
                    <td>{user.gender}</td>
                    <td>
                      <span className="user-approval-status">{user.approvalStatus}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}