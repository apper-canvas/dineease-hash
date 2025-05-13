import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import getIcon from '../utils/iconUtils';

const OrderHistory = () => {
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  
  const pastOrders = useSelector(state => state.order.pastOrders);
  const activeOrders = useSelector(state => state.order.activeOrders);
  
  const ArrowLeftIcon = getIcon("ArrowLeft");
  const ChevronDownIcon = getIcon("ChevronDown");
  const ChevronUpIcon = getIcon("ChevronUp");
  const ClockIcon = getIcon("Clock");
  const TruckIcon = getIcon("Truck");
  const ShoppingBagIcon = getIcon("ShoppingBag");
  
  const toggleOrder = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };
  
  // Combine active and past orders for display
  const allOrders = [...activeOrders, ...pastOrders].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
  
  if (allOrders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="flex items-center gap-1 text-surface-600 dark:text-surface-400 hover:text-primary transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
        </div>
        
        <div className="bg-white dark:bg-surface-800 rounded-2xl overflow-hidden shadow-card p-8 text-center">
          <ClockIcon className="w-16 h-16 mx-auto mb-4 text-surface-400 dark:text-surface-500" />
          <h2 className="text-2xl font-bold mb-2">No Order History</h2>
          <p className="text-surface-600 dark:text-surface-400 mb-6">
            You haven't placed any orders yet.
          </p>
          <Link to="/order" className="btn btn-primary">
            Place Your First Order
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/"
          className="flex items-center gap-1 text-surface-600 dark:text-surface-400 hover:text-primary transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      
      <div className="space-y-4">
        {allOrders.map(order => {
          const isActive = activeOrders.find(o => o.id === order.id) !== undefined;
          const isExpanded = expandedOrderId === order.id;
          
          return (
            <div key={order.id} className="bg-white dark:bg-surface-800 rounded-lg shadow-card overflow-hidden">
              <div 
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-700"
                onClick={() => toggleOrder(order.id)}
              >
                <div className="flex items-center gap-3">
                  {order.orderType === 'delivery' ? 
                    <TruckIcon className="w-5 h-5 text-primary" /> : 
                    <ShoppingBagIcon className="w-5 h-5 text-primary" />
                  }
                  <div>
                    <div className="font-medium">Order #{order.id}</div>
                    <div className="text-sm text-surface-500">
                      {new Date(order.date).toLocaleDateString()} • ${order.total.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {isActive ? (
                    <span className="text-sm font-medium px-3 py-1 bg-primary/10 text-primary rounded-full">
                      {order.status}
                    </span>
                  ) : (
                    <span className="text-sm font-medium px-3 py-1 bg-surface-100 dark:bg-surface-700 text-surface-500 rounded-full">
                      Completed
                    </span>
                  )}
                  
                  {isExpanded ? 
                    <ChevronUpIcon className="w-5 h-5 text-surface-400" /> : 
                    <ChevronDownIcon className="w-5 h-5 text-surface-400" />
                  }
                </div>
              </div>
              
              {isExpanded && (
                <div className="p-4 border-t border-surface-200 dark:border-surface-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-sm uppercase text-surface-500 mb-2">Order Items</h3>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{item.quantity}x {item.name}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-surface-200 dark:border-surface-700 mt-3 pt-2">
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span>${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-sm uppercase text-surface-500 mb-2">
                        {order.orderType === 'delivery' ? 'Delivery' : 'Pickup'} Details
                      </h3>
                      <p>{order.deliveryAddress.name}</p>
                      <p>{order.deliveryAddress.phone}</p>
                      {order.orderType === 'delivery' && (
                        <p className="mt-1">
                          {order.deliveryAddress.street}, {order.deliveryAddress.city}, 
                          {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {isActive && (
                    <div className="mt-4 flex justify-center">
                      <Link 
                        to={`/order-tracking/${order.id}`}
                        className="btn btn-primary"
                      >
                        Track Order
                      </Link>
                    </div>
                  )}
                  
                  {!isActive && (
                    <div className="mt-4 flex justify-center">
                      <Link
                        to="/order"
                        className="btn btn-outline"
                      >
                        Order Again
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderHistory;