import React, { useState, useEffect } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import Table from "../components/Table";
import Modal from "../components/Modal";
import { downloadExcel } from "../services/helpers";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    fetchCourses();
    fetchSchools();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get("/course");
      setCourses(response.data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
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

  const handleEdit = (course) => {
    setCurrentCourse(course);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/course/${id}`);
      fetchCourses();
    } catch (error) {
      console.error("Failed to delete course:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentCourse.id) {
        await api.put(`/course/${currentCourse.id}`, currentCourse);
      } else {
        await api.post("/course", currentCourse);
      }
      setIsModalOpen(false);
      fetchCourses();
    } catch (error) {
      console.error("Failed to update course:", error);
    }
  };

  const handleExport = () => {
    downloadExcel(courses, "Курсы", "courses");
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Курсы</h1>
      <div className="mb-4">
        <button
          onClick={() => {
            setCurrentCourse({});
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
        headers={["ID", "Название", "Стоимость обучения", "Автошкола"]}
        data={courses.map((course) => ({
          ...course,
          driving_school_id:
            schools.find((s) => s.id === course.driving_school_id)?.name ||
            "N/A",
        }))}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentCourse?.id ? "Изменить курс" : "Добавить курс"}
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
              value={currentCourse?.name || ""}
              onChange={(e) =>
                setCurrentCourse({ ...currentCourse, name: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label htmlFor="tuition_fees" className="block mb-2">
              Стоимость обучения
            </label>
            <input
              type="number"
              id="tuition_fees"
              step="0.01"
              className="w-full px-3 py-2 border rounded"
              value={currentCourse?.tuition_fees || ""}
              onChange={(e) =>
                setCurrentCourse({
                  ...currentCourse,
                  tuition_fees: parseFloat(e.target.value),
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
              value={currentCourse?.driving_school_id || ""}
              onChange={(e) =>
                setCurrentCourse({
                  ...currentCourse,
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

export default Courses;
