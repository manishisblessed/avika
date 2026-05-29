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
      "/testimonials/t1.jpg",
    quote:
      "The vegetables are always farm-fresh and the prices are so reasonable! I've been ordering weekly for 6 months now. My go-to for all grocery needs.",
    rating: 5,
  },
  {
    id: "t2",
    name: "Rahul Verma",
    role: "Software Engineer",
    avatar:
      "/testimonials/t2.jpg",
    quote:
      "Being a working professional, I barely have time to shop. AVIKA's same-day delivery is a lifesaver. Quality products, no hassle!",
    rating: 5,
  },
  {
    id: "t3",
    name: "Meera Patel",
    role: "Mother of Two",
    avatar:
      "/testimonials/t3.jpg",
    quote:
      "I trust AVIKA for my family's groceries. The dairy products are always fresh, and my kids love the snacks selection. Best grocery store!",
    rating: 5,
  },
  {
    id: "t4",
    name: "Anil Kumar",
    role: "Restaurant Owner",
    avatar:
      "/testimonials/t4.jpg",
    quote:
      "I order in bulk for my restaurant and the quality is consistently excellent. The spices are aromatic and the staples are top-notch.",
    rating: 5,
  },
];
