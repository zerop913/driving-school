import React, { useState, useEffect } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import Table from "../components/Table";
import ConfirmationModal from "../components/ConfirmationModal";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [additionalFields, setAdditionalFields] = useState({});
  const [drivingSchools, setDrivingSchools] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const fetchDrivingSchools = async () => {
      const response = await api.get("/driving_schools");
      setDrivingSchools(response.data);
    };
    fetchDrivingSchools();

    const fetchGroups = async () => {
      const response = await api.get("/groups");
      setGroups(response.data);
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await api.get("/users");
      setUsers(response.data);
    };
    fetchUsers();
  }, []);

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setAdditionalFields({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setNewRole("");
    setAdditionalFields({});
  };

  const handleRoleChange = (event) => {
    const newRole = event.target.value;
    setNewRole(newRole);

    switch (newRole) {
      case "teacher":
        setAdditionalFields({
          inn: "",
          salary: "",
          passport_data: "",
          work_experience: "",
          driving_school_id: "",
        });
        break;
      case "inspector":
        setAdditionalFields({
          salary: "",
          passport_data: "",
          work_experience: "",
        });
        break;
      case "student":
        setAdditionalFields({
          passport_data: "",
          group_id: "",
        });
        break;
      default:
        setAdditionalFields({});
    }
  };

  const handleAdditionalFieldChange = (event) => {
    setAdditionalFields({
      ...additionalFields,
      [event.target.name]: event.target.value,
    });
  };

  const handleSaveUser = async () => {
    try {
      const updatedUser = {
        role: newRole,
        ...additionalFields,
      };
      await api.put(`/users/${selectedUser.id}`, updatedUser);
      setUsers(
        users.map((user) => (user.id === selectedUser.id ? updatedUser : user))
      );
      handleCloseModal();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleConfirmDelete = (user) => {
    setUserToDelete(user);
    setShowConfirmationModal(true);
  };

  const handleDeleteUser = async () => {
    try {
      if (userToDelete) {
        await api.delete(`/users/${userToDelete.id}`);
        setUsers(users.filter((user) => user.id !== userToDelete.id));
        handleCloseConfirmationModal();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    setUserToDelete(null);
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Управление пользователями</h1>
      <Table
        headers={["ID", "Имя пользователя", "ФИО", "Роль"]}
        data={users.map((user) => ({
          id: user.id,
          username: user.username,
          fullName: user.full_name,
          role: user.role,
        }))}
        onEdit={handleEditUser}
        onDelete={handleConfirmDelete}
      />
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="Редактировать пользователя"
      >
        <div className="mb-4">
          <label htmlFor="role" className="block mb-2">
            Роль
          </label>
          <select
            id="role"
            value={newRole}
            onChange={handleRoleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Выберите роль</option>
            <option value="teacher">Учитель</option>
            <option value="inspector">Инспектор</option>
            <option value="student">Ученик</option>
          </select>
        </div>
        {Object.keys(additionalFields).map((field) => (
          <div key={field} className="mb-4">
            <label htmlFor={field} className="block mb-2">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            {field === "driving_school_id" && newRole === "teacher" ? (
              <select
                id={field}
                name={field}
                value={additionalFields[field]}
                onChange={handleAdditionalFieldChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">Выберите автошколу</option>
                {drivingSchools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </select>
            ) : field === "group_id" && newRole === "student" ? (
              <select
                id={field}
                name={field}
                value={additionalFields[field]}
                onChange={handleAdditionalFieldChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">Выберите группу</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.group_number}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                id={field}
                name={field}
                value={additionalFields[field]}
                onChange={handleAdditionalFieldChange}
                className="w-full px-3 py-2 border rounded"
              />
            )}
          </div>
        ))}
        <button
          onClick={handleSaveUser}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Сохранить
        </button>
      </Modal>
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onConfirm={handleDeleteUser}
        onCancel={handleCloseConfirmationModal}
        message={`Вы действительно хотите удалить пользователя ${
          userToDelete?.fullName || ""
        }?`}
      />
    </Layout>
  );
};

export default UserManagement;
