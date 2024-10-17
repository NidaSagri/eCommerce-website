import React, { Fragment, useEffect } from "react";
import "./ProductList.css";
import { useSelector, useDispatch } from "react-redux";
import { Link , useNavigate} from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from "@mui/material";
import MetaData from "../layout/MetaData";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SideBar from "./Sidebar";
import { getAllUsers, clearErrors, deleteUser } from "../../actions/userAction";
import { DELETE_USER_RESET } from "../../constants/userConstants";
import Loader from "../layout/Loader/Loader";

const UsersList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();

  const { error, users, loading } = useSelector((state) => state.allUsers);

  const { error: deleteError, isDeleted, message } = useSelector(
    (state) => state.profile
  );

  const deleteUserHandler = (id) => {
    dispatch(deleteUser(id));
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
      alert.success(message);
      navigate("/admin/users");
      dispatch({ type: DELETE_USER_RESET});
    }

    dispatch(getAllUsers());
  }, [dispatch, alert, error, deleteError, navigate, isDeleted, message]);


  return (
 <Fragment>
  {loading?    
   (<Loader />):(
    <Fragment>
      <MetaData title={`ALL USERS - Admin`} />

      <div className="dashboard">
        <SideBar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL USERS</h1>

          <table className="productListTable">
          
          <thead className="columnHeader">
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
          </thead>

          <tbody>
        
            {users && users.map((item)=>(
              <tr key={item._id}>

             <td>{item._id}</td>
             <td>{item.name}</td>
             <td>{item.email}</td>
             <td className={item.role === "admin"? "greenColor": "redColor"}>{item.role}</td>
             <td className="editIcon">{<Link to={`/admin/user/${item._id}`}><EditIcon/></Link>} {<Button onClick={() =>
                 deleteUserHandler(item._id)}><DeleteIcon/></Button>}</td>
            </tr>
            ) )}
          </tbody>

        </table>
        </div>
      </div>
    </Fragment>
  )}
 </Fragment>
  );
};

export default UsersList;