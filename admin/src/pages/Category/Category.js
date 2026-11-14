// import React from "react";
// import { useEffect, useState } from "react";
// import { Card, Table } from 'react-bootstrap';
// import axios from "axios";
// import { FaEdit, FaTrash } from 'react-icons/fa';

// const API_BASE = "http://localhost:8081";
// const UPLOADS_BASE = `${API_BASE}/uploads/`;

// // helper: turn a stored filename into a loadable URL
// const getImageUrl = (filename) => {
//     if (!filename) return null;
//     if (filename.startsWith("http") || filename.startsWith("blob:")) return filename;
//     return `${UPLOADS_BASE}${filename}`;
// };

// const Category = () => {

//     const [list, setList] = useState([]);

//     const [categories, setCategories] = useState({
//         image: null,
//         category_name: "",
//         description: "",
//     });
//     const [imagePreview, setImagePreview] = useState(null);

//     const [updatecategories, setUpdatecategories] = useState({
//         category_id: "",
//         image: null,
//         old_image: "",
//         category_name: "",
//         description: "",
//     });
//     const [updateImagePreview, setUpdateImagePreview] = useState(null);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setCategories({ ...categories, [name]: value });
//     };

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setCategories({ ...categories, image: file });
//             setImagePreview(URL.createObjectURL(file));
//         }
//     };

//     const handleEditChange = (e) => {
//         const { name, value } = e.target;
//         setUpdatecategories({ ...updatecategories, [name]: value });
//     };

//     const handleEditImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setUpdatecategories({ ...updatecategories, image: file });
//             setUpdateImagePreview(URL.createObjectURL(file));
//         }
//     };

//     const handleEditClick = (item) => {
//         setUpdatecategories({ ...item, 
//         image: null, // no new file choosen yet
//         old_image: item.image || "", // keep the current image name
//         });
//         // build a full URL from the stored filename so the preview actually loads
//         setUpdateImagePreview(getImageUrl(item.image));
//     };

//     useEffect(() => {
//         getListCategories();
//         getCategoriesbyId();
//     }, []);

//     const getListCategories = () => {
//         // axios({
//         //     url: `${API_BASE}/api/category`,
//         //     method: "get",
//         // }).then(res => {
//         //     setList(res.data.list);
//         // }).catch(error => {
//         //     console.log(error);
//         // });
//         axios.get(`${API_BASE}/api/category`)
//         .then(res => {
//             setList(res.data.list);
//         })
//         .catch(error => {
//             console.log(error);
//         })
//     };

//     const getCategoriesbyId = () => {
//         // axios({
//         //     url: `${API_BASE}/api/category/${updatecategories.category_id}`,
//         //     method: "get",
//         // }).then(res => {
//         //     setList(res.data.list);
//         // }).catch(error => {
//         //     console.log(error);
//         // })
//         axios.get(`${API_BASE}/api/category/${updatecategories.category_id}`)
//         .then(res => {
//             setList(res.data.list);
//         })
//         .catch(error => {
//             console.log(error);
//         })
//     }

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         const formData = new FormData();
//         formData.append("image", categories.image);
//         formData.append("category_name", categories.category_name);
//         formData.append("description", categories.description);

//         axios.post(`${API_BASE}/api/category`, formData, {
//             headers: { "Content-Type": "multipart/form-data" },
//         })
//             .then(response => {
//                 console.log("Category created:", response.data);
//                 setCategories({ image: null, category_name: "", description: "" });
//                 setImagePreview(null);
//                 getListCategories();
//             })
//             .catch(error => {
//                 console.error("Error creating category:", error);
//             });
//     };

//     const handleUpdateSubmit = (e) => {
//         e.preventDefault();

//         const formData = new FormData();
//         if (updatecategories.image) {
//             formData.append("image", updatecategories.image);
//         }
//         formData.append("category_name", updatecategories.category_name);
//         formData.append("description", updatecategories.description);

//         axios.put(`${API_BASE}/api/category/${updatecategories.category_id}`, formData, {
//             headers: { "Content-Type": "multipart/form-data" },
//         })
//             .then(response => {
//                 console.log("Categories updated: ", response.data);
//                 setUpdatecategories({ category_id: "", image: null, old_image: "", category_name: "", description: "" });
//                 setUpdateImagePreview(null);
//                 getListCategories();
//             })
//             .catch(error => {
//                 console.log("Error updating categories: ", error);
//             });
//     };

//     const deleteCatgories = (category_id) => {
//         axios.delete(`${API_BASE}/api/category/${category_id}`)
//             .then(response => {
//                 console.log("Delete Category: ", response.data);
//                 getListCategories();
//             })
//             .catch(error => {
//                 console.log("Error removing Category: ", error);
//             });
//     };

//     return (
//         <div>
//             <div className="d-lg-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
//                 <div className="mb-4 mb-lg-0">
//                     <h4 className='font-weight-bold'>Category List</h4>
//                     <p className="mb-0">Your category list on dashboard page</p>
//                 </div>
//                 <div className="d-flex justify-content-end mb-2">
//                     <button type="button" className="btn btn-dark me-2" data-bs-toggle="modal" data-bs-target="#exampleModal">
//                         Add
//                     </button>
//                 </div>
//             </div>

//             {/* Create Modal */}
//             <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
//                 <div className="modal-dialog">
//                     <div className="modal-content">
//                         <div className="modal-header">
//                             <h1 className="modal-title fs-5" id="exampleModalLabel">Create Category</h1>
//                             <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                         </div>
//                         <div className="modal-body">
//                             <form onSubmit={handleSubmit}>
//                                 <div className="mb-3">
//                                     <label htmlFor="image" className="form-label">Image</label>
//                                     <input
//                                         type="file"
//                                         className="form-control"
//                                         name="image"
//                                         accept="image/*"
//                                         onChange={handleImageChange}
//                                         required
//                                     />
//                                     {imagePreview && (
//                                         <img src={imagePreview} alt="preview" style={{ width: '80px', marginTop: '10px' }} />
//                                     )}
//                                 </div>
//                                 <div className="mb-3">
//                                     <label htmlFor="category_name" className="form-label">Category Name</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="category_name"
//                                         value={categories.category_name}
//                                         onChange={handleChange}
//                                         placeholder='Category Name'
//                                         required
//                                     />
//                                 </div>
//                                 <div className="mb-3">
//                                     <label htmlFor="description" className="form-label">Description</label>
//                                     <br />
//                                     <textarea
//                                         className='form-control'
//                                         name="description"
//                                         value={categories.description}
//                                         onChange={handleChange}
//                                         placeholder='Description'
//                                         required
//                                     />
//                                 </div>
//                                 <button type="submit" className="btn btn-dark" data-bs-dismiss="modal">Add</button>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Edit Modal */}
//             <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
//                 <div className="modal-dialog">
//                     <div className="modal-content">
//                         <div className="modal-header">
//                             <h1 className="modal-title fs-5" id="staticBackdropLabel">Edit Category</h1>
//                             <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                         </div>
//                         <div className="modal-body">
//                             <form onSubmit={handleUpdateSubmit}>
//                                 <div className="mb-3">
//                                     <label htmlFor="category_id" className="form-label">NO.</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="category_id"
//                                         value={updatecategories.category_id}
//                                         disabled
//                                     />
//                                 </div>
//                                 <div className="mb-3">
//                                     <label htmlFor="image" className="form-label">Image</label>
//                                     <input
//                                         type="file"
//                                         className="form-control"
//                                         name="image"
//                                         accept="image/*"
//                                         onChange={handleEditImageChange}
//                                     />
//                                     {updateImagePreview && (
//                                         <img src={updateImagePreview} alt="preview" style={{ width: '80px', marginTop: '10px' }} />
//                                     )}
//                                 </div>
//                                 <div className="mb-3">
//                                     <label htmlFor="category_name" className="form-label">Category Name</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="category_name"
//                                         value={updatecategories.category_name}
//                                         onChange={handleEditChange}
//                                         placeholder='Category Name'
//                                         required
//                                     />
//                                 </div>
//                                 <div className="mb-3">
//                                     <label htmlFor="description" className="form-label">Description</label>
//                                     <br />
//                                     <textarea
//                                         className='form-control'
//                                         name="description"
//                                         value={updatecategories.description}
//                                         onChange={handleEditChange}
//                                         placeholder='Description'
//                                         required
//                                     />
//                                 </div>
//                                 <button type="submit" className="btn btn-dark" data-bs-dismiss="modal">Update</button>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <Card border="light" className="table-wrapper table-responsive shadow-sm">
//                 <Card.Body>
//                     <Table hover className="user-table align-items-center">
//                         <thead>
//                             <tr>
//                                 <th className="border-bottom">No.</th>
//                                 <th className="border-bottom">Image</th>
//                                 <th className="border-bottom">Category Name</th>
//                                 <th className="border-bottom">Description</th>
//                                 <th className="border-bottom">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {list.map((item, index) => (
//                                 <tr key={item.category_id}>
//                                     <th className='cell'>{index + 1}</th>
//                                     <td className='cell'>
//                                         {item.image ? (
//                                             <img
//                                                 src={getImageUrl(item.image)}
//                                                 alt={item.category_name}
//                                                 style={{ width: '50px', height: '50px', objectFit: 'cover' }}
//                                                 onError={(e) => {
//                                                     e.target.onerror = null;
//                                                     e.target.style.display = 'none';
//                                                 }}
//                                             />
//                                         ) : (
//                                             <span className="text-muted">No image</span>
//                                         )}
//                                     </td>
//                                     <td className='cell'>{item.category_name}</td>
//                                     <td className='cell'>{item.description}</td>
//                                     <td className="cell">
//                                         <FaEdit
//                                             style={{ cursor: 'pointer', marginRight: '10px' }}
//                                             onClick={() => handleEditClick(item)}
//                                             data-bs-toggle="modal"
//                                             data-bs-target="#staticBackdrop"
//                                         />
//                                         <FaTrash
//                                             style={{ cursor: 'pointer', color: 'red' }}
//                                             onClick={() => deleteCatgories(item.category_id)}
//                                         />
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </Table>
//                 </Card.Body>
//             </Card>
//         </div>
//     );
// };

// export default Category;

// import React from "react";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";

// // Requires bootstrap + bootstrap-icons (see Navbar.jsx header comment):
// //   import "bootstrap/dist/css/bootstrap.min.css";
// //   import "bootstrap-icons/font/bootstrap-icons.css";
// //   import "bootstrap/dist/js/bootstrap.bundle.min.js";

// const API_BASE = process.env.REACT_APP_API_URL;
// // const UPLOADS_BASE = `${API_BASE}/uploads/`;

// const PAGE_SIZE = 5;

// // helper: turn a stored filename into a loadable URL
// const getImageUrl = (filename) => {
//     if (!filename) return null;
//     if (filename.startsWith("http") || filename.startsWith("blob:")) return filename;
//     return `${API_BASE}/uploads/${filename}`;
// };

// const Category = () => {

//     const [list, setList] = useState([]);

//     const [search, setSearch] = useState("");

//     const [currentPage, setCurrentPage] = useState(1);


//     const [categories, setCategories] = useState({
//         image: null,
//         category_name: "",
//         description: "",
//     });
//     const [imagePreview, setImagePreview] = useState(null);

//     const [updatecategories, setUpdatecategories] = useState({
//         category_id: "",
//         image: null,
//         old_image: "",
//         category_name: "",
//         description: "",
//     });
//     const [updateImagePreview, setUpdateImagePreview] = useState(null);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setCategories({ ...categories, [name]: value });
//     };

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setCategories({ ...categories, image: file });
//             setImagePreview(URL.createObjectURL(file));
//         }
//     };

//     const handleEditChange = (e) => {
//         const { name, value } = e.target;
//         setUpdatecategories({ ...updatecategories, [name]: value });
//     };

//     const handleEditImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setUpdatecategories({ ...updatecategories, image: file });
//             setUpdateImagePreview(URL.createObjectURL(file));
//         }
//     };

//     const handleEditClick = (item) => {
//         setUpdatecategories({
//             ...item,
//             image: null, // no new file chosen yet
//             old_image: item.image || "", // keep the current image name
//         });
//         // build a full URL from the stored filename so the preview actually loads
//         setUpdateImagePreview(getImageUrl(item.image));
//     };

//     useEffect(() => {
//         getListCategories();
//         getCategoriesbyId();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     const getListCategories = () => {
//         axios.get(`${API_BASE}/api/category`)
//             .then(res => {
//                 setList(res.data.list);
//             })
//             .catch(error => {
//                 console.log(error);
//             });
//     };

//     const getCategoriesbyId = () => {
//         axios.get(`${API_BASE}/api/category/${updatecategories.category_id}`)
//             .then(res => {
//                 setList(res.data.list);
//             })
//             .catch(error => {
//                 console.log(error);
//             });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         const formData = new FormData();
//         formData.append("image", categories.image);
//         formData.append("category_name", categories.category_name);
//         formData.append("description", categories.description);

//         axios.post(`${API_BASE}/api/category`, formData, {
//             headers: { "Content-Type": "multipart/form-data" },
//         })
//             .then(response => {
//                 console.log("Category created:", response.data);
//                 setCategories({ image: null, category_name: "", description: "" });
//                 setImagePreview(null);
//                 getListCategories();
//                 Swal.fire("Success", "Add success", "success");
//             })
//             .catch(error => {
//                 console.error("Error creating category:", error);
//                 Swal.fire("Error", "Add failed", "error");
//             });
//     };

//     const handleUpdateSubmit = (e) => {
//         e.preventDefault();

//         const formData = new FormData();
//         if (updatecategories.image) {
//             formData.append("image", updatecategories.image);
//         }
//         formData.append("category_name", updatecategories.category_name);
//         formData.append("description", updatecategories.description);

//         axios.put(`${API_BASE}/api/category/${updatecategories.category_id}`, formData, {
//             headers: { "Content-Type": "multipart/form-data" },
//         })
//             .then(response => {
//                 console.log("Categories updated: ", response.data);
//                 setUpdatecategories({ category_id: "", image: null, old_image: "", category_name: "", description: "" });
//                 setUpdateImagePreview(null);
//                 getListCategories();
//                 Swal.fire("Success", "Update success", "success");
//             })
//             .catch(error => {
//                 console.log("Error updating categories: ", error);
//                 Swal.fire("Error", "Update failed", "error");
//             });
//     };

//     const deleteCatgories = (category_id) => {
//         Swal.fire({
//             title: "Do you want to delete this record?",
//             text: "This cannot be undone.",
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonColor: "#d33",
//             confirmButtonText: "Yes, delete it",
//             cancelButtonText: "Cancel",
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 axios.delete(`${API_BASE}/api/category/${category_id}`)
//                     .then(response => {
//                         console.log("Delete Category: ", response.data);
//                         getListCategories();
//                         Swal.fire("Deleted", "Delete success", "success");
//                     })
//                     .catch(error => {
//                         console.log("Error removing Category: ", error);
//                         Swal.fire("Error", "Delete failed", "error");
//                     });
//             }
//         });
//     };

//     const filteredst = list.filter((item) =>
//         (item.category_name || "")
//             .toLowerCase()
//             .includes(search.toLowerCase())
//     );

//     // NEW: pagination math
//     const totalPages = Math.max(1, Math.ceil(filteredst.length / PAGE_SIZE));
//     const startIndex = (currentPage - 1) * PAGE_SIZE;
//     const paginatedList = filteredst.slice(startIndex, startIndex + PAGE_SIZE);

//     const goToPage = (page) => {
//         if (page < 1 || page > totalPages) return;
//         setCurrentPage(page);
//     };

//     const viewImage = (item) => {
//         Swal.fire({
//         imageUrl: getImageUrl(item.image),
//         imageAlt: item.category_name,
//         imageWidth: 400,
//         showConfirmButton: false,
//     });
//     }

//     return (
//         <div>
//             {/* Page header */}
//             <div className="d-lg-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-3">
//                 <div className="mb-3 mb-lg-0">
//                     <h4 className="fw-bold mb-1">Categories</h4>
//                     <p className="text-secondary mb-0">Organize the products in your store by category</p>
//                     <form
//                         className="py-3"
//                         style={{ maxWidth: "360px", width: "100%" }}
//                         role="search"
//                     >
//                         <div className="input-group">
//                             <span className="input-group-text bg-body-secondary border-end-0">
//                                 <i className="bi bi-search text-secondary"></i>
//                             </span>
//                             <input
//                                 type="search"
//                                 className="form-control bg-body-secondary border-start-0"
//                                 placeholder="Search..."
//                                 id="search"
//                                 name="search"
//                                 value={search}
//                                 onChange={(e) => setSearch(e.target.value)}
//                             />
//                         </div>
//                     </form>
//                 </div>
//                 <button
//                     type="button"
//                     className="btn btn-primary d-inline-flex align-items-center gap-2"
//                     data-bs-toggle="modal"
//                     data-bs-target="#addCategoryModal"
//                 >
//                     <i className="bi bi-plus-lg"></i>
//                     Add Category
//                 </button>
//             </div>

//             {/* Add Category Modal */}
//             <div className="modal fade" id="addCategoryModal" tabIndex="-1" aria-labelledby="addCategoryModalLabel" aria-hidden="true">
//                 <div className="modal-dialog">
//                     <div className="modal-content">
//                         <div className="modal-header">
//                             <h5 className="modal-title" id="addCategoryModalLabel">New Category</h5>
//                             <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                         </div>
//                         <form onSubmit={handleSubmit}>
//                             <div className="modal-body">
//                                 <div className="mb-3">
//                                     <label htmlFor="image" className="form-label">Image</label>
//                                     <input
//                                         type="file"
//                                         className="form-control"
//                                         id="image"
//                                         name="image"
//                                         accept="image/*"
//                                         onChange={handleImageChange}
//                                         required
//                                     />
//                                     {imagePreview && (
//                                         <img
//                                             src={imagePreview}
//                                             alt="preview"
//                                             className="rounded border mt-2"
//                                             style={{ width: "80px", height: "80px", objectFit: "cover" }}
//                                         />
//                                     )}
//                                 </div>
//                                 <div className="mb-3">
//                                     <label htmlFor="category_name" className="form-label">Category Name</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         id="category_name"
//                                         name="category_name"
//                                         value={categories.category_name}
//                                         onChange={handleChange}
//                                         placeholder="e.g. Electronics"
//                                         required
//                                     />
//                                 </div>
//                                 <div className="mb-1">
//                                     <label htmlFor="description" className="form-label">Description</label>
//                                     <textarea
//                                         className="form-control"
//                                         id="description"
//                                         name="description"
//                                         rows="3"
//                                         value={categories.description}
//                                         onChange={handleChange}
//                                         placeholder="Short description of this category"
//                                         required
//                                     />
//                                 </div>
//                             </div>
//                             <div className="modal-footer">
//                                 <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
//                                 <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Add Category</button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>

//             {/* Edit Category Modal */}
//             <div className="modal fade" id="editCategoryModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="editCategoryModalLabel" aria-hidden="true">
//                 <div className="modal-dialog">
//                     <div className="modal-content">
//                         <div className="modal-header">
//                             <h5 className="modal-title" id="editCategoryModalLabel">Edit Category</h5>
//                             <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                         </div>
//                         <form onSubmit={handleUpdateSubmit}>
//                             <div className="modal-body">
//                                 <div className="mb-3">
//                                     <label htmlFor="category_id" className="form-label">ID</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         id="category_id"
//                                         name="category_id"
//                                         value={updatecategories.category_id}
//                                         disabled
//                                     />
//                                 </div>
//                                 <div className="mb-3">
//                                     <label htmlFor="edit_image" className="form-label">Image</label>
//                                     <input
//                                         type="file"
//                                         className="form-control"
//                                         id="edit_image"
//                                         name="image"
//                                         accept="image/*"
//                                         onChange={handleEditImageChange}
//                                     />
//                                     {updateImagePreview && (
//                                         <img
//                                             src={updateImagePreview}
//                                             alt="preview"
//                                             className="rounded border mt-2"
//                                             style={{ width: "80px", height: "80px", objectFit: "cover" }}
//                                         />
//                                     )}
//                                 </div>
//                                 <div className="mb-3">
//                                     <label htmlFor="edit_category_name" className="form-label">Category Name</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         id="edit_category_name"
//                                         name="category_name"
//                                         value={updatecategories.category_name}
//                                         onChange={handleEditChange}
//                                         placeholder="Category Name"
//                                         required
//                                     />
//                                 </div>
//                                 <div className="mb-1">
//                                     <label htmlFor="edit_description" className="form-label">Description</label>
//                                     <textarea
//                                         className="form-control"
//                                         id="edit_description"
//                                         name="description"
//                                         rows="3"
//                                         value={updatecategories.description}
//                                         onChange={handleEditChange}
//                                         placeholder="Description"
//                                         required
//                                     />
//                                 </div>
//                             </div>
//                             <div className="modal-footer">
//                                 <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
//                                 <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Save Changes</button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>

//             {/* Category table */}
//             <div className="card border-0 shadow-sm">
//                 <div className="card-body p-0">
//                     <div className="table-responsive">
//                         <table className="table table-hover align-middle mb-0">
//                             <thead className="table-light">
//                                 <tr>
//                                     <th className="ps-3">No.</th>
//                                     <th>Image</th>
//                                     <th>Category Name</th>
//                                     <th>Description</th>
//                                     <th className="text-end pe-3">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {paginatedList.length === 0 && (
//                                     <tr>
//                                         <td colSpan="5" className="text-center text-secondary py-5">
//                                             <i className="bi bi-tags fs-2 d-block mb-2"></i>
//                                             No categories yet — click "Add Category" to create one.
//                                         </td>
//                                     </tr>
//                                 )}
//                                 {paginatedList.map((item, index) => (
//                                     <tr key={item.category_id}>
//                                         <td className="ps-3">{index + 1}</td>
//                                         <td>
//                                             {item.image ? (
//                                                 <img
//                                                     src={getImageUrl(item.image)}
//                                                     alt={item.category_name}
//                                                     className="rounded border"
//                                                     style={{ width: "48px", height: "48px", objectFit: "cover" }}
//                                                     onClick={() => viewImage(item)}
//                                                     onError={(e) => {
//                                                         e.target.onerror = null;
//                                                         e.target.style.display = "none";
//                                                     }}
//                                                 />
//                                             ) : (
//                                                 <span
//                                                     className="d-inline-flex align-items-center justify-content-center rounded bg-light border text-secondary"
//                                                     style={{ width: "48px", height: "48px" }}
//                                                 >
//                                                     <i className="bi bi-image"></i>
//                                                 </span>
//                                             )}
//                                         </td>
//                                         <td className="fw-medium">{item.category_name}</td>
//                                         <td className="text-secondary" style={{ maxWidth: "320px" }}>
//                                             <span className="d-inline-block text-truncate" style={{ maxWidth: "320px" }}>
//                                                 {item.description}
//                                             </span>
//                                         </td>
//                                         <td className="text-end pe-3">
//                                             <button
//                                                 type="button"
//                                                 className="btn btn-sm btn-outline-secondary me-2"
//                                                 title="Edit"
//                                                 data-bs-toggle="modal"
//                                                 data-bs-target="#editCategoryModal"
//                                                 onClick={() => handleEditClick(item)}
//                                             >
//                                                 <i className="bi bi-pencil-square"></i>
//                                             </button>
//                                             <button
//                                                 type="button"
//                                                 className="btn btn-sm btn-outline-danger"
//                                                 title="Delete"
//                                                 onClick={() => deleteCatgories(item.category_id)}
//                                             >
//                                                 <i className="bi bi-trash"></i>
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>



//                 {/* NEW: pagination controls, only shown when there is more than 1 page */}
//                 {totalPages > 1 && (
//                     <div className="card-footer bg-white d-flex justify-content-between align-items-center">
//                         <span className="text-secondary small">
//                             Page {currentPage} of {totalPages} ({filteredst.length} results)
//                         </span>
//                         <div className="btn-group">
//                             <button
//                                 type="button"
//                                 className="btn btn-outline-secondary btn-sm"
//                                 disabled={currentPage === 1}
//                                 onClick={() => goToPage(currentPage - 1)}
//                             >
//                                 <i className="bi bi-chevron-left"></i> Prev
//                             </button>
//                             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                                 <button
//                                     key={page}
//                                     type="button"
//                                     className={`btn btn-sm ${page === currentPage ? "btn-primary" : "btn-outline-secondary"}`}
//                                     onClick={() => goToPage(page)}
//                                 >
//                                     {page}
//                                 </button>
//                             ))}
//                             <button
//                                 type="button"
//                                 className="btn btn-outline-secondary btn-sm"
//                                 disabled={currentPage === totalPages}
//                                 onClick={() => goToPage(currentPage + 1)}
//                             >
//                                 Next <i className="bi bi-chevron-right"></i>
//                             </button>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Category;


import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

// Requires bootstrap + bootstrap-icons (see Navbar.jsx header comment):
//   import "bootstrap/dist/css/bootstrap.min.css";
//   import "bootstrap-icons/font/bootstrap-icons.css";
//   import "bootstrap/dist/js/bootstrap.bundle.min.js";

const API_BASE = process.env.REACT_APP_API_URL;
// const UPLOADS_BASE = `${API_BASE}/uploads/`;

const PAGE_SIZE = 5;

// show the message sent by the backend (for example "The image is too large"),
// or the default text if the backend sent nothing
const getErrorText = (error, fallback) => {
    const message = error.response?.data?.message;
    return typeof message === "string" ? message : fallback;
};

// helper: turn a stored filename into a loadable URL
const getImageUrl = (filename) => {
    if (!filename) return null;
    if (filename.startsWith("http") || filename.startsWith("blob:")) return filename;
    return `${API_BASE}/uploads/${filename}`;
};

const Category = () => {

    const [list, setList] = useState([]);

    const [search, setSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);


    const [categories, setCategories] = useState({
        image: null,
        category_name: "",
        description: "",
    });
    const [imagePreview, setImagePreview] = useState(null);

    const [updatecategories, setUpdatecategories] = useState({
        category_id: "",
        image: null,
        old_image: "",
        category_name: "",
        description: "",
    });
    const [updateImagePreview, setUpdateImagePreview] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategories({ ...categories, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCategories({ ...categories, image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setUpdatecategories({ ...updatecategories, [name]: value });
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUpdatecategories({ ...updatecategories, image: file });
            setUpdateImagePreview(URL.createObjectURL(file));
        }
    };

    const handleEditClick = (item) => {
        setUpdatecategories({
            ...item,
            image: null, // no new file chosen yet
            old_image: item.image || "", // keep the current image name
        });
        // build a full URL from the stored filename so the preview actually loads
        setUpdateImagePreview(getImageUrl(item.image));
    };

    useEffect(() => {
        getListCategories();
        getCategoriesbyId();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getListCategories = () => {
        axios.get(`${API_BASE}/api/category`)
            .then(res => {
                setList(res.data.list);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const getCategoriesbyId = () => {
        axios.get(`${API_BASE}/api/category/${updatecategories.category_id}`)
            .then(res => {
                setList(res.data.list);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("image", categories.image);
        formData.append("category_name", categories.category_name);
        formData.append("description", categories.description);

        axios.post(`${API_BASE}/api/category`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(response => {
                console.log("Category created:", response.data);
                setCategories({ image: null, category_name: "", description: "" });
                setImagePreview(null);
                getListCategories();
                Swal.fire("Success", "Add success", "success");
            })
            .catch(error => {
                console.error("Error creating category:", error);
                Swal.fire("Error", getErrorText(error, "Add failed"), "error");
            });
    };

    const handleUpdateSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        if (updatecategories.image) {
            formData.append("image", updatecategories.image);
        }
        formData.append("category_name", updatecategories.category_name);
        formData.append("description", updatecategories.description);

        axios.put(`${API_BASE}/api/category/${updatecategories.category_id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(response => {
                console.log("Categories updated: ", response.data);
                setUpdatecategories({ category_id: "", image: null, old_image: "", category_name: "", description: "" });
                setUpdateImagePreview(null);
                getListCategories();
                Swal.fire("Success", "Update success", "success");
            })
            .catch(error => {
                console.log("Error updating categories: ", error);
                Swal.fire("Error", getErrorText(error, "Update failed"), "error");
            });
    };

    const deleteCatgories = (category_id) => {
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
                axios.delete(`${API_BASE}/api/category/${category_id}`)
                    .then(response => {
                        console.log("Delete Category: ", response.data);
                        getListCategories();
                        Swal.fire("Deleted", "Delete success", "success");
                    })
                    .catch(error => {
                        console.log("Error removing Category: ", error);
                        Swal.fire("Error", "Delete failed", "error");
                    });
            }
        });
    };

    const filteredst = list.filter((item) =>
        (item.category_name || "")
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    // NEW: pagination math
    const totalPages = Math.max(1, Math.ceil(filteredst.length / PAGE_SIZE));
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const paginatedList = filteredst.slice(startIndex, startIndex + PAGE_SIZE);

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const viewImage = (item) => {
        Swal.fire({
        imageUrl: getImageUrl(item.image),
        imageAlt: item.category_name,
        imageWidth: 400,
        showConfirmButton: false,
    });
    }

    return (
        <div>
            {/* Page header */}
            <div className="d-lg-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-3">
                <div className="mb-3 mb-lg-0">
                    <h4 className="fw-bold mb-1">Categories</h4>
                    <p className="text-secondary mb-0">Organize the products in your store by category</p>
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
                    data-bs-target="#addCategoryModal"
                >
                    <i className="bi bi-plus-lg"></i>
                    Add Category
                </button>
            </div>

            {/* Add Category Modal */}
            <div className="modal fade" id="addCategoryModal" tabIndex="-1" aria-labelledby="addCategoryModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="addCategoryModalLabel">New Category</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
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
                                    <label htmlFor="category_name" className="form-label">Category Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="category_name"
                                        name="category_name"
                                        value={categories.category_name}
                                        onChange={handleChange}
                                        placeholder="e.g. Electronics"
                                        required
                                    />
                                </div>
                                <div className="mb-1">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        name="description"
                                        rows="3"
                                        value={categories.description}
                                        onChange={handleChange}
                                        placeholder="Short description of this category"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Add Category</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Edit Category Modal */}
            <div className="modal fade" id="editCategoryModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="editCategoryModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="editCategoryModalLabel">Edit Category</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="category_id" className="form-label">ID</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="category_id"
                                        name="category_id"
                                        value={updatecategories.category_id}
                                        disabled
                                    />
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
                                    <label htmlFor="edit_category_name" className="form-label">Category Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="edit_category_name"
                                        name="category_name"
                                        value={updatecategories.category_name}
                                        onChange={handleEditChange}
                                        placeholder="Category Name"
                                        required
                                    />
                                </div>
                                <div className="mb-1">
                                    <label htmlFor="edit_description" className="form-label">Description</label>
                                    <textarea
                                        className="form-control"
                                        id="edit_description"
                                        name="description"
                                        rows="3"
                                        value={updatecategories.description}
                                        onChange={handleEditChange}
                                        placeholder="Description"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Category table */}
            <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-3">No.</th>
                                    <th>Image</th>
                                    <th>Category Name</th>
                                    <th>Description</th>
                                    <th className="text-end pe-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedList.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center text-secondary py-5">
                                            <i className="bi bi-tags fs-2 d-block mb-2"></i>
                                            No categories yet — click "Add Category" to create one.
                                        </td>
                                    </tr>
                                )}
                                {paginatedList.map((item, index) => (
                                    <tr key={item.category_id}>
                                        <td className="ps-3">{index + 1}</td>
                                        <td>
                                            {item.image ? (
                                                <img
                                                    src={getImageUrl(item.image)}
                                                    alt={item.category_name}
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
                                        <td className="fw-medium">{item.category_name}</td>
                                        <td className="text-secondary" style={{ maxWidth: "320px" }}>
                                            <span className="d-inline-block text-truncate" style={{ maxWidth: "320px" }}>
                                                {item.description}
                                            </span>
                                        </td>
                                        <td className="text-end pe-3">
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-secondary me-2"
                                                title="Edit"
                                                data-bs-toggle="modal"
                                                data-bs-target="#editCategoryModal"
                                                onClick={() => handleEditClick(item)}
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                title="Delete"
                                                onClick={() => deleteCatgories(item.category_id)}
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



                {/* NEW: pagination controls, only shown when there is more than 1 page */}
                {totalPages > 1 && (
                    <div className="card-footer bg-white d-flex justify-content-between align-items-center">
                        <span className="text-secondary small">
                            Page {currentPage} of {totalPages} ({filteredst.length} results)
                        </span>
                        <div className="btn-group">
                            <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                disabled={currentPage === 1}
                                onClick={() => goToPage(currentPage - 1)}
                            >
                                <i className="bi bi-chevron-left"></i> Prev
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    type="button"
                                    className={`btn btn-sm ${page === currentPage ? "btn-primary" : "btn-outline-secondary"}`}
                                    onClick={() => goToPage(page)}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                disabled={currentPage === totalPages}
                                onClick={() => goToPage(currentPage + 1)}
                            >
                                Next <i className="bi bi-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Category;