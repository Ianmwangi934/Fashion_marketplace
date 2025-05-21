import React, {createContext, useState} from "react";

export const CartContext = createContext();

export const CartProvider = ({children}) =>{
    const [cartItems, setCartItems] = useState([]);

    const addToCart = async (product) => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            console.warn("User is not authenticated. Cart add blocked.");
            return; // Don’t allow unauthenticated users
        }
    
        try {
            await fetch('http://127.0.0.1:8000/store/cart/add/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    
                },
                body: JSON.stringify({
                    products_id: product.id,
                    quantity: 1,
                })
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
        } catch (error) {
            console.error("Failed to add to cart:", error);
        }
    };
    

    const removeFromCart = (id) =>{
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    return (
        <CartContext.Provider value={{cartItems, addToCart, removeFromCart}}>
            {children}
        </CartContext.Provider>
    );
};