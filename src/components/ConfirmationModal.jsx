import React from "react";
import ReactDOM from "react-dom";

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onCancel();
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
        <p className="text-gray-700 mb-6 text-lg">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={handleCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 px-6 rounded mr-4"
          >
            Отмена
          </button>
          <button
            onClick={handleConfirm}
            className="bg-red-500 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded"
          >
            Подтвердить
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmationModal;
