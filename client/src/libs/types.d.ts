type NonNullable<T> = Exclude<T, null>; // Remove null and undefined from T
type NoNullableField<T> = {
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>;
};
