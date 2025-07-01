import React, { useState, useEffect } from 'react';
import uploadProduct from '../api/productApi';
import './ProductForm.css';

const ProductForm = ({ refreshProducts }) => {
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        size: '',
        color: '',
        category: '',
        image: null,
    });

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const res=await fetch('http://127.0.0.1:8000/store/api/categories/',{
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":`Bearer ${token}`
                    }
                });
                const data = await res.json();
                console.log("fetched categories:", data);
                if (Array.isArray(data)){
                    setCategories(data);
                } else if (Array.isArray(data.results)){
                    setCategories(data.results);
                } else {
                    console.log("Unexpected response format for categories");
                }
                
        
            } catch (err) {
                console.error('Failed to load categories:', err);
            }
        };

        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setProductData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await uploadProduct(productData);
            alert('✅ Product uploaded successfully!');
            setProductData({
                name: '',
                description: '',
                price: '',
                stock: '',
                size: '',
                color: '',
                category: '',
                image: null,
            });
            if (refreshProducts) {
                await refreshProducts(); //  Refresh the product list
            }
        } catch (err) {
            alert('❌ Failed to upload product');
        }
    };

    return (
        <form className="product-form" onSubmit={handleSubmit} encType="multipart/form-data">
            <input type="text" name="name" placeholder="Name" value={productData.name} onChange={handleChange} required />
            <input type="text" name="description" placeholder="Description" value={productData.description} onChange={handleChange} />
            <input type="number" name="price" placeholder="Price in Dolars" value={productData.price} onChange={handleChange} />
            <input type="number" name="stock" placeholder="Stock" value={productData.stock} onChange={handleChange} />
            <input type="text" name="size" placeholder="Size" value={productData.size} onChange={handleChange} />
            <input type="text" name="color" placeholder="Color" value={productData.color} onChange={handleChange} />
            <select name="category" value={productData.category} onChange={handleChange} required>
                <option value="">Select Category</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>

            <input type="file" name="image" accept="image/*" onChange={handleChange} />
            <button type="submit">Upload Product</button>
        </form>
    );
};

export default ProductForm;
