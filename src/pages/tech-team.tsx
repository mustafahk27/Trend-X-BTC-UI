'use client'

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Brain, Database, Code, Layers, Clock } from "lucide-react";
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
    name: 'Mustafa Hussein',
    role: 'Ai/ML Engineer',
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

export default function TechTeam() {
  return (
    <div className="min-h-screen bg-black">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#F7931A_0%,transparent_35%)] opacity-15" />
      </div>

      {/* Navigation Buttons */}
      <div className="fixed top-6 left-6 z-20 flex gap-4">
        <NavButton href="/dashboard" icon={ArrowLeft} label="Back" />
        <NavButton href="/dashboard" icon={BarChart2} label="Dashboard" />
        <NavButton href="/chatbot" icon={MessageSquare} label="AI Chat" />
      </div>

      {/* User Button */}
      <div className="fixed top-6 right-6 z-20">
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-10 h-10 rounded-full border-2 border-white/10 hover:border-[#F7931A]/50 transition-all",
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
      <main className="relative z-10 px-6 pt-12 pb-24 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-[#F7931A] mb-6">Tech & Team</h1>
          <p className="text-xl text-gray-300">Meet the innovation and expertise behind Trend-X-BTC.</p>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                className="text-center"
              >
                <Card className="bg-black/50 backdrop-blur-sm border border-white/10 p-6 hover:border-[#F7931A]/50 transition-all">
                  <div className="relative h-16 w-full mb-4">
                    <Image
                      src={tech.logo}
                      alt={tech.name}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{tech.name}</h3>
                  <p className="text-sm text-gray-300">{tech.description}</p>
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

        {/* Team Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
              >
                <Card className="bg-black/50 backdrop-blur-sm border border-white/10 p-6 hover:border-[#F7931A]/50 transition-all">
                  <div className="relative h-48 w-48 mx-auto mb-6 rounded-full overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-white text-center mb-2">{member.name}</h3>
                  <p className="text-[#F7931A] text-center mb-4">{member.role}</p>
                  <p className="text-gray-300 text-center mb-4">{member.description}</p>
                  
                  <div className="flex justify-center gap-4">
                    {member.socials && member.socials.linkedin && (
                      <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" 
                         className="text-gray-300 hover:text-[#F7931A] transition-colors">
                        LinkedIn
                      </a>
                    )}
                    {member.socials && member.socials.github && (
                      <a href={member.socials.github} target="_blank" rel="noopener noreferrer" 
                         className="text-gray-300 hover:text-[#F7931A] transition-colors">
                        GitHub
                      </a>
                    )}
                    {member.socials && member.socials.portfolio && (
                      <a href={member.socials.portfolio} target="_blank" rel="noopener noreferrer" 
                         className="text-gray-300 hover:text-[#F7931A] transition-colors">
                        Portfolio
                      </a>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
} 