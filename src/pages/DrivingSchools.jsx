import React, { useState, useEffect } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import Table from "../components/Table";
import Modal from "../components/Modal";
import { downloadExcel } from "../services/helpers";

const DrivingSchools = () => {
  const [schools, setSchools] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSchool, setCurrentSchool] = useState(null);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const response = await api.get("/driving_school");
      setSchools(response.data);
    } catch (error) {
      console.error("Failed to fetch driving schools:", error);
    }
  };

  const handleEdit = (school) => {
    setCurrentSchool(school);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/driving_school/${id}`);
      fetchSchools();
    } catch (error) {
      console.error("Failed to delete driving school:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentSchool.id) {
        await api.put(`/driving_school/${currentSchool.id}`, currentSchool);
      } else {
        await api.post("/driving_school", currentSchool);
      }
      setIsModalOpen(false);
      fetchSchools();
    } catch (error) {
      console.error("Failed to update driving school:", error);
    }
  };

  const handleExport = () => {
    downloadExcel(schools, "Автошколы", "driving_schools");
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Автошколы</h1>
      <div className="mb-4">
        <button
          onClick={() => {
            setCurrentSchool({});
            setIsModalOpen(true);
          }}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Добавить
        </button>
        <button
          onClick={handleExport}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Экспорт в Excel
        </button>
      </div>
      <Table
        headers={["ID", "Название", "Контакты", "Рейтинг", "Часы работы"]}
        data={schools}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentSchool?.id ? "Изменить автошколу" : "Добавить автошколу"}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2">
              Название
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 border rounded"
              value={currentSchool?.name || ""}
              onChange={(e) =>
                setCurrentSchool({ ...currentSchool, name: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label htmlFor="contacts" className="block mb-2">
              Контакты
            </label>
            <input
              type="text"
              id="contacts"
              className="w-full px-3 py-2 border rounded"
              value={currentSchool?.contacts || ""}
              onChange={(e) =>
                setCurrentSchool({ ...currentSchool, contacts: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label htmlFor="rating" className="block mb-2">
              Рейтинг
            </label>
            <input
              type="number"
              id="rating"
              step="0.1"
              className="w-full px-3 py-2 border rounded"
              value={currentSchool?.rating || ""}
              onChange={(e) =>
                setCurrentSchool({
                  ...currentSchool,
                  rating: parseFloat(e.target.value),
                })
              }
            />
          </div>
          <div className="mb-4">
            <label htmlFor="working_hours" className="block mb-2">
              Часы работы
            </label>
            <input
              type="text"
              id="working_hours"
              className="w-full px-3 py-2 border rounded"
              value={currentSchool?.working_hours || ""}
              onChange={(e) =>
                setCurrentSchool({
                  ...currentSchool,
                  working_hours: e.target.value,
                })
              }
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-orange hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
            >
              Сохранить
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default DrivingSchools;
