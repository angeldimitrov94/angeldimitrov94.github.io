import React from 'react';

export default function NotFound(){
  return (
    <div className="mx-auto my-10 px-10 py-10 max-w-4xl bg-black/60 backdrop-blur-md rounded-3xl shadow-2xl relative text-white">
      <h1 className="text-5xl font-semibold text-white my-3">404</h1>
      <h2 className="text-4xl text-white my-3">Page Not Found</h2>
      <p className="text-white text-lg mb-4">Sorry, the page you're looking for doesn't exist. Try navigating to <a href="#/" className="text-white no-underline font-semibold hover:underline">home</a>.</p>
    </div>
  );
}
