"use client";
import { UserContext } from "@/context/user-context";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useContext, useState, useEffect, use } from "react";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Input,
    Textarea,
    Divider,
    Spinner,
} from "@heroui/react";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import * as Yup from "yup";
import ProtectedRoute from "@/components/protected-route";

const validationSchema = Yup.object({
    name: Yup.string().required("Event name is required"),
    description: Yup.string().required("Description is required"),
    category: Yup.string().required("Category is required"),
    eventDate: Yup.date().required("Event date is required"),
    venue: Yup.string().required("Venue is required"),
    price: Yup.number()
        .min(0, "Price cannot be negative")
        .required("Price is required"),
});

export default function UpdateEventPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(params);
    const router = useRouter();
    const { userToken } = useContext(UserContext);
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [feedbackType, setFeedbackType] = useState("success");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchEventDetails = async () => {
        const config = userToken
            ? { headers: { Authorization: `Bearer ${userToken}` } }
            : {};
        return axios.get(`/api/event/${slug}`, config);
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: ["event-update", slug],
        queryFn: fetchEventDetails,
    });

    const event = data?.data?.result?.data;

    const formik = useFormik({
        initialValues: {
            id: 0,
            name: "",
            description: "",
            category: "",
            eventDate: "",
            venue: "",
            price: 0,
            imageUrl: "",
        },
        validationSchema,
        onSubmit: async (formValues) => {
            setIsSubmitting(true);
            try {
                const config = userToken
                    ? { headers: { Authorization: `Bearer ${userToken}` } }
                    : {};
                const formattedValues = {
                    ...formValues,
                    eventDate: new Date(formValues.eventDate)
                        .toISOString()
                        .split("T")[0],
                };

                const { data } = await axios.put(
                    `/api/event/${slug}`,
                    formattedValues,
                    config
                );
                setFeedbackMessage(
                    data.result.message || "Event updated successfully"
                );
                setFeedbackType("success");
                setTimeout(() => {
                    router.push("/admin-panel");
                }, 2000);
            } catch (error: any) {
                setFeedbackMessage(
                    error?.response?.data?.result?.message || "Update failed"
                );
                setFeedbackType("error");
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    useEffect(() => {
        if (event) {
            const eventDate = event.eventDate
                ? new Date(event.eventDate).toISOString().split("T")[0]
                : "";
            formik.resetForm({
                values: {
                    id: event.id,
                    name: event.name || "",
                    description: event.description || "",
                    category: event.category || "",
                    eventDate,
                    venue: event.venue || "",
                    price: event.price || 0,
                    imageUrl: event.imageUrl || "",
                },
            });
        }
    }, [event]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center py-12">
                <div className="bg-red-100 p-4 rounded-lg max-w-lg mx-auto">
                    <h2 className="text-xl font-semibold text-red-800">
                        Error
                    </h2>
                    <p className="text-red-600">
                        Failed to load event details. Please try again later.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <ProtectedRoute requiredRole="admin">
            <div className="max-w-5xl mx-auto px-6 py-10">
                <Card shadow="lg">
                    <CardHeader className="light:bg-gray-100 dark:border-gray-800  px-6 py-4 border-b border-gray-200">
                        <h1 className="text-3xl font-semibold light:text-gray-800 dark:text-gray-100">
                            Update Event
                        </h1>
                    </CardHeader>
                    <form onSubmit={formik.handleSubmit}>
                        <CardBody className="px-6 py-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Event Name"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={
                                        formik.touched.name &&
                                        Boolean(formik.errors.name)
                                    }
                                    errorMessage={
                                        formik.touched.name &&
                                        formik.errors.name
                                    }
                                    placeholder="Enter event name"
                                    radius="sm"
                                />
                                <Input
                                    label="Category"
                                    name="category"
                                    value={formik.values.category}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={
                                        formik.touched.category &&
                                        Boolean(formik.errors.category)
                                    }
                                    errorMessage={
                                        formik.touched.category &&
                                        formik.errors.category
                                    }
                                    placeholder="Enter category"
                                    radius="sm"
                                />
                                <Input
                                    label="Event Date"
                                    name="eventDate"
                                    type="date"
                                    value={formik.values.eventDate}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={
                                        formik.touched.eventDate &&
                                        Boolean(formik.errors.eventDate)
                                    }
                                    errorMessage={
                                        formik.touched.eventDate &&
                                        formik.errors.eventDate
                                    }
                                    radius="sm"
                                />
                                <Input
                                    label="Venue"
                                    name="venue"
                                    value={formik.values.venue}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={
                                        formik.touched.venue &&
                                        Boolean(formik.errors.venue)
                                    }
                                    errorMessage={
                                        formik.touched.venue &&
                                        formik.errors.venue
                                    }
                                    placeholder="Enter venue location"
                                    radius="sm"
                                />
                                <Input
                                    label="Price ($)"
                                    name="price"
                                    type="number"
                                    value={formik.values.price.toString()}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={
                                        formik.touched.price &&
                                        Boolean(formik.errors.price)
                                    }
                                    errorMessage={
                                        formik.touched.price &&
                                        formik.errors.price
                                    }
                                    placeholder="Enter price"
                                    radius="sm"
                                />
                            </div>
                            <Textarea
                                label="Description"
                                name="description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={
                                    formik.touched.description &&
                                    Boolean(formik.errors.description)
                                }
                                errorMessage={
                                    formik.touched.description &&
                                    formik.errors.description
                                }
                                placeholder="Enter event description"
                                radius="sm"
                                minRows={4}
                            />
                        </CardBody>

                        <Divider />

                        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 light:bg-gray-50 border-t border-gray-200 dark:border-gray-800">
                            <div className="w-full sm:w-auto">
                                <Button
                                    type="button"
                                    variant="light"
                                    radius="full"
                                    className="border border-gray-300"
                                    onPress={() => router.push("/admin-panel")}
                                >
                                    Cancel
                                </Button>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-end w-full sm:w-auto">
                                {feedbackMessage && (
                                    <p
                                        className={`text-sm ${
                                            feedbackType === "success"
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {feedbackMessage}
                                    </p>
                                )}
                                <Button
                                    type="submit"
                                    radius="full"
                                    className="bg-violet-800 hover:bg-violet-900 text-white"
                                    isLoading={isSubmitting}
                                    isDisabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? "Updating..."
                                        : "Update Event"}
                                </Button>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </ProtectedRoute>
    );
}
