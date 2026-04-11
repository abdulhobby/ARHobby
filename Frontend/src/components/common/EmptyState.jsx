import { Link } from 'react-router-dom';

const EmptyState = ({ icon, title, message, actionText, actionLink }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 sm:py-24">
      <div className="bg-bg-secondary rounded-full p-6 sm:p-8 mb-6 shadow-md">
        {icon && (
          <div className="text-primary text-5xl sm:text-6xl flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>

      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary mb-3 text-center">
        {title}
      </h3>

      <p className="text-text-secondary text-sm sm:text-base md:text-lg text-center max-w-md mb-8 leading-relaxed">
        {message}
      </p>

      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-text-white font-semibold 
                     py-3 px-8 rounded-lg cursor-pointer transition-all duration-300 ease-in-out 
                     shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
                     text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;