import React, { useEffect, useState } from 'react';
import ProductList from './ProductList';

const StorePage = () => {
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/store/api/products/');
            const data = await res.json();
            console.log('Fetched products:', data);
            setProducts(data);
        } catch (err) {
            console.error('Failed to fetch products:', err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div>
            
            <ProductList products={products} />
        </div>
    );
};

export default StorePage;
