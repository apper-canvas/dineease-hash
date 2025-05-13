import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [statusIndex, setStatusIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const activeOrders = useSelector(state => state.order.activeOrders);
  
  const ArrowLeftIcon = getIcon("ArrowLeft");
  const ChevronDownIcon = getIcon("ChevronDown");
  const ChevronUpIcon = getIcon("ChevronUp");
  const TruckIcon = getIcon("Truck");
  const ClockIcon = getIcon("Clock");
  const CheckCircleIcon = getIcon("CheckCircle");
  const CookingPotIcon = getIcon("Soup");
  const PackageIcon = getIcon("Package");
  
  // Status steps for tracking
  const orderStatuses = [
    { 
      key: 'Preparing', 
      label: 'Order Confirmed', 
      description: 'Your order has been received and is being prepared.',
      icon: CheckCircleIcon
    },
    { 
      key: 'Cooking', 
      label: 'Cooking', 
      description: 'Our chefs are now preparing your delicious meal.',
      icon: CookingPotIcon
    },
    { 
      key: 'Packaging', 
      label: 'Packaging', 
      description: 'Your meal is being carefully packaged.',
      icon: PackageIcon
    },
    { 
      key: 'OnTheWay', 
      label: 'On the way', 
      description: 'Your order is on its way to you!',
      icon: TruckIcon
    },
    { 
      key: 'Delivered', 
      label: 'Delivered', 
      description: 'Your order has been delivered. Enjoy your meal!',
      icon: CheckCircleIcon
    }
  ];
  
  // Find the order based on the ID parameter
  useEffect(() => {
    const foundOrder = activeOrders.find(o => o.id === id);
    if (foundOrder) {
      setOrder(foundOrder);
      
      // Set status index based on order status
      const index = orderStatuses.findIndex(s => s.key === foundOrder.status);
      setStatusIndex(index >= 0 ? index : 0);
      
      // Calculate remaining time if estimated delivery is available
      if (foundOrder.estimatedDelivery) {
        const now = new Date();
        const estimated = new Date(foundOrder.estimatedDelivery);
        const diffMs = Math.max(0, estimated - now);
        setTimeRemaining(Math.floor(diffMs / 60000)); // Convert to minutes
      }
    }
  }, [id, activeOrders]);
  
  // Simulate order progress for demo purposes
  useEffect(() => {
    if (!order) return;
    
    // For demo: advance status every 15 seconds
    const timer = setTimeout(() => {
      if (statusIndex < orderStatuses.length - 1) {
        setStatusIndex(prev => prev + 1);
        
        // Update time remaining
        setTimeRemaining(prev => Math.max(0, prev - 3));
      }
    }, 15000);
    
    return () => clearTimeout(timer);
  }, [order, statusIndex]);
  
  // Countdown timer
  useEffect(() => {
    if (timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, [timeRemaining]);
  
  if (!order) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-surface-800 rounded-2xl overflow-hidden shadow-card p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <p className="text-surface-600 dark:text-surface-400 mb-6">
            We couldn't find the order you're looking for.
          </p>
          <Link to="/" className="btn btn-primary">
            Return Home
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
      
      <div className="bg-white dark:bg-surface-800 rounded-2xl overflow-hidden shadow-card">
        <div className="bg-gradient-to-r from-primary to-primary-light p-6 text-white">
          <h2 className="text-2xl font-bold">Order #{order.id}</h2>
          <p className="text-white/80">
            {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
          </p>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Order Status</h3>
            
            {timeRemaining > 0 && (
              <div className="flex items-center gap-2 text-primary">
                <ClockIcon className="w-5 h-5" />
                <span className="font-medium">
                  {timeRemaining} min remaining
                </span>
              </div>
            )}
          </div>
          
          <div className="relative mb-8">
            {/* Progress bar */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-surface-200 dark:bg-surface-700"></div>
            
            {/* Status points */}
            {orderStatuses.map((status, index) => {
              const Icon = status.icon;
              const isPassed = index <= statusIndex;
              const isCurrent = index === statusIndex;
              
              return (
                <div key={status.key} className="relative mb-8 last:mb-0">
                  <div className="flex">
                    <div className={`relative z-10 rounded-full w-10 h-10 flex items-center justify-center ${
                      isPassed 
                        ? 'bg-primary text-white'
                        : 'bg-surface-200 dark:bg-surface-700 text-surface-500'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="font-medium text-lg">
                        {status.label}
                      </div>
                      <div className="text-surface-600 dark:text-surface-400 text-sm">
                        {status.description}
                      </div>
                      
                      {isCurrent && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-primary font-medium"
                        >
                          Current status
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-8">
            <div 
              className="flex justify-between items-center cursor-pointer mb-4"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <h3 className="text-lg font-medium">Order Details</h3>
              <button className="text-surface-500">
                {isExpanded ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
              </button>
            </div>
            
            {isExpanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-4"
              >
                <div className="bg-surface-50 dark:bg-surface-800 rounded-lg p-4">
                  <h4 className="font-medium mb-2 text-sm uppercase text-surface-500">Items</h4>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between py-1">
                      <span>{item.quantity}x {item.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-surface-200 dark:border-surface-700 mt-3 pt-3">
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-surface-50 dark:bg-surface-800 rounded-lg p-4">
                  <h4 className="font-medium mb-2 text-sm uppercase text-surface-500">
                    {order.orderType === 'delivery' ? 'Delivery' : 'Pickup'} Information
                  </h4>
                  <p>{order.deliveryAddress.name}</p>
                  <p>{order.deliveryAddress.phone}</p>
                  {order.orderType === 'delivery' && (
                    <p className="mt-1">{order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}</p>
                  )}
                  {order.deliveryAddress.specialInstructions && (
                    <p className="mt-2 text-sm italic">"{order.deliveryAddress.specialInstructions}"</p>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;