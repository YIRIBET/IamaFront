/*import React, { useState, useEffect } from "react";

function ModalDeleteProduct({ onClose, onSubmit, product }) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (product) {
      // Resetea el estado del motivo cuando se abre el modal para un nuevo producto
      setReason("");
    }
  }, [product]);

  const handleChange = (e) => {
    setReason(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (product && product.id) {
      onSubmit({
        id: product.id,
        reason,
      });
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Delete Product</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Product ID</label>
            <input
              type="text"
              value={product?.id || ""}
              readOnly
            />
          </div>
          <div>
            <label>Reason</label>
            <input
              type="text"
              value={reason}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Delete</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default ModalDeleteProduct;*/
