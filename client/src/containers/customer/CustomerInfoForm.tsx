import Input from "@client/components/atoms/Input";
import TextArea from "@client/components/atoms/TextArea";
import Datepicker from "@client/components/molecules/DatePicker";
import { FORM_VALIDATION, REGEX } from "@client/libs/constants";
import { Controller, useFormContext } from "react-hook-form";

export const CustomerInfoForm: React.FC = () => {
  const methods = useFormContext();

  return (
    <>
      <Controller
        control={methods.control}
        name="name"
        rules={{
          required: FORM_VALIDATION.REQUIRED,
        }}
        render={({ field, fieldState: { error } }) => (
          <Input
            id="customer-info-name"
            label="Name"
            {...field}
            value={field.value ?? ""}
            error={error?.message}
          />
        )}
      />
      <div className="u-m-t-16">
        <Controller
          control={methods.control}
          name="phone"
          rules={{
            required: FORM_VALIDATION.REQUIRED,
            validate: {
              isValidPhone: (value) => {
                const phoneReg = new RegExp(REGEX.PHONE);

                if (!phoneReg.test(value)) {
                  return FORM_VALIDATION.PHONE_INVALID;
                }
                return true;
              },
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <Input
              id="customer-info-phone"
              label="Phone"
              {...field}
              value={field.value ?? ""}
              error={error?.message}
            />
          )}
        />
      </div>
      <div className="u-m-t-16">
        <Controller
          control={methods.control}
          name="address"
          render={({ field, fieldState: { error } }) => (
            <TextArea
              id="customer-info-address"
              label="Address"
              rows={2}
              {...field}
              value={field.value ?? ""}
              error={error?.message}
            />
          )}
        />
      </div>
      <div className="u-m-t-16">
        <Controller
          control={methods.control}
          name="email"
          rules={{
            validate: {
              isEmail: (value) => {
                if (!value) return;
                const reg = new RegExp(REGEX.EMAIL);
                if (!reg.test(value)) {
                  return FORM_VALIDATION.EMAIL_INVALID;
                }
                return true;
              },
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <Input
              id="customer-info-email"
              label="Email"
              {...field}
              value={field.value ?? ""}
              error={error?.message}
            />
          )}
        />
      </div>
      <div className="u-m-t-16">
        <Controller
          control={methods.control}
          name="dateOfBirth"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <Datepicker
              id="customer-info-dateOfBirth"
              label="Date of birth"
              value={value}
              handleChangeDate={onChange}
              error={error?.message}
            />
          )}
        />
      </div>
    </>
  );
};
