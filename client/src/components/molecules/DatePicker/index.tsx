import React from "react";
import "react-calendar/dist/Calendar.css";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "./index.scss";
import { mapModifiers } from "@client/libs/functions";

export type RangeDateTypes = {
  date: Date;
};

interface DatePickerProps {
  id: string;
  handleChangeDate: (date?: Date) => void;
  label?: string;
  error?: string;
  required?: boolean;
  modifiers?: "default" | "transparent";
  maxDate?: Date;
  minDate?: Date;
  value?: Date | null;
}

const Datepicker: React.FC<DatePickerProps> = ({
  id,
  handleChangeDate,
  label,
  error,
  required,
  modifiers,
  maxDate,
  minDate,
  value,
}) => {
  return (
    <>
      {label && (
        <div className={mapModifiers("m-datePicker_label", modifiers)}>
          <label htmlFor={id}>
            {label}
            {required && <span className="m-datePicker_label-required">*</span>}
          </label>
        </div>
      )}
      <div
        className={mapModifiers("m-datePicker", error && "error", modifiers)}
      >
        <div className="m-datePicker_wrapper">
          <DatePicker
            id={`wrapper_${id}`}
            className={"m-datePicker_input"}
            value={value}
            onChange={(val) => {
              if (!Array.isArray(val)) {
                if (val) handleChangeDate(val);
              }
            }}
            format="dd/MM/y"
            maxDate={maxDate}
            minDate={minDate}
          />
        </div>
      </div>
      {error && <span className={"m-datePicker_error"}>{error}</span>}
    </>
  );
};

Datepicker.defaultProps = {
  error: "",
  label: "",
  required: false,
  modifiers: undefined,
  maxDate: undefined,
  minDate: undefined,
  value: undefined,
};

export default Datepicker;
