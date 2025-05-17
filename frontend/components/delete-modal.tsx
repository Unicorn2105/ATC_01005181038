import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@heroui/react";

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
}
export default function DeleteModal({
    isOpen,
    onClose,
    onDelete,
}: DeleteModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    Confirm Deletion
                </ModalHeader>
                <ModalBody>
                    <p>
                        Are you sure you want to delete this event? This action
                        cannot be undone.
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button variant="flat" color="default" onPress={onClose}>
                        Cancel
                    </Button>
                    <Button color="danger" onPress={onDelete}>
                        Delete
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
