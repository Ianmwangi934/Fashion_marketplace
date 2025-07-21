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
        const token = localStorage.getItem("access_token");
        const response = await axios.post(
            'https://fashion-marketplace-12.onrender.com/store/api/products/create/',
            formData,
            {
                headers: {
                    // ⚠️ Let axios set Content-Type properly with boundary
                    Authorization: `Bearer ${token}`,
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
