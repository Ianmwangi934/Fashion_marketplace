import React, {createContext, useState,useEffect,useCallback} from "react";
import axios from "axios";

export const CartContext = createContext();

export const CartProvider = ({children}) =>{
    const [cartItems, setCartItems] = useState([]);
    const token = localStorage.getItem("access_token");
    // Fetching cart items from the backend
    const fetchCartItems =useCallback(
        async () => {
            if (!token){
                console.log("User not authenticated");
                return;
            }

             

            try {
                const response = await axios.get("https://fashion-marketplace-10.onrender.com/store/cart/", {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                const items = response.data.items.map(item => ({
                    id: item.product.id,
                    name: item.product.name,
                    price: item.product.price,
                    image: `http://127.0.0.1:8000${item.product.image}`,
                    quantity: item.quantity
                }));

                setCartItems(items);
            } catch (error) {
                console.error("Failed to fetch cart items", error);
                if (error.response && error.response.status === 401){
                    setCartItems([]);
                }
            }
        },
        [token]);
    useEffect(()=>{
        fetchCartItems();
    }, [fetchCartItems]);



    const addToCart = async (product) => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            console.warn("User is not authenticated. Cart add blocked.");
            return false; // Don’t allow unauthenticated users
        }
    
        try {
            await axios.post('https://fashion-marketplace-9.onrender.com/store/cart/add/', {
            products_id: product.id,
            quantity: 1,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
    
            setCartItems(prevItems => {
                const itemExists = prevItems.find(item => item.id === product.id);
                if (itemExists) {
                    return prevItems.map(item =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                } else {
                    return [...prevItems, { ...product, quantity: 1 }];
                }
            });
            return true;
        } catch (error) {
            console.error("Failed to add to cart:", error);
            return false;
        }
    };
    

    const removeFromCart = (id) =>{
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    return (
        <CartContext.Provider value={{cartItems, addToCart, removeFromCart,fetchCartItems}}>
            {children}
        </CartContext.Provider>
    );
};
