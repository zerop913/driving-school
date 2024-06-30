import React, { useState, useEffect } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import Table from "../components/Table";
import Modal from "../components/Modal";
import { downloadExcel } from "../services/helpers";

const ExamRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [inspectors, setInspectors] = useState([]);
  const [routeImage, setRouteImage] = useState(null);

  useEffect(() => {
    fetchRoutes();
    fetchInspectors();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await api.get("/exam_route");
      setRoutes(response.data);
    } catch (error) {
      console.error("Failed to fetch exam routes:", error);
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

  const handleEdit = (route) => {
    setCurrentRoute(route);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/exam_route/${id}`);
      fetchRoutes();
    } catch (error) {
      console.error("Failed to delete exam route:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(currentRoute)) {
        formData.append(key, value);
      }
      if (routeImage) {
        formData.append("image", routeImage);
      }

      if (currentRoute.id) {
        await api.put(`/exam_route/${currentRoute.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/exam_route", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setIsModalOpen(false);
      fetchRoutes();
    } catch (error) {
      console.error("Failed to update exam route:", error);
    }
  };

  const handleExport = () => {
    downloadExcel(routes, "Маршруты сдачи", "exam_routes");
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Маршруты сдачи</h1>
      <div className="mb-4">
        <button
          onClick={() => {
            setCurrentRoute({});
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
          "Название",
          "Условия",
          "Расстояние",
          "Инспектор",
          "Карта",
        ]}
        data={routes.map((route) => ({
          ...route,
          inspector_id:
            inspectors.find((i) => i.id === route.inspector_id)?.full_name ||
            "N/A",
          map_image: route.map_image ? (
            <img
              src={`http://localhost:5000/uploads/${route.map_image}`}
              alt="Route Map"
              className="w-20 h-20 object-cover rounded"
            />
          ) : (
            "Нет карты"
          ),
        }))}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentRoute?.id ? "Изменить маршрут" : "Добавить маршрут"}
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
              value={currentRoute?.name || ""}
              onChange={(e) =>
                setCurrentRoute({ ...currentRoute, name: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label htmlFor="conditions" className="block mb-2">
              Условия
            </label>
            <input
              type="text"
              id="conditions"
              className="w-full px-3 py-2 border rounded"
              value={currentRoute?.conditions || ""}
              onChange={(e) =>
                setCurrentRoute({ ...currentRoute, conditions: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label htmlFor="distance" className="block mb-2">
              Расстояние
            </label>
            <input
              type="number"
              id="distance"
              step="0.1"
              className="w-full px-3 py-2 border rounded"
              value={currentRoute?.distance || ""}
              onChange={(e) =>
                setCurrentRoute({
                  ...currentRoute,
                  distance: parseFloat(e.target.value),
                })
              }
            />
          </div>
          <div className="mb-4">
            <label htmlFor="inspector_id" className="block mb-2">
              Инспектор
            </label>
            <select
              id="inspector_id"
              className="w-full px-3 py-2 border rounded"
              value={currentRoute?.inspector_id || ""}
              onChange={(e) =>
                setCurrentRoute({
                  ...currentRoute,
                  inspector_id: parseInt(e.target.value),
                })
              }
            >
              <option value="">Выберите инспектора</option>
              {inspectors.map((inspector) => (
                <option key={inspector.id} value={inspector.id}>
                  {inspector.full_name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="map_image" className="block mb-2">
              Карта маршрута
            </label>
            <input
              type="file"
              id="map_image"
              accept="image/*"
              className="w-full px-3 py-2 border rounded"
              onChange={(e) => setRouteImage(e.target.files[0])}
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

export default ExamRoutes;
