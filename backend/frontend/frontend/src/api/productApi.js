// src/api/productApi.js
import axios from 'axios';

const uploadProduct = async (productData) => {
    const formData = new FormData();

    for (const key in productData) {
        const value = productData[key];
        if (value !== null && value !== undefined) {
            formData.append(key, value);
        }
    }

    try {
        const response = await axios.post(
            'https://fashion-marketplace-10.onrender.com/store/api/products/create/',
            formData,
            
            {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',

                },
            }
        );
        console.log('✅ Product Uploaded:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Upload failed:', error.response?.data || error.message);
        throw error;
    }
};
export default uploadProduct;
