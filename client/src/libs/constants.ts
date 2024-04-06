export const FORM_VALIDATION = {
  REQUIRED: "Required",
  EMAIL_INVALID: "Invalid email",
  RE_PASSWORD_UNMATCH: "Password unmatch",
  PHONE_INVALID: "Invalid phone",
};

export const AUTHEN_TOKENS = {
  ACCESS: "yomi-token-access",
  REFRESH: "yomi-token-refresh",
};

export const DEFAULT_PAGINATION = {
  LIMIT: 10,
  PAGE: 1,
};

export const DATE_TIME_FORMAT = {
  DATE: "DD/MM/YYYY",
  DATE_TIME: "DD/MM/YYYY HH:mm",
};

export const DEFAULT_QUERY_OPTION = {
  retry: 0,
  refetchOnMount: true,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
};

export const REGEX = {
  EMAIL: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
  PHONE: "(84|0[3|5|7|8|9])+([0-9]{8})\\b",
};

export const TOAST_SUCCESS_MESSAGE = {
  CREATE: "Create success!",
  UPDATE: "Update success!",
};

export const TOAST_ERROR_MESSAGE = {
  CREATE: "Create error!",
  UPDATE: "Update error!",
  CUSTOMER_NOT_FOUND: "Not found any customer with this name or phone!",
};