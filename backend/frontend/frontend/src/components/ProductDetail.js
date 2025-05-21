import React, {useEffect, useState, useContext} from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../CartContext";
import './ProductDetail.css';
//Check if the user is authenticated by checking the localstorage
const isAuthenticated = () =>{
    return !!(localStorage.getItem("access_token"));
};


const ProductDetail = () => {
    const {id} = useParams(); // Get product id from URL
    const [product, setProduct] = useState(null);
    const {addToCart} = useContext(CartContext)

    useEffect(() =>{
        fetch(`http://127.0.0.1:8000/store/products/${id}/`)
        .then(res => res.json())
        .then(data => setProduct(data))
        .catch(error => console.error('Error fetching product:', error));
    },[id]);

    if (!product) return <div>Loading...</div>;

    return (
        <div className="product-detail-container" style={{padding: '2rem'}}>
            <h1>{product.name}</h1>
            <img className="product-detail-image" src={product.image} alt={product.name} style={{width: '300px', borderRadius: '10px'}}></img>
            <p><strong>Category:</strong>{product.category_detail?.name}</p>
            <p><strong>Description:</strong>{product.description}</p>
            <p><strong>Price:</strong>${product.price}</p>
            <p><strong>Stock:</strong>{product.stock}</p>
            <button
            className="add-to-cart-btn"
            onClick={() =>{
                if (isAuthenticated()){
                    addToCart(product);
                } else {
                    alert("Please login to add items in your cart")
                }
            }}
            >
                Add to Cart
                

        



            </button>

        </div>
    );
};

export default ProductDetail;