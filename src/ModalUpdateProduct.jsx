import React, { useState, useEffect } from "react";

function ModalUpdateProduct({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    productId: "",
    categoryId: "",
    departmentId: "",
    newDescription: "",
    newName: "",
    reason: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit("UPDATE", formData);
  };


  const [categories, setCategories] = useState([]); //objeto categoria
  const [departments, setDepartments] = useState([]); //objeto de departamento
  useEffect(() => {
    // mostrar de categorías para crear producto
    fetch("http://localhost:8080/api/category/")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched categories:", data);
        setCategories(data.data || []);
      })
      .catch((error) => {
        console.error("No se encontraron categorías", error);
      });
  }, []);

  useEffect(() => {
    // mostrar departamentos para crear producto
    const fetchDepartments = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/department/");
        const data = await response.json();
        console.log("Fetched departments:", data);
        setDepartments(data.data || []);
      } catch (error) {
        console.error("No se encontraron departamentos", error);
      }
    };

    fetchDepartments();
  }, []);



  return (
    <div
  id="default-modal"
  aria-hidden="true"
  className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full bg-gray-800 bg-opacity-50"
>
  <div className="relative p-4 w-full max-w-2xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
        Actualizar producto
      </h3>
      <button
        type="button"
        onClick={onClose}
        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
        aria-label="Close modal"
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
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>

    <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
      <div className="relative z-0 w-full mb-5 group">
        <input
          type="text"
          name="productId"
          value={formData.productId}
          onChange={handleChange}
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder="Producto ID"
          required
        />
      </div>
      <div className="relative z-0 w-full mb-5 group">
        <input
          type="text"
          name="newName"
          value={formData.newName}
          onChange={handleChange}
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder="Nuevo nombre"
        />
      </div>

      <div className="relative z-0 w-full mb-5 group">
        <input
          type="text"
          name="newDescription"
          value={formData.newDescription}
          onChange={handleChange}
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder="Descripción"
        />
      </div>

     

      <div className="relative z-0 w-full mb-5 group">
        <input
          type="text"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder="Razón"
        />
      </div>
      <div className="relative z-0 w-full mb-5 group">
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              required
            >
              <option value="" disabled selected>
                Selecciona una categoría
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.categoryName}
                </option>
              ))}
            </select>
            <label
              htmlFor="categoryId"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Categoría
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              required
            >
              <option value="" disabled selected>
                Selecciona un departamento
              </option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
            <label
              htmlFor="departmentId"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Departamento
            </label>
          </div>

      <div className="flex justify-end space-x-4">
        
        <button
          type="submit"
          className="px-4 py-2 text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg"
        >
          Update
        </button>
      </div>
    </form>
  </div>
</div>

  );
}

export default ModalUpdateProduct;
