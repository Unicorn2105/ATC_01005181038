"use client";
import Event from "@/components/events";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SimpleSlider from "@/components/image-slider";
import ModalComponent from "@/components/modal";

export default function Home() {
    return (
        <section className="flex flex-col  gap-4 py-8 md:py-10 px-16 lg:px-28">
            <SimpleSlider></SimpleSlider>
            <Event></Event>
        </section>
    );
}
