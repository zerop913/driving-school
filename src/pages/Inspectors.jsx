import React, { useState, useEffect } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import Table from "../components/Table";
import Modal from "../components/Modal";
import { downloadExcel } from "../services/helpers";

const Inspectors = () => {
  const [inspectors, setInspectors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentInspector, setCurrentInspector] = useState(null);

  useEffect(() => {
    fetchInspectors();
  }, []);

  const fetchInspectors = async () => {
    try {
      const response = await api.get("/inspector");
      setInspectors(response.data);
    } catch (error) {
      console.error("Failed to fetch inspectors:", error);
    }
  };

  const handleEdit = (inspector) => {
    setCurrentInspector(inspector);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/inspector/${id}`);
      fetchInspectors();
    } catch (error) {
      console.error("Failed to delete inspector:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentInspector.id) {
        await api.put(`/inspector/${currentInspector.id}`, currentInspector);
      } else {
        await api.post("/inspector", currentInspector);
      }
      setIsModalOpen(false);
      fetchInspectors();
    } catch (error) {
      console.error("Failed to update inspector:", error);
    }
  };

  const handleExport = () => {
    downloadExcel(inspectors, "Инспекторы", "inspectors");
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Инспекторы</h1>
      <div className="mb-4">
        <button
          onClick={() => {
            setCurrentInspector({});
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
        headers={["ID", "ФИО", "Зарплата", "Паспортные данные", "Опыт работы"]}
        data={inspectors}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          currentInspector?.id ? "Изменить инспектора" : "Добавить инспектора"
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="full_name" className="block mb-2">
              ФИО
            </label>
            <input
              type="text"
              id="full_name"
              className="w-full px-3 py-2 border rounded"
              value={currentInspector?.full_name || ""}
              onChange={(e) =>
                setCurrentInspector({
                  ...currentInspector,
                  full_name: e.target.value,
                })
              }
            />
          </div>
          <div className="mb-4">
            <label htmlFor="salary" className="block mb-2">
              Зарплата
            </label>
            <input
              type="number"
              id="salary"
              step="0.01"
              className="w-full px-3 py-2 border rounded"
              value={currentInspector?.salary || ""}
              onChange={(e) =>
                setCurrentInspector({
                  ...currentInspector,
                  salary: parseFloat(e.target.value),
                })
              }
            />
          </div>
          <div className="mb-4">
            <label htmlFor="passport_data" className="block mb-2">
              Паспортные данные
            </label>
            <input
              type="text"
              id="passport_data"
              className="w-full px-3 py-2 border rounded"
              value={currentInspector?.passport_data || ""}
              onChange={(e) =>
                setCurrentInspector({
                  ...currentInspector,
                  passport_data: e.target.value,
                })
              }
            />
          </div>
          <div className="mb-4">
            <label htmlFor="work_experience" className="block mb-2">
              Опыт работы (лет)
            </label>
            <input
              type="number"
              id="work_experience"
              className="w-full px-3 py-2 border rounded"
              value={currentInspector?.work_experience || ""}
              onChange={(e) =>
                setCurrentInspector({
                  ...currentInspector,
                  work_experience: parseInt(e.target.value),
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

export default Inspectors;
