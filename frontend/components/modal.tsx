"use client";
import {
    Button,
    Link,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@heroui/react";
import { RiLockLine } from "react-icons/ri";

interface LoginModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
}

export default function ModalComponent({
    isOpen,
    onOpenChange,
}: LoginModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            backdrop="blur"
            className="bg-gradient-to-b from-white to-purple-50"
            motionProps={{
                initial: { opacity: 0, scale: 0.9 },
                animate: { opacity: 1, scale: 1 },
                exit: { opacity: 0, scale: 0.95 },
                transition: { duration: 0.3 },
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col items-center gap-1">
                            <div className="bg-violet-100 p-3 rounded-full mb-2">
                                <RiLockLine
                                    size={28}
                                    className="text-violet-800"
                                />
                            </div>
                            <h2 className="text-xl font-bold text-center">
                                Account Required
                            </h2>
                        </ModalHeader>
                        <ModalBody className="py-4 px-6 text-center">
                            <p className="text-gray-600">
                                You need to be logged in to book this exciting
                                event.
                            </p>
                            <p className="mt-2 text-gray-600">
                                Please sign in to your account or create a new
                                one to continue.
                            </p>
                        </ModalBody>
                        <ModalFooter className="flex flex-col gap-2 pb-6">
                            <Link href="/login" className="w-full">
                                <Button
                                    className="bg-violet-800 text-white w-full font-medium py-2"
                                    size="lg"
                                >
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/register" className="w-full">
                                <Button
                                    className="bg-white text-violet-800 border border-violet-300 w-full font-medium py-2"
                                    size="lg"
                                >
                                    Create Account
                                </Button>
                            </Link>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
