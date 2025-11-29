import { Truck, ShieldCheck, Headphones, CreditCard } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over Rp 500.000",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "Your payment is 100% secure",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "We're here to help anytime",
  },
  {
    icon: CreditCard,
    title: "Easy Returns",
    description: "30-day return policy",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 px-4 bg-gray-50 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="flex flex-col items-center text-center p-6 
             bg-white dark:bg-neutral-900 
             border border-neutral-200 dark:border-neutral-800
             rounded-lg shadow-sm hover:shadow-md 
             transition-shadow"
              >
                <div
                  className="w-16 h-16 
                  bg-neutral-100 dark:bg-neutral-800 
                  rounded-full flex items-center justify-center mb-4"
                >
                  <Icon className="w-8 h-8 text-neutral-900 dark:text-neutral-200" />
                </div>

                <h3
                  className="text-lg font-semibold 
                 text-neutral-900 dark:text-neutral-100 mb-2"
                >
                  {feature.title}
                </h3>

                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
