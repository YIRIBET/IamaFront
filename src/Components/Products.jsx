import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
// Importa tus modales si están disponibles
// import ModalUpdateProduct from "./ModalUpdateProduct";
// import ModalDeleteProduct from "./ModalDeleteProduct";

function Product() {
  const [products, setProducts] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    productId: "",
    newName: "",
    newDescription: "",
    categoryId: "",
    departmentId: "",
    reason: ""
  });
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    // Fetch products
    fetch("http://localhost:8080/api/product/")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });

    // Fetch categories and departments for the select fields
    fetch("http://localhost:8080/api/category/")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });

    fetch("http://localhost:8080/api/department/")
      .then((response) => response.json())
      .then((data) => {
        setDepartments(data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
      });
  }, []);

  const handleOpenModal = (type, product) => {
    setModalType(type);
    setCurrentProduct(product);

    if (product) {
      setFormData({
        productId: product.id || "",
        newName: product.name || "",
        newDescription: product.description || "",
        categoryId: product.categoryBean?.id || "",
        departmentId: product.departmentBean?.[0]?.id || "",
        reason: product.reason || "" // Initialize or update reason if needed
      });
    }
  };

  const handleCloseModal = () => {
    setModalType(null);
    setCurrentProduct(null);
    setFormData({
      productId: "",
      newName: "",
      newDescription: "",
      categoryId: "",
      departmentId: "",
      reason: ""
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentProduct) return;
  
    const id = currentProduct.id;
    const type = "UPDATE"; // Cambiar a "POST" o "DELETE" según el tipo de solicitud
  
    try {
      const response = await fetch(`http://localhost:8080/api/productRequest/saveReq`, {
        method: "POST", // Asegúrate de usar el método correcto
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          reqType: type,
          productBean: { id: formData.productId },
          categoryBean: { id: formData.categoryId },
          departmentBean: { id: formData.departmentId },
          newDescription: formData.newDescription,
          newName: formData.newName,
          reason: formData.reason,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong!");
      }
  
      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Solicitud enviada correctamente",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      Swal.fire({
        position: "top-center",
        icon: "error",
        title: "Error",
        text: err.message,
        showConfirmButton: true,
      });
    } finally {
      handleCloseModal();
    }
  };
  //Enviar solicitud para eliminar
  const handleSubmitDelete = async (e) => {
    e.preventDefault();
    if (!currentProduct) return;
  
    const id = currentProduct.id;
    const type = "DELETE"; // Cambiar a "POST" o "DELETE" según el tipo de solicitud
  
    try {
      const response = await fetch(`http://localhost:8080/api/productRequest/saveReq`, {
        method: "POST", // Asegúrate de usar el método correcto
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          reqType: type,
          productBean: { id: formData.productId },
          categoryBean: { id: formData.categoryId },
          departmentBean: { id: formData.departmentId },
          newDescription: formData.newDescription,
          newName: formData.newName,
          reason: formData.reason,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong!");
      }
  
      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Solicitud enviada correctamente",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      Swal.fire({
        position: "top-center",
        icon: "error",
        title: "Error",
        text: "El Producto no esta asignado a un departamento",
        showConfirmButton: true,
      });
    } finally {
      handleCloseModal();
    }
  };
  
  

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Nombre del Producto</th>
              <th scope="col" className="px-6 py-3">Descripción</th>
              <th scope="col" className="px-6 py-3">Categoría</th>
              <th scope="col" className="px-6 py-3">Departamento</th>
              <th scope="col" className="px-6 py-3">Acción</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {product.name}
                </th>
                <td className="px-6 py-4">{product.description}</td>
                <td className="px-6 py-4">{product.categoryBean.categoryName}</td>
                <td className="px-6 py-4">
                {product.departmentBean.name}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleOpenModal('update', product)}
                    type="button"
                    className="text-gray-400 bg-yellow-500 hover:bg-yellow-200 hover:text-yellow-900 rounded-lg text-sm w-10 h-10 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    <svg
                      className="w-8 h-8 text-gray-800 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() => handleOpenModal('delete', product)}
                    type="button"
                    className="text-gray-400 bg-red-500 hover:bg-red-200 hover:text-red-900 rounded-lg text-sm w-10 h-10 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    <svg
                      className="w-8 h-8 text-gray-800 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para actualización */}
      {modalType === 'update' && (
          <div
          id="default-modal"
          aria-hidden="true"
          className="fixed inset-0 z-50 flex justify-center items-center bg-gray-800 bg-opacity-50"
        >
          <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Crear Producto
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-2.5 dark:hover:bg-gray-600 dark:hover:text-white"
                aria-label="Close modal"
              >
                <svg
              className="w-5 h-5"
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
                d="M1 1l12 12M1 13l12-12"
              />
            </svg>
              </button>
            </div>
            <form className="p-3 space-y-1" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Nombre
                </label>
                <input
                  type="text"
                  name="newName"
                  value={formData.newName}
                  onChange={handleChange}
                  className="border rounded-lg p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Descripción
                </label>
                <input
                  name="newDescription"
                  value={formData.newDescription}
                  onChange={handleChange}
                  className="border rounded-lg p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoryId">
                  Categoría
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="border rounded-lg p-2 w-full"
                  required
                >
                  <option value="">Seleccione una categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="departmentId">
                  Departamento
                </label>
                <select
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleChange}
                  className="border rounded-lg p-2 w-full"
                  required
                >
                  <option value="">Seleccione un departamento</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reason">
                  Motivo (opcional)
                </label>
                <textarea
                  type="text"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className="border rounded-lg p-2 w-full"
                />
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-yellow-500 text-white px-8 py-2 rounded-lg mr-2"
                >
                  Enviar
                </button>
               
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para eliminación (si lo implementas) */}
      {modalType === 'delete' && (
        <div
        id="default-modal"
        aria-hidden="true"
        className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full bg-gray-800 bg-opacity-50"
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full bg-white rounded-lg shadow dark:bg-gray-800">
          <button
            type="button"
            onClick={handleCloseModal}
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <svg
              className="w-5 h-5"
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
                d="M1 1l12 12M1 13l12-12"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Delete Product
            </h3>
            <form onSubmit={handleSubmitDelete}>
              <div className="my-4">
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Reason for Deletion
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className="block w-full p-2.5 text-gray-900 bg-gray-50 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Reason for deletion"
                  required
                />
              </div>
              <button
                type="submit"
                className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
              >
                Delete Product
              </button>
            </form>
          </div>
        </div>
      </div>
      )}
    </>
  );
}

export default Product;
