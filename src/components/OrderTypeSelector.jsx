import { useDispatch, useSelector } from 'react-redux';
import { setOrderType } from '../store/orderSlice';
import getIcon from '../utils/iconUtils';

const OrderTypeSelector = () => {
  const dispatch = useDispatch();
  const orderType = useSelector(state => state.order.orderType);
  
  const TruckIcon = getIcon("Truck");
  const ShoppingBagIcon = getIcon("ShoppingBag");
  
  return (
    <div className="flex gap-4 w-full">
      <button
        onClick={() => dispatch(setOrderType('delivery'))}
        className={`flex flex-col items-center justify-center gap-2 flex-1 p-4 rounded-lg border-2 transition-all ${
          orderType === 'delivery'
            ? 'border-primary bg-primary/10 dark:bg-primary/20'
            : 'border-surface-200 dark:border-surface-700'
        }`}
      >
        <TruckIcon className={`w-6 h-6 ${orderType === 'delivery' ? 'text-primary' : ''}`} />
        <span className={`font-medium ${orderType === 'delivery' ? 'text-primary' : ''}`}>Delivery</span>
      </button>
      
      <button
        onClick={() => dispatch(setOrderType('pickup'))}
        className={`flex flex-col items-center justify-center gap-2 flex-1 p-4 rounded-lg border-2 transition-all ${
          orderType === 'pickup'
            ? 'border-primary bg-primary/10 dark:bg-primary/20'
            : 'border-surface-200 dark:border-surface-700'
        }`}
      >
        <ShoppingBagIcon className={`w-6 h-6 ${orderType === 'pickup' ? 'text-primary' : ''}`} />
        <span className={`font-medium ${orderType === 'pickup' ? 'text-primary' : ''}`}>Pickup</span>
      </button>
    </div>
  );
};

export default OrderTypeSelector;