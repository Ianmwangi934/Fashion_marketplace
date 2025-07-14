import React from 'react';
import { Link } from 'react-router-dom';
import './ProductList.css';


function ProductList({ products = [] }) {
    return (
        <div className="product-grid">
            {products.length > 0 ? (
                products.map(product => (
                    <div className="product-card" key={product.id}>
                        <img src={product.image} alt={product.name} width="200" />
                        <Link to={`/product/${product.id}`}><h2>{product.name}</h2></Link>
                        <h3>{product.name}</h3>
                        <p>${product.price}</p>
                    </div>
                ))
            ) : (
                <p>No products available.Note: Product data may be temporarily unavailable due to Render’s free tier, which puts the backend to sleep after 30 minutes of inactivity. Feel free to sign up and upload a product, or check out the demo video to see the full experience. </p>
            )}
        </div>
    );
}

export default ProductList;
