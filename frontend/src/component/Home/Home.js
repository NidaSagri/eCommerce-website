import React, { Fragment } from 'react'
import { useEffect } from 'react';
import { CgMouse } from "react-icons/cg";
import "./Home.css"
import ProductCard from './ProductCard';
import MetaData from '../layout/MetaData';
import {clearErrors, getProduct} from "../../actions/productAction"
import {useSelector, useDispatch} from "react-redux"
import Loader from "../layout/Loader/Loader"
import { useAlert } from 'react-alert';

const Home = () => {

  const alert = useAlert()
  const dispatch = useDispatch()
  const {error, products, loading} = useSelector(
    (state)=> state.products
  )

  useEffect(()=>{
    if(error){
      alert.error(error);
      dispatch(clearErrors())
    }
    dispatch(getProduct())
  },[dispatch,error, alert])

  return (
    <>
    {loading? (<Loader/>): (
      <Fragment>
      <MetaData title="SHOPPY - ECOMMERCE"/>
      <div className="banner">
            <p>Welcome to SHOPPY</p>
            <h1>FIND AMAZING PRODUCTS BELOW</h1>

            <a href="#container">
              <button>
                Scroll <CgMouse />
              </button>
            </a>
        </div>

        <h2 className="homeHeading">Featured Products</h2>

        <div className="container" id="container">
            {products && products.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      </Fragment>
    )}
    </>
  )
}

export default Home
