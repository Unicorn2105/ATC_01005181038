"use client";
import { UserContext } from "@/context/user-context";
import { EventMap } from "@/interface/event";
import { Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useContext } from "react";
import Slider from "react-slick";
export default function SimpleSlider() {
    const { userToken } = useContext(UserContext);
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };
    const getEvent = async () => {
        const config = userToken
            ? { headers: { Authorization: `Bearer ${userToken}` } }
            : {};
        return axios.get("api/event", config);
    };
    const { data } = useQuery({
        queryKey: ["events"],
        queryFn: getEvent,
    });

    return (
        <Slider {...settings}>
            {data?.data?.result?.data.map((event: EventMap) => (
                <div className="h-[500px]" key={event.id}>
                    <Image
                        width={1500}
                        height={500}
                        src={`http://localhost:8000/${event.imageUrl}`}
                        alt={event.name}
                        className="w-full object-cover object-center h-full blockrounded-lg"
                    />
                </div>
            ))}
        </Slider>
    );
}
