import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { newProductReducer, newReviewReducer, productDetailsReducer, productReducer, productsReducer } from "./reducers/ProductReducer";
import { userReducer, profileReducer } from "./reducers/UserReducer";
import { cartReducer } from "./reducers/CartReducer";
import { myOrdersReducer, newOrderReducer, orderDetailsReducer } from "./reducers/OrderReducer";

const reducer = combineReducers({
 products:productsReducer,
 productDetails: productDetailsReducer,
 user: userReducer,
 profile: profileReducer,
 cart: cartReducer,
 newOrder: newOrderReducer,
 myOrders: myOrdersReducer,
 orderDetails: orderDetailsReducer,
 newReview: newReviewReducer,
 newProduct: newProductReducer,
 product: productReducer,
//  allOrders: allOrdersReducer,
//  order: orderReducer,
//  allUsers: allUsersReducer,
//  userDetails: userDetailsReducer,
//  productReviews: productReviewsReducer,
//  review: reviewReducer,
})

let initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
  },
}

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;