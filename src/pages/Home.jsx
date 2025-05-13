import { useState } from 'react';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

const Home = () => {
  const [activeTab, setActiveTab] = useState('menu');
  
  // Icon declarations
  const MenuIcon = getIcon("Utensils");
  const ReservationIcon = getIcon("Calendar");
  const ReviewsIcon = getIcon("Star");
  const InfoIcon = getIcon("Info");

  const menuItems = [
    {
      id: 1,
      name: "Grilled Salmon",
      description: "Fresh Atlantic salmon grilled to perfection with a lemon herb butter sauce, served with seasonal vegetables and garlic mashed potatoes.",
      price: 24.99,
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      dietaryLabels: ["Gluten-Free", "Pescatarian"],
      available: true
    },
    {
      id: 2,
      name: "Classic Caesar Salad",
      description: "Crisp romaine lettuce, homemade croutons, parmesan cheese, and our signature Caesar dressing.",
      price: 12.99,
      category: "Starters",
      image: "https://images.unsplash.com/photo-1551248429-40975aa4de74?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      dietaryLabels: ["Vegetarian"],
      available: true
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
      available: true
    }
  ];

  const restaurantInfo = {
    name: "DineEase Restaurant",
    description: "A modern dining experience featuring locally sourced ingredients and innovative cuisine in a cozy atmosphere.",
    address: "123 Gourmet Street, Foodville, CA 90210",
    phone: "(555) 123-4567",
    email: "contact@dineease.com",
    hours: {
      Monday: "11:00 AM - 9:00 PM",
      Tuesday: "11:00 AM - 9:00 PM",
      Wednesday: "11:00 AM - 9:00 PM",
      Thursday: "11:00 AM - 10:00 PM",
      Friday: "11:00 AM - 11:00 PM",
      Saturday: "10:00 AM - 11:00 PM",
      Sunday: "10:00 AM - 9:00 PM"
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'menu':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {menuItems.map((item) => (
                <div key={item.id} className="card hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col md:flex-row">
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
                      <div className="flex flex-wrap gap-2">
                        {item.dietaryLabels.map((label, index) => (
                          <span key={index} className="px-2 py-1 bg-surface-100 dark:bg-surface-700 rounded-full text-xs font-medium">
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'reservation':
        return <MainFeature />;
      case 'reviews':
        return (
          <div className="card p-8">
            <h3 className="text-xl font-bold mb-6">Customer Reviews</h3>
            <div className="space-y-6">
              <div className="p-4 border border-surface-200 dark:border-surface-700 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="flex text-accent">
                    <StarFilledIcon className="w-5 h-5" />
                    <StarFilledIcon className="w-5 h-5" />
                    <StarFilledIcon className="w-5 h-5" />
                    <StarFilledIcon className="w-5 h-5" />
                    <StarIcon className="w-5 h-5" />
                  </div>
                  <span className="ml-2 font-medium">Sarah Johnson</span>
                </div>
                <p className="text-surface-600 dark:text-surface-300">
                  "The food was absolutely amazing! The grilled salmon was cooked to perfection and the service was impeccable. Will definitely be coming back soon!"
                </p>
                <p className="text-sm text-surface-500 mt-2">2 days ago</p>
              </div>
              
              <div className="p-4 border border-surface-200 dark:border-surface-700 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="flex text-accent">
                    <StarFilledIcon className="w-5 h-5" />
                    <StarFilledIcon className="w-5 h-5" />
                    <StarFilledIcon className="w-5 h-5" />
                    <StarFilledIcon className="w-5 h-5" />
                    <StarFilledIcon className="w-5 h-5" />
                  </div>
                  <span className="ml-2 font-medium">Michael Rodriguez</span>
                </div>
                <p className="text-surface-600 dark:text-surface-300">
                  "Had the truffle mushroom risotto and it was divine! The ambiance was perfect for our anniversary dinner. Highly recommend the chocolate lava cake for dessert!"
                </p>
                <p className="text-sm text-surface-500 mt-2">1 week ago</p>
              </div>

              <div className="p-4 border border-surface-200 dark:border-surface-700 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="flex text-accent">
                    <StarFilledIcon className="w-5 h-5" />
                    <StarFilledIcon className="w-5 h-5" />
                    <StarFilledIcon className="w-5 h-5" />
                    <StarFilledIcon className="w-5 h-5" />
                    <StarIcon className="w-5 h-5" />
                  </div>
                  <span className="ml-2 font-medium">Emily Chen</span>
                </div>
                <p className="text-surface-600 dark:text-surface-300">
                  "Great vegetarian options available. The Caesar salad was fresh and the portion size was generous. The staff was friendly and accommodating to our dietary restrictions."
                </p>
                <p className="text-sm text-surface-500 mt-2">2 weeks ago</p>
              </div>
            </div>
          </div>
        );
      case 'info':
        return (
          <div className="card p-8">
            <h3 className="text-xl font-bold mb-6">Restaurant Information</h3>
            <div className="space-y-4">
              <p className="text-surface-600 dark:text-surface-300">{restaurantInfo.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h4 className="text-lg font-semibold mb-2 flex items-center">
                    <MapPinIcon className="w-5 h-5 mr-2 text-primary" />
                    Location
                  </h4>
                  <p className="text-surface-600 dark:text-surface-300">{restaurantInfo.address}</p>
                  
                  <h4 className="text-lg font-semibold mb-2 mt-4 flex items-center">
                    <PhoneIcon className="w-5 h-5 mr-2 text-primary" />
                    Contact
                  </h4>
                  <p className="text-surface-600 dark:text-surface-300">{restaurantInfo.phone}</p>
                  <p className="text-surface-600 dark:text-surface-300">{restaurantInfo.email}</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-2 flex items-center">
                    <ClockIcon className="w-5 h-5 mr-2 text-primary" />
                    Hours of Operation
                  </h4>
                  <div className="space-y-1">
                    {Object.entries(restaurantInfo.hours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="font-medium">{day}</span>
                        <span className="text-surface-600 dark:text-surface-300">{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome to DineEase Restaurant</h1>
        <p className="text-center text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
          Experience exceptional dining with our curated menu, easy reservation system, and hear what our customers have to say.
        </p>
      </header>

      <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8">
        <button
          onClick={() => setActiveTab('menu')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'menu'
              ? 'bg-primary text-white'
              : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
          }`}
        >
          <MenuIcon className="w-5 h-5" />
          <span>Menu</span>
        </button>
        
        <button
          onClick={() => setActiveTab('reservation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'reservation'
              ? 'bg-primary text-white'
              : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
          }`}
        >
          <ReservationIcon className="w-5 h-5" />
          <span>Reservations</span>
        </button>
        
        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'reviews'
              ? 'bg-primary text-white'
              : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
          }`}
        >
          <ReviewsIcon className="w-5 h-5" />
          <span>Reviews</span>
        </button>
        
        <button
          onClick={() => setActiveTab('info')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'info'
              ? 'bg-primary text-white'
              : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
          }`}
        >
          <InfoIcon className="w-5 h-5" />
          <span>Info</span>
        </button>
      </div>

      {renderTabContent()}
    </div>
  );
};

// Icon declarations
const StarFilledIcon = getIcon("Star");
const StarIcon = getIcon("Star");
const MapPinIcon = getIcon("MapPin");
const PhoneIcon = getIcon("Phone");
const ClockIcon = getIcon("Clock");

export default Home;