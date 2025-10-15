import { Lock, UserLock } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("https://18.144.115.199.nip.io/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (data.message === "Login exitoso" && data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/ventas");
      } else {
        setError(data.message || "Credenciales incorrectas");
      }
    } catch (error) {
      setError("Error al autenticar");
      console.error("Error al autenticar:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full mx-auto my-10 border border-gray-200"
    >
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Ingresar al Sistema
      </h2>
      {/* Campo de Usuario */}
      <div className="mb-6">
        <label
          htmlFor="username"
          className="block text-gray-700 text-left text-sm font-semibold mb-2"
        >
          Usuario:
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            <UserLock color="green" size={20} />
          </span>
          <input
            type="text"
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            required
          />
        </div>
      </div>

      {/* Campo de Contraseña */}
      <div className="mb-8">
        <label
          htmlFor="password"
          className="block text-gray-700 text-left text-sm font-semibold mb-2"
        >
          Contraseña:
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            <Lock color="green" size={20} />
          </span>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            required
          />
        </div>
      </div>

      {/* Mensaje de Error */}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Botón de Submit */}
      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200 transform hover:scale-105"
      >
        Ingresar
      </button>
    </form>
  );
};

export default LoginForm;
