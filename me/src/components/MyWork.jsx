import React from 'react';

export default function MyWork() {
  const [previewImage, setPreviewImage] = React.useState(null);

  const projects = [
    {
      title: 'Itinerary Fairy',
      link: 'https://itineraryfairy.com/',
      tagline: 'AI-powered travel itinerary builder with mapping integrations.',
      image: 'https://itineraryfairy.com/if-256.png',
      imageSize: 'w-24',
      tags: [
        { text: 'AI-assisted', color: 'bg-purple-600' },
        { text: 'travel', color: 'bg-purple-600' },
        { text: 'geospatial data', color: 'bg-purple-600' },
      ],
      sections: [
        {
          title: 'Stack & Architecture',
          content: [
            'Angular with RxJS for reactive state management',
            'Node.js/Express REST API with MongoDB',
            'OpenAI API integration for intelligent location suggestions',
            'Google Maps/Routes API for interactive mapping and routing',
            'Docker for containerized deployment',
            'Nginx reverse proxy with SSL termination',
          ],
        },
        {
          title: 'Key Implementation Details',
          content: [
            'Dynamic route optimization using Directions API',
            'Drag-and-drop reordering with persistence layer',
            'Real-time collaborative editing with WebSocket synchronization',
            'Server-side rendering for shareable itinerary links',
            'Rate limiting and caching strategies for external API calls',
          ],
        },
      ],
    },
    {
      title: 'Proteograph Instrument Control Software',
      link: 'https://seer.bio/products/proteograph-product-suite/',
      tagline:
        'Desktop software for automated high-throughput sample processing.',
      image: 'ics.png',
      tags: [
        { text: 'lab automation', color: 'bg-teal-600' },
        { text: 'Electron.js', color: 'bg-teal-600' },
        { text: 'COM interop', color: 'bg-teal-600' },
        { text: '.NET', color: 'bg-teal-600' },
      ],
      tallImageRight: true,
      sections: [
        {
          title: 'Stack & Architecture',
          content: [
            'Electron.js desktop packaging',
            'Angular UI components and RxJS state management',
            'Windows COM interop for third-party instrument control',
          ],
        },
        {
          title: 'Technical Challenges',
          content: [
            'Deep Windows COM object integration for controlling lab automation equipment',
            'Error recovery and fault tolerance for long-running unattended operations',
            'C# backend services for hardware communication and process orchestration',
            'Custom Wix-based installer with dependency management and auto-update capabilities',
          ],
        },
      ],
    },
    {
      title: 'Proteograph Analysis Suite',
      link: 'https://seer.bio/products/proteograph-analysis-suite/',
      tagline:
        'Cloud-native bioinformatics platform for proteomics data analysis.',
      image:
        'https://media.seer.bio/dev/uploads/2024/06/laptopPAS_061224v2.png',
      tags: [
        { text: 'proteomics', color: 'bg-teal-600' },
        { text: 'biotech', color: 'bg-teal-600' },
        { text: 'analytics', color: 'bg-teal-600' },
      ],
      sections: [
        {
          title: 'Technical Challenges',
          content: [
            'Multi-generation data schema compatibility and migration strategies',
            'Implementing wizard-driven workflows to simplify complex data ingestion processes',
            'Data validation and error handling for scientific accuracy',
          ],
        },
      ],
    },
    {
      title: 'Tablet Command CAD Integration',
      link: 'https://www.tabletcommand.com/cad_integration',
      tagline:
        'Real-time CAD-to-field integration for emergency response systems.',
      image:
        'https://www.tabletcommand.com/hs-fs/hubfs/Screen%20Shot%202021-03-22%20at%2011.06.46%20AM.png?width=1688&height=1010&name=Screen%20Shot%202021-03-22%20at%2011.06.46%20AM.png',
      tags: [
        { text: 'public safety', color: 'bg-red-900' },
        { text: 'ETL', color: 'bg-red-900' },
        { text: 'Computer-aided Dispatching', color: 'bg-red-900' },
        { text: 'pipelines', color: 'bg-red-900' },
        { text: 'geospatial data', color: 'bg-red-900' },
      ],
      sections: [
        {
          title: 'Integration Architecture',
          content: [
            'On-premise connector service with outbound-only communication',
            'Multiple integration strategies: database polling, file system monitoring, REST API clients',
          ],
        },
        {
          title: 'Technical Challenges',
          content: [
            'GeoJSON parsing and validation for incident locations',
            'State Plane Coordinate System (SPCS) to latitude/longitude conversion',
            'Coordinate system transformations between NAD83, WGS84, and local projections',
            'Projection library integration (ProjNET) for accurate geographic calculations',
            'Address geocoding and reverse geocoding for location verification',
            'Heavy data normalization across disparate data source formats',
            'Configurability enhancements via standardized configuration interfaces',
            'Structured logging to multiple logging targets',
            'Heartbeat notifications for service health and status monitoring',
          ],
        },
      ],
    },
    {
      title: 'Omron Automation',
      link: 'https://www.omron-ap.com/our-value/production-base/',
      tagline:
        'C# manufacturing test execution platform for robotic hardware verification.',
      image:
        'https://assets.omron-ap.com/wp-content/uploads/2023/03/29090217/netherlands_img_03.jpg',
      tags: [
        { text: 'robotics', color: 'bg-blue-900' },
        { text: 'manufacturing', color: 'bg-blue-900' },
        { text: 'embedded software', color: 'bg-blue-900' },
      ],
      sections: [
        {
          title: 'Stack & Architecture',
          content: [
            'C# .NET Framework for test sequencing engine',
            'SQL Server for test state tracking and results storage',
            'WPF desktop applications for operator interfaces',
            'TCP/IP communication with robotic test equipment',
            'Custom hardware drivers and control protocols',
          ],
        },
        {
          title: 'Technical Challenges',
          content: [
            'Embedded electronics debugging for prototype firmware validation',
            'Flashing PCBs and firmware deployment in manufacturing environment',
            'Electronics troubleshooting and diagnostics for devices under test',
            'State machine design for complex multi-stage test sequences',
            'Real-time hardware synchronization with millisecond-level timing constraints',
            'Data integrity validation gating shipment decisions',
          ],
        },
      ],
    },
    {
      title: 'This Site',
      link: null,
      tagline: null,
      image: null,
      sections: [
        {
          title: 'Stack',
          content: [
            'React with functional components and hooks',
            'React Router for client-side routing',
            'Tailwind CSS for utility-first styling',
            'Vite for fast build tooling',
            'Static site deployment (no backend)',
          ],
        },
      ],
    },
  ];

  return (
    <div className="mx-auto my-10 px-6 py-10 max-w-6xl text-white">
      <h1 className="text-5xl font-bold text-white mb-12 text-center">
        My Work
      </h1>

      <div className="flex flex-col gap-8">
        {projects.map((project, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-black/70 to-black/50 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 hover:shadow-3xl hover:scale-[1.01]"
          >
            {project.tallImageRight ? (
              <div className="md:flex md:items-stretch">
                <div className="p-8 md:w-1/2">
                  {/* Header */}
                  <div className="mb-6">
                    <h2 className="text-4xl font-bold text-white mb-3">
                      {project.title}
                    </h2>
                    {project.tags && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className={`${tag.color} text-white text-xs font-semibold px-3 py-1 rounded-full`}
                          >
                            {tag.text}
                          </span>
                        ))}
                      </div>
                    )}
                    {project.link && (
                      <a
                        href={project.link}
                        className="text-blue-400 hover:text-blue-300 font-semibold transition-colors inline-block mb-4"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {project.link.replace(/^https?:\/\//, '')} →
                      </a>
                    )}
                    {project.tagline && (
                      <p className="text-gray-300 italic text-lg">
                        {project.tagline}
                      </p>
                    )}
                  </div>

                  {/* Sections */}
                  <div className="space-y-6">
                    {project.sections.map((section, sIndex) => (
                      <div
                        key={sIndex}
                        className="border-l-4 border-blue-500/50 pl-6"
                      >
                        <h4 className="text-xl font-semibold text-blue-300 mb-2">
                          {section.title}
                        </h4>
                        <ul className="text-gray-200 leading-relaxed">
                          {Array.isArray(section.content) ? (
                            section.content.map((item, i) => (
                              <li key={i}>• {item}</li>
                            ))
                          ) : (
                            <li>• {section.content}</li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {project.image && (
                  <div className="w-full md:w-1/2 min-h-[360px] md:min-h-0 p-3 md:p-4">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-contain bg-transparent cursor-pointer rounded-lg border border-white/20 transition-transform duration-300"
                      onClick={() =>
                        setPreviewImage({
                          src: project.image,
                          alt: project.title,
                        })
                      }
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
                  <div className="flex-1">
                    <h2 className="text-4xl font-bold text-white mb-3">
                      {project.title}
                    </h2>
                    {project.tags && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className={`${tag.color} text-white text-xs font-semibold px-3 py-1 rounded-full`}
                          >
                            {tag.text}
                          </span>
                        ))}
                      </div>
                    )}
                    {project.link && (
                      <a
                        href={project.link}
                        className="text-blue-400 hover:text-blue-300 font-semibold transition-colors inline-block mb-4"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {project.link.replace(/^https?:\/\//, '')} →
                      </a>
                    )}
                    {project.tagline && (
                      <p className="text-gray-300 italic text-lg">
                        {project.tagline}
                      </p>
                    )}
                  </div>

                  {/* Image */}
                  {project.image && (
                    <div
                      className={`${project.imageSize || 'md:w-96'} md:flex-shrink-0`}
                    >
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full rounded-lg shadow-xl border border-white/20 hover:scale-105 transition-transform duration-300 cursor-pointer"
                        onClick={() =>
                          setPreviewImage({
                            src: project.image,
                            alt: project.title,
                          })
                        }
                      />
                    </div>
                  )}
                </div>

                {/* Sections */}
                <div className="space-y-6">
                  {project.sections.map((section, sIndex) => (
                    <div
                      key={sIndex}
                      className="border-l-4 border-blue-500/50 pl-6"
                    >
                      <h4 className="text-xl font-semibold text-blue-300 mb-2">
                        {section.title}
                      </h4>
                      <ul className="text-gray-200 leading-relaxed">
                        {Array.isArray(section.content) ? (
                          section.content.map((item, i) => (
                            <li key={i}>• {item}</li>
                          ))
                        ) : (
                          <li>• {section.content}</li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors z-10"
              aria-label="Close preview"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={previewImage.src}
              alt={previewImage.alt}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
