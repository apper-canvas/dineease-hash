import { useDispatch } from 'react-redux';
import { updateCartItemQuantity, removeFromCart } from '../store/orderSlice';
import getIcon from '../utils/iconUtils';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  
  const PlusIcon = getIcon("Plus");
  const MinusIcon = getIcon("Minus");
  const TrashIcon = getIcon("Trash2");
  
  const handleQuantityChange = (newQuantity) => {
    dispatch(updateCartItemQuantity({
      id: item.id,
      options: item.options,
      quantity: newQuantity
    }));
  };
  
  const handleRemove = () => {
    dispatch(removeFromCart({
      id: item.id,
      options: item.options
    }));
  };
  
  const itemTotal = item.price * item.quantity;
  
  return (
    <div className="flex items-start gap-4 p-4 border-b border-surface-200 dark:border-surface-700 last:border-0">
      <div className="w-20 h-20 rounded-lg overflow-hidden bg-surface-100 dark:bg-surface-800 flex-shrink-0">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="font-medium">{item.name}</h3>
          <p className="font-medium">${itemTotal.toFixed(2)}</p>
        </div>
        
        <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">${item.price.toFixed(2)} each</p>
        
        {item.options && Object.keys(item.options).length > 0 && (
          <div className="mt-1 text-xs text-surface-500 dark:text-surface-400">
            {Object.entries(item.options).map(([category, option]) => (
              <span key={category}>{category}: {option} </span>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-surface-200 dark:border-surface-700 rounded-lg">
            <button 
              onClick={() => handleQuantityChange(Math.max(1, item.quantity - 1))}
              className="px-2 py-1 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-l-lg"
            >
              <MinusIcon className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 text-center">{item.quantity}</span>
            <button 
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="px-2 py-1 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-r-lg"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
          
          <button 
            onClick={handleRemove}
            className="text-red-500 hover:text-red-600 p-1"
            aria-label="Remove item"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;