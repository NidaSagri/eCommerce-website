import React, { Fragment, useEffect } from "react";
import "./ProductList.css";
import { useSelector, useDispatch } from "react-redux";
import { Link , useNavigate} from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SideBar from "./Sidebar";
import { deleteOrder, getAllOrders, clearErrors } from "../../actions/orderAction";
import { DELETE_ORDER_RESET } from "../../constants/orderConstants";

const OrderList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();

  const { error, orders } = useSelector((state) => state.allOrders);

  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.order
  );

  const deleteOrderHandler = (id) => {
    dispatch(deleteOrder(id));
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
      alert.success("Order Deleted Successfully");
      navigate("/admin/orders");
      dispatch({ type: DELETE_ORDER_RESET});
    }

    dispatch(getAllOrders());
  }, [dispatch, alert, error, deleteError, navigate, isDeleted]);


  return (
    <Fragment>
      <MetaData title={`ALL ORDERS - Admin`} />

      <div className="dashboard">
        <SideBar />

        <div className="productListContainer">
          {orders && orders.length > 0 ? (
            <>
            <h1 id="productListHeading">ALL ORDERS</h1>

          <table className="myOrdersTable">          
          <thead className="columnHeader">
          <tr>
            <th>Order ID</th>
            <th>Items Quantity</th>
            <th>Status</th>
            <th>Amount(₹)</th>
            <th>Actions</th>
          </tr>
          </thead>

          <tbody>
        
            {orders && orders.map((item)=>(
              <tr key={item._id}>

             <td>{item._id}</td>
             <td>{item.orderItems.length}</td>
             <td className={item.orderStatus==="Delivered"? "greenColor" :"redColor"}>{item.orderStatus}</td>
             <td>₹{item.totalPrice}</td>
             <td className="editIcon">{<Link to={`/admin/order/${item._id}`}><EditIcon/></Link>} {<Button onClick={() =>
                 deleteOrderHandler(item._id)}><DeleteIcon style={{color:"red"}}/></Button>}</td>

          </tr>
            ) )}
          </tbody>

         </table>
         </>
          ) :
           (<h1 className="productReviewsFormHeading" style={{marginTop:"4vmax"}}>No Orders Yet!</h1>)}

        </div>
      </div>
    </Fragment>
  );
};

export default OrderList;