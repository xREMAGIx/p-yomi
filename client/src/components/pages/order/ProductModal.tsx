import Button from "@client/components/atoms/Button";
import Icon from "@client/components/atoms/Icon";
import Text from "@client/components/atoms/Text";
import Modal from "@client/components/organisms/Modal";
import Table, {
  TableCell,
  TableHeader,
  TableRow,
} from "@client/components/organisms/Table";
import { ProductWithInventoryData } from "@server/models/product.model";
import { forwardRef, useImperativeHandle, useState } from "react";

const productModalHeaderData = [
  {
    id: "action",
    keyValue: "action",
    title: "Action",
  },
  {
    id: "name",
    keyValue: "name",
    title: "Name",
  },
  {
    id: "description",
    keyValue: "description",
    title: "Description",
  },
  {
    id: "barcode",
    keyValue: "barcode",
    title: "Barcode",
  },
  {
    id: "price",
    keyValue: "price",
    title: "Price",
  },
] as const;

interface ProductModalProps {
  children?: React.ReactNode;
  handleAddProduct?: (product: ProductWithInventoryData) => void;
}

export interface ProductModalRef {
  handleListProduct: (products: ProductWithInventoryData[]) => void;
  handleOpen: () => void;
}

export const ProductModal = forwardRef<ProductModalRef, ProductModalProps>(
  ({ handleAddProduct }, ref) => {
    //* States
    const [selectedProduct, setSelectedProduct] =
      useState<ProductWithInventoryData>();
    const [products, setProducts] = useState<ProductWithInventoryData[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    //* Functions
    const handleClose = () => {
      setIsOpen(false);
    };

    const handleProduct = (product: ProductWithInventoryData) => {
      if (!handleAddProduct) return;

      handleAddProduct(product);

      const updatedProducts = products.filter(
        (ele) => ele.id !== (selectedProduct ?? product).id
      );
      setProducts(updatedProducts);
      setSelectedProduct(undefined);

      if (!updatedProducts.length) {
        handleClose();
      }
    };

    //* Imperative hanlder
    useImperativeHandle(ref, () => ({
      handleListProduct: (newProducts) => {
        setProducts(newProducts);
      },
      handleOpen: () => {
        setSelectedProduct(undefined);
        setIsOpen(true);
      },
    }));

    return (
      <Modal isOpen={isOpen} handleClose={handleClose}>
        <div>
          <Table
            header={
              <TableHeader>
                <TableRow isHead>
                  {productModalHeaderData.map((ele) => (
                    <TableCell key={ele.id} isHead>
                      <span>{ele.title}</span>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>
            }
          >
            {products.map((product) => (
              <TableRow
                key={`row-${product.id}`}
                isSelected={product.id === selectedProduct?.id}
                onClick={() => setSelectedProduct(product)}
              >
                {productModalHeaderData.map((col) => {
                  const keyVal = col.keyValue;

                  if (keyVal === "action") {
                    return (
                      <TableCell key={`${product.id}-${keyVal}`}>
                        <Button
                          variant="icon"
                          modifiers={["inline"]}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProduct(product);
                          }}
                        >
                          <Icon iconName="plus" />
                        </Button>
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell key={`${product.id}-${keyVal}`}>
                      <Text type="span">{product[keyVal]}</Text>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </Table>
          <div className="u-m-t-16 u-d-flex u-flex-jc-end u-flex-ai-center">
            <Button
              variant="outlinePrimary"
              modifiers={["inline"]}
              onClick={handleClose}
            >
              Close
            </Button>
            <div className="u-m-l-8">
              <Button
                disabled={!selectedProduct}
                modifiers={["inline"]}
                onClick={() =>
                  selectedProduct && handleProduct(selectedProduct)
                }
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
);
