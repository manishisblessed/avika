export type Testimonial = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
};

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Priya Sharma",
    role: "Homemaker, Delhi",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    quote:
      "The vegetables are always farm-fresh and the prices are so reasonable! I've been ordering weekly for 6 months now. My go-to for all grocery needs.",
    rating: 5,
  },
  {
    id: "t2",
    name: "Rahul Verma",
    role: "Software Engineer",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    quote:
      "Being a working professional, I barely have time to shop. AVIKA's same-day delivery is a lifesaver. Quality products, no hassle!",
    rating: 5,
  },
  {
    id: "t3",
    name: "Meera Patel",
    role: "Mother of Two",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
    quote:
      "I trust AVIKA for my family's groceries. The dairy products are always fresh, and my kids love the snacks selection. Best grocery store!",
    rating: 5,
  },
  {
    id: "t4",
    name: "Anil Kumar",
    role: "Restaurant Owner",
    avatar:
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=200&q=80",
    quote:
      "I order in bulk for my restaurant and the quality is consistently excellent. The spices are aromatic and the staples are top-notch.",
    rating: 5,
  },
];
