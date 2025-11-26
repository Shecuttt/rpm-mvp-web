"use client";
import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import banner from "@/data/banner.json";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

export default function Slider() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnMouseEnter: false, stopOnInteraction: false })
  );

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[plugin.current]}
      className="mt-12 md:mt-0 py-12"
    >
      <CarouselContent>
        {banner.map((item) => (
          <CarouselItem key={item.id}>
            <div className="flex items-center justify-center w-full px-4 md:px-8 mx-auto h-48 md:h-72 lg:h-96 overflow-hidden">
              <Image
                src={item.image}
                alt={item.alt}
                width={1200}
                height={400}
                className="object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
