import React from 'react';

interface Photographer {
  id: number;
  name: string;
  specialty: string;
  image: string;
  rating: number;
}

const photographers: Photographer[] = [
  {
    id: 1,
    name: 'Emily Johnson',
    specialty: 'Wedding & Events',
    image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=400',
    rating: 4.9,
  },
  {
    id: 2,
    name: 'Michael Chen',
    specialty: 'Portrait & Fashion',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    rating: 4.8,
  },
  {
    id: 3,
    name: 'Sarah Williams',
    specialty: 'Family & Newborn',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    rating: 4.7,
  },
];

const FeaturedPhotographers: React.FC = () => (
  <section className="featured">
    <div className="container">
      <h2 className="section-title">Featured Photographers</h2>
      <div className="grid">
        {photographers.map((p) => (
          <div key={p.id} className="card">
            <img src={p.image} alt={p.name} />
            <div className="card-body">
              <h3 className="card-name">{p.name}</h3>
              <p className="card-specialty">{p.specialty}</p>
              <div className="card-rating">
                ★ <span>{p.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturedPhotographers;