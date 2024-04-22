type NonNullable<T> = Exclude<T, null>; // Remove null and undefined from T
type NoNullableField<T> = {
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GetElementType<T extends any[]> = T extends (infer U)[] ? U : never;
export type Keys<T> = [keyof T][];

interface WithForwardRefType extends React.FC<WithForwardRefProps<Option>> {
  <T extends Option>(
    props: WithForwardRefProps<T>
  ): ReturnType<React.FC<WithForwardRefProps<T>>>;
}
