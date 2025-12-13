export default function AboutPage() {
  const skills = {
    languages: ['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust'],
    frontend: ['React', 'Next.js', 'Vue.js', 'Tailwind CSS', 'Svelte'],
    backend: ['Node.js', 'Express', 'Django', 'FastAPI', 'PostgreSQL'],
    tools: ['Docker', 'Kubernetes', 'Git', 'AWS', 'CI/CD'],
    other: ['GraphQL', 'REST APIs', 'WebSockets', 'Redis', 'MongoDB']
  };

  const experience = [
    {
      title: 'Senior Full Stack Developer',
      company: 'Tech Startup Inc.',
      period: '2022 - Present',
      description: 'Leading development of scalable web applications using Next.js and Node.js'
    },
    {
      title: 'Full Stack Developer',
      company: 'Digital Agency Co.',
      period: '2020 - 2022',
      description: 'Built and maintained multiple client projects using React and Express'
    },
    {
      title: 'Frontend Developer',
      company: 'Web Solutions Ltd.',
      period: '2018 - 2020',
      description: 'Developed responsive user interfaces and implemented modern design systems'
    }
  ];

  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com', icon: 'GitHub' },
    { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'LinkedIn' },
    { name: 'Twitter', url: 'https://twitter.com', icon: 'Twitter' },
    { name: 'Email', url: 'mailto:dev@example.com', icon: 'Email' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-16">
        <h1 className="text-5xl font-bold mb-6">About Me</h1>
        <div className="h-1 w-20 bg-[#00ff88]"></div>
      </div>

      <div className="grid md:grid-cols-3 gap-12 mb-16">
        <div className="md:col-span-1">
          <div className="bg-[#161b22] border border-gray-800 rounded-lg p-8 sticky top-24">
            <div className="w-full aspect-square bg-[#00ff88] rounded-lg flex items-center justify-center mb-6">
              <span className="text-6xl font-bold text-[#0d1117]">TD</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Tech Developer</h2>
            <p className="text-gray-400 mb-6">Full Stack Engineer</p>

            <div className="space-y-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-300 hover:text-[#00ff88] transition-colors"
                >
                  <span className="w-5 h-5 flex items-center justify-center">
                    <span className="text-xl">→</span>
                  </span>
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-12">
          <section>
            <h2 className="text-3xl font-bold mb-6">Biography</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                I&apos;m a passionate full stack developer with over 6 years of experience building
                modern web applications. I specialize in JavaScript/TypeScript ecosystems and
                love creating performant, scalable solutions.
              </p>
              <p>
                My journey in software development started with a curiosity about how websites work,
                which quickly evolved into a deep passion for building digital experiences. I believe
                in writing clean, maintainable code and staying up-to-date with the latest technologies.
              </p>
              <p>
                When I&apos;m not coding, you can find me contributing to open source projects, writing
                technical blog posts, or exploring new programming languages and frameworks. I&apos;m
                particularly interested in web performance optimization, developer experience, and
                building tools that make developers&apos; lives easier.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6">Experience</h2>
            <div className="space-y-6">
              {experience.map((job, index) => (
                <div
                  key={index}
                  className="bg-[#161b22] border border-gray-800 rounded-lg p-6 hover:border-[#00ff88] transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{job.title}</h3>
                    <span className="text-sm text-gray-400 whitespace-nowrap ml-4">
                      {job.period}
                    </span>
                  </div>
                  <p className="text-[#00ff88] mb-3">{job.company}</p>
                  <p className="text-gray-300">{job.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6">Skills & Technologies</h2>
            <div className="space-y-6">
              {Object.entries(skills).map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-xl font-semibold mb-3 capitalize text-[#00ff88]">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((skill) => (
                      <span
                        key={skill}
                        className="px-4 py-2 bg-[#161b22] border border-gray-800 rounded-lg text-sm hover:border-[#00ff88] transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6">Philosophy</h2>
            <div className="bg-[#161b22] border-l-4 border-[#00ff88] p-6 rounded-r-lg">
              <blockquote className="text-lg text-gray-300 italic leading-relaxed">
                &quot;Code is poetry. Every function should tell a story, every variable should have
                purpose, and every project should leave the codebase better than you found it.
                I believe in continuous learning, sharing knowledge, and building software that
                makes a difference.&quot;
              </blockquote>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6">What I&apos;m Learning</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#161b22] border border-gray-800 rounded-lg p-5 hover:border-[#00ff88] transition-colors">
                <h3 className="font-bold mb-2 text-[#00ff88]">WebAssembly</h3>
                <p className="text-sm text-gray-400">
                  Exploring high-performance web applications
                </p>
              </div>
              <div className="bg-[#161b22] border border-gray-800 rounded-lg p-5 hover:border-[#00ff88] transition-colors">
                <h3 className="font-bold mb-2 text-[#00ff88]">Rust</h3>
                <p className="text-sm text-gray-400">
                  Systems programming and performance optimization
                </p>
              </div>
              <div className="bg-[#161b22] border border-gray-800 rounded-lg p-5 hover:border-[#00ff88] transition-colors">
                <h3 className="font-bold mb-2 text-[#00ff88]">Machine Learning</h3>
                <p className="text-sm text-gray-400">
                  Integrating ML models into web applications
                </p>
              </div>
              <div className="bg-[#161b22] border border-gray-800 rounded-lg p-5 hover:border-[#00ff88] transition-colors">
                <h3 className="font-bold mb-2 text-[#00ff88]">Edge Computing</h3>
                <p className="text-sm text-gray-400">
                  Building globally distributed applications
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
