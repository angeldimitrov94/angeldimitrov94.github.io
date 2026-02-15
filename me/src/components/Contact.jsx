import React from 'react';

export default function Contact() {
  return (
    <div className="mx-auto my-10 px-10 py-10 max-w-4xl bg-black/60 backdrop-blur-md rounded-3xl shadow-2xl relative text-white">
      <h1 className="text-5xl font-semibold text-gray-100 my-3">Contact</h1>
      <p className="text-white mb-4">
        I'd love to hear from you! Whether you have a question, want to
        collaborate, or just want to say hello, feel free to reach out using any
        of the methods below.
      </p>
      <ul className="list-none p-0">
        <li className="mb-4">
          <strong className="text-white">LinkedIn:</strong>{' '}
          <a
            href="https://www.linkedin.com/in/angel-dimitrov/"
            target="_blank"
            rel="noreferrer"
            className="text-white no-underline font-semibold hover:underline"
          >
            linkedin.com/in/angel-dimitrov
          </a>
        </li>
        <li className="mb-4">
          <strong className="text-white">GitHub:</strong>{' '}
          <a
            href="https://github.com/angeldimitrov94"
            target="_blank"
            rel="noreferrer"
            className="text-white no-underline font-semibold hover:underline"
          >
            github.com/angeldimitrov94
          </a>
        </li>
      </ul>
    </div>
  );
}
