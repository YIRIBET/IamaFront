import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

function AdminProduc() {
  const [products, setProducts] = useState([]); //objeto usuarios
  const [productToEdit, setProductToEdit] = useState(null);
  const [modal, setOpenModal] = useState(false); //Hook para guardar
  const [modalUpdate, setOpenModalUpdate] = useState(false); //Hook para actualizar
  const [categories, setCategories] = useState([]); //objeto categoria
  const [departments, setDepartments] = useState([]); //objeto de departamento

  useEffect(() => {
    fetch("http://localhost:8080/api/product/")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.data || []);
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
      });
  }, []);

  //Guardar producto
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
// Abrir y cerrar modales
const openModal = () => setOpenModal(true);
const closeModal = () => setOpenModal(false);
const OpenModalUpdate = (product) => {
  setProductToEdit(product);
  setOpenModalUpdate(true);
};
const CerrarModalUpdate = () => setOpenModalUpdate(false);


  const saveProduct = (event) => {
    event.preventDefault();

    const newProduct = {
      name: event.target.name.value,
      description: event.target.description.value,
      categoryBean: {
        id: event.target.categoryId.value,
      },
      departmentBeans: [
        {
          id: event.target.departmentId.value,
        },
      ],
    };
    //peticion para guardar productos
    fetch("http://localhost:8080/api/product/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.message || "Error en la solicitud");
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === "OK") {
          setProducts([...products, data.data]);
          Swal.fire({
            position: "top-center",
            icon: "success",
            title: "Producto creado correctamente",
            showConfirmButton: false,
            timer: 1500,
          });
          closeModal(true);
        } else {
          console.error("Error al guardar el producto ", data.message);
        }
      })
      .catch((error) => {
        console.error("Hubo un error al guardar el producto ", error);
      });
  };


// Actualizar producto
const handleUpdateProduct = (event) => {
  event.preventDefault();
  const updatedProduct = {
    id: productToEdit.id, // Asegúrate de incluir el ID del producto
    name: event.target.name.value,
    description: event.target.description.value,
    categoryBean: {
      id: event.target.categoryId.value,
    },
    departmentBeans: [
      {
        id: event.target.departmentId.value,
      },
    ],
  };

  fetch("http://localhost:8080/api/product/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedProduct),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        setProducts(
          products.map((product) =>
            product.id === updatedProduct.id ? data.data : product
          )
        );

      
        
        console.error(
          "Actualizado correctamente",
          data.message
        );
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Producto actualizado correctamente",
          showConfirmButton: false,
          timer: 1500,
        });
        CerrarModalUpdate(true);
      }
    })
    .catch((error) => {
      console.error("Hay un error intentando actualizar el producto", error);
    });
};


  //eliminar producto
  const deleteProduct = (id) => {
    fetch(`http://localhost:8080/api/product/delete/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setProducts(products.filter((product) => product.id !== id));
        } else {
          console.error("Error al borrar el producto");
        }
      })
      .catch((error) => {
        console.error("Error al borrar el producto", error);
      });
  };

  //alerta para eliminar producto
  const abrirDelete = (id) => {
    Swal.fire({
      title: "¿Estás seguro de eliminar el producto?",
      text: "Se eliminará este producto permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar!",
      cancelButtonText: "No, cancelar!",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProduct(id);
        Swal.fire(
          "Eliminado correctamente!",
          "El producto ha sido eliminado.",
          "success"
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelado", "El producto no ha sido eliminado.", "error");
      }
    });
  };

  return (
    <>
      <div className="">
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-1">
            <label htmlFor="table-search" className="sr-only">
              Buscar
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                id="table-search"
                className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Buscar"
              />
            </div>
            <button
              onClick={openModal}
              type="submit"
              className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Crear producto
            </button>
            <button
              type="button"
              className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Reporte
            </button>
          </div>
          <h5 className="mb-2 mt-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Productos
          </h5>

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Nombre del Producto
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Descripción
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Categoría
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Departamento
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {product.name}
                    </th>
                    <td className="px-6 py-4">{product.description}</td>
                    <td className="px-6 py-4">
                      {product.categoryBean.categoryName}
                    </td>
                    <td className="px-6 py-4">
                      {product.departmentBeans.map((department) => (
                        <div key={department.id}>{department.name}</div>
                      ))}
                    </td>
                    <td className="px-6 py-4">
                      <button
                         onClick={() => OpenModalUpdate(product)}
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
                        onClick={() => abrirDelete(product.id)}
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
        </div>
      </div>

      {modal && (
        <div
          id="default-modal"
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full bg-gray-800 bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-2xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Crear producto
              </h3>
              <button
                type="button"
                onClick={closeModal}
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

            <form className="max-w-md mx-auto" onSubmit={saveProduct}>
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder="Nombre del producto"
                  required
                />
                <label
                  htmlFor="name"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                ></label>
              </div>

              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="description"
                  id="description"
                  maxLength="255" // Limita a 255 caracteres
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder="Descripción del producto"
                  required
                />

                <label
                  htmlFor="description"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                ></label>
              </div>

              <div className="relative z-0 w-full mb-5 group">
                <select
                  name="categoryId"
                  id="categoryId"
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
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Categoría
                </label>
              </div>

              <div className="relative z-0 w-full mb-5 group">
                <select
                  name="departmentId"
                  id="departmentId"
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
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Departamento
                </label>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:bg-blue-700 rounded-lg"
              >
                Crear Producto
              </button>
            </form>
          </div>
        </div>
      )}

{modalUpdate && productToEdit && (
          <div
            id="default-modal"
            aria-hidden="true"
            className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full bg-gray-800 bg-opacity-50"
          >
            <div className="relative p-4 w-full max-w-2xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Actualizar Producto
                </h3>
                <button
                  type="button"
                  onClick={CerrarModalUpdate}
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

              <form className="max-w-md mx-auto"   onSubmit={handleUpdateProduct}>
                <div className="relative z-0 w-full mb-5 group">
                <h1>Nueva descripción</h1>
                <input
                  type="text"
                  name="name"
                  defaultValue={productToEdit.name}
                  required
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full"
                />
                
                 
                </div>

                <div className="relative z-0 w-full mb-5 group">
                <h1>Nueva descripción</h1>
                <input
                  type="text"
                  name="description"
                  defaultValue={productToEdit.description}
                  required
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full"
                />
                 
                </div>

                <div className="relative z-0 w-full mb-5 group">
                <h1>Categoría</h1>
                <select
                  name="categoryId"
                  defaultValue={productToEdit.categoryBean?.id || ""}
                  required
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
                  <label
                    htmlFor="categoryId"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Categoría
                  </label>
                </div>

                <div className="relative z-0 w-full mb-5 group">
                <h1>Departamento</h1>
                <select
                  name="departmentId"
                  defaultValue={productToEdit.departmentBeans[0]?.id || ""}
                  required
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full"
                >
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
                  <label
                    htmlFor="departmentId"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Departamento
                  </label>
                </div>

                <button
                
                  type="submit"
                  className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:bg-blue-700 rounded-lg"
                >
                  Actualizar Producto
                </button>
              </form>
            </div>
          </div>
        )}
    </>
  );
}

export default AdminProduc;
