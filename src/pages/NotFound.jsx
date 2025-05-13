import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const NotFound = () => {
  // Icon declarations
  const HomeIcon = getIcon("Home");
  const AlertCircleIcon = getIcon("AlertCircle");

  return (
    <motion.div 
      className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8 text-primary">
        <AlertCircleIcon className="w-20 h-20 mx-auto" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Page Not Found</h1>
      
      <p className="text-lg text-surface-600 dark:text-surface-400 max-w-md mx-auto mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
        >
          <HomeIcon className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default NotFound;