interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  github: string;
  demo?: string;
  stars: number;
  forks: number;
  language: string;
  status: 'active' | 'maintenance' | 'archived';
}

const projects: Project[] = [
  {
    id: 1,
    title: 'API Gateway Framework',
    description: 'High-performance API gateway built with Node.js and TypeScript',
    longDescription: 'A production-ready API gateway that handles routing, authentication, rate limiting, and load balancing. Features include JWT authentication, Redis caching, and comprehensive monitoring.',
    tags: ['Node.js', 'TypeScript', 'Redis', 'Docker'],
    github: 'https://github.com/yourusername/api-gateway',
    demo: 'https://api-gateway-demo.vercel.app',
    stars: 1234,
    forks: 89,
    language: 'TypeScript',
    status: 'active'
  },
  {
    id: 2,
    title: 'React Component Library',
    description: 'Modern, accessible component library for React applications',
    longDescription: 'A comprehensive UI component library with 50+ components, built with React, TypeScript, and Tailwind CSS. Fully accessible, customizable, and production-tested.',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Storybook'],
    github: 'https://github.com/yourusername/react-components',
    demo: 'https://components.example.com',
    stars: 2567,
    forks: 234,
    language: 'TypeScript',
    status: 'active'
  },
  {
    id: 3,
    title: 'Real-time Analytics Dashboard',
    description: 'WebSocket-based analytics dashboard with live data visualization',
    longDescription: 'Real-time analytics platform processing millions of events per day. Built with Next.js, WebSocket, and D3.js for interactive data visualization.',
    tags: ['Next.js', 'WebSocket', 'D3.js', 'PostgreSQL'],
    github: 'https://github.com/yourusername/analytics-dashboard',
    stars: 890,
    forks: 67,
    language: 'JavaScript',
    status: 'active'
  },
  {
    id: 4,
    title: 'CLI Task Runner',
    description: 'Fast and flexible task runner for modern JavaScript projects',
    longDescription: 'A zero-config task runner that simplifies common development tasks. Features parallel execution, watch mode, and plugin system.',
    tags: ['Node.js', 'CLI', 'TypeScript', 'npm'],
    github: 'https://github.com/yourusername/task-runner',
    stars: 456,
    forks: 34,
    language: 'TypeScript',
    status: 'maintenance'
  },
  {
    id: 5,
    title: 'GraphQL Server Boilerplate',
    description: 'Production-ready GraphQL server with authentication and subscriptions',
    longDescription: 'A complete GraphQL server setup with Apollo Server, Prisma, and PostgreSQL. Includes authentication, authorization, real-time subscriptions, and testing.',
    tags: ['GraphQL', 'Apollo', 'Prisma', 'PostgreSQL'],
    github: 'https://github.com/yourusername/graphql-boilerplate',
    demo: 'https://graphql-demo.example.com',
    stars: 1876,
    forks: 156,
    language: 'TypeScript',
    status: 'active'
  },
  {
    id: 6,
    title: 'Markdown Blog Engine',
    description: 'Static site generator for markdown-based blogs',
    longDescription: 'A lightweight static site generator that converts markdown files into a beautiful blog. Features syntax highlighting, SEO optimization, and RSS feeds.',
    tags: ['Node.js', 'Markdown', 'SSG', 'SEO'],
    github: 'https://github.com/yourusername/markdown-blog',
    stars: 678,
    forks: 45,
    language: 'JavaScript',
    status: 'maintenance'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'text-[#00ff88] border-[#00ff88]';
    case 'maintenance':
      return 'text-yellow-500 border-yellow-500';
    case 'archived':
      return 'text-gray-500 border-gray-500';
    default:
      return 'text-gray-500 border-gray-500';
  }
};

export default function ProjectsPage() {
  const activeProjects = projects.filter(p => p.status === 'active');
  const otherProjects = projects.filter(p => p.status !== 'active');

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-16">
          <h1 className="text-5xl font-bold mb-6">Projects</h1>
          <p className="text-xl text-gray-400 max-w-3xl">
            A collection of open source projects and tools I've built to solve real-world problems.
            Check out the code on GitHub or try the live demos.
          </p>
          <div className="h-1 w-20 bg-[#00ff88] mt-6"></div>
        </div>

        <div className="mb-12 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#00ff88] rounded-full"></div>
            <span>Active Development</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Maintenance Mode</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span>Archived</span>
          </div>
        </div>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Active Projects</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {activeProjects.map((project) => (
              <article
                key={project.id}
                className="bg-[#161b22] border border-gray-800 rounded-lg p-6 hover:border-[#00ff88] transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold group-hover:text-[#00ff88] transition-colors">
                    {project.title}
                  </h3>
                  <span className={`px-2 py-1 border rounded text-xs uppercase font-semibold ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>

                <p className="text-gray-400 mb-4 leading-relaxed">
                  {project.description}
                </p>

                <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                  {project.longDescription}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-[#0d1117] border border-gray-800 rounded text-xs font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-[#00ff88] rounded-full"></span>
                    <span className="font-mono">{project.language}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>★</span>
                    <span>{project.stars}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>⑂</span>
                    <span>{project.forks}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-[#0d1117] border border-gray-800 rounded-lg hover:border-[#00ff88] transition-colors text-center font-semibold"
                  >
                    View Code
                  </a>
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-[#00ff88] text-[#0d1117] rounded-lg hover:bg-opacity-90 transition-colors text-center font-semibold"
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {otherProjects.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-8">Other Projects</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {otherProjects.map((project) => (
                <article
                  key={project.id}
                  className="bg-[#161b22] border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold">
                      {project.title}
                    </h3>
                    <span className={`px-2 py-1 border rounded text-xs uppercase font-semibold ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>

                  <p className="text-gray-400 mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-[#0d1117] border border-gray-800 rounded text-xs font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 bg-gray-500 rounded-full"></span>
                      <span className="font-mono">{project.language}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>★</span>
                      <span>{project.stars}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>⑂</span>
                      <span>{project.forks}</span>
                    </div>
                  </div>

                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 bg-[#0d1117] border border-gray-800 rounded-lg hover:border-gray-700 transition-colors text-center font-semibold"
                  >
                    View on GitHub
                  </a>
                </article>
              ))}
            </div>
          </section>
        )}

        <div className="mt-16 bg-[#161b22] border border-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Want to Collaborate?</h2>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            I'm always open to interesting projects and collaborations. Feel free to reach out
            if you have an idea or want to contribute to any of these projects.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/contact"
              className="px-8 py-3 bg-[#00ff88] text-[#0d1117] rounded-lg hover:bg-opacity-90 transition-colors font-bold"
            >
              Get in Touch
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-[#0d1117] border border-gray-800 rounded-lg hover:border-[#00ff88] transition-colors font-bold"
            >
              Follow on GitHub
            </a>
          </div>
        </div>
    </div>
  );
}
