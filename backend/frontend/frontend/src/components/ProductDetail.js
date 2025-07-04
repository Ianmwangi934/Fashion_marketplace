import React, {useEffect, useState, useContext} from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../CartContext";
import './ProductDetail.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Check if the user is authenticated by checking the localstorage
const isAuthenticated = () =>{
    return !!(localStorage.getItem("access_token"));
};


const ProductDetail = () => {
    const {id} = useParams(); // Get product id from URL
    const [product, setProduct] = useState(null);
    const {addToCart} = useContext(CartContext)

    useEffect(() =>{
        fetch(`https://fashion-marketplace-11.onrender.com/store/products/${id}/`)
        .then(res => res.json())
        .then(data => setProduct(data))
        .catch(error => console.error('Error fetching product:', error));
    },[id]);

    if (!product) return <div>Loading...</div>;

    return (
        <div className="product-detail-container" style={{padding: '2rem'}}>
            <h1>{product.name}</h1>
            <img className="product-detail-image" src={product.image} alt={product.name} style={{width: '300px', borderRadius: '10px'}}></img>
            <p><strong>Description:</strong>{product.description}</p>
            <p><strong>Price:</strong>${product.price}</p>
            <p><strong>Size:</strong>{product.size}</p>
            <p><strong>Stock:</strong>{product.stock}</p>
            <button
            className="add-to-cart-btn"
            onClick={ async() =>{
                if (isAuthenticated()){
                    try {
                        
                        const result =await addToCart(product); // wait for the promise to complete
                        if (result === false){
                            toast.error("Please login to add items to your cart");
                        } else {
                            toast.success("Item added to cart!");
                        }
                        
                    } catch (error) {
                        console.log("Error adding to cart:", error);
                        toast.error("Failed to add item to cart. Please try again.");
                    }
                } else{
                    toast.error("Please login to add items to your cart");
                }
            }}
            >
                Add to Cart
                

        



            </button>
            <ToastContainer position="top-center" autoClose={3000} />

        </div>
    );
};

export default ProductDetail;
