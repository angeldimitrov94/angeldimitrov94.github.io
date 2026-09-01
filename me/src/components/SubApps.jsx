import React from 'react';

export default function SubApps() {
  return (
    <div className="mx-auto my-10 px-10 py-10 max-w-4xl bg-black/60 backdrop-blur-md rounded-3xl shadow-2xl relative text-white">
      <h1 className="text-5xl font-semibold text-white my-3">Sub-Apps</h1>
      <p className="text-white text-lg mb-4 leading-relaxed">
        I have a personal hobby of building offline, client-only applications for various ideas that I have.
        In today's trend of increasingly connected applications, where virtually everything requires OAuth, subscriptions, and an internet connection, I enjoy creating quick apps that are built to be client-side-only. No logins, no tracking, and complete ownership of your data.
      </p>

      <p className="text-gray-300 text-sm mb-6 italic leading-relaxed border-l-2 border-white/20 pl-4">
        Yes, of course these sub-apps are written using AI...welcome to 2026! No, I haven't tested them extensively as a production app would be. Feel free to copy the code, deploy it yourself, and fix the problems. If you like any of the tools or have feedback, drop me a line at {' '}
        <a 
          href="mailto:angeldimitrov94@gmail.com" 
          className="text-blue-400 hover:text-blue-300 underline font-semibold"
        >
          angeldimitrov94@gmail.com
        </a>!
      </p>

      <div className="border border-white/15 rounded-2xl bg-white/5 p-6 hover:bg-white/10 hover:border-white/25 transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <h2 className="text-3xl font-bold text-blue-300">FinPlanner</h2>
          <a
            href="./sub-apps/fin-planner/index.html"
            className="inline-block bg-blue-600 hover:bg-blue-500 !text-white hover:!text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-lg text-center"
          >
            Launch FinPlanner →
          </a>
        </div>
        <p className="text-gray-200 mb-4 leading-relaxed">
          FinPlanner is a basic personal financial forecasting tool designed to help you map out your future financial scenarios.
        </p>
        <ul className="list-disc pl-5 text-gray-300 space-y-2">
          <li>
            <strong>100% Client-Side:</strong> All data is stored purely in your browser's local storage.
          </li>
          <li>
            <strong>Data Sovereignty:</strong> No data ever leaves your device. You can download your plan configuration as a backup file and upload it to use on any other device.
          </li>
          <li>
            <strong>Zero Dependencies:</strong> No accounts, no database, no setup required.
          </li>
        </ul>
      </div>

      <div className="mt-8 pt-6 border-t border-white/10 text-right">
        <span className="font-handwriting text-4xl text-blue-300 inline-block -rotate-2 tracking-wide select-none">
          Angel Dimitrov
        </span>
      </div>
    </div>
  );
}
