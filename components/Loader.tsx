
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-6 h-6 border-4 border-dashed rounded-full animate-spin border-indigo-400"></div>
    </div>
  );
};

export default Loader;
