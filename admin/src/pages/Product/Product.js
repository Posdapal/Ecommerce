// import React from "react";
// import { useEffect, useState } from "react";
// import { Card, Table } from 'react-bootstrap';
// import axios from "axios";
// import { FaEdit, FaTrash } from 'react-icons/fa';

// const API_BASE = "http://localhost:8081";
// const UPLOADS_BASE = `${API_BASE}/uploads/`;

// // helper: turn a stored filename into a loadable URL
// const getImageUrl = (filename) => {
//   if (!filename) return null;
//   if (filename.startsWith("http") || filename.startsWith("blob:")) return filename;
//   return `${UPLOADS_BASE}${filename}`;
// };

// // helper: show the real error message from the server
// const showError = (title, error) => {
//   const message = error.response?.data?.message || error.response?.data?.error || error.message;
//   console.log(title, error.response?.data || error);
//   alert(`${title}\n${message}`);
// };

// const Product = () => {

//   // list of products (for the table)
//   const [list, setList] = useState([]);

//   // list of categories (for the dropdown)  <-- NEW
//   const [categoryList, setCategoryList] = useState([]);

//   const [products, setProducts] = useState({
//     category_id: "",
//     name: "",
//     price: "",
//     image: null,
//   });
//   const [imagePreview, setImagePreview] = useState(null);

//   const [updateproducts, setUpdateproducts] = useState({
//     product_id: "",
//     category_id: "",
//     name: "",
//     price: "",
//     image: null,
//     old_image: "",
//   });
//   const [updateImagePreview, setUpdateImagePreview] = useState(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProducts({ ...products, [name]: value });
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setProducts({ ...products, image: file });
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setUpdateproducts({ ...updateproducts, [name]: value });
//   };

//   const handleEditImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setUpdateproducts({ ...updateproducts, image: file });
//       setUpdateImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleEditClick = (item) => {
//     setUpdateproducts({ ...item, 
//       image: null, // no new file choosen yet
//       old_image: item.image || "", // keep the curren image name
//      });
//     setUpdateImagePreview(getImageUrl(item.image));
//   };

//   // load products AND categories when the page opens
//   useEffect(() => {
//     getListProducts();
//     getListCategories();
//   }, []);

//   const getListProducts = () => {
//     axios.get(`${API_BASE}/api/product`)
//       .then(res => {
//         setList(res.data.list);
//       })
//       .catch(error => {
//         console.log(error);
//       });
//   };

//   // NEW: get all categories for the dropdown
//   const getListCategories = () => {
//     axios.get(`${API_BASE}/api/category`)
//       .then(res => {
//         setCategoryList(res.data.list);
//       })
//       .catch(error => {
//         console.log(error);
//       });
//   };

//   // NEW: show category name instead of only the id number
//   const getCategoryName = (category_id) => {
//     const found = categoryList.find(c => String(c.category_id) === String(category_id));
//     return found ? found.category_name : category_id;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("category_id", products.category_id);
//     formData.append("image", products.image);
//     formData.append("name", products.name);
//     formData.append("price", products.price);

//     axios.post(`${API_BASE}/api/product`, formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     })
//       .then(response => {
//         console.log("Product created:", response.data);
//         setProducts({ category_id: "", image: null, name: "", price: "" });
//         setImagePreview(null);
//         getListProducts();
//       })
//       .catch(error => {
//         showError("Error creating product", error);
//       });
//   };

//   const handleUpdateSubmit = (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     if (updateproducts.image) {
//       formData.append("image", updateproducts.image);
//     }
//     formData.append("category_id", updateproducts.category_id);
//     formData.append("name", updateproducts.name);
//     formData.append("price", updateproducts.price);

//     axios.put(`${API_BASE}/api/product/${updateproducts.product_id}`, formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     })
//       .then(response => {
//         console.log("Product updated: ", response.data);
//         setUpdateproducts({ product_id: "", category_id: "", image: null, old_image: "", name: "", price: "" });
//         setUpdateImagePreview(null);
//         getListProducts();
//       })
//       .catch(error => {
//         showError("Error updating product", error);
//       });
//   };

//   const deleteProducts = (product_id) => {
//     axios.delete(`${API_BASE}/api/product/${product_id}`)
//       .then(response => {
//         console.log("Delete Product: ", response.data);
//         getListProducts();
//       })
//       .catch(error => {
//         showError("Error removing product", error);
//       });
//   };

//   return (
//     <div>
//       <div className="d-lg-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
//         <div className="mb-4 mb-lg-0">
//           <h4 className='font-weight-bold'>Product List</h4>
//           <p className="mb-0">Your product list on dashboard page</p>
//         </div>
//         <div className="d-flex justify-content-end mb-2">
//           <button type="button" className="btn btn-dark me-2" data-bs-toggle="modal" data-bs-target="#exampleModal">
//             Add
//           </button>
//         </div>
//       </div>

//       {/* Create Modal */}
//       <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
//         <div className="modal-dialog">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h1 className="modal-title fs-5" id="exampleModalLabel">Create Product</h1>
//               <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//             </div>
//             <div className="modal-body">
//               <form onSubmit={handleSubmit}>

//                 {/* CHANGED: dropdown instead of typing category_id */}
//                 <div className="mb-3">
//                   <label htmlFor="category_id" className="form-label">Category</label>
//                   <select
//                     className="form-select"
//                     name="category_id"
//                     value={products.category_id}
//                     onChange={handleChange}
//                     required
//                   >
//                     <option value="">Select category</option>
//                     {categoryList.map((cat) => (
//                       <option key={cat.category_id} value={cat.category_id}>
//                         {cat.category_name}
//                       </option>
//                     ))}
//                   </select>
//                   {categoryList.length === 0 && (
//                     <small className="text-danger">
//                       No category yet. Please create a category first.
//                     </small>
//                   )}
//                 </div>

//                 <div className="mb-3">
//                   <label htmlFor="image" className="form-label">Image</label>
//                   <input
//                     type="file"
//                     className="form-control"
//                     name="image"
//                     accept="image/*"
//                     onChange={handleImageChange}
//                     required
//                   />
//                   {imagePreview && (
//                     <img src={imagePreview} alt="preview" style={{ width: '80px', marginTop: '10px' }} />
//                   )}
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="name" className="form-label">Name</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="name"
//                     value={products.name}
//                     onChange={handleChange}
//                     placeholder='name'
//                     required
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="price" className="form-label">Price</label>
//                   <input
//                     type="number"
//                     className='form-control'
//                     name="price"
//                     value={products.price}
//                     onChange={handleChange}
//                     placeholder='Price'
//                     required
//                   />
//                 </div>
//                 <button type="submit" className="btn btn-dark" data-bs-dismiss="modal">Add</button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Edit Modal */}
//       <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
//         <div className="modal-dialog">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h1 className="modal-title fs-5" id="staticBackdropLabel">Edit Product</h1>
//               <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//             </div>
//             <div className="modal-body">
//               <form onSubmit={handleUpdateSubmit}>
//                 <div className="mb-3">
//                   <label htmlFor="product_id" className="form-label">No.</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="product_id"
//                     value={updateproducts.product_id}
//                     disabled
//                   />
//                 </div>

//                 {/* CHANGED: dropdown so you can also change the category */}
//                 <div className="mb-3">
//                   <label htmlFor="category_id" className="form-label">Category</label>
//                   <select
//                     className="form-select"
//                     name="category_id"
//                     value={updateproducts.category_id}
//                     onChange={handleEditChange}
//                     required
//                   >
//                     <option value="">-- Select category --</option>
//                     {categoryList.map((cat) => (
//                       <option key={cat.category_id} value={cat.category_id}>
//                         {cat.category_name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="mb-3">
//                   <label htmlFor="image" className="form-label">Image</label>
//                   <input
//                     type="file"
//                     className="form-control"
//                     name="image"
//                     accept="image/*"
//                     onChange={handleEditImageChange}
//                   />
//                   {updateImagePreview && (
//                     <img src={updateImagePreview} alt="preview" style={{ width: '80px', marginTop: '10px' }} />
//                   )}
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="name" className="form-label">Product Name</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="name"
//                     value={updateproducts.name}
//                     onChange={handleEditChange}
//                     placeholder='Product Name'
//                     required
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="price" className="form-label">Price</label>
//                   <input
//                     type="number"
//                     className='form-control'
//                     name="price"
//                     value={updateproducts.price}
//                     onChange={handleEditChange}
//                     placeholder='Price'
//                     required
//                   />
//                 </div>
//                 <button type="submit" className="btn btn-dark" data-bs-dismiss="modal">Update</button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Card border="light" className="table-wrapper table-responsive shadow-sm">
//         <Card.Body>
//           <Table hover className="user-table align-items-center">
//             <thead>
//               <tr>
//                 <th className="border-bottom">No.</th>
//                 <th className="border-bottom">Image</th>
//                 <th className="border-bottom">Category</th>
//                 <th className="border-bottom">Product Name</th>
//                 <th className="border-bottom">Price</th>
//                 <th className="border-bottom">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {list.map((item, index) => (
//                 <tr key={item.product_id}>
//                   <th className='cell'>{index + 1}</th>
//                   <td className='cell'>
//                     {item.image ? (
//                       <img
//                         src={getImageUrl(item.image)}
//                         alt={item.name}
//                         style={{ width: '50px', height: '50px', objectFit: 'cover' }}
//                         onError={(e) => {
//                           e.target.onerror = null;
//                           e.target.style.display = 'none';
//                         }}
//                       />
//                     ) : (
//                       <span className="text-muted">No image</span>
//                     )}
//                   </td>
//                   {/* CHANGED: show category name */}
//                   <td className='cell'>{getCategoryName(item.category_id)}</td>
//                   <td className='cell'>{item.name}</td>
//                   <td className='cell'>{item.price}</td>
//                   <td className="cell">
//                     <FaEdit
//                       style={{ cursor: 'pointer', marginRight: '10px' }}
//                       onClick={() => handleEditClick(item)}
//                       data-bs-toggle="modal"
//                       data-bs-target="#staticBackdrop"
//                     />
//                     <FaTrash
//                       style={{ cursor: 'pointer', color: 'red' }}
//                       onClick={() => deleteProducts(item.product_id)}
//                     />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </Card.Body>
//       </Card>
//     </div>
//   );
// };

// export default Product;

import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

// Requires bootstrap + bootstrap-icons (see Navbar.jsx header comment):
//   import "bootstrap/dist/css/bootstrap.min.css";
//   import "bootstrap-icons/font/bootstrap-icons.css";
//   import "bootstrap/dist/js/bootstrap.bundle.min.js";

const API_BASE = process.env.REACT_APP_API_URL;
const UPLOADS_BASE = `${API_BASE}/uploads/`;

// helper: turn a stored filename into a loadable URL
const getImageUrl = (filename) => {
  if (!filename) return null;
  if (filename.startsWith("http") || filename.startsWith("blob:")) return filename;
  return `${UPLOADS_BASE}${filename}`;
};

// helper: show the real error message from the server
const showError = (title, error) => {
  const message = error.response?.data?.message || error.response?.data?.error || error.message;
  console.log(title, error.response?.data || error);
  alert(`${title}\n${message}`);
};

// helper: consistent price formatting
const formatPrice = (price) => {
  const n = Number(price);
  if (Number.isNaN(n)) return price;
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
};

const Product = () => {

  // list of products (for the table)
  const [list, setList] = useState([]);

  const [search, setSearch] = useState("");

  // list of categories (for the dropdown)
  const [categoryList, setCategoryList] = useState([]);

  const [products, setProducts] = useState({
    category_id: "",
    name: "",
    price: "",
    image: null,
    description: "",
  });
  const [imagePreview, setImagePreview] = useState(null);

  const [updateproducts, setUpdateproducts] = useState({
    product_id: "",
    category_id: "",
    name: "",
    price: "",
    image: null,
    old_image: "",
    description: "",
  });
  const [updateImagePreview, setUpdateImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducts({ ...products, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProducts({ ...products, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setUpdateproducts({ ...updateproducts, [name]: value });
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUpdateproducts({ ...updateproducts, image: file });
      setUpdateImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditClick = (item) => {
    setUpdateproducts({
      ...item,
      image: null, // no new file chosen yet
      old_image: item.image || "", // keep the current image name
    });
    setUpdateImagePreview(getImageUrl(item.image));
  };

  // load products AND categories when the page opens
  useEffect(() => {
    getListProducts();
    getListCategories();
  }, []);

  const getListProducts = () => {
    axios.get(`${API_BASE}/api/product`)
      .then(res => {
        setList(res.data.list);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getListCategories = () => {
    axios.get(`${API_BASE}/api/category`)
      .then(res => {
        setCategoryList(res.data.list);
      })
      .catch(error => {
        console.log(error);
      });
  };

  // show category name instead of only the id number
  const getCategoryName = (category_id) => {
    const found = categoryList.find(c => String(c.category_id) === String(category_id));
    return found ? found.category_name : category_id;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("category_id", products.category_id);
    formData.append("image", products.image);
    formData.append("name", products.name);
    formData.append("price", products.price);
    formData.append("description", products.description);

    axios.post(`${API_BASE}/api/product`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(response => {
        console.log("Product created:", response.data);
        setProducts({ category_id: "", image: null, name: "", price: "", description: "" });
        setImagePreview(null);
        getListProducts();
        Swal.fire("Success", "Add success", "success");
      })
      .catch(error => {
        showError("Error creating product", error);
        Swal.fire("Error", "Add failed", "error")
      });
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (updateproducts.image) {
      formData.append("image", updateproducts.image);
    }
    formData.append("category_id", updateproducts.category_id);
    formData.append("name", updateproducts.name);
    formData.append("price", updateproducts.price);
    formData.append("description", updateproducts.description);

    axios.put(`${API_BASE}/api/product/${updateproducts.product_id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(response => {
        console.log("Product updated: ", response.data);
        setUpdateproducts({ product_id: "", category_id: "", image: null, old_image: "", name: "", price: "", description: "" });
        setUpdateImagePreview(null);
        getListProducts();
        Swal.fire("Success", "Update success", "success");
      })
      .catch(error => {
        showError("Error updating product", error);
        Swal.fire("Error", "Update failed", "error")
      });
  };

  const deleteProducts = (product_id) => {
    // if (!window.confirm("Delete this product? This cannot be undone.")) return;

    // axios.delete(`${API_BASE}/api/product/${product_id}`)
    //   .then(response => {
    //     console.log("Delete Product: ", response.data);
    //     getListProducts();
    //   })
    //   .catch(error => {
    //     showError("Error removing product", error);
    //   });
    Swal.fire({
      title: "Do you want to delete this record?",
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${API_BASE}/api/product/${product_id}`)
          .then(response => {
            console.log("Delete Product: ", response.data);
            getListProducts();
            Swal.fire("Deleted", "Delete success", "success");
          })
          .catch(error => {
            console.log("Error removing Product: ", error);
            Swal.fire("Error", "Delete failed", "error");
          });
      }
    });
  };

  const filteredst = list.filter((item) =>
    (item.name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const viewImage = (item) => {
    Swal.fire({
      imageUrl: getImageUrl(item.image),
      imageAlt: item.name,
      imageWidth: 400,
      showConfirmButton: false
    })
  }

  return (
    <div>
      {/* Page header */}
      <div className="d-lg-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-3">
        <div className="mb-3 mb-lg-0">
          <h4 className="fw-bold mb-1">Products</h4>
          <p className="text-secondary mb-0">Manage the products available in your store</p>
          <form
            className="py-3"
            style={{ maxWidth: "360px", width: "100%" }}
            role="search"
          >
            <div className="input-group">
              <span className="input-group-text bg-body-secondary border-end-0">
                <i className="bi bi-search text-secondary"></i>
              </span>
              <input
                type="search"
                className="form-control bg-body-secondary border-start-0"
                placeholder="Search..."
                id="search"
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </form>
        </div>

        <button
          type="button"
          className="btn btn-primary d-inline-flex align-items-center gap-2"
          data-bs-toggle="modal"
          data-bs-target="#addProductModal"
        >
          <i className="bi bi-plus-lg"></i>
          Add Product
        </button>
      </div>

      {/* Add Product Modal */}
      <div className="modal fade" id="addProductModal" tabIndex="-1" aria-labelledby="addProductModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addProductModalLabel">New Product</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="category_id" className="form-label">Category</label>
                  <select
                    className="form-select"
                    id="category_id"
                    name="category_id"
                    value={products.category_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select category</option>
                    {categoryList.map((cat) => (
                      <option key={cat.category_id} value={cat.category_id}>
                        {cat.category_name}
                      </option>
                    ))}
                  </select>
                  {categoryList.length === 0 && (
                    <div className="form-text text-danger">
                      No categories yet. Please create a category first.
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="image" className="form-label">Image</label>
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="rounded border mt-2"
                      style={{ width: "80px", height: "80px", objectFit: "cover" }}
                    />
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={products.name}
                    onChange={handleChange}
                    placeholder="Product name"
                    required
                  />
                </div>

                <div className="mb-1">
                  <label htmlFor="price" className="form-label">Price</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-control"
                      id="price"
                      name="price"
                      value={products.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={products.description}
                    onChange={handleChange}
                    placeholder="Product description"
                    rows="3"
                    required
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Add Product</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Edit Product Modal */}
      <div className="modal fade" id="editProductModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="editProductModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editProductModalLabel">Edit Product</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleUpdateSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="product_id" className="form-label">ID</label>
                  <input
                    type="text"
                    className="form-control"
                    id="product_id"
                    name="product_id"
                    value={updateproducts.product_id}
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="edit_category_id" className="form-label">Category</label>
                  <select
                    className="form-select"
                    id="edit_category_id"
                    name="category_id"
                    value={updateproducts.category_id}
                    onChange={handleEditChange}
                    required
                  >
                    <option value="">Select category</option>
                    {categoryList.map((cat) => (
                      <option key={cat.category_id} value={cat.category_id}>
                        {cat.category_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="edit_image" className="form-label">Image</label>
                  <input
                    type="file"
                    className="form-control"
                    id="edit_image"
                    name="image"
                    accept="image/*"
                    onChange={handleEditImageChange}
                  />
                  {updateImagePreview && (
                    <img
                      src={updateImagePreview}
                      alt="preview"
                      className="rounded border mt-2"
                      style={{ width: "80px", height: "80px", objectFit: "cover" }}
                    />
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="edit_name" className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="edit_name"
                    name="name"
                    value={updateproducts.name}
                    onChange={handleEditChange}
                    placeholder="Product Name"
                    required
                  />
                </div>

                <div className="mb-1">
                  <label htmlFor="edit_price" className="form-label">Price</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-control"
                      id="edit_price"
                      name="price"
                      value={updateproducts.price}
                      onChange={handleEditChange}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="edit_description" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="edit_description"
                    name="description"
                    value={updateproducts.description}
                    onChange={handleEditChange}
                    placeholder="Product description"
                    rows="3"
                    required
                  ></textarea>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                  <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Save Changes</button>
                </div>
                </div>
            </form>
          </div>
        </div>
      </div>

      {/* Product table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-3">No.</th>
                  <th>Image</th>
                  <th>Category</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th className="text-end pe-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredst.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-secondary py-5">
                      <i className="bi bi-box-seam fs-2 d-block mb-2"></i>
                      No products yet — click "Add Product" to create one.
                    </td>
                  </tr>
                )}
                {filteredst.map((item, index) => (
                  <tr key={item.product_id}>
                    <td className="ps-3">{index + 1}</td>
                    <td>
                      {item.image ? (
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="rounded border"
                          style={{ width: "48px", height: "48px", objectFit: "cover" }}
                          onClick={() => viewImage(item)}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <span
                          className="d-inline-flex align-items-center justify-content-center rounded bg-light border text-secondary"
                          style={{ width: "48px", height: "48px" }}
                        >
                          <i className="bi bi-image"></i>
                        </span>
                      )}
                    </td>
                    <td>
                      <span className="badge text-bg-light border">{getCategoryName(item.category_id)}</span>
                    </td>
                    <td className="fw-medium">{item.name}</td>
                    <td>{formatPrice(item.price)}</td>
                    <td>{item.description}</td>
                    <td className="text-end pe-3">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary me-2"
                        title="Edit"
                        data-bs-toggle="modal"
                        data-bs-target="#editProductModal"
                        onClick={() => handleEditClick(item)}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        title="Delete"
                        onClick={() => deleteProducts(item.product_id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;