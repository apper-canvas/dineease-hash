import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../store/orderSlice';
import { toast } from 'react-toastify';
import CartItem from '../components/CartItem';
import getIcon from '../utils/iconUtils';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector(state => state.order.cart);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  const ArrowLeftIcon = getIcon("ArrowLeft");
  const TrashIcon = getIcon("Trash2");
  const AlertTriangleIcon = getIcon("AlertTriangle");
  const ShoppingBagIcon = getIcon("ShoppingBag");
  
  const handleClearCart = () => {
    dispatch(clearCart());
    toast.info("Your cart has been cleared");
    setShowClearConfirm(false);
  };
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxRate = 0.0825; // 8.25%
  const tax = subtotal * taxRate;
  const deliveryFee = 3.99;
  const total = subtotal + tax + (cart.length > 0 ? deliveryFee : 0);
  
  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-surface-800 rounded-2xl overflow-hidden shadow-card">
          <div className="p-8 text-center">
            <ShoppingBagIcon className="w-16 h-16 mx-auto mb-4 text-surface-400 dark:text-surface-500" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-surface-600 dark:text-surface-400 mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link 
              to="/order" 
              className="btn btn-primary"
            >
              Browse Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-surface-600 dark:text-surface-400 hover:text-primary transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back to Menu</span>
        </button>
        
        <button 
          onClick={() => setShowClearConfirm(true)}
          className="flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors"
        >
          <TrashIcon className="w-4 h-4" />
          <span>Clear Cart</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-surface-800 rounded-2xl overflow-hidden shadow-card">
            <h2 className="text-xl font-bold p-6 border-b border-surface-200 dark:border-surface-700">
              Your Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
            </h2>
            
            <div className="divide-y divide-surface-200 dark:divide-surface-700">
              {cart.map((item, index) => (
                <CartItem key={`${item.id}-${index}`} item={item} />
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-surface-800 rounded-2xl overflow-hidden shadow-card p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-surface-600 dark:text-surface-400">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-surface-600 dark:text-surface-400">Tax (8.25%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-surface-600 dark:text-surface-400">Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-surface-200 dark:border-surface-700 pt-3 mt-3">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <Link 
              to="/checkout" 
              className="btn btn-primary w-full mt-6"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
      
      {/* Clear Cart Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-surface-800 rounded-xl p-6 max-w-sm w-full m-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangleIcon className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-bold">Clear your cart?</h3>
            </div>
            
            <p className="text-surface-600 dark:text-surface-400 mb-6">
              Are you sure you want to remove all items from your cart? This action cannot be undone.
            </p>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowClearConfirm(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button 
                onClick={handleClearCart}
                className="btn bg-red-500 text-white hover:bg-red-600 focus:ring-red-500"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;