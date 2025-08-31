import React, { useEffect, useState } from 'react';
import { getUserAddressesAPI, updateUserAddressesAPI } from '../api/authAPI';
import { Pencil, Trash2 } from 'lucide-react';

const ProfileAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    name: '', label: '', phone: '', line1: '', city: '', state: '', zip: ''
  });
  const [isAdding, setIsAdding] = useState(false);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      getUserAddressesAPI(userId)
        .then(res => {
          const addressList = Array.isArray(res) ? res : res?.data || [];
          setAddresses(addressList);
          
        })
        .catch(console.error);
    }
  }, [userId]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddAddress = async () => {
    const updated = [...addresses, formData];
    try {
      const res = await updateUserAddressesAPI(userId, updated);
      const updatedList = res?.addresses || res?.data?.addresses || res?.data || [];
      setAddresses(updatedList);
      setFormData({ name: '', label: '', phone: '', line1: '', city: '', state: '', zip: '' });
      setIsAdding(false);
    } catch (err) {
      console.error('Error saving address:', err);
    }
  };

  const handleDelete = (idx) => {
    const updated = addresses.filter((_, i) => i !== idx);
    updateUserAddressesAPI(userId, updated)
      .then(res => {
        const updatedList = res?.addresses || res?.data?.addresses || res?.data || [];
        setAddresses(updatedList);
      })
      .catch(console.error);
  };

  return (
    <div className="p-4 rounded-xl bg-white shadow-md">
      <h2 className="text-xl font-semibold text-green-800 mb-6">Delivery Address</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!isAdding && (
          <div
            onClick={() => setIsAdding(true)}
            className="cursor-pointer w-64 h-64 border-dashed border-2 border-green-500 flex flex-col justify-center items-center rounded-xl hover:bg-green-50 transition"
          >
            <span className="text-green-600 text-sm font-semibold">Add New Address</span>
            <div className="mt-2 text-3xl">📍</div>
          </div>
        )}

        {addresses?.map((address, idx) => (
          <div key={idx} className="relative w-64 h-64 p-4 border rounded-xl shadow-sm bg-gray-50 flex flex-col justify-between">
            <div>
              <p className="font-bold text-green-800 mb-1">{address.name}</p>
              <p className="text-xs font-semibold text-white bg-green-500 inline-block px-2 py-1 rounded-full mb-1">DEFAULT</p>
              <p className="text-sm text-gray-700">{address.label}</p>
              <p className="text-sm text-gray-600">{address.line1}, {address.city}, {address.state} - {address.zip}</p>
              <p className="text-sm text-gray-600 mt-2">📞 {address.phone}</p>
            </div>
            <div className="absolute top-2 right-2 flex gap-2">
              <button className="p-1 rounded hover:bg-gray-200">
                <Pencil size={16} className="text-gray-600" />
              </button>
              <button onClick={() => handleDelete(idx)} className="p-1 rounded hover:bg-gray-200">
                <Trash2 size={16} className="text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="mt-6 bg-gray-50 p-4 rounded-xl shadow-inner max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['name', 'label', 'phone', 'line1', 'city', 'state', 'zip'].map(field => (
              <input
                key={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={field[0].toUpperCase() + field.slice(1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAddAddress}
              className="px-5 py-2 bg-green-700 text-white font-medium rounded-lg hover:bg-green-800 transition-all duration-200"
            >
              Save Address
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="px-5 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileAddress;
