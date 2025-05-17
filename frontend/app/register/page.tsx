"use client";
import { FormValues } from "@/interface/form";
import * as Yup from "yup";
import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "@/context/user-context";
import { useFormik } from "formik";
import { Input } from "@heroui/input";
import { Form } from "@heroui/form";
import { Button } from "@heroui/button";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/icons";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/react";
export default function Register() {
    let { setUserToken, setUserEmail } = useContext(UserContext);
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [feedbackType, setFeedbackType] = useState("success");
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    const router = useRouter();
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .matches(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                "Invalid email format"
            )
            .required("Email is required"),
        password: Yup.string()
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
            )
            .required("Password is required"),
    });
    async function handleSubmit(formValues: FormValues) {
        try {
            const { data } = await axios.post("api/auth/register", {
                email: formValues.email,
                password: formValues.password,
            });
            setUserToken(data.result.data.access_token);
            localStorage.setItem("userToken", data.result.data.access_token);
            localStorage.setItem("userEmail", data.result.data.user.email);
            setUserEmail(data.result.data.user.email);
            setFeedbackMessage(data.result.message);
            setFeedbackType("success");
            router.push("/");
        } catch (error: any) {
            setFeedbackMessage(
                error?.response?.data?.result?.message || "Registration failed"
            );
            setFeedbackType("error");
        }
    }
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema,
        onSubmit: handleSubmit,
    });

    return (
        <>
            <div className="flex h-screen items-center justify-center">
                <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <h1 className="text-xl font-semibold mb-2">
                        Discover.Learn.Create.
                    </h1>
                    <h1 className="text-xl font-medium text-gray-400 mb-8">
                        Create your account in Workshoply
                    </h1>
                    {feedbackMessage && (
                        <div
                            className={`mb-4 p-3 rounded ${feedbackType === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                        >
                            {feedbackMessage}
                        </div>
                    )}
                    <Form onSubmit={formik.handleSubmit}>
                        <Input
                            className="mb-4"
                            size="md"
                            isRequired
                            label="Email"
                            placeholder="Enter your email"
                            labelPlacement="outside"
                            type="email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            errorMessage={formik.errors.email}
                            isInvalid={
                                formik.touched.email &&
                                Boolean(formik.errors.email)
                            }
                        ></Input>
                        <Input
                            size="md"
                            isRequired
                            label="Password"
                            type={isVisible ? "text" : "password"}
                            name="password"
                            labelPlacement="outside"
                            placeholder="Enter your password"
                            className="mb-2 w-full"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            errorMessage={formik.errors.password}
                            isInvalid={
                                formik.touched.password &&
                                Boolean(formik.errors.password)
                            }
                            endContent={
                                <button
                                    aria-label="toggle password visibility"
                                    className="focus:outline-none"
                                    type="button"
                                    onClick={toggleVisibility}
                                >
                                    {isVisible ? (
                                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    ) : (
                                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    )}
                                </button>
                            }
                        />
                        <Button
                            isLoading={formik.isSubmitting}
                            type="submit"
                            className="bg-violet-800 w-full text-white"
                        >
                            Register
                        </Button>
                    </Form>
                </div>
            </div>
        </>
    );
}
