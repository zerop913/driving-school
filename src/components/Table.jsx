import React, { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";

const Table = ({ headers, data, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleDelete = (item) => {
    setItemToDelete(item);
    setShowConfirmation(true);
  };

  const handleConfirmDelete = () => {
    onDelete(itemToDelete.id);
    setShowConfirmation(false);
    setItemToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
    setItemToDelete(null);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Поиск..."
        className="mb-4 p-2 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            {headers.map((header) => (
              <th key={header} className="py-3 px-6 text-left">
                {header}
              </th>
            ))}
            <th className="py-3 px-6 text-left">Действия</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {filteredData.map((row, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              {Object.values(row).map((value, i) => (
                <td key={i} className="py-3 px-6 text-left whitespace-nowrap">
                  {value}
                </td>
              ))}
              <td className="py-3 px-6 text-left">
                <button
                  onClick={() => onEdit(row)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                >
                  Изменить
                </button>
                <button
                  onClick={() => handleDelete(row)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ConfirmationModal
        isOpen={showConfirmation}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message="Вы уверены, что хотите удалить эту запись?"
      />
    </div>
  );
};

export default Table;
