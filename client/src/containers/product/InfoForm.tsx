import Input from "@client/components/atoms/Input";
import TextArea from "@client/components/atoms/TextArea";
import { FORM_VALIDATION } from "@client/libs/constants";
import { useTranslation } from "@client/libs/translation";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

export interface ProductInfoForm {
  name: string;
  barcode: string;
  price: number;
  description: string;
}

interface InfoFormProps {}

const InfoForm: React.FC<InfoFormProps> = () => {
  //* Hooks
  const { t } = useTranslation();

  //* States

  //* Refs

  //* Hook-form
  const methods = useFormContext<ProductInfoForm>();

  //* Effects

  return (
    <div className="c-product_infoForm">
      <div className="u-m-t-16">
        <Controller
          control={methods.control}
          name="name"
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
    </div>
  );
};

InfoForm.defaultProps = {};

export default InfoForm;
