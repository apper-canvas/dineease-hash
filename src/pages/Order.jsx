import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MenuItemCard from '../components/MenuItemCard';
import getIcon from '../utils/iconUtils';

const Order = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  
  const cart = useSelector(state => state.order.cart);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const SearchIcon = getIcon("Search");
  const FilterIcon = getIcon("Filter");
  const ShoppingCartIcon = getIcon("ShoppingCart");
  const XCircleIcon = getIcon("XCircle");
  
  // Initial menu items with additional sample data
  useEffect(() => {
    // This would come from an API in a real app
    const mockMenuItems = [
      {
        id: 1,
        name: "Grilled Salmon",
        description: "Fresh Atlantic salmon grilled to perfection with a lemon herb butter sauce, served with seasonal vegetables and garlic mashed potatoes.",
        price: 24.99,
        category: "Main Course",
        image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        dietaryLabels: ["Gluten-Free", "Pescatarian"],
        available: true,
        options: {
          "Cooking Preference": [
            { name: "Medium Rare", price: 0 },
            { name: "Medium", price: 0 },
            { name: "Well Done", price: 0 }
          ],
          "Side Options": [
            { name: "Garlic Mashed Potatoes", price: 0 },
            { name: "Roasted Vegetables", price: 0 },
            { name: "Quinoa Pilaf", price: 2 }
          ]
        }
      },
      {
        id: 2,
        name: "Classic Caesar Salad",
        description: "Crisp romaine lettuce, homemade croutons, parmesan cheese, and our signature Caesar dressing.",
        price: 12.99,
        category: "Starters",
        image: "https://images.unsplash.com/photo-1551248429-40975aa4de74?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        dietaryLabels: ["Vegetarian"],
        available: true,
        options: {
          "Add Protein": [
            { name: "Grilled Chicken", price: 4.99 },
            { name: "Grilled Shrimp", price: 6.99 },
            { name: "None", price: 0 }
          ],
          "Dressing": [
            { name: "Regular", price: 0 },
            { name: "On the Side", price: 0 }
          ]
        }
      },
      {
        id: 3,
        name: "Truffle Mushroom Risotto",
        description: "Arborio rice cooked with wild mushrooms, truffle oil, and finished with aged parmesan cheese.",
        price: 22.99,
        category: "Main Course",
        image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        dietaryLabels: ["Vegetarian", "Gluten-Free"],
        available: true
      },
      {
        id: 4,
        name: "Chocolate Lava Cake",
        description: "Warm chocolate cake with a molten center, served with vanilla bean ice cream and fresh berries.",
        price: 9.99,
        category: "Desserts",
        image: "https://images.unsplash.com/photo-1573399054516-24af5a8395ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        dietaryLabels: ["Vegetarian"],
        available: true,
        options: {
          "Ice Cream Flavor": [
            { name: "Vanilla", price: 0 },
            { name: "Chocolate", price: 0 },
            { name: "Strawberry", price: 0 }
          ]
        }
      },
      {
        id: 5,
        name: "Margherita Pizza",
        description: "Classic pizza with San Marzano tomato sauce, fresh mozzarella, basil, and extra virgin olive oil.",
        price: 18.99,
        category: "Main Course",
        image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        dietaryLabels: ["Vegetarian"],
        available: true,
        options: {
          "Size": [
            { name: "Personal (10\")", price: 0 },
            { name: "Medium (14\")", price: 6 },
            { name: "Large (18\")", price: 10 }
          ],
          "Crust": [
            { name: "Regular", price: 0 },
            { name: "Thin Crust", price: 0 },
            { name: "Gluten-Free Crust", price: 3 }
          ]
        }
      }
    ];
    
    setMenuItems(mockMenuItems);
  }, []);
  
  const uniqueCategories = ['All', ...new Set(menuItems.map(item => item.category))];
  const uniqueDietary = [...new Set(menuItems.flatMap(item => item.dietaryLabels || []))];
  
  const filteredMenuItems = menuItems.filter(item => {
    // Category filter
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    
    // Search filter
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Dietary filter
    const matchesDietary = dietaryFilter.length === 0 || 
      dietaryFilter.every(filter => item.dietaryLabels && item.dietaryLabels.includes(filter));
    
    return matchesCategory && matchesSearch && matchesDietary;
  });
  
  const handleDietaryToggle = (label) => {
    if (dietaryFilter.includes(label)) {
      setDietaryFilter(dietaryFilter.filter(l => l !== label));
    } else {
      setDietaryFilter([...dietaryFilter, label]);
    }
  };
  
  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">Order Online</h1>
        <p className="text-center text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
          Browse our menu and place your order for pickup or delivery.
        </p>
      </header>
      
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500" />
          <input
            type="text"
            placeholder="Search menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-500 hover:text-surface-700"
            >
              <XCircleIcon className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <div className="flex gap-2 items-center">
          <FilterIcon className="w-5 h-5 text-surface-500" />
          <span className="text-sm font-medium">Dietary:</span>
          <div className="flex flex-wrap gap-2">
            {uniqueDietary.map(label => (
              <button
                key={label}
                onClick={() => handleDietaryToggle(label)}
                className={`px-2 py-1 text-xs rounded-full ${
                  dietaryFilter.includes(label)
                    ? 'bg-primary text-white'
                    : 'bg-surface-100 dark:bg-surface-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Category Filter */}
      <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-2 mb-6">
        {uniqueCategories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              category === activeCategory
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* Cart Summary Button (Fixed) */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-10">
          <Link
            to="/cart"
            className="flex items-center gap-2 bg-primary text-white px-4 py-3 rounded-lg shadow-lg hover:bg-primary-dark transition-colors"
          >
            <ShoppingCartIcon className="w-5 h-5" />
            <span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
            <span className="font-bold">${cartTotal.toFixed(2)}</span>
          </Link>
        </div>
      )}
      
      {/* Menu Items */}
      <div className="grid grid-cols-1 gap-6">
        {filteredMenuItems.length > 0 ? (
          filteredMenuItems.map(item => (
            <MenuItemCard key={item.id} item={item} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-surface-600 dark:text-surface-400">No menu items match your criteria.</p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchTerm('');
                setDietaryFilter([]);
              }}
              className="mt-4 btn btn-outline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;