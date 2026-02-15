import React from 'react'

export default function About(){
  return (
    <div className="mx-auto my-10 px-10 py-10 max-w-4xl bg-black/60 backdrop-blur-md rounded-3xl shadow-2xl relative text-white">
      <h1 className="text-5xl font-semibold text-white my-3">About</h1>
      <h2 className="text-4xl text-white my-3">Angel Dimitrov</h2>
      <img src='./me.jpg' className="headshot"></img>
      <p className="text-white mb-4">Senior Software Engineer with 8+ years building and owning backend and full‑stack systems for robotics, manufacturing, and scientific instrumentation. I have served as a technical owner for high-criticality instrumentation software and ETL platforms, driving reliability and scalability in production environments. I regularly lead cross‑functional initiatives, set interface and API standards, and mentor engineers to improve code quality and delivery speed. I balance technical leadership with pragmatic engineering to reduce operational cost and ship reliable solutions.</p>
      <p className="text-white mb-4">Find me on <a href="https://www.linkedin.com/in/angel-dimitrov/" target="_blank" rel="noreferrer" className="text-white no-underline font-semibold hover:underline">LinkedIn</a> or <a href="https://github.com/angeldimitrov94" target="_blank" rel="noreferrer" className="text-white no-underline font-semibold hover:underline">GitHub</a>.</p>
    </div>
  )
}