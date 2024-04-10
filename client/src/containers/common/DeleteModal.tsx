import Button from "@client/components/atoms/Button";
import Heading from "@client/components/atoms/Heading";
import Text from "@client/components/atoms/Text";
import Modal from "@client/components/organisms/Modal";
import { forwardRef, useImperativeHandle, useState } from "react";

interface DeleteModalProps {
  isLoading?: boolean;
  handleDelete: (props: { id: number }) => void;
}

export interface DeleteModalRef {
  handleOpen: (props: { id: number }) => void;
  handleClose: () => void;
}

export const DeleteModal = forwardRef<DeleteModalRef, DeleteModalProps>(
  ({ isLoading, handleDelete }, ref) => {
    //* States
    const [deleteModal, setDeleteModal] = useState({
      isOpen: false,
      id: -1,
    });

    //* Functions
    const handleOpen = (id: number) => {
      setDeleteModal({ isOpen: true, id });
    };

    const handleClose = () => {
      setDeleteModal({ isOpen: false, id: -1 });
    };

    const handlePressDelete = () => {
      if (handleDelete) handleDelete({ id: deleteModal.id });
    };

    //* Imperative hanlder
    useImperativeHandle(ref, () => ({
      handleOpen: ({ id }) => {
        handleOpen(id);
      },
      handleClose: handleClose,
    }));

    return (
      <Modal
        isOpen={deleteModal.isOpen}
        handleClose={handleClose}
        headerComponent={
          <Heading type="h6" modifiers={["24x32"]}>
            Delete
          </Heading>
        }
      >
        <Text>Are you sure you want to delete this record?</Text>
        <div className="u-d-flex u-flex-jc-end u-flex-ai-center">
          <Button
            variant="outlinePrimary"
            modifiers={["inline"]}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <div className="u-m-l-8">
            <Button
              isLoading={isLoading}
              modifiers={["inline"]}
              onClick={handlePressDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
);
