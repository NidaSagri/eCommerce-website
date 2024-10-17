import React, { Fragment, useEffect } from "react";
import "./MyOrders.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, myOrders } from "../../actions/orderAction";
import Loader from "../layout/Loader/Loader";
import { Link} from "react-router-dom";
import { useAlert } from "react-alert";
import Typography from "@mui/material/Typography";
import MetaData from "../layout/MetaData";
import LaunchIcon from '@mui/icons-material/Launch';

const MyOrders = () => {
  const dispatch = useDispatch();

  const alert = useAlert();

  const { loading, error, orders } = useSelector((state) => state.myOrders);
  const { user } = useSelector((state) => state.user);


  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(myOrders());
  }, [dispatch, alert, error]);

  return (
    <Fragment>
      <MetaData title={`${user.name} - Orders`} />

      {loading ? (
        <Loader />
      ) : (
        <div className="myOrdersPage">
        <Typography id="myOrdersHeading">{user.name}'s Orders</Typography> 
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
        
            {orders.map((item)=>(
              <tr key={item._id}>

             <td>{item._id}</td>
             <td>{item.orderItems.length}</td>
             <td className={item.orderStatus==="Delivered"? "greenColor" :"redColor"}>{item.orderStatus}</td>
             <td>₹{item.totalPrice}</td>
             <td>{<Link to={`/order/${item._id}`}> <LaunchIcon/> </Link> }</td>

          </tr>
            ) )}
          </tbody>

         </table>

          
        </div>
      )}
    </Fragment>
  );
};

export default MyOrders;