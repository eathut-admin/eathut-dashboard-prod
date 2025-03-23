"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

const BannerImageSliderWithDeleteButton = ({
  slides,
  loading,
}: {
  slides: any[];
  loading: boolean;
}) => {
  return (
    <main>
      <Carousel className="w-full relative">
        {loading ? (
          <div className="animate-pulse rounded-md bg-gray-300 dark:bg-gray-500 h-[280px] w-[100%]"></div>
        ) : (
          <CarouselContent
            className={`${slides?.length < 2 && "flex justify-center"}`}>
            {slides?.map((slide, _id) => (
              <CarouselItem key={_id} className="md:basis-1/2 lg:basis-1/3">
                <div>
                  <Card className="border-0 outline-none">
                    <CardContent className="flex aspect-video items-center justify-center p-4 overflow-hidden">
                      <div className="w-full h-full rounded-md overflow-hidden">
                        <Image
                          src={slide?.image}
                          alt={slide?.alt}
                          width={500}
                          height={500}
                          className="aspect-video rounded-md w-[500px] h-[300px] object-fill object-center"></Image>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        )}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 ">
          {slides?.length > 3 && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </div>
      </Carousel>
    </main>
  );
};

export default BannerImageSliderWithDeleteButton;
