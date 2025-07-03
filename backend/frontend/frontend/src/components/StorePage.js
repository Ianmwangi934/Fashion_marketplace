import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ProductList from './ProductList';
import boyImage from '../assets/hero.jpeg';
import girlImage from '../assets/heroine.jpeg';



const StorePage = () => {
    const [products, setProducts] = useState([]); // All products from backend
    const [searchTerm, setSearchTerm] = useState("");  // Search input
    const [filteredProducts, setFilteredProducts] = useState([]) //Displayed

    // Fetching all products at once
    const fetchProducts = async () => {
        try {
            const response = await axios.get('https://fashion-marketplace-9.onrender.com/store/api/products/',{
                
                params: {
                    t: new Date().getTime(),
                },
            });
            console.log("Fetched products:", response.data);
            setProducts(response.data);
            setFilteredProducts(response.data);
        } catch (err) {
            console.error('Failed to fetch products:', err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Filter whenever searchTerm or products change
    useEffect(()=>{
        const filtered = products.filter(product=>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        setFilteredProducts(filtered);
    }, [searchTerm, products]);

    return (
        <div>
            {/* Floating search on image banner */}
            <div className="store-hero">
            

            <img src={boyImage} alt="Boy Fashion" className="hero-image" />
                <div className="search-overlay">
                <h1 style={{
                textAlign: "center",
                fontSize: "2rem",
                color: "#333",
                marginBottom: "1rem",
                fontWeight: 700,
                fontFamily: "'Poppins', sans-serif"
                }}>
                <span style={{ color: "#6c63ff" }}>Style</span> Meets <span style={{ color: "#28a745" }}>Savings</span> — Shop the Latest Looks Today!
                </h1>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-bar"
                    />
                </div>
                <img src={girlImage} alt="Girl Fashion" className="hero-image" />
            </div>

            <ProductList products={filteredProducts} />
        </div>
    );
};

export default StorePage;
