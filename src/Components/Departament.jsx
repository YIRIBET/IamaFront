import React, { useState, useEffect } from "react";
import "../App.css";
import ModalCrearProduct from "./ModalCrearProduct";
import Swal from "sweetalert2";

const Department = () => {
  const [departments, setDepartments] = useState([]);
 // const [SolicitarProd, setSolicitarProd] = useState(false);
  const [departmentToEdit, setDepartmentToEdit] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/department/");
      const data = await response.json();
      setDepartments(data.data || []);
    } catch (error) {
      console.error("Error encontrando departamentos", error);
    }
  };

  const handleAddDepartment = async (event) => {
    event.preventDefault();
    const newDepartment = {
      name: event.target.name.value,
      address: event.target.address.value,
    };
    try {
      const response = await fetch("http://localhost:8080/api/department/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDepartment),
      });
      if (response.ok) {
        fetchDepartments();
      }
    } catch (error) {
      console.error("Ocurrió un error al crear un departamento!", error);
    }
  };

  const handleUpdateDepartment = async (event) => {
    event.preventDefault();
    const updatedDepartment = {
      ...departmentToEdit,
      name: event.target.name.value,
      address: event.target.address.value,
    };
    try {
      const response = await fetch("http://localhost:8080/api/department/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedDepartment),
      });
      if (response.ok) {
        fetchDepartments();
        setDepartmentToEdit(null);
      }
    } catch (error) {
      console.error("There was an error updating the department!", error);
    }
  };


  /*const AbrirModal = () => {
    setSolicitarProd(true);
  };

  const CerrarModal = () => {
    setSolicitarProd(false);
    setDepartmentToEdit(null);
  };*/

  const [modalType, setModalType] = useState(null);

  const handleOpenModal = (type) => {
    setModalType(type);
  };

  const handleCloseModal = () => {
    setModalType(null);
  };

  const handleSubmit = async (type, formData) => {
    let url = "http://localhost:8080/api/productRequest/saveReq";
    let method = "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reqType: type,
          ...(formData.productId && { productBean: { id: formData.productId } }),
          categoryBean: { id: formData.categoryId },
          departmentBean: { id: formData.departmentId },
          newDescription: formData.newDescription,
          newName: formData.newName,
          reason: formData.reason,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong!");
      }

      Swal.fire({
       position: "top-center",
       icon: "success",
       title: "Solicitud enviada correctamente",
       showConfirmButton: false,
       timer: 1500,
     });
    } catch (err) {
      alert(err.message);
    } finally {
      handleCloseModal();
    }
  };

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 rounded-s-lg">
                Nombre
              </th>
              <th scope="col" className="px-6 py-3 rounded-s-lg">
                Dirección
              </th>
              <th scope="col" className="px-6 py-3 rounded-e-lg">
                Acción
              </th>
            </tr>
          </thead>
          <tbody>
            {departments.map((department) => (
              <tr key={department.id} className="bg-white dark:bg-gray-800">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {department.name}
                </th>
                <td className="px-6 py-4">
                  {department.address}
                </td>
                <td className="px-6 py-4">
                  <button
                   onClick={() => handleOpenModal("create")}
                    type="submit"
                    className
                    ="text-white bg-green-400 hover:bg-green-500 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  >
                    Solicitar un producto
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
     {/* {SolicitarProd && (
        <div
          id="crud-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center overflow-y-auto overflow-x-hidden z-50"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {departmentToEdit
                    ? "Editar departamento"
                    : "Solicitar producto"}
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={CerrarModal}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Cerrar modal</span>
                </button>
              </div>
              <form
                className="p-4 md:p-5"
                onSubmit={
                  departmentToEdit
                    ? handleUpdateDepartment
                    : handleAddDepartment
                }
              >
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Nombre del departamento
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      defaultValue={
                        departmentToEdit ? departmentToEdit.name : ""
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Nombre del departamento"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="address"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Dirección
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      defaultValue={
                        departmentToEdit ? departmentToEdit.address : ""
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Dirección del departamento"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="text-white flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <svg
                    className="me-1 -ms-1 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {departmentToEdit ? "Actualizar" : "Solicitar"}
                </button>
              </form>
            </div>
          </div>
        </div>
     )}*/}

       {modalType === "create" && (
        <ModalCrearProduct onClose={handleCloseModal} onSubmit={handleSubmit} />
      )}
    </>
  );
};

export default Department;