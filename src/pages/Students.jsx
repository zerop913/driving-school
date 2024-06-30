import React, { useState, useEffect } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import Table from "../components/Table";
import Modal from "../components/Modal";
import { downloadExcel } from "../services/helpers";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchStudents();
    fetchGroups();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get("/student");
      setStudents(response.data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await api.get("/groups");
      setGroups(response.data);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    }
  };

  const handleEdit = (student) => {
    setCurrentStudent(student);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/student/${id}`);
      fetchStudents();
    } catch (error) {
      console.error("Failed to delete student:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(currentStudent)) {
        formData.append(key, value);
      }
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      if (currentStudent.id) {
        await api.put(`/student/${currentStudent.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/student", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setIsModalOpen(false);
      fetchStudents();
    } catch (error) {
      console.error("Failed to update student:", error);
    }
  };

  const handleExport = () => {
    downloadExcel(students, "Ученики", "students");
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Ученики</h1>
      <div className="mb-4">
        <button
          onClick={() => {
            setCurrentStudent({});
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
        headers={["ID", "ФИО", "Паспортные данные", "Группа", "Фото"]}
        data={students.map((student) => ({
          ...student,
          group_id:
            groups.find((g) => g.id === student.group_id)?.group_number ||
            "N/A",
          photo: student.photo ? (
            <img
              src={`http://localhost:5000/uploads/${student.photo}`}
              alt="Student"
              className="w-10 h-10 rounded-full"
            />
          ) : (
            "Нет фото"
          ),
        }))}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentStudent?.id ? "Изменить ученика" : "Добавить ученика"}
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
              value={currentStudent?.full_name || ""}
              onChange={(e) =>
                setCurrentStudent({
                  ...currentStudent,
                  full_name: e.target.value,
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
              value={currentStudent?.passport_data || ""}
              onChange={(e) =>
                setCurrentStudent({
                  ...currentStudent,
                  passport_data: e.target.value,
                })
              }
            />
          </div>
          <div className="mb-4">
            <label htmlFor="group_id" className="block mb-2">
              Группа
            </label>
            <select
              id="group_id"
              className="w-full px-3 py-2 border rounded"
              value={currentStudent?.group_id || ""}
              onChange={(e) =>
                setCurrentStudent({
                  ...currentStudent,
                  group_id: parseInt(e.target.value),
                })
              }
            >
              <option value="">Выберите группу</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.group_number}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block mb-2">
              Фото
            </label>
            <input
              type="file"
              id="image"
              className="w-full px-3 py-2 border rounded"
              onChange={(e) => setSelectedImage(e.target.files[0])}
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

export default Students;
