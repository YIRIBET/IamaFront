import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

function AdminCateg() {
  const [categories, setCategories] = useState([]);
  const [AbrirCrearCategory, SetCrearCategory] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/category/")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data); // Verifica la estructura de los datos aquí
        setCategories(data.data || []);
      })
      .catch((error) => {
        console.error("There was an error fetching the categories!", error);
      });
  }, []);

  // crear category
  const CrearNuevoCategory = () => {
    SetCrearCategory(true);
  };

  const CerrarNuevoCategory = () => {
    SetCrearCategory(false);
  };
  const saveCategory = (event) => {
    event.preventDefault();

    const newCategory = {
      categoryName: event.target.categoryName.value,
    };

    fetch("http://localhost:8080/api/category/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCategory),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "OK") {
          setCategories([...categories, data.data]);
          CerrarNuevoCategory(); // Cerrar el modal
        } else {
          console.error("Error al guardar la categoría:", data.message);
        }
      })
      .catch((error) => {
        console.error("Hubo un error al guardar la categoría:", error);
      });
  };

  //
  const OpenModalUpdateCategory = (category) => {
    setCategoryToEdit(category);
    setModalUpdate(true);
  };

  const CerrarModalUpCategory = () => setModalUpdate(false);

  const handleUpdateCategory = (event) => {
    event.preventDefault();
    const updatedCategory = {
      ...categoryToEdit,
      categoryName: event.target.categoryName.value,
    };

    fetch("http://localhost:8080/api/category/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCategory),
    })
      .then((response) => response.json())
      .then((data) => {
        setCategories(
          categories.map((category) =>
            category.id === updatedCategory.id ? data : category
          )
        );
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Producto actualizado correctamente",
          showConfirmButton: false,
          timer: 1500,
        });
        CerrarModalUpCategory(false);
      })
      .catch((error) => {
        console.error("Ocurrio un error al actualizar la categoría!", error);
      });
  };

  //eliminar ---Elimina solo si no esta asignada a un producto ---

  const deleteCategory = (id) => {
      fetch(`http://localhost:8080/api/category/delete/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            setCategories(categories.filter((category) => category.id !== id));
          } else {
            console.error("Error al borrar el producto");
            Swal.fire({
              position: "top-center",
              icon: "error",
              title: "Esta categoría es utilizada en productos",
              showConfirmButton: false,
              timer: 2500,
            });
          }
        })
        .catch((error) => {
          console.error("Error al borrar el producto", error);
          
        });
    };
  
    //alerta para eliminar producto
    const abrirDelete = (id) => {
      Swal.fire({
        title: "¿Estás seguro de eliminar esta categoría?",
        text: "Se eliminará esta categoría permanentemente.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar!",
        cancelButtonText: "No, cancelar!",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          deleteCategory(id);
          Swal.fire(
            "Eliminada correctamente!",
            "La categoría ha sido eliminada.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Cancelado", "La categoría no ha sido eliminada.", "error");
        }
      });
    };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-1">
        <label htmlFor="table-search" className="sr-only">
          Search
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
          onClick={CrearNuevoCategory}
          type="button"
          className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          Crear categoría
        </button>
        <button
          type="button"
          className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          Reporte
        </button>
      </div>

      <div className="flex flex-end mb-4">
        <h5 className="mb-2 mt-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Categoría
        </h5>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {categories.length === 0 ? (
          <p>No hay categorías disponibles</p>
        ) : (
          categories.map((category) => (
            <a
              key={category.id}
              className=" max-sm p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <div className="flex items-center justify-between mb-1">
                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                  {category.categoryName}
                </h5>
                <button
                  onClick={() => abrirDelete(category.id)}
                  type="button"
                  className="text-white hover:bg-red-200 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:bg-white-600 dark:hover:bg-white-700 dark:focus:ring-white-800"
                >
                  <svg
                    className="w-[31px] h-[31px] text-gray-800 dark:text-white"
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
              </div>

              <div className="flex justify-end items-end">
                <button
                  type="button"
                  className="mt-4 ml-1 text-white hover:bg-yellow-200 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:bg-white-600 dark:hover:bg-white-700 dark:focus:ring-white-800"
                  onClick={() => OpenModalUpdateCategory(category)}
                >
                  <svg
                    className="w-[31px] h-[31px] text-gray-800 dark:text-white"
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
              </div>
            </a>
          ))
        )}
      </div>

      {AbrirCrearCategory && (
        <div
          id="crud-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
        >
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 md:p-6">
            <div className="flex justify-between items-center pb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Crear nuevo categoría
              </h3>
              <button
                onClick={CerrarNuevoCategory}
                className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg w-8 h-8 flex items-center justify-center"
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

            <form className="space-y-4" onSubmit={saveCategory}>
              <label
                htmlFor="categoryName"
                className="block text-sm font-medium text-gray-900"
              >
                Nombre
              </label>
              <input
                type="text"
                name="categoryName"
                id="categoryName"
                className="border border-gray-300 rounded-lg w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Escritorio"
                required
              />

              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:bg-blue-700 rounded-lg"
              >
                Crear categoría
              </button>
            </form>
          </div>
        </div>
      )}

      {modalUpdate && (
        <div
          id="crud-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
        >
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 md:p-6">
            <div className="flex justify-between items-center pb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Crear nuevo categoría
              </h3>
              <button
                onClick={CerrarModalUpCategory}
                className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg w-8 h-8 flex items-center justify-center"
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

            <form className="space-y-4" onSubmit={handleUpdateCategory}>
              <label
                htmlFor="categoryName"
                className="block text-sm font-medium text-gray-900"
              >
                Nombre
              </label>
              <input
                type="text"
                name="categoryName"
                id="categoryName"
                defaultValue={categoryToEdit.categoryName}
                className="border border-gray-300 rounded-lg w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Escritorio"
                required
              />

              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:bg-yellow-700 rounded-lg"
              >
                Actualizar categoría
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCateg;
