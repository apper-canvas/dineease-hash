import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { updateDeliveryAddress, placeOrder } from '../store/orderSlice';
import OrderTypeSelector from '../components/OrderTypeSelector';
import getIcon from '../utils/iconUtils';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, orderType, deliveryAddress, activeOrders } = useSelector(state => state.order);
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(deliveryAddress);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [errors, setErrors] = useState({});
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [cardErrors, setCardErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const ArrowLeftIcon = getIcon("ArrowLeft");
  const MapPinIcon = getIcon("MapPin");
  const CreditCardIcon = getIcon("CreditCard");
  const DollarSignIcon = getIcon("DollarSign");
  const ChevronRightIcon = getIcon("ChevronRight");
  const CheckIcon = getIcon("Check");
  const ClockIcon = getIcon("Clock");
  const ShoppingBagIcon = getIcon("ShoppingBag");
  
  useEffect(() => {
    // Redirect to cart if no items in cart
    if (cart.length === 0) {
      navigate('/cart');
      toast.info("Your cart is empty. Please add items before checkout.");
    }
  }, [cart, navigate]);
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxRate = 0.0825; // 8.25%
  const tax = subtotal * taxRate;
  const deliveryFee = orderType === 'delivery' ? 3.99 : 0;
  const total = subtotal + tax + deliveryFee;
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleCardChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'number') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
      setCardDetails(prev => ({
        ...prev,
        [name]: formatted
      }));
    } 
    // Format expiry date
    else if (name === 'expiry') {
      const formatted = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .slice(0, 5);
      setCardDetails(prev => ({
        ...prev,
        [name]: formatted
      }));
    }
    // CVV and Name
    else {
      setCardDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when field is edited
    if (cardErrors[name]) {
      setCardErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateAddressForm = () => {
    const newErrors = {};
    
    if (orderType === 'delivery') {
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.street) newErrors.street = 'Street address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(formData.phone)) {
        newErrors.phone = 'Invalid phone number format';
      }
    } else {
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(formData.phone)) {
        newErrors.phone = 'Invalid phone number format';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validatePaymentForm = () => {
    if (paymentMethod === 'cash') return true;
    
    const newErrors = {};
    
    // Basic card validation
    if (!cardDetails.number.replace(/\s/g, '').match(/^\d{16}$/)) {
      newErrors.number = 'Invalid card number';
    }
    
    if (!cardDetails.name) {
      newErrors.name = 'Name on card is required';
    }
    
    if (!cardDetails.expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      newErrors.expiry = 'Invalid expiry date (MM/YY)';
    } else {
      // Check if card is expired
      const [month, year] = cardDetails.expiry.split('/');
      const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1, 1);
      const today = new Date();
      
      if (expiryDate < today) {
        newErrors.expiry = 'Card has expired';
      }
    }
    
    if (!cardDetails.cvv.match(/^\d{3,4}$/)) {
      newErrors.cvv = 'Invalid CVV';
    }
    
    setCardErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    if (step === 1 && validateAddressForm()) {
      // Save address information to redux store
      dispatch(updateDeliveryAddress(formData));
      setStep(2);
    } else if (step === 2 && validatePaymentForm()) {
      setStep(3);
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/cart');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting || !validatePaymentForm()) return;
      setIsSubmitting(true);
      
      try {
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Calculate estimated delivery or pickup time (30-45 min from now)
        const now = new Date();
        const estimatedDelivery = new Date(now.getTime() + (40 * 60 * 1000));
        
        // Place the order
        const actionResult = dispatch(placeOrder({ estimatedDelivery }));
        const newOrderId = actionResult.payload.id;
        
        if (newOrderId) {
          toast.success(`Your order has been placed! ${orderType === 'delivery' ? 'It will be delivered soon.' : 'It will be ready for pickup soon.'}`, {
            icon: "🍽️"
          });
          
          // Navigate to order tracking with the new order ID
          navigate(`/order-tracking/${newOrderId}`);
        } else {
          throw new Error("Failed to create order");
        }
      } catch (error) {
        toast.error("There was an error processing your order. Please try again.", { autoClose: 5000 });
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={handleBack}
          className="flex items-center gap-1 text-surface-600 dark:text-surface-400 hover:text-primary transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>{step === 1 ? 'Back to Cart' : 'Back'}</span>
        </button>
        
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>
      
      {/* Progress Steps */}
      <div className="bg-white dark:bg-surface-800 rounded-lg p-4 mb-6">
        <div className="flex justify-between">
          <div className={`flex flex-col items-center ${step >= 1 ? 'text-primary' : 'text-surface-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-primary text-white' : 'bg-surface-200 dark:bg-surface-700'
            }`}>
              {step > 1 ? <CheckIcon className="w-4 h-4" /> : '1'}
            </div>
            <span className="text-xs mt-1">Address</span>
          </div>
          
          <div className={`flex-1 flex items-center mx-2 ${step > 1 ? 'text-primary' : ''}`}>
            <div className={`h-0.5 w-full ${step > 1 ? 'bg-primary' : 'bg-surface-200 dark:bg-surface-700'}`}></div>
          </div>
          
          <div className={`flex flex-col items-center ${step >= 2 ? 'text-primary' : 'text-surface-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-primary text-white' : 'bg-surface-200 dark:bg-surface-700'
            }`}>
              {step > 2 ? <CheckIcon className="w-4 h-4" /> : '2'}
            </div>
            <span className="text-xs mt-1">Payment</span>
          </div>
          
          <div className={`flex-1 flex items-center mx-2 ${step > 2 ? 'text-primary' : ''}`}>
            <div className={`h-0.5 w-full ${step > 2 ? 'bg-primary' : 'bg-surface-200 dark:bg-surface-700'}`}></div>
          </div>
          
          <div className={`flex flex-col items-center ${step >= 3 ? 'text-primary' : 'text-surface-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 3 ? 'bg-primary text-white' : 'bg-surface-200 dark:bg-surface-700'
            }`}>
              {step > 3 ? <CheckIcon className="w-4 h-4" /> : '3'}
            </div>
            <span className="text-xs mt-1">Review</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-surface-800 rounded-2xl overflow-hidden shadow-card">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Delivery/Pickup Information */}
              {step === 1 && (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="p-6"
                >
                  <h2 className="text-xl font-bold mb-6">Delivery or Pickup?</h2>
                  
                  <motion.div variants={itemVariants} className="mb-6">
                    <OrderTypeSelector />
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="mt-8">
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      {orderType === 'delivery' ? (
                        <>
                          <MapPinIcon className="w-5 h-5 mr-2 text-primary" />
                          Delivery Information
                        </>
                      ) : (
                        <>
                          <ShoppingBagIcon className="w-5 h-5 mr-2 text-primary" />
                          Pickup Information
                        </>
                      )}
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="label">Your Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="input"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="label">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="input"
                          placeholder="(123) 456-7890"
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                      </div>
                      
                      {orderType === 'delivery' && (
                        <>
                          <div>
                            <label htmlFor="street" className="label">Street Address</label>
                            <input
                              type="text"
                              id="street"
                              name="street"
                              value={formData.street}
                              onChange={handleChange}
                              className="input"
                            />
                            {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-1">
                              <label htmlFor="city" className="label">City</label>
                              <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="input"
                              />
                              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                            </div>
                            
                            <div className="md:col-span-1">
                              <label htmlFor="state" className="label">State</label>
                              <input
                                type="text"
                                id="state"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className="input"
                              />
                              {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                            </div>
                            
                            <div className="md:col-span-1">
                              <label htmlFor="zipCode" className="label">ZIP Code</label>
                              <input
                                type="text"
                                id="zipCode"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                className="input"
                              />
                              {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                            </div>
                          </div>
                        </>
                      )}
                      
                      <div>
                        <label htmlFor="specialInstructions" className="label">Special Instructions (Optional)</label>
                        <textarea
                          id="specialInstructions"
                          name="specialInstructions"
                          value={formData.specialInstructions}
                          onChange={handleChange}
                          className="input min-h-[80px]"
                          placeholder={orderType === 'delivery' ? "Delivery instructions (gate code, landmarks, etc.)" : "Pickup instructions"}
                        ></textarea>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
              
              {/* Step 2: Payment */}
              {step === 2 && (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="p-6"
                >
                  <h2 className="text-xl font-bold mb-6">Payment Method</h2>
                  
                  <motion.div variants={itemVariants} className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div 
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          paymentMethod === 'credit' 
                            ? 'border-primary bg-primary/10 dark:bg-primary/20' 
                            : 'border-surface-200 dark:border-surface-700'
                        }`}
                        onClick={() => setPaymentMethod('credit')}
                      >
                        <div className="flex items-center gap-2">
                          <CreditCardIcon className={`w-5 h-5 ${paymentMethod === 'credit' ? 'text-primary' : ''}`} />
                          <span className={`font-medium ${paymentMethod === 'credit' ? 'text-primary' : ''}`}>
                            Credit/Debit Card
                          </span>
                        </div>
                      </div>
                      
                      <div 
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          paymentMethod === 'cash' 
                            ? 'border-primary bg-primary/10 dark:bg-primary/20' 
                            : 'border-surface-200 dark:border-surface-700'
                        }`}
                        onClick={() => setPaymentMethod('cash')}
                      >
                        <div className="flex items-center gap-2">
                          <DollarSignIcon className={`w-5 h-5 ${paymentMethod === 'cash' ? 'text-primary' : ''}`} />
                          <span className={`font-medium ${paymentMethod === 'cash' ? 'text-primary' : ''}`}>
                            Cash on {orderType === 'delivery' ? 'Delivery' : 'Pickup'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  {paymentMethod === 'credit' && (
                    <motion.div 
                      variants={itemVariants}
                      className="space-y-4 border-t border-surface-200 dark:border-surface-700 pt-6 mt-6"
                    >
                      <h3 className="text-lg font-medium mb-4">Card Details</h3>
                      
                      <div>
                        <label htmlFor="cardNumber" className="label">Card Number</label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="number"
                          value={cardDetails.number}
                          onChange={handleCardChange}
                          className="input"
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                        />
                        {cardErrors.number && <p className="text-red-500 text-sm mt-1">{cardErrors.number}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="cardName" className="label">Name on Card</label>
                        <input
                          type="text"
                          id="cardName"
                          name="name"
                          value={cardDetails.name}
                          onChange={handleCardChange}
                          className="input"
                          placeholder="John Doe"
                        />
                        {cardErrors.name && <p className="text-red-500 text-sm mt-1">{cardErrors.name}</p>}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="cardExpiry" className="label">Expiry Date</label>
                          <input
                            type="text"
                            id="cardExpiry"
                            name="expiry"
                            value={cardDetails.expiry}
                            onChange={handleCardChange}
                            className="input"
                            placeholder="MM/YY"
                            maxLength="5"
                          />
                          {cardErrors.expiry && <p className="text-red-500 text-sm mt-1">{cardErrors.expiry}</p>}
                        </div>
                        
                        <div>
                          <label htmlFor="cardCvv" className="label">CVV</label>
                          <input
                            type="text"
                            id="cardCvv"
                            name="cvv"
                            value={cardDetails.cvv}
                            onChange={handleCardChange}
                            className="input"
                            placeholder="123"
                            maxLength="4"
                          />
                          {cardErrors.cvv && <p className="text-red-500 text-sm mt-1">{cardErrors.cvv}</p>}
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {paymentMethod === 'cash' && (
                    <motion.div 
                      variants={itemVariants}
                      className="p-4 border border-surface-200 dark:border-surface-700 rounded-lg mt-4"
                    >
                      <p className="text-surface-600 dark:text-surface-400">
                        You will pay in cash when your order is {orderType === 'delivery' ? 'delivered' : 'picked up'}.
                        Please have the exact amount ready if possible.
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}
              
              {/* Step 3: Review Order */}
              {step === 3 && (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="p-6"
                >
                  <h2 className="text-xl font-bold mb-6">Review Your Order</h2>
                  
                  <motion.div variants={itemVariants} className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Order Summary</h3>
                    
                    <div className="bg-surface-50 dark:bg-surface-800 rounded-lg p-4 space-y-3">
                      {cart.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.quantity}x</span>
                            <span>{item.name}</span>
                            {item.options && Object.keys(item.options).length > 0 && (
                              <span className="text-xs text-surface-500">
                                ({Object.values(item.options).join(', ')})
                              </span>
                            )}
                          </div>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">{orderType === 'delivery' ? 'Delivery' : 'Pickup'} Details</h3>
                      <div className="bg-surface-50 dark:bg-surface-800 rounded-lg p-4">
                        <p className="font-medium">{formData.name}</p>
                        <p className="text-surface-600 dark:text-surface-400">{formData.phone}</p>
                        {orderType === 'delivery' && (
                          <>
                            <p className="mt-2">{formData.street}</p>
                            <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                          </>
                        )}
                        {formData.specialInstructions && (
                          <p className="mt-2 text-sm italic">"{formData.specialInstructions}"</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Payment Method</h3>
                      <div className="bg-surface-50 dark:bg-surface-800 rounded-lg p-4">
                        {paymentMethod === 'credit' ? (
                          <div className="flex items-center gap-2">
                            <CreditCardIcon className="w-5 h-5 text-primary" />
                            <div>
                              <p className="font-medium">Credit/Debit Card</p>
                              <p className="text-surface-600 dark:text-surface-400">
                                **** **** **** {cardDetails.number.slice(-4)}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <DollarSignIcon className="w-5 h-5 text-primary" />
                            <p className="font-medium">Cash on {orderType === 'delivery' ? 'Delivery' : 'Pickup'}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Estimated Time</h3>
                    <div className="bg-surface-50 dark:bg-surface-800 rounded-lg p-4 flex items-center gap-3">
                      <ClockIcon className="w-5 h-5 text-primary" />
                      <p className="font-medium">
                        {orderType === 'delivery' ? '30-45 minutes' : '15-20 minutes'}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
              
              <div className="p-6 border-t border-surface-200 dark:border-surface-700 flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="btn btn-outline"
                >
                  Back
                </button>
                
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    <span>{step === 1 ? 'Continue to Payment' : 'Review Order'}</span>
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-primary flex items-center gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Place Order</span>
                        <CheckIcon className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
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
                <span className="text-surface-600 dark:text-surface-400">
                  {orderType === 'delivery' ? 'Delivery Fee' : 'Pickup Fee'}
                </span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-surface-200 dark:border-surface-700 pt-3 mt-3">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <Link to="/cart" className="text-primary text-sm font-medium mt-4 block">
              Edit Cart
            </Link>
          </div>
  );
    </div>
  );
};

export default Checkout;