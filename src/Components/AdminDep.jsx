import { useState, useEffect } from "react";
import Swal from "sweetalert2";

function AdminDep() {
  const [AbrirCrearDep, SetCrearDep] = useState(false);
  const [AbrirModalUpdate, setModalUpdate] = useState(false);
  const [AbrirCrearProductDep, setCrearProduct] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [departmentToEdit, setDepartmentToEdit] = useState(null);
const [products,setProducts] = useState([]);
const [categories, setCategories] = useState([]); //objeto categoria
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/department/");
      const data = await response.json();
      setDepartments(data.data || []);
    } catch (error) {
      console.error("There was an error fetching the departments!", error);
    }
  };

  // Abrir y cerrar modales
  const CrearNuevoDep = () => {
    SetCrearDep(true);
  };

  const CerrarNuevoDep = () => {
    SetCrearDep(false);
  };

  const OpenModalUpdate =(department) =>{
    setDepartmentToEdit(department);
    setModalUpdate(true);
  }
const CloseModalUpdate =()=> setModalUpdate(false);

const OpenCreateProduct = () => setCrearProduct(true);
const CloseCreateProduct = () => setCrearProduct(false);


  const saveDep = (event) => {
    event.preventDefault();

    const newDepartment = {
      name: event.target.name.value,
      address: event.target.address.value
    };

    fetch("http://localhost:8080/api/department/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newDepartment),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "OK") {
          // Añadir el nuevo usuario a la lista de usuarios en el estado
          setDepartments([...departments, data.data]);
          CerrarNuevoDep(); // Cerrar el modal
        } else {
          console.error("Error al guardar el departamento", data.message);
        }
      })
      .catch((error) => {
        console.error("Hubo un error al guardar el departamento", error);
      });
  };
  //
  const handleUpdateDepartment = (event) => {
    event.preventDefault();
    const updateDepartment = {
      ...departmentToEdit,
      name: event.target.name.value,
      address: event.target.address.value
    };

    fetch("http://localhost:8080/api/department/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateDepartment),
    })
      .then((response) => response.json())
      .then((data) => {
        setDepartments(
          departments.map((department) =>
            department.id === updateDepartment.id ? data : department
          )
        );
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Departamento actualizado correctamente",
          showConfirmButton: false,
          timer: 1500,
        });
        CloseModalUpdate(false);
      })
      .catch((error) => {
        console.error("Ocurrio un error al actualizar el departamento!", error);
      });
  };
  //
  const deleteDepartment = (id) => {
    fetch(`http://localhost:8080/api/department/delete/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setDepartments(
            departments.filter((department) => department.id !== id)
          );
        } else {
          console.error("Error al borrar la categoría");
        }
      })
      .catch((error) => {
        console.error("Error al borrar la categoría", error);
      });
  };

  const abrirDelete = (id) => {
    Swal.fire({
      title: "¿Estás seguro de eliminar esta categoría?",
      text: "Se eliminará esta categoría permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar!",
      cancelButtonText: "cancelar!",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteDepartment(id);
        Swal.fire(
          "Eliminado correctamente!",
          "La categoria ha sido eliminada.",
          "success"
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelado", "La categoria no ha sido eliminada.", "error");
      }
    });
  };

  //Crear producto con departamento 
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


  return (
    <>
      <div className="">
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div className="flex flex-wrap items-center justify-between mx-auto">
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
              onClick={CrearNuevoDep}
              type="submit"
              className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Crear departamento
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
              Departamentos
            </h5>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {departments.map((department) => (
              <a
                href="#"
                key={department.id}
                className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                    {department.name}
                  </h5>
                  <button
                    onClick={() => abrirDelete(department.id)}
                    type="submit"
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
                    <span className="sr-only">Icon description</span>
                  </button>
                </div>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  Dirección: {department.address}
                </p>
                <div className="flex justify-end items-end">
                  <button
                  onClick={()=>OpenCreateProduct(department)}
                    type="button"
                    className="mt-4 text-white hover:bg-blue-200 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:bg-white-600 dark:hover:bg-white-700 dark:focus:ring-white-800"
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
                        d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </button>

                  <button
                  onClick={()=>OpenModalUpdate(department)}
                    type="button"
                    className="text-white hover:bg-yellow-200 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:bg-white-600 dark:hover:bg-white-700 dark:focus:ring-white-800"
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
                    <span className="sr-only">Icon description</span>
                  </button>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {AbrirCrearDep && (
        <div
          id="crud-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
        >
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 md:p-6">
            <div className="flex justify-between items-center pb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Crear nuevo departamento
              </h3>
              <button
                onClick={CerrarNuevoDep}
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

            <form className="space-y-4" onSubmit={saveDep}>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-900"
              >
                Nombre
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="border border-gray-300 rounded-lg w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Escritorio"
                required
              />

              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-900"
              >
                Dirección
              </label>
              <input
                type="text"
                name="address"
                id="address"
                className="border border-gray-300 rounded-lg w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Escritorio"
                required
              />
              <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:bg-blue-700 rounded-lg"
            >
              Crear departamento
            </button>
            </form>

            
          </div>
        </div>
      )}

{AbrirModalUpdate && (
        <div
          id="crud-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
        >
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 md:p-6">
            <div className="flex justify-between items-center pb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Crear nuevo departamento
              </h3>
              <button
                onClick={CloseModalUpdate}
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

            <form className="space-y-4" onSubmit={handleUpdateDepartment}>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-900"
              >
                Nombre
              </label>
              <input
                type="text"
                name="name"
                id="name"
                defaultValue={departmentToEdit.name}

                className="border border-gray-300 rounded-lg w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Escritorio"
                required
              />

              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-900"
              >
                Dirección
              </label>
              <input
                type="text"
                name="address"
                id="address"
                defaultValue={departmentToEdit.address}
                className="border border-gray-300 rounded-lg w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Escritorio"
                required
              />
              <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:bg-blue-700 rounded-lg"
            >
              Crear departamento
            </button>
            </form>

            
          </div>
        </div>
      )}
      
      {AbrirCrearProductDep && (
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
                onClick={CloseCreateProduct}
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
    </>
  );
}
export default AdminDep;
