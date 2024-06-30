import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { getRole } from "../services/auth";

const Dashboard = () => {
  const role = getRole();

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">
        Добро пожаловать в систему автошколы!
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {role === "admin" && (
          <>
            <Link
              to="/driving-schools"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">Автошколы</h2>
              <p>Управление автошколами</p>
            </Link>
            <Link
              to="/staff"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">Персонал</h2>
              <p>Управление персоналом</p>
            </Link>
            <Link
              to="/courses"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">Курсы</h2>
              <p>Управление курсами</p>
            </Link>
          </>
        )}
        {(role === "admin" || role === "teacher") && (
          <>
            <Link
              to="/groups"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">Группы</h2>
              <p>Управление группами</p>
            </Link>
            <Link
              to="/students"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">Ученики</h2>
              <p>Управление учениками</p>
            </Link>
            <Link
              to="/exam-routes"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">Маршруты</h2>
              <p>Управление маршрутами</p>
            </Link>
          </>
        )}
        {role === "student" && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">Моя группа</h2>
              <p>Информация о вашей группе</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">Мой прогресс</h2>
              <p>Отслеживание прогресса обучения</p>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
