export default function Services() {
  const services = [
    {
      title: 'Custom Fabrication',
      description: 'We specialize in creating custom metal fabrications tailored to your specific needs. Our team of expert welders can bring your designs to life with precision and quality.',
      features: [
        'Custom metal structures',
        'Architectural elements',
        'Industrial components',
        'Artistic metalwork'
      ]
    },
    {
      title: 'Industrial Welding',
      description: 'Our industrial welding services are designed to meet the demands of heavy-duty applications. We work with various materials and welding techniques to ensure the highest quality results.',
      features: [
        'Structural welding',
        'Pipe welding',
        'Heavy equipment repair',
        'Industrial machinery maintenance'
      ]
    },
    {
      title: 'Repair & Maintenance',
      description: 'Keep your equipment and structures in top condition with our comprehensive repair and maintenance services. We provide quick response times and lasting solutions.',
      features: [
        'Equipment repair',
        'Structural repairs',
        'Preventive maintenance',
        'Emergency services'
      ]
    }
  ];

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-12">Our Services</h1>
        
        <div className="space-y-16">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4">{service.title}</h2>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <svg
                        className="h-5 w-5 text-blue-600"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Need a Custom Solution?</h2>
          <p className="text-gray-600 mb-8">
            Contact us to discuss your specific requirements and get a free quote.
          </p>
          <a
            href="/contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
} 