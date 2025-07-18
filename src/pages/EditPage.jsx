import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { VITE_BACKEND_URL } from "../App";

const EditPage = () => {
    let { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [product, setProduct] = useState({
        name: "",
        quantity: "",
        price: "",
        image: "",
    });

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

    const getProduct = async () => {
        setIsLoading(true);
        try{
            const response = await axios.get(`${VITE_BACKEND_URL}/api/products/${id}`);
            setProduct({
                name: response.data.name,
                quantity: response.data.quantity,
                price: response.data.price,
                image: response.data.image,
            });
            setIsLoading(false);
        }catch(error){
            setIsLoading(false);
            toast.error(error.response?.data?.message || 'Error loading product');
        }
    }

    const updateProduct = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try{
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('name', product.name);
            formData.append('quantity', product.quantity);
            formData.append('price', product.price);
            if (image) {
                formData.append('image', image);
            }
            
            await axios.put(`${VITE_BACKEND_URL}/api/products/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            toast.success("Product updated successfully");
            navigate('/');
        }catch(error){
            setIsLoading(false);
            console.error('Error updating product:', error);
            toast.error(error.response?.data?.message || 'Error updating product');
        }
    }

    useEffect(() => {
        getProduct();
    }, [])

    return (
        <div className="max-w-lg bg-white shadow-lg mx-auto p-7 rounded mt-6">
            <h2 className="font-semibold text-2xl mb-4 block text-center">
                Update Product
            </h2>
            {isLoading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading...</p>
                </div>
            ) : (
                <form onSubmit={updateProduct}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                            <input 
                                type="text" 
                                value={product.name} 
                                onChange={(e) => setProduct({...product, name: e.target.value})}  
                                className="w-full block border p-3 text-gray-600 rounded focus:outline-none focus:shadow-outline focus:border-blue-200 placeholder-gray-400" 
                                placeholder="Enter product name"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                            <input 
                                type="number" 
                                value={product.quantity} 
                                onChange={(e) => setProduct({...product, quantity: e.target.value})}  
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
                                value={product.price} 
                                onChange={(e) => setProduct({...product, price: e.target.value})} 
                                className="w-full block border p-3 text-gray-600 rounded focus:outline-none focus:shadow-outline focus:border-blue-200 placeholder-gray-400" 
                                placeholder="Enter price"
                                min="0"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                            
                            {/* Current image */}
                            {product.image && !imagePreview && (
                                <div className="mb-3">
                                    <p className="text-sm text-gray-600 mb-2">Current image:</p>
                                    <img 
                                        src={product.image.startsWith('/uploads/') 
                                            ? `${VITE_BACKEND_URL}${product.image}`
                                            : product.image
                                        } 
                                        alt="Current product" 
                                        className="w-full h-32 object-cover rounded border"
                                        onError={(e) => {
                                            e.target.src = '/placeholder-image.png';
                                        }}
                                    />
                                </div>
                            )}
                            
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full block border p-3 text-gray-600 rounded focus:outline-none focus:shadow-outline focus:border-blue-200"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Max size: 5MB. Leave empty to keep current image.
                            </p>
                            
                            {/* New image preview */}
                            {imagePreview && (
                                <div className="mt-3">
                                    <p className="text-sm text-gray-600 mb-2">New image preview:</p>
                                    <img 
                                        src={imagePreview} 
                                        alt="New preview" 
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
                                {isLoading ? 'Updating...' : 'Update Product'}
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    )
}

export default EditPage;