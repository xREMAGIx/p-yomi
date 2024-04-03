import Button from "@client/components/atoms/Button";
import Icon from "@client/components/atoms/Icon";
import Text from "@client/components/atoms/Text";
import Modal from "@client/components/organisms/Modal";
import Table, {
  TableCell,
  TableHeader,
  TableRow,
} from "@client/components/organisms/Table";
import { DATE_TIME_FORMAT } from "@client/libs/constants";
import { ProductData } from "@server/models/product.model";
import dayjs from "dayjs";
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
];

interface ProductModalProps {
  children?: React.ReactNode;
  handleAddProduct?: (product: ProductData) => void;
}

export interface ProductModalRef {
  handleListProduct: (products: ProductData[]) => void;
  handleOpen: () => void;
}

export const ProductModal = forwardRef<ProductModalRef, ProductModalProps>(
  ({ handleAddProduct }, ref) => {
    //* States
    const [selectedProduct, setSelectedProduct] = useState<ProductData>();
    const [products, setProducts] = useState<ProductData[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    //* Functions
    const handleClose = () => {
      setIsOpen(false);
    };

    const handleProduct = (product: ProductData) => {
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
                  const keyVal = col.keyValue as keyof typeof product;
                  const data = product[keyVal];

                  if (
                    keyVal === "createdAt" ||
                    keyVal === "updatedAt" ||
                    data instanceof Date
                  ) {
                    return (
                      <TableCell key={`${product.id}-${col.keyValue}`}>
                        <Text type="span">
                          {dayjs(data).format(DATE_TIME_FORMAT.DATE_TIME)}
                        </Text>
                      </TableCell>
                    );
                  }

                  if (col.keyValue === "action") {
                    return (
                      <TableCell key={`${product.id}-${col.keyValue}`}>
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
                    <TableCell key={`${product.id}-${col.keyValue}`}>
                      <Text type="span">{data}</Text>
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
