import { useState, useEffect } from "react";

function Search() {
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredItems, setFilteredItems] = useState({
    products: [],
    categories: [],
    departments: [],
    users: [],
    solicitudes: [],
  });

  useEffect(() => {
    // Fetch all data in parallel
    const fetchData = async () => {
      try {
        const [productsData, categoriesData, departmentsData, usersData, solicitudesData] = await Promise.all([
          fetch("http://localhost:8080/api/product/").then((response) => response.json()),
          fetch("http://localhost:8080/api/category/").then((response) => response.json()),
          fetch("http://localhost:8080/api/department/").then((response) => response.json()),
          fetch("http://localhost:8080/api/users/").then((response) => response.json()),
          fetch("http://localhost:8080/api/productRequest/").then((response) => response.json()),
        ]);

        setProducts(productsData.data || []);
        setCategories(categoriesData.data || []);
        setDepartments(departmentsData.data || []);
        setUsers(usersData.data || []);
        setSolicitudes(solicitudesData.data || []);
        setFilteredItems({
          products: productsData.data || [],
          categories: categoriesData.data || [],
          departments: departmentsData.data || [],
          users: usersData.data || [],
          solicitudes: solicitudesData.data || [],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFilteredItems({
      products: products.filter((product) =>
        product.name?.toLowerCase().includes(search.toLowerCase())
      ),
      categories: categories.filter((category) =>
        category.categoryName?.toLowerCase().includes(search.toLowerCase())
      ),
      departments: departments.filter((department) =>
        department.name?.toLowerCase().includes(search.toLowerCase())
      ),
      users: users.filter((user) =>
        user.name?.toLowerCase().includes(search.toLowerCase())
      ),
      solicitudes: solicitudes.filter((solicitud) =>
        solicitud.reason?.toLowerCase().includes(search.toLowerCase())
      ),
    });
  }, [search, products, categories, departments, users, solicitudes]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  return (
    <>
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
            value={search}
            onChange={handleSearchChange}
            className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search for items"
          />
        </div>
        <button
          type="button"
          className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          Reporte
        </button>
      </div>
      <ul>
        {filteredItems.products.map((product, index) => (
          <li key={`${product.id}-${index}`}>{product.name}</li>
        ))}
        {filteredItems.categories.map((category, index) => (
          <li key={`${category.id}-${index}`}>{category.categoryName}</li>
        ))}
        {filteredItems.departments.map((department, index) => (
          <li key={`${department.id}-${index}`}>{department.name}</li>
        ))}
        {filteredItems.users.map((user, index) => (
          <li key={`${user.id}-${index}`}>{user.name}</li>
        ))}
        {filteredItems.solicitudes.map((solicitud, index) => (
          <li key={`${solicitud.id}-${index}`}>{solicitud.reason}</li>
        ))}
      </ul>
    </>
  );
}

export default Search;
