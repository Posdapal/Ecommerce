import React from 'react'
import HeroSlider from "../../components/HeaderSlider/HeaderSlider"
import { useEffect, useState } from 'react';
import axios from "axios";
import ProductCard from '../../components/ProductCard/ProductCard';

const API_BASE =  process.env.REACT_APP_API_URL;

function Home() {
  const [products, setProducts] = useState([]);
  const [setLoading] = useState(true);

  useEffect(() => {
    getProducts();
  });

  const getProducts = () => {
    axios.get(`${API_BASE}/api/product`)
      .then(res => {
        setProducts(res.data.list);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      });
  }
  return (
    <>
      <HeroSlider />

      <h3 className="mt-5 text-bold" id='computers' style={{ scrollMarginTop: "90px" }}>Computers & Accessories</h3>
      <div className="row">
        {products.map((p) => (
          <ProductCard key={p.product_id} product={p} />
        ))}
      </div>

    </>
  )
}

export default Home