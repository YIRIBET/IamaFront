import { useState, useEffect } from "react";
import Swal from 'sweetalert2';

function Category() {
  const [categories, setCategories] = useState([]);
  const [modalVCategory, setModalVCategory] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/category/")
      .then((response) => response.json())
      .then((data) => {
        console.log(data); 
        setCategories(data.data || []);
      })
      .catch((error) => {
        console.error("Error al encontrar categorías", error);
      });
  }, []);

  const MostrarModalCategory = (category) => {
    setCategoryToEdit(category);
    setModalVCategory(true);
  };

  const CerrarModalCategory = () => setModalVCategory(false);

  return (
    <>
     <div className="flex flex-end mb-4">
        
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.length === 0 ? (
          <p>No hay categorías disponibles</p>
        ) : (
          categories.map((category) => (
            <a
              href="#"
              key={category.id}
              className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <div className="flex items-center justify-center mb-4">
                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                  {category.categoryName} 
                </h5>
              </div>
            </a>
          ))
        )}
      </div>
    </>
  );
}

export default Category;
