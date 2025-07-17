import React from "react";
import { FaArrowRight } from "react-icons/fa";
import ai from "../../assets/home_page/ai.jpg";
import block_chain from "../../assets/home_page/block_chain.jpg";
import chat_gpt from "../../assets/home_page/chat_gpt.jpg";
import deep_learning from "../../assets/home_page/deep_learning.jpg";
import code from "../../assets/home_page/code.jpg";
import robot from "../../assets/home_page/robot.jpg";

const features = [
  {
    name: "AI and Machine Learning Solutions",
    description:
      "Transform your business with cutting-edge AI and machine learning solutions designed to optimize operations and enhance decision-making.",
    link: "/ai-ml-solutions",
    icon: <FaArrowRight className="text-indigo-600" />,
  },
  {
    name: "Blockchain Development",
    description:
      "Build secure, scalable, and efficient blockchain solutions tailored to meet the demands of today’s digital economy.",
    link: "/blockchain-development",
    icon: <FaArrowRight className="text-indigo-600" />,
  },
  {
    name: "Web and Mobile Applications",
    description:
      "Develop responsive, user-friendly web and mobile applications that engage customers and drive business growth.",
    link: "/web-mobile-apps",
    icon: <FaArrowRight className="text-indigo-600" />,
  },
  {
    name: "Software Testing and QA",
    description:
      "Ensure the reliability and performance of your software with our comprehensive testing and quality assurance services.",
    link: "/software-testing",
    icon: <FaArrowRight className="text-indigo-600" />,
  },
  {
    name: "Custom Client Solutions",
    description:
      "Leverage our expertise in MERN, Next.js, and WordPress to create tailored solutions that meet your unique business needs.",
    link: "/custom-client-solutions",
    icon: <FaArrowRight className="text-indigo-600" />,
  },
  {
    name: "Training and Placement Services",
    description:
      "Empower your team with hands-on training and real-world project experience, supported by our industry-leading placement services.",
    link: "/training-placement",
    icon: <FaArrowRight className="text-indigo-600" />,
  },
];

export default function Homepage() {
  return (
    <div className="bg-white">
      <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 px-4 py-12 sm:px-6 sm:py-24 lg:max-w-7xl lg:grid-cols-2 lg:px-8">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-gray-600 sm:text-4xl">
            Empowering Businesses with Innovative Software Solutions
          </h2>
          <p className="mt-4 text-gray-500">
            We are a leading software company committed to driving business
            transformation through technology. With expertise in AI, blockchain,
            web and mobile applications, software testing, and custom client
            solutions, we empower organizations to innovate and thrive in a
            competitive market. Our solutions are designed to be robust,
            scalable, and aligned with your strategic goals, ensuring you stay
            ahead of the curve in today's rapidly evolving digital landscape.
            Partner with us to unlock new opportunities and achieve sustainable
            growth.
          </p>

          <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
            {features.map((feature) => (
              <div key={feature.name} className="border-t border-gray-300 pt-4">
                <dt className="font-medium text-gray-800 flex justify-between items-center">
                  <span className="bg-indigo-500 text-white rounded transition-colors duration-200 ease-in-out hover:text-gray-800 btn btn-sm">
                    {feature.name}
                  </span>
                  {feature.icon}
                </dt>
                <dd className="mt-2 text-sm text-gray-500">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:gap-1 lg:gap-1 mt-0">
          <img
            alt="AI and Machine Learning"
            src={ai}
            className="rounded-lg bg-gray-100"
          />
          <img
            alt="Blockchain Development"
            src={robot}
            className="rounded-lg bg-gray-100"
          />
          <img
            alt="Web and Mobile Applications"
            src={chat_gpt}
            className="rounded-lg bg-gray-100"
          />
          <img
            alt="Software Testing"
            src={deep_learning}
            className="rounded-lg bg-gray-100"
          />
        </div>
      </div>
    </div>
  );
}
