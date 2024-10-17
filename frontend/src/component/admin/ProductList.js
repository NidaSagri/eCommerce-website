import React, { Fragment, useEffect } from "react";
import "./ProductList.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getAdminProduct,
  deleteProduct,
} from "../../actions/productAction";
import { Link , useNavigate} from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from "@mui/material";
import MetaData from "../layout/MetaData";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SideBar from "./Sidebar";
import { DELETE_PRODUCT_RESET } from "../../constants/productConstants";

const ProductList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();

  const { error, products } = useSelector((state) => state.products);

  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.product
  );

  const deleteProductHandler = (id) => {
    dispatch(deleteProduct(id));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success("Product Deleted Successfully");
      navigate("/admin/dashboard");
      dispatch({ type: DELETE_PRODUCT_RESET });
    }

    dispatch(getAdminProduct());
  }, [dispatch, alert, error, deleteError, navigate, isDeleted]);


  return (
    <Fragment>
      <MetaData title={`ALL PRODUCTS - Admin`} />

      <div className="dashboard">
        <SideBar />
        <div className="productListContainer">
          {products && products.length > 0? (<>
            <h1 id="productListHeading">ALL PRODUCTS</h1>

          <table className="productListTable">
          
          <thead className="columnHeader">
          <tr>
            <th>Product ID</th>
            <th>Name</th>
            <th>Stock</th>
            <th>Price(₹)</th>
            <th>Actions</th>
          </tr>
          </thead>

          <tbody>
        
            {products && products.map((item)=>(
              <tr key={item._id}>

             <td>{item._id}</td>
             <td>{item.name}</td>
             <td>{item.Stock}</td>
             <td>₹{item.price}</td>
             <td className="editIcon">{<Link to={`/admin/product/${item._id}`}><EditIcon/></Link>} {<Button onClick={() =>
                 deleteProductHandler(item._id)}><DeleteIcon/></Button>}</td>
            </tr>
            ) )}
          </tbody>

        </table>
          </>):
          ((<h1 className="productReviewsFormHeading" style={{marginTop:"4vmax"}}>No Products</h1>))}
        </div>
      </div>
    </Fragment>
  );
};

export default ProductList;