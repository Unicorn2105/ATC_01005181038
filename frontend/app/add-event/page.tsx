"use client";
import { UserContext } from "@/context/user-context";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Input,
    Textarea,
    Divider,
} from "@heroui/react";
import axios from "axios";
import * as Yup from "yup";
import { Input as ShadcnInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud } from "lucide-react";
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

export default function AddEventPage() {
    const router = useRouter();
    const { userToken } = useContext(UserContext);
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [feedbackType, setFeedbackType] = useState("success");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const formik = useFormik({
        initialValues: {
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
                const formData = new FormData();
                if (imageFile) {
                    formData.append("image", imageFile);
                }
                const eventDate = new Date(formValues.eventDate)
                    .toISOString()
                    .split("T")[0];
                formData.append("name", formValues.name);
                formData.append("description", formValues.description);
                formData.append("category", formValues.category);
                formData.append("eventDate", eventDate);
                formData.append("venue", formValues.venue);
                formData.append("price", formValues.price.toString());
                const requestConfig = {
                    ...config,
                    headers: {
                        ...config.headers,
                        "Content-Type": "multipart/form-data",
                    },
                };
                const { data } = await axios.post(
                    "/api/event",
                    formData,
                    requestConfig
                );
                setFeedbackMessage(
                    data.result.message || "Event created successfully"
                );
                setFeedbackType("success");
                setTimeout(() => {
                    router.push("/admin-panel");
                }, 2000);
            } catch (error: any) {
                setFeedbackMessage(
                    error?.response?.data?.result?.message || "Creation failed"
                );
                setFeedbackType("error");
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <ProtectedRoute requiredRole="admin">
            <div className="max-w-5xl mx-auto px-6 py-10">
                <Card shadow="lg">
                    <CardHeader className="light:bg-gray-100 dark:border-gray-800 px-6 py-4 border-b border-gray-200">
                        <h1 className="text-3xl font-semibold light:text-gray-800 dark:text-gray-100">
                            Add New Event
                        </h1>
                    </CardHeader>
                    <form onSubmit={formik.handleSubmit}>
                        <CardBody className="px-6 py-8 space-y-6">
                            <div className="w-full space-y-2">
                                <Label htmlFor="event-image">Event Image</Label>
                                <div className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer light:bg-gray-50 light:hover:bg-gray-100 transition-colors">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        {imagePreview ? (
                                            <div className="relative w-full max-w-md">
                                                <img
                                                    src={imagePreview}
                                                    alt="Event preview"
                                                    className="w-full h-auto rounded-md object-cover max-h-60"
                                                />
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="light"
                                                    className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full"
                                                    onPress={() => {
                                                        setImageFile(null);
                                                        setImagePreview(null);
                                                    }}
                                                >
                                                    Change
                                                </Button>
                                            </div>
                                        ) : (
                                            <>
                                                <UploadCloud className="h-10 w-10 text-gray-400" />
                                                <p className="text-sm text-gray-600">
                                                    Click or drag and drop to
                                                    upload an event image
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    PNG, JPG, or WEBP (max. 5MB)
                                                </p>
                                            </>
                                        )}
                                        <ShadcnInput
                                            id="event-image"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                        {!imagePreview && (
                                            <Button
                                                type="button"
                                                variant="light"
                                                className="mt-2"
                                                onPress={() => {
                                                    document
                                                        .getElementById(
                                                            "event-image"
                                                        )
                                                        ?.click();
                                                }}
                                            >
                                                Select File
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>

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
                                        ? "Creating..."
                                        : "Create Event"}
                                </Button>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </ProtectedRoute>
    );
}
