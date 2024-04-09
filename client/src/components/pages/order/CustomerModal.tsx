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
import { CustomerData } from "@server/models/customer.model";
import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";

const customerModalHeaderData = [
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
    id: "phone",
    keyValue: "phone",
    title: "Phone",
  },
  {
    id: "address",
    keyValue: "address",
    title: "Address",
  },
] as const;

interface FilterForm {
  name: string;
  phone: string;
  address: string;
}

interface CustomerModalProps {
  children?: React.ReactNode;
  handleAddCustomer?: (customer: CustomerData) => void;
}

export interface CustomerModalRef {
  handleListCustomer: (customers: CustomerData[]) => void;
  handleOpen: () => void;
}

export const CustomerModal = forwardRef<CustomerModalRef, CustomerModalProps>(
  ({ handleAddCustomer }, ref) => {
    //* States
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerData>();
    const [customers, setCustomers] = useState<CustomerData[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    //* Hook-form
    const filterMethods = useForm<FilterForm>({
      defaultValues: {
        name: "",
        phone: "",
        address: "",
      },
    });

    //* Functions
    const handleClose = () => {
      setIsOpen(false);
      filterMethods.reset();
    };

    const handleCustomer = (customer: CustomerData) => {
      if (!handleAddCustomer) return;

      handleAddCustomer(customer);

      const updatedCustomers = customers.filter(
        (ele) => ele.id !== (selectedCustomer ?? customer).id
      );
      setCustomers(updatedCustomers);
      setSelectedCustomer(undefined);

      handleClose();
    };

    //* Imperative hanlder
    useImperativeHandle(ref, () => ({
      handleListCustomer: (newCustomers) => {
        setCustomers(newCustomers);
      },
      handleOpen: () => {
        setSelectedCustomer(undefined);
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
                    {customerModalHeaderData.map((ele) => (
                      <TableCell key={ele.id} isHead>
                        <Text>{ele.title}</Text>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    {customerModalHeaderData.map((ele) => {
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
                                id={`goods-receipt-customer-filter-${ele.keyValue}`}
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
                customers={customers}
                handleCustomer={handleCustomer}
                selectedCustomer={selectedCustomer}
                handleSelectCustomer={setSelectedCustomer}
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
                disabled={!selectedCustomer}
                modifiers={["inline"]}
                onClick={() =>
                  selectedCustomer && handleCustomer(selectedCustomer)
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
  customers: CustomerData[];
  handleCustomer: (customer: CustomerData) => void;
  selectedCustomer?: CustomerData;
  handleSelectCustomer: (customer: CustomerData) => void;
}

const TableContent: React.FC<TableContentProps> = ({
  customers,
  handleCustomer,
  selectedCustomer,
  handleSelectCustomer,
}) => {
  //* Hook-form
  const filterMethods = useFormContext<FilterForm>();
  const filter = useWatch({ control: filterMethods.control });

  const filteredCustomers = useMemo(() => {
    let result = [...customers];
    const { name, phone, address } = filter;

    if (name) {
      result = result.filter((ele) =>
        ele.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    if (phone) {
      result = result.filter((ele) =>
        ele.phone?.toLowerCase().includes(phone.toLowerCase())
      );
    }

    if (address) {
      result = result.filter((ele) =>
        ele.address?.toLowerCase().includes(address.toLowerCase())
      );
    }

    return result;
  }, [customers, filter]);

  return (
    <>
      {filteredCustomers.map((customer) => (
        <TableRow
          key={`row-${customer.id}`}
          isSelected={customer.id === selectedCustomer?.id}
          onClick={() => handleSelectCustomer(customer)}
        >
          {customerModalHeaderData.map((col) => {
            const keyVal = col.keyValue;

            if (keyVal === "action") {
              return (
                <TableCell key={`${customer.id}-${keyVal}`}>
                  <Button
                    variant="icon"
                    modifiers={["inline"]}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCustomer(customer);
                    }}
                  >
                    <Icon iconName="plus" />
                  </Button>
                </TableCell>
              );
            }

            return (
              <TableCell key={`${customer.id}-${keyVal}`}>
                <Text type="span">{customer[keyVal]}</Text>
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </>
  );
};
