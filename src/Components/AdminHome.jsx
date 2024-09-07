import { useState, useEffect } from "react";


function AdminHome() {
  const [solicitudes, setSolicitudes] =useState ([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/productRequest/")
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setSolicitudes(data.data || []);
      })
      .catch((error) => {
        console.error("Ocurrió un error encontrando solicitudes", error);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/productRequest/findOne/{id}")
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setSolicitudes(data.data || []);
      })
      .catch((error) => {
        console.error("Ocurrió un error encontrando solicitudes", error);
      });
  }, []);

 
  const ApproveReq = (id) => {
    fetch(`http://localhost:8080/api/productRequest/approve/${id}`, {
      method: "PUT",
    })
      .then((response) => {
        if (response.ok) {
          setSolicitudes(solicitudes.filter((solicitud) => solicitud.id !== id));
        } else {
          console.log(data);
        }
      })
      .catch((error) => {
        console.error("Hubo un error ", error);
      });
  };
  

  return (
    <>
     
      <div class="">
        <div class="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-1">
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
              type="button"
              class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Reporte
            </button>
          </div>

          <div className="flex flex-end mb-4">
           
            <h5 class="mb-2 mt-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Solicitudes
            </h5>
          </div>
          <div className=" grid grid-cols-2 md:grid-cols-3 gap-4">
          {solicitudes.length === 0 ? (
          <p>No hay solicitudes disponibles</p>
        ) : (
          solicitudes.map((solicitud) => (
            <a
              href="#"
              key={solicitud.id}
              className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                {solicitud.newName} 
                </h5>
                <button
                 onClick={() =>abrirDelete(solicitud.id)}
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
              <p className="font-normal text-gray-700 dark:text-gray-400">
              {solicitud.newDescription} 
              </p>
              <p className="font-normal text-gray-700 dark:text-gray-400">
              Razón: {solicitud.reason}
              </p>
              <div className="flex space-x-2 justify-end items-end mr-4">
                <button
                  type="button"
                  onClick={() => ApproveReq(solicitud.id)}

                  className="mt-4 text-white bg-green-200 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:bg-white-600 dark:hover:bg-white-700 dark:focus:ring-white-800"
                >
                  <svg
                    class="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 11.917 9.724 16.5 19 7.5"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  className="text-white bg-red-200 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:bg-white-600 dark:hover:bg-white-700 dark:focus:ring-white-800"
                >
                  <svg
                    class="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18 17.94 6M18 18 6.06 6"
                    />
                  </svg>
                </button>
              </div>
            </a>
             ))
            )}
          </div>
          
        </div>
      </div>
    </>
  );
}
export default AdminHome;
