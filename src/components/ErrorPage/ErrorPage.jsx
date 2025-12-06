import React from 'react';
import { Link } from "react-router";
import errorImg from '../../assets/error-404.png';

const ErrorPage = () => {
    return (
        <div className='bg-gradient-to-r from-[#47aa8e] to-[#6497a8]'>
             <div className="flex flex-col justify-center items-center py-20">
                <img
      src={errorImg}
                    alt=""
            className="h-60 w-60 mb-5"
                />
        <p className="text-gray-600 text-2xl font-semibold mb-6 text-center">
                    Oops! Page Not Found
                </p>
                <Link to="/">
                  <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg animate-gradient font-semibold shadow-md transition-all duration-200">
                     Go Back!
             
                  </button>  
                        </Link>
            </div>
        </div>
    );
};

export default ErrorPage;