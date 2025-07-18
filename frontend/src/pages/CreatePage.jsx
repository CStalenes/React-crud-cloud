import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { VITE_BACKEND_URL } from "../config/constants";

const CreatePage = () => {

    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImage(null);
            setImagePreview(null);
        }
    };

    const saveProduct = async(e) => {
        e.preventDefault();
        if(name === "" || quantity === "" || price === ""){
            toast.error('Please fill out all required fields');
            return;
        }
        
        try{
            setIsLoading(true);
            
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('name', name);
            formData.append('quantity', quantity);
            formData.append('price', price);
            if (image) {
                formData.append('image', image);
            }
            
            const response = await axios.post(`${VITE_BACKEND_URL}/api/products`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            toast.success(`Product ${response.data.name} created successfully`);
            setIsLoading(false);
            navigate("/");
        }catch (error){
            console.error('Error creating product:', error);
            toast.error(error.response?.data?.message || 'Error creating product');
            setIsLoading(false);
        }
    }

    return (
        <div className="max-w-lg bg-white shadow-lg mx-auto p-7 rounded mt-6">
            <h2 className="font-semibold text-2xl mb-4 block text-center">
                Create a Product
            </h2>
            <form onSubmit={saveProduct}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            className="w-full block border p-3 text-gray-600 rounded focus:outline-none focus:shadow-outline focus:border-blue-200 placeholder-gray-400" 
                            placeholder="Enter product name"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                        <input 
                            type="number" 
                            value={quantity} 
                            onChange={(e) => setQuantity(e.target.value)} 
                            className="w-full block border p-3 text-gray-600 rounded focus:outline-none focus:shadow-outline focus:border-blue-200 placeholder-gray-400" 
                            placeholder="Enter quantity"
                            min="0"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                        <input 
                            type="number" 
                            step="0.01"
                            value={price} 
                            onChange={(e) => setPrice(e.target.value)} 
                            className="w-full block border p-3 text-gray-600 rounded focus:outline-none focus:shadow-outline focus:border-blue-200 placeholder-gray-400" 
                            placeholder="Enter price"
                            min="0"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full block border p-3 text-gray-600 rounded focus:outline-none focus:shadow-outline focus:border-blue-200"
                        />
                        <p className="text-sm text-gray-500 mt-1">Max size: 5MB. Supported formats: JPG, PNG, GIF, WebP</p>
                        
                        {imagePreview && (
                            <div className="mt-3">
                                <img 
                                    src={imagePreview} 
                                    alt="Preview" 
                                    className="w-full h-32 object-cover rounded border"
                                />
                            </div>
                        )}
                    </div>
                    
                    <div className="pt-4">
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className={`block w-full px-4 py-2 font-bold text-white rounded-sm transition-colors ${
                                isLoading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-700 hover:bg-blue-600 hover:cursor-pointer'
                            }`}
                        >
                            {isLoading ? 'Creating...' : 'Create Product'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default CreatePage;