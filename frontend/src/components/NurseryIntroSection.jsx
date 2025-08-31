import React from 'react';
import { Leaf, Truck, Flower } from 'lucide-react';
import img1 from '../assets/1.jpg';

const points = [
  {
    icon: <Leaf className="w-6 h-6" />,
    title: '17 Acres Across Pune',
    desc: '3 locations with diverse climates & a 2-acre garden centre on NH9',
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: '20+ Years of Expertise',
    desc: 'Delivering quality landscape plants, bonsai, succulents & more',
  },
  {
    icon: <Flower className="w-6 h-6" />,
    title: 'Family-Run Business',
    desc: 'A second-generation nursery led by skilled, passionate professionals',
  },
];

const NurseryIntroSection = () => {
  return (
    <section className="bg-[#f8f8f4] py-16 px-4 md:px-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Text content */}
        <div>
          <h2 className="text-4xl font-extrabold text-green-900 mb-6 leading-tight">
            Decorate your home with plants
          </h2>
          <p className="text-gray-700 text-lg mb-8">
            Our nursery is spread over 17 acres at 3 different climatic locations in Pune.
            We have over 20 years of experience growing and supplying finished pot plants,
            bonsai, succulents, exotic varieties and more. Our passionate family-run team
            is committed to providing top-quality greenery and innovations like Cryptanthus
            Eliane Red, new succulents, and fern varieties.
          </p>

          {/* Bullet points */}
          <div className="space-y-6">
            {points.map((point, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="bg-green-800 text-white rounded-full p-3">
                  {point.icon}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-green-900">{point.title}</h4>
                  <p className="text-sm text-gray-600">{point.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Image */}
        <div className="rounded-lg overflow-hidden shadow-lg">
          <img
            src={img1}
            alt="Nursery Plants"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default NurseryIntroSection;
