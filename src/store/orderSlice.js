import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
  orderType: 'delivery', // 'delivery' or 'pickup'
  deliveryAddress: {
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    specialInstructions: ''
  },
  activeOrders: [],
  pastOrders: [
    {
      id: '8901',
      date: '2023-10-15',
      items: [
        { id: 1, name: 'Grilled Salmon', quantity: 2, price: 24.99 },
        { id: 4, name: 'Chocolate Lava Cake', quantity: 1, price: 9.99 }
      ],
      total: 59.97,
      status: 'Completed',
      deliveryAddress: {
        name: 'John Smith',
        street: '123 Main St',
        city: 'Foodville',
        state: 'CA',
        zipCode: '90210',
        phone: '(555) 123-4567'
      },
      orderType: 'delivery'
    }
  ]
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const itemIndex = state.cart.findIndex(item => 
        item.id === action.payload.id && 
        JSON.stringify(item.options || {}) === JSON.stringify(action.payload.options || {})
      );
      
      if (itemIndex >= 0) {
        state.cart[itemIndex].quantity += action.payload.quantity || 1;
      } else {
        state.cart.push({
          ...action.payload,
          quantity: action.payload.quantity || 1
        });
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => 
        !(item.id === action.payload.id && 
        JSON.stringify(item.options || {}) === JSON.stringify(action.payload.options || {}))
      );
    },
    updateCartItemQuantity: (state, action) => {
      const { id, options, quantity } = action.payload;
      const itemIndex = state.cart.findIndex(item => 
        item.id === id && 
        JSON.stringify(item.options || {}) === JSON.stringify(options || {})
      );
      
      if (itemIndex >= 0) {
        if (quantity > 0) {
          state.cart[itemIndex].quantity = quantity;
        } else {
          state.cart.splice(itemIndex, 1);
        }
      }
    },
    clearCart: (state) => {
      state.cart = [];
    },
    setOrderType: (state, action) => {
      state.orderType = action.payload;
    },
    updateDeliveryAddress: (state, action) => {
      state.deliveryAddress = {
        ...state.deliveryAddress,
        ...action.payload
      };
    },
    placeOrder: (state, action) => {
      const newOrder = {
        // Generate a unique order ID
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString(),
        items: [...state.cart],
        total: state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'Preparing',
        deliveryAddress: {...state.deliveryAddress},
        orderType: state.orderType,
        estimatedDelivery: action.payload?.estimatedDelivery || null
      };
      
      // Add the new order to active orders
      state.activeOrders.push(newOrder);
      
      // Clear the cart
      state.cart = [];
      return state.activeOrders[state.activeOrders.length - 1];
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const orderIndex = state.activeOrders.findIndex(order => order.id === orderId);
      if (orderIndex >= 0) {
        state.activeOrders[orderIndex].status = status;
      }
    }
  }
});

export const { addToCart, removeFromCart, updateCartItemQuantity, clearCart, setOrderType, updateDeliveryAddress, placeOrder, updateOrderStatus } = orderSlice.actions;
export default orderSlice.reducer;