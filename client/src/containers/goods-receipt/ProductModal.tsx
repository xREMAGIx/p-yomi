import Button from "@client/components/atoms/Button";
import Icon from "@client/components/atoms/Icon";
import Input from "@client/components/atoms/Input";
import Text from "@client/components/atoms/Text";
import Modal from "@client/components/organisms/Modal";
import Table, {
  TableCell,
  TableHeader,
  TableRow,
} from "@client/components/organisms/Table";
import { ProductData } from "@server/models/product.model";
import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";

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

interface FilterForm {
  name: string;
  description: string;
  barcode: string;
  price: string;
}

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

    //* Hook-form
    const filterMethods = useForm<FilterForm>({
      defaultValues: {
        name: "",
        description: "",
        barcode: "",
        price: "",
      },
    });

    //* Functions
    const handleClose = () => {
      setIsOpen(false);
      filterMethods.reset();
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
      <Modal
        isOpen={isOpen}
        handleClose={handleClose}
        modifier={["noMaxWidth"]}
      >
        <div>
          <FormProvider {...filterMethods}>
            <Table
              header={
                <TableHeader>
                  <TableRow isHead>
                    {productModalHeaderData.map((ele) => (
                      <TableCell key={ele.id} isHead>
                        <Text>{ele.title}</Text>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    {productModalHeaderData.map((ele) => {
                      if (ele.keyValue === "action") {
                        return <TableCell key={ele.id}></TableCell>;
                      }
                      return (
                        <TableCell key={ele.id}>
                          <Controller
                            control={filterMethods.control}
                            name={ele.keyValue}
                            defaultValue={""}
                            render={({ field, fieldState: { error } }) => (
                              <Input
                                id={`goods-receipt-product-filter-${ele.keyValue}`}
                                {...field}
                                error={error?.message}
                              />
                            )}
                          />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHeader>
              }
            >
              <TableContent
                products={products}
                handleProduct={handleProduct}
                selectedProduct={selectedProduct}
                handleSelectProduct={setSelectedProduct}
              />
            </Table>
          </FormProvider>
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

interface TableContentProps {
  products: ProductData[];
  handleProduct: (product: ProductData) => void;
  selectedProduct?: ProductData;
  handleSelectProduct: (product: ProductData) => void;
}

const TableContent: React.FC<TableContentProps> = ({
  products,
  handleProduct,
  selectedProduct,
  handleSelectProduct,
}) => {
  //* Hook-form
  const filterMethods = useFormContext<FilterForm>();
  const filter = useWatch({ control: filterMethods.control });

  const filteredProducts = useMemo(() => {
    let result = [...products];
    const { name, description, barcode, price } = filter;

    if (name) {
      result = result.filter((ele) =>
        ele.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    if (description) {
      result = result.filter((ele) =>
        ele.description?.toLowerCase().includes(description.toLowerCase())
      );
    }

    if (barcode) {
      result = result.filter((ele) =>
        ele.barcode?.toLowerCase().includes(barcode.toLowerCase())
      );
    }

    if (price) {
      result = result.filter((ele) =>
        ele.price.toString().includes(price.toString())
      );
    }

    return result;
  }, [products, filter]);

  return (
    <>
      {filteredProducts.map((product) => (
        <TableRow
          key={`row-${product.id}`}
          isSelected={product.id === selectedProduct?.id}
          onClick={() => handleSelectProduct(product)}
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
    </>
  );
};
