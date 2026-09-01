import React from 'react';

export default function About() {
  return (
    <div className="mx-auto my-10 px-10 py-10 max-w-4xl bg-black/60 backdrop-blur-md rounded-3xl shadow-2xl relative text-white">
      <h1 className="text-5xl font-semibold text-white my-3">About</h1>
      <h2 className="text-4xl text-white my-3">Angel Dimitrov</h2>
      <img src="./me.jpg" className="headshot"></img>
      <p className="text-white mb-4">
        I'm a software engineer who cares about tackling complex technical puzzles, not the title on my business card. For the past eight years, I've focused on building software in complex-system settings where reliability is paramount and systems absolutely have to hold up under pressure.
      </p>
      <p className="text-white mb-4">
        I approach engineering with zero ego. If a deep problem needs solving, I will jump into whatever layer of the stack is required to fix it, whether that means diving into low-level device communication, writing robust backends, or cleaning up user-facing interfaces. My main goal is always to design extensible architectures that scale cleanly with a company's growth, making sure the codebase stays clear, maintainable, and ready for whatever needs to be built next.
      </p>
      <p className="text-white mb-4">
        Find me on{' '}
        <a
          href="https://www.linkedin.com/in/angel-dimitrov/"
          target="_blank"
          rel="noreferrer"
          className="text-white no-underline font-semibold hover:underline"
        >
          LinkedIn
        </a>{' '}
        or{' '}
        <a
          href="https://github.com/angeldimitrov94"
          target="_blank"
          rel="noreferrer"
          className="text-white no-underline font-semibold hover:underline"
        >
          GitHub
        </a>
        .
      </p>
      <div className="mt-8 pt-6 border-t border-white/10 text-right">
        <span className="font-handwriting text-5xl text-pink-300 inline-block -rotate-1 tracking-wide select-none">
          Angel Dimitrov
        </span>
      </div>
    </div>
  );
}
