'use client'

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Brain, Database, Code, Layers, Clock, Github, ArrowUpRight } from "lucide-react";
import Image from 'next/image';
import { ArrowLeft } from "lucide-react";
import { NavButton } from "@/components/ui/nav-button";
import { BarChart2, MessageSquare } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

// Tech stack data
const techStack = [
  {
    name: 'Next.js',
    logo: '/nextjs.jpg',
    description: 'Frontend framework with TypeScript'
  },
  {
    name: 'Firebase',
    logo: '/firebase.jpg',
    description: 'Real-time database and hosting'
  },
  {
    name: 'PyTorch',
    logo: '/pytorch.jpg',
    description: 'Deep learning model development'
  },
  {
    name: 'Vercel',
    logo: '/vercel.jpg',
    description: 'Deployment and hosting platform'
  }
];

// Team members data
const teamMembers = [
  {
    name: 'Ahsen Tahir',
    role: 'Team Lead & AI/ML Engineer',
    image: '/team-member-1.jpg',
    description: 'Expertise in deep learning and model architecture and handeling big data.',
    socials: {
      linkedin: 'https://www.linkedin.com/in/ahsen-tahir-224a7126b/',
      github: 'https://github.com/AhsenTahir',
      portfolio: 'https://ahsentahir.framer.ai/'
    }
  },
  {
    name: 'Mustafa Khan',
    role: 'AI/ML Engineer',
    image: '/team-member-2.jpg',
    description: 'Expert in predictive modeling and AI solutions development.',
    socials: {
      linkedin: 'https://www.linkedin.com/in/mustafa-khan-14a15b217/',
      github: 'https://github.com/mustafahk27'
    }
  },
  {
    name: 'Burhanuddin Khatri',
    role: 'API & Three.js Specialist',
    image: '/team-member-3.jpg',
    description: 'Combining API integrations with 3D model design to deliver seamless, visually immersive UI',
    socials: {
        linkedin: 'https://www.linkedin.com/in/burhankhatri/',
        github: 'https://github.com/BurhanCantCode',
        portfolio: 'http://burhanis.me'
      }
  }
];

// Key features data
const keyFeatures = [
  {
    icon: <Brain className="w-8 h-8 text-[#F7931A]" />,
    title: 'Extensive Data Training',
    description: 'Trained on comprehensive historical Bitcoin data for accurate predictions.'
  },
  {
    icon: <Code className="w-8 h-8 text-[#F7931A]" />,
    title: 'Sophisticated AI Backend',
    description: 'Advanced deep learning algorithms for precise market analysis.'
  },
  {
    icon: <Layers className="w-8 h-8 text-[#F7931A]" />,
    title: 'Multiple LLM with Web Searching',
    description: 'Integration of multiple language models for enhanced accuracy.'
  },
  {
    icon: <Database className="w-8 h-8 text-[#F7931A]" />,
    title: 'Interactive Dashboard',
    description: 'Real-time data visualization and analysis tools.'
  },
  {
    icon: <Clock className="w-8 h-8 text-[#F7931A]" />,
    title: 'Automation for Scheduling',
    description: 'Automated predictions and notifications system.'
  },
  {
    icon: <Brain className="w-8 h-8 text-[#F7931A]" />,
    title: 'Advanced Neural Architecture',
    description: 'LSTM networks with attention mechanism achieving 98% prediction accuracy.'
  }
];

// Add this new data sources array near your other data constants
const dataSources = [
  {
    name: 'Binance',
    logo: '/binance.jpg',
    description: 'Real-time cryptocurrency market data and historical price information'
  },
  {
    name: 'Alternative.me',
    logo: '/alternativeme.jpg',
    description: 'Market sentiment analysis and Fear & Greed Index'
  },
  {
    name: 'FRED',
    logo: '/fred.jpg',
    description: 'Macroeconomic indicators and financial data'
  },
  {
    name: 'Google BigQuery',
    logo: '/googlebigquery.jpg',
    description: 'Blockchain transaction data and network metrics'
  }
];

// Add this new array after the dataSources array
const repositories = [
 
  {
    name: 'Trend-X-BTC ML',
    description: 'Deep Learning implementation and model architecture',
    url: 'https://github.com/AhsenTahir/Trend-X-BTC',
    tech: ['Python', 'TensorFlow', 'LSTM', 'Attention Mechanism']
  },
  {
    name: 'Trend-X-BTC UI',
    description: 'Frontend implementation and website codebase',
    url: 'https://github.com/BurhanCantCode/BTC',
    tech: ['Next.js', 'TypeScript', 'TailwindCSS', 'Three.js']
  }
];

export default function TechTeam() {
  return (
    <div className="min-h-screen bg-black">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#F7931A_0%,transparent_35%)] opacity-15" />
      </div>

      {/* Navigation Buttons */}
      <div className="fixed top-2 sm:top-6 left-2 sm:left-6 z-20 flex flex-wrap gap-2 sm:gap-4">
        <NavButton 
          href="/dashboard" 
          icon={ArrowLeft} 
          label="Back"
          className="flex items-center gap-2 !px-3 sm:!px-6 !py-2 sm:!py-5"
          showLabelOnMobile={true}
        />
        <NavButton 
          href="/dashboard" 
          icon={BarChart2} 
          label="Dashboard"
          className="flex items-center gap-2" 
          showLabelOnMobile={true}
        />
        <NavButton 
          href="/chatbot" 
          icon={MessageSquare} 
          label="AI Chat"
          className="flex items-center gap-2" 
          showLabelOnMobile={true}
        />
      </div>

      {/* User Button */}
      <div className="fixed top-2 sm:top-6 right-2 sm:right-6 z-20">
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white/10 hover:border-[#F7931A]/50 transition-all",
              userButtonPopover: "bg-black/90 border border-white/10 backdrop-blur-sm",
              userButtonPopoverCard: "bg-transparent",
              userButtonPopoverActions: "bg-transparent",
              userButtonPopoverActionButton: "hover:bg-white/10",
              userButtonPopoverActionButtonText: "text-white",
              userButtonPopoverFooter: "hidden"
            }
          }}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 px-4 sm:px-6 pt-20 sm:pt-24 pb-16 sm:pb-24 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-20"
        >
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-[#F7931A] mb-4 sm:mb-6">Tech & Team</h1>
          <p className="text-lg sm:text-xl text-gray-300">Meet the innovation and expertise behind Trend-X-BTC.</p>
        </motion.section>

        {/* Our Approach Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold text-white mb-6">Our Approach</h2>
              <p className="text-gray-300 leading-relaxed">
                Trend-X-BTC is an advanced deep learning project designed to mimic the expertise of professional Bitcoin technical analysts. 
                It delivers precise price forecasting with an impressive 98% accuracy, empowering users to make informed trading decisions with confidence.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative h-[300px] w-full rounded-xl overflow-hidden">
                <Image
                  src="/Trend-X-BTC .png"
                  alt="Deep Learning Model"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Key Features Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
              >
                <Card className="bg-black/50 backdrop-blur-sm border border-white/10 p-6 hover:border-[#F7931A]/50 transition-all">
                  <div className="flex items-center mb-4">
                    {feature.icon}
                    <h3 className="text-xl font-semibold text-white ml-4">{feature.title}</h3>
                  </div>
                  <p className="text-gray-300">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Tech Stack Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Tech Stack</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
              >
                <Card className="bg-black/50 backdrop-blur-sm border border-white/10 p-4 sm:p-6 hover:border-[#F7931A]/50 transition-all h-full">
                  <div className="relative h-12 sm:h-16 w-12 sm:w-16 mx-auto mb-3 sm:mb-4">
                    <Image
                      src={tech.logo}
                      alt={tech.name}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-white text-center mb-1 sm:mb-2">{tech.name}</h3>
                  <p className="text-sm sm:text-base text-gray-300 text-center">{tech.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Data Sources Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Data Sources</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {dataSources.map((source, index) => (
              <motion.div
                key={source.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                className="text-center"
              >
                <Card className="bg-black/50 backdrop-blur-sm border border-white/10 p-6 hover:border-[#F7931A]/50 transition-all">
                  <div className="relative h-16 w-full mb-4">
                    <Image
                      src={source.logo}
                      alt={source.name}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{source.name}</h3>
                  <p className="text-sm text-gray-300">{source.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Open Source Repositories Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Open Source Repositories</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {repositories.map((repo) => (
              <motion.div
                key={repo.name}
                whileHover={{ scale: 1.02 }}
                className="bg-black/40 border border-[#F7931A]/20 rounded-xl p-6 hover:border-[#F7931A]/40 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-[#F7931A]">{repo.name}</h3>
                  <Github className="w-6 h-6 text-[#F7931A]" />
                </div>
                <p className="text-gray-300 mb-4">{repo.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {repo.tech.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs bg-[#F7931A]/10 text-[#F7931A] px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[#F7931A] hover:text-[#F7931A]/80 transition-colors"
                >
                  View Repository
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Team Section */}
        <section className="mt-12 sm:mt-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-8 text-center">
            Meet Our Team
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
              >
                <Card className="bg-black/50 backdrop-blur-sm border border-white/10 p-3 sm:p-4 lg:p-6 hover:border-[#F7931A]/50 transition-all">
                  <div className="relative w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 mx-auto mb-3 sm:mb-4 lg:mb-6">
                    <Image
                      src={member.image}
                      alt={member.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white text-center mb-1 sm:mb-2">
                    {member.name}
                  </h3>
                  <p className="text-sm sm:text-base text-[#F7931A] text-center mb-2 sm:mb-3">
                    {member.role}
                  </p>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-300 text-center mb-3 sm:mb-4">
                    {member.description}
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                    {member.socials && Object.entries(member.socials).map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-sm text-gray-300 hover:text-[#F7931A] transition-colors"
                      >
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </a>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
} 