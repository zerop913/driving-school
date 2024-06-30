import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getRole, getFullName } from "../services/auth";
import ConfirmationModal from "./ConfirmationModal";

const Navigation = () => {
  const navigate = useNavigate();
  const role = getRole();
  const fullName = getFullName();
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirmation(true);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("fullName");
    navigate("/login");
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirmation(false);
  };

  return (
    <nav className="bg-gray-800 w-64">
      <div className="px-6 py-8">
        <h1 className="text-3xl font-bold text-white">Drive School</h1>
        <p className="text-gray-300 mt-2">{fullName}</p>
      </div>
      <ul className="mt-6">
        {role === "admin" && (
          <>
            <li>
              <Link
                to="/driving-schools"
                className="block py-3 px-6 text-gray-100 hover:bg-gray-700"
              >
                Автошколы
              </Link>
            </li>
            <li>
              <Link
                to="/staff"
                className="block py-3 px-6 text-gray-100 hover:bg-gray-700"
              >
                Персонал
              </Link>
            </li>
            <li>
              <Link
                to="/courses"
                className="block py-3 px-6 text-gray-100 hover:bg-gray-700"
              >
                Курсы
              </Link>
            </li>
            <li>
              <Link
                to="/groups"
                className="block py-3 px-6 text-gray-100 hover:bg-gray-700"
              >
                Группы
              </Link>
            </li>
            <li>
              <Link
                to="/user-management"
                className="block py-3 px-6 text-gray-100 hover:bg-gray-700"
              >
                Управление пользователями
              </Link>
            </li>
          </>
        )}
        {(role === "admin" || role === "teacher") && (
          <>
            <li>
              <Link
                to="/students"
                className="block py-3 px-6 text-gray-100 hover:bg-gray-700"
              >
                Ученики
              </Link>
            </li>
            <li>
              <Link
                to="/inspectors"
                className="block py-3 px-6 text-gray-100 hover:bg-gray-700"
              >
                Инспекторы
              </Link>
            </li>
            <li>
              <Link
                to="/exam-routes"
                className="block py-3 px-6 text-gray-100 hover:bg-gray-700"
              >
                Маршруты
              </Link>
            </li>
          </>
        )}
        <li>
          <button
            onClick={handleLogout}
            className="block w-full py-3 px-6 text-left text-gray-100 hover:bg-gray-700"
          >
            Выйти
          </button>
        </li>
        <ConfirmationModal
          isOpen={showLogoutConfirmation}
          onConfirm={handleConfirmLogout}
          onCancel={handleCancelLogout}
          message="Вы уверены, что хотите выйти?"
        />
      </ul>
    </nav>
  );
};

export default Navigation;
