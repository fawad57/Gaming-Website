import { useState, useEffect } from "react";
import axios from "axios";

export default function InputField() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    axios
      .get("http://localhost:3001/employees")
      .then((response) => setEmployees(response.data))
      .catch((err) => console.log(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/register", { name, email, password })
      .then((result) => {
        console.log(result);
        fetchEmployees();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <br />
        <input
          type="text"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <br />
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
        />
        <br />
        <button>Add</button>
      </form>

      <h2>Employee List</h2>
      {employees.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.password}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No employees found</p>
      )}
    </div>
  );
}
