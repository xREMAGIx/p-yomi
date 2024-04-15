import Input from "@client/components/atoms/Input";
import TextArea from "@client/components/atoms/TextArea";
import Select from "@client/components/molecules/Select";
import { FORM_VALIDATION } from "@client/libs/constants";
import { useTranslation } from "@client/libs/translation";
import { ProductStatus, ProductStatusCode } from "@server/models/product.model";
import React, { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";

export interface ProductInfoForm {
  name: string;
  barcode: string;
  price: number;
  costPrice: number;
  description: string;
  status: {
    value: number;
    label: string;
  };
}

interface InfoFormProps {}

const InfoForm: React.FC<InfoFormProps> = () => {
  //* Hooks
  const { t } = useTranslation();

  //* States

  //* Refs

  //* Hook-form
  const methods = useFormContext<ProductInfoForm>();

  //* Memos
  const productStatusList = useMemo(() => {
    return Object.keys(ProductStatus).map((key) => ({
      label: t(`product.${ProductStatus[key as keyof typeof ProductStatus]}`),
      value: ProductStatusCode[key as keyof typeof ProductStatus],
    }));
  }, [t]);

  //* Effects

  return (
    <div className="c-product_infoForm">
      <div className="u-m-t-16">
        <Controller
          control={methods.control}
          name="name"
          defaultValue={""}
          rules={{
            required: FORM_VALIDATION.REQUIRED,
          }}
          render={({ field, fieldState: { error } }) => (
            <Input
              id="product-info-name"
              label={t("product.name")}
              {...field}
              error={error?.message}
            />
          )}
        />
      </div>
      <div className="u-m-t-8">
        <Controller
          control={methods.control}
          name="barcode"
          defaultValue={""}
          rules={{
            required: FORM_VALIDATION.REQUIRED,
          }}
          render={({ field, fieldState: { error } }) => (
            <Input
              id="product-info-barcode"
              label={t("product.barcode")}
              {...field}
              value={field.value ?? ""}
              error={error?.message}
            />
          )}
        />
      </div>
      <div className="u-m-t-8">
        <Controller
          control={methods.control}
          name="description"
          defaultValue={""}
          rules={{
            required: FORM_VALIDATION.REQUIRED,
          }}
          render={({ field, fieldState: { error } }) => (
            <TextArea
              id="product-info-description"
              label={t("product.description")}
              rows={2}
              {...field}
              value={field.value ?? ""}
              error={error?.message}
            />
          )}
        />
      </div>
      <div className="u-m-t-8">
        <Controller
          control={methods.control}
          name="price"
          defaultValue={0}
          rules={{
            required: FORM_VALIDATION.REQUIRED,
          }}
          render={({ field, fieldState: { error } }) => (
            <Input
              id="product-info-price"
              label={t("product.price")}
              {...field}
              error={error?.message}
            />
          )}
        />
      </div>
      <div className="u-m-t-8">
        <Controller
          control={methods.control}
          name="costPrice"
          defaultValue={0}
          rules={{
            required: FORM_VALIDATION.REQUIRED,
          }}
          render={({ field, fieldState: { error } }) => (
            <Input
              id="product-info-costPrice"
              label={t("product.costPrice")}
              {...field}
              error={error?.message}
            />
          )}
        />
      </div>
      <div className="u-m-t-8">
        <Controller
          control={methods.control}
          name="status"
          defaultValue={productStatusList[0]}
          rules={{
            required: FORM_VALIDATION.REQUIRED,
          }}
          render={({
            field: { value, onBlur, onChange },
            fieldState: { error },
          }) => (
            <Select
              id="product-info-status"
              label={t("product.status")}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              options={productStatusList}
              error={error?.message}
            />
          )}
        ></Controller>
      </div>
    </div>
  );
};

InfoForm.defaultProps = {};

export default InfoForm;
