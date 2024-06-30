import React, { useState, useEffect } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import Table from "../components/Table";
import Modal from "../components/Modal";
import { downloadExcel } from "../services/helpers";

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [courses, setCourses] = useState([]);
  const [inspectors, setInspectors] = useState([]);

  useEffect(() => {
    fetchGroups();
    fetchCourses();
    fetchInspectors();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await api.get("/groups");
      setGroups(response.data);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get("/course");
      setCourses(response.data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  const fetchInspectors = async () => {
    try {
      const response = await api.get("/inspector");
      setInspectors(response.data);
    } catch (error) {
      console.error("Failed to fetch inspectors:", error);
    }
  };

  const handleEdit = (group) => {
    setCurrentGroup(group);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/groups/${id}`);
      fetchGroups();
    } catch (error) {
      console.error("Failed to delete group:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentGroup.id) {
        await api.put(`/groups/${currentGroup.id}`, currentGroup);
      } else {
        await api.post("/groups", currentGroup);
      }
      setIsModalOpen(false);
      fetchGroups();
    } catch (error) {
      console.error("Failed to update group:", error);
    }
  };

  const handleExport = () => {
    downloadExcel(groups, "Группы", "groups");
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Группы</h1>
      <div className="mb-4">
        <button
          onClick={() => {
            setCurrentGroup({});
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
          "Номер группы",
          "Количество учеников",
          "Курс",
          "Инспектор",
        ]}
        data={groups.map((group) => ({
          ...group,
          course_id:
            courses.find((c) => c.id === group.course_id)?.name || "N/A",
          inspector_id:
            inspectors.find((i) => i.id === group.inspector_id)?.full_name ||
            "Не назначен",
        }))}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentGroup?.id ? "Изменить группу" : "Добавить группу"}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="group_number" className="block mb-2">
              Номер группы
            </label>
            <input
              type="number"
              id="group_number"
              className="w-full px-3 py-2 border rounded"
              value={currentGroup?.group_number || ""}
              onChange={(e) =>
                setCurrentGroup({
                  ...currentGroup,
                  group_number: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className="mb-4">
            <label htmlFor="course_id" className="block mb-2">
              Курс
            </label>
            <select
              id="course_id"
              className="w-full px-3 py-2 border rounded"
              value={currentGroup?.course_id || ""}
              onChange={(e) =>
                setCurrentGroup({
                  ...currentGroup,
                  course_id: parseInt(e.target.value),
                })
              }
            >
              <option value="">Выберите курс</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="inspector_id" className="block mb-2">
              Инспектор
            </label>
            <select
              id="inspector_id"
              className="w-full px-3 py-2 border rounded"
              value={currentGroup?.inspector_id || ""}
              onChange={(e) =>
                setCurrentGroup({
                  ...currentGroup,
                  inspector_id: e.target.value
                    ? parseInt(e.target.value)
                    : null,
                })
              }
            >
              <option value="">Не назначен</option>
              {inspectors.map((inspector) => (
                <option key={inspector.id} value={inspector.id}>
                  {inspector.full_name}
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

export default Groups;
