import React from 'react';

export default function Home(){
  return (
    <div className="mx-auto my-10 px-10 py-10 max-w-4xl bg-black/60 backdrop-blur-md rounded-3xl shadow-2xl relative text-white">
      <h1 className="text-5xl font-semibold text-white my-3">Angel Dimitrov</h1>
      <h2 className="text-4xl text-white my-3">Full Stack Software Engineer</h2>
      <p className="text-white text-lg mb-4">Explore my <a href="#my-work" className="text-white no-underline font-semibold hover:underline">work</a> or <a href="#about" className="text-white no-underline font-semibold hover:underline">learn more about me</a>.</p>
    </div>
  );
}
