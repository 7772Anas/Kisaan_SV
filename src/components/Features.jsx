import React from "react";

export default function Features() {
  const features = [
    {
      title: "Expert Guidance",
      description: "Get professional advice from agricultural experts to improve your farming practices.",
      icon: "🌱",
    },
    {
      title: "Market Insights",
      description: "Access real-time market information to make informed decisions about your produce.",
      icon: "📊",
    },
    {
      title: "Modern Technology",
      description: "Stay updated with the latest farming techniques and technological advancements.",
      icon: "💡",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Kisaan Suvidha?
          </h2>
          <p className="text-lg text-gray-600">
            We provide comprehensive solutions to help you succeed in farming
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 