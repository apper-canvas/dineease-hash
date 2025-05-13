import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

const MainFeature = () => {
  // Icon declarations
  const CalendarIcon = getIcon("Calendar");
  const UsersIcon = getIcon("Users");
  const ClockIcon = getIcon("Clock");
  const CheckIcon = getIcon("Check");
  const ChevronRightIcon = getIcon("ChevronRight");
  const PenIcon = getIcon("Pen");
  const XIcon = getIcon("X");

  // State management
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    partySize: 2,
    specialRequests: ''
  });
  const [errors, setErrors] = useState({});
  const [availableTimes, setAvailableTimes] = useState([]);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateSelected, setDateSelected] = useState(false);

  // Calculate tomorrow's date for minimum date selection
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Update available times based on selected date
  useEffect(() => {
    if (formData.date) {
      // Simulate fetching available times based on the selected date
      // In a real app, this would come from an API call
      const date = new Date(formData.date);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      
      // Different time slots for weekends vs weekdays
      const times = isWeekend
        ? ['10:00', '11:00', '12:00', '13:00', '14:00', '17:00', '18:00', '19:00', '20:00', '21:00']
        : ['11:00', '12:00', '13:00', '17:00', '18:00', '19:00', '20:00'];
      
      setAvailableTimes(times);
      setDateSelected(true);
      
      // Reset time if changing date
      setFormData(prev => ({
        ...prev,
        time: ''
      }));
    }
  }, [formData.date]);

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

  const validateForm = () => {
    const newErrors = {};
    
    // Step 1 validation
    if (step === 1) {
      if (!formData.date) newErrors.date = 'Please select a date';
      if (!formData.time) newErrors.time = 'Please select a time';
      if (!formData.partySize || formData.partySize < 1) newErrors.partySize = 'Please enter a valid party size';
    }
    
    // Step 2 validation
    if (step === 2) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(formData.phone)) {
        newErrors.phone = 'Phone number is invalid';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Success
        toast.success("Your reservation has been confirmed! We'll see you soon.", {
          icon: "🍽️"
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          partySize: 2,
          specialRequests: ''
        });
        setStep(1);
        setDateSelected(false);
      } catch (error) {
        toast.error("There was an error processing your reservation. Please try again.");
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
      <div className="bg-white dark:bg-surface-800 rounded-2xl overflow-hidden shadow-neu-light dark:shadow-neu-dark">
        <div className="bg-gradient-to-r from-primary to-primary-light p-6 text-white">
          <h2 className="text-2xl font-bold">Make a Reservation</h2>
          <p className="mt-1 text-white/80">Reserve your table in just a few simple steps</p>
        </div>
        
        {/* Progress indicator */}
        <div className="flex p-4 border-b border-surface-200 dark:border-surface-700">
          <div className="flex items-center flex-1">
            <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
              step >= 1 ? 'bg-primary text-white' : 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400'
            }`}>
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div className="ml-2">
              <div className="text-sm font-medium">Step 1</div>
              <div className="text-xs text-surface-500">Date & Party Size</div>
            </div>
          </div>
          <div className="flex-1 flex items-center">
            <div className={`h-px flex-1 mx-2 ${
              step > 1 ? 'bg-primary' : 'bg-surface-300 dark:bg-surface-600'
            }`}></div>
            <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
              step >= 2 ? 'bg-primary text-white' : 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400'
            }`}>
              <PenIcon className="w-4 h-4" />
            </div>
            <div className="ml-2">
              <div className="text-sm font-medium">Step 2</div>
              <div className="text-xs text-surface-500">Your Details</div>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {step === 1 && (
            <motion.div 
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <label htmlFor="date" className="label">Select Date</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500" />
                  <input
                    type="date"
                    id="date"
                    name="date"
                    min={minDate}
                    value={formData.date}
                    onChange={handleChange}
                    className="input pl-10"
                  />
                </div>
                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
              </motion.div>
              
              <motion.div variants={itemVariants} className={dateSelected ? 'opacity-100' : 'opacity-50 pointer-events-none'}>
                <label className="label">Select Time</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {availableTimes.map(time => (
                    <div 
                      key={time}
                      className={`text-center py-2 px-3 rounded-lg cursor-pointer border transition-all ${
                        formData.time === time 
                          ? 'border-primary bg-primary/10 dark:bg-primary/20 text-primary font-medium' 
                          : 'border-surface-200 dark:border-surface-700 hover:border-primary/50'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, time }))}
                    >
                      {time}
                    </div>
                  ))}
                </div>
                {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <label htmlFor="partySize" className="label">Party Size</label>
                <div className="relative">
                  <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500" />
                  <input
                    type="number"
                    id="partySize"
                    name="partySize"
                    min="1"
                    max="20"
                    value={formData.partySize}
                    onChange={handleChange}
                    className="input pl-10"
                  />
                </div>
                {errors.partySize && <p className="text-red-500 text-sm mt-1">{errors.partySize}</p>}
              </motion.div>
              
              <motion.div variants={itemVariants} className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <span>Continue</span>
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </motion.div>
            </motion.div>
          )}
          
          {step === 2 && (
            <motion.div 
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <label htmlFor="name" className="label">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </motion.div>
              
              <motion.div variants={itemVariants}>
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
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <label htmlFor="specialRequests" className="label">Special Requests (Optional)</label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  className="input min-h-[100px]"
                  placeholder="Any dietary restrictions or special occasions?"
                ></textarea>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <div className="p-4 bg-surface-50 dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700">
                  <h4 className="font-medium mb-2">Reservation Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-primary" />
                      <span>{formData.date || 'No date selected'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4 text-primary" />
                      <span>{formData.time || 'No time selected'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UsersIcon className="w-4 h-4 text-primary" />
                      <span>{formData.partySize} {formData.partySize === 1 ? 'person' : 'people'}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="btn btn-outline flex items-center gap-2"
                >
                  <XIcon className="w-4 h-4" />
                  <span>Back</span>
                </button>
                
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
                      <CheckIcon className="w-4 h-4" />
                      <span>Confirm Reservation</span>
                    </>
                  )}
                </button>
              </motion.div>
            </motion.div>
          )}
        </form>
      </div>
      
      <div className="mt-8 bg-surface-100 dark:bg-surface-800 rounded-lg p-6 border border-surface-200 dark:border-surface-700">
        <h3 className="text-lg font-medium mb-4">Reservation Policy</h3>
        <ul className="space-y-2 text-sm text-surface-600 dark:text-surface-400">
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            Reservations can be made up to 30 days in advance.
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            Please arrive within 15 minutes of your reservation time. After that, your table may be given to waiting guests.
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            For parties of 8 or more, please contact us directly by phone.
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            Cancellations should be made at least 24 hours in advance.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MainFeature;