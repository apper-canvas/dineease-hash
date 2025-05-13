import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { addToCart } from '../store/orderSlice';
import getIcon from '../utils/iconUtils';

const MenuItemCard = ({ item }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});
  
  const PlusIcon = getIcon("Plus");
  const MinusIcon = getIcon("Minus");
  const ShoppingCartIcon = getIcon("ShoppingCart");

  const handleAddToCart = () => {
    dispatch(addToCart({
      ...item,
      quantity,
      options: selectedOptions
    }));
    
    toast.success(`${item.name} added to your cart!`);
    setQuantity(1);
    setShowOptions(false);
    setSelectedOptions({});
  };

  const handleOptionChange = (category, value) => {
    setSelectedOptions({
      ...selectedOptions,
      [category]: value
    });
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 h-48 md:h-auto overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
      <div className="p-4 md:p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold">{item.name}</h3>
            <span className="font-bold text-primary">${item.price.toFixed(2)}</span>
          </div>
          <p className="text-surface-600 dark:text-surface-400 text-sm mb-3">{item.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {item.dietaryLabels && item.dietaryLabels.map((label, index) => (
              <span key={index} className="px-2 py-1 bg-surface-100 dark:bg-surface-700 rounded-full text-xs font-medium">
                {label}
              </span>
            ))}
          </div>
          
          {showOptions && item.options && (
            <div className="space-y-3 my-4 p-3 bg-surface-50 dark:bg-surface-800 rounded-lg">
              {Object.keys(item.options).map(category => (
                <div key={category}>
                  <p className="text-sm font-medium mb-1">{category}:</p>
                  <div className="flex flex-wrap gap-2">
                    {item.options[category].map(option => (
                      <button 
                        key={option.name}
                        onClick={() => handleOptionChange(category, option.name)}
                        className={`px-2 py-1 text-xs rounded-full ${
                          selectedOptions[category] === option.name 
                            ? 'bg-primary text-white' 
                            : 'bg-surface-100 dark:bg-surface-700'
                        }`}
                      >
                        {option.name} {option.price > 0 ? `+$${option.price.toFixed(2)}` : ''}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center border border-surface-200 dark:border-surface-700 rounded-lg">
            <button 
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              className="px-2 py-1 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-l-lg"
            >
              <MinusIcon className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 text-center">{quantity}</span>
            <button 
              onClick={() => setQuantity(prev => prev + 1)}
              className="px-2 py-1 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-r-lg"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex gap-2">
            {item.options && (
              <button 
                onClick={() => setShowOptions(!showOptions)}
                className="btn btn-outline text-sm"
              >
                {showOptions ? 'Hide Options' : 'Customize'}
              </button>
            )}
            
            <button 
              onClick={handleAddToCart}
              className="btn btn-primary flex items-center gap-2"
            >
              <ShoppingCartIcon className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;