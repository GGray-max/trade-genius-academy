
import { Card, CardContent } from "@/components/ui/card";

const Testimonials = () => {
  const testimonials = [
    {
      quote:
        "TradeWizard completely transformed my trading. I've seen a 43% increase in my monthly returns since using their AI bots.",
      author: "Sarah Johnson",
      role: "Forex Trader",
      avatar: "https://placehold.co/100/1A2B6D/FFFFFF?text=SJ&font=montserrat",
    },
    {
      quote:
        "The bot sandbox testing feature saved me from making costly mistakes. I can now verify strategies before putting real money on the line.",
      author: "Michael Chen",
      role: "Crypto Investor",
      avatar: "https://placehold.co/100/34D399/FFFFFF?text=MC&font=montserrat",
    },
    {
      quote:
        "As a bot developer, I love how TradeWizard has connected me with traders worldwide. The platform makes monetizing my strategies seamless.",
      author: "David Mwangi",
      role: "Algorithm Developer",
      avatar: "https://placehold.co/100/F7CB45/000000?text=DM&font=montserrat",
    },
  ];

  return (
    <section className="py-20 bg-tw-blue-dark text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Join thousands of satisfied traders who have improved their trading results with TradeWizard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white/10 border-none backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col h-full">
                  <blockquote className="text-lg mb-6 flex-grow">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center mt-auto">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-gray-300 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
