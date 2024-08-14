import React, { useState, useEffect } from 'react';
import Departament from './Departament'; // Asegúrate de ajustar la ruta según tu estructura de carpetas
import Products from './Products'; // Asegúrate de ajustar la ruta según tu estructura de carpetas
import Category from './Category'; // Asegúrate de ajustar la ruta según tu estructura de carpetas
import ModalCrearProduct from "./ModalCrearProduct";
import Swal from "sweetalert2";

import '../App.css';

function Home() {
  
 
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

  const [componenteVisible, setComponenteVisible] = useState(null);

  const handleMostrarDepartamento = () => { //abre el componente de departamento
    setComponenteVisible('departamento');
  };

  const handleMostrarProducto = () => { //abre el componente de producto
    setComponenteVisible('producto');
  };

  const handleMostrarCategoria = () => { // abre el componente de categoria
    setComponenteVisible('categoria');
  };


  return (
    <>
      

<nav className="bg-white border-gray-200 dark:bg-gray-900">
    <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
        
        <img
              src="src\assets\LOGOiAMA.png"
              className="h-11 me-3 sm:h-90"
              alt="Logo"
            />
            
        <div className="flex items-center space-x-6 rtl:space-x-reverse">
            <a href="tel:5541251234" className="text-sm  text-gray-500 dark:text-white hover:underline">(555) 412-1234</a>
            <a href="#" className="text-sm  text-blue-600 dark:text-blue-500 hover:underline">Login</a>
        </div>
    </div>
</nav>


      <div className="p-2 sm:ml-4 sm:mb-4">
        <div className=" mb-25 p-6   bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between ">
            <label htmlFor="table-search" className="sr-only">buscar</label>
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
                placeholder="Search for items"
              />
            </div>
            <button
            onClick={() => handleOpenModal("create")}
             // onClick={openModalCreate}
              type="submit"
              className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Crear producto
            </button>
            <button
              type="button"
              //onClick={OpenHojaDEH}
              className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Hoja de deshecho
            </button>
          </div>
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <button
            onClick={handleMostrarProducto}
              type="button"
              className="py-5 px-10 focus:outline-none focus:ring-4 focus:ring-green-300 text-m font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-green-100 hover:text-green-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"            >
              Productos
            </button>
            <button
              onClick={handleMostrarDepartamento}
              type="button"
              className="py-5 px-10 focus:outline-none focus:ring-4 focus:ring-green-300 text-m font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-green-100 hover:text-green-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"            
              >
              Departamentos
            </button>
            <button
            onClick={handleMostrarCategoria}
              type="button"
              className="py-5 px-10 focus:outline-none focus:ring-4 focus:ring-green-300 text-m font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-green-100 hover:text-green-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"            >

              Categorias
            </button>
          </div>

          {componenteVisible === 'departamento' && <Departament />}
            {componenteVisible === 'producto' && <Products />}
            {componenteVisible === 'categoria' && <Category />}
        </div>
      </div>
      {modalType === "create" && (
        <ModalCrearProduct onClose={handleCloseModal} onSubmit={handleSubmit} />
      )}
 
    </>
  );
}

export default Home;
