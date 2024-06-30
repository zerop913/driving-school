import React, { useState, useEffect } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import Table from "../components/Table";
import Modal from "../components/Modal";
import { downloadExcel } from "../services/helpers";

const Staff = () => {
  const [staffList, setStaffList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    fetchStaff();
    fetchSchools();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await api.get("/staff");
      setStaffList(response.data);
    } catch (error) {
      console.error("Failed to fetch staff:", error);
    }
  };

  const fetchSchools = async () => {
    try {
      const response = await api.get("/driving_school");
      setSchools(response.data);
    } catch (error) {
      console.error("Failed to fetch driving schools:", error);
    }
  };

  const handleEdit = (staff) => {
    setCurrentStaff(staff);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/staff/${id}`);
      fetchStaff();
    } catch (error) {
      console.error("Failed to delete staff:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentStaff.id) {
        await api.put(`/staff/${currentStaff.id}`, currentStaff);
      } else {
        await api.post("/staff", currentStaff);
      }
      setIsModalOpen(false);
      fetchStaff();
    } catch (error) {
      console.error("Failed to update staff:", error);
    }
  };

  const handleExport = () => {
    downloadExcel(staffList, "Персонал", "staff");
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Персонал</h1>
      <div className="mb-4">
        <button
          onClick={() => {
            setCurrentStaff({});
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
        headers={[
          "ID",
          "ФИО",
          "ИНН",
          "Зарплата",
          "Паспортные данные",
          "Опыт работы",
          "Автошкола",
        ]}
        data={staffList.map((staff) => ({
          ...staff,
          driving_school_id:
            schools.find((s) => s.id === staff.driving_school_id)?.name ||
            "N/A",
        }))}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentStaff?.id ? "Изменить сотрудника" : "Добавить сотрудника"}
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
              value={currentStaff?.full_name || ""}
              onChange={(e) =>
                setCurrentStaff({ ...currentStaff, full_name: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label htmlFor="inn" className="block mb-2">
              ИНН
            </label>
            <input
              type="text"
              id="inn"
              className="w-full px-3 py-2 border rounded"
              value={currentStaff?.inn || ""}
              onChange={(e) =>
                setCurrentStaff({ ...currentStaff, inn: e.target.value })
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
              value={currentStaff?.salary || ""}
              onChange={(e) =>
                setCurrentStaff({
                  ...currentStaff,
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
              value={currentStaff?.passport_data || ""}
              onChange={(e) =>
                setCurrentStaff({
                  ...currentStaff,
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
              value={currentStaff?.work_experience || ""}
              onChange={(e) =>
                setCurrentStaff({
                  ...currentStaff,
                  work_experience: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className="mb-4">
            <label htmlFor="driving_school_id" className="block mb-2">
              Автошкола
            </label>
            <select
              id="driving_school_id"
              className="w-full px-3 py-2 border rounded"
              value={currentStaff?.driving_school_id || ""}
              onChange={(e) =>
                setCurrentStaff({
                  ...currentStaff,
                  driving_school_id: parseInt(e.target.value),
                })
              }
            >
              <option value="">Выберите автошколу</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
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

export default Staff;
