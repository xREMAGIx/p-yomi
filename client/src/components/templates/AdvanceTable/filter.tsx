import Button from "@client/components/atoms/Button";
import Checkbox from "@client/components/atoms/Checkbox";
import Icon from "@client/components/atoms/Icon";
import Input from "@client/components/atoms/Input";
import Radio from "@client/components/atoms/Radio";
import Text from "@client/components/atoms/Text";
import Popper from "@client/components/molecules/Popper";
import { useTranslation } from "@client/libs/translation";
import { forwardRef, useImperativeHandle } from "react";
import { Controller, useForm } from "react-hook-form";
import { AdvanceTableColumnType, SearchForm, SortForm } from "./types";
import { WithForwardRefType } from "@client/libs/types";

interface TableFilterProps<T> {
  columns?: AdvanceTableColumnType<T>[];
  sortKeys?: string[];
  handleSearch?: (searchText: string) => void;
  handleChangeShowCol?: (column: AdvanceTableColumnType<T>[]) => void;
  handleSort?: (form: SortForm) => void;
}

export interface TableFilterRef {}

function TableFilterFnc<T>(
  {
    columns,
    sortKeys,
    handleSearch,
    handleChangeShowCol,
    handleSort,
  }: TableFilterProps<T>,
  ref: React.ForwardedRef<TableFilterRef>
) {
  //* Hooks
  const { t } = useTranslation();

  //* States

  //* Refs

  //* Hook-form
  const searchMethods = useForm<SearchForm>();

  //* Query

  //* Mutations

  //* Functions
  const handleSearchForm = (form: SearchForm) => {
    if (!handleSearch || !form.search) return;

    handleSearch(form.search);
  };

  const handleToggleFilter = () => {};

  const handleCheck = (
    e: React.ChangeEvent<HTMLInputElement>,
    keyValue: string
  ) => {
    if (!handleChangeShowCol || !columns) return;

    const modifyCols = columns.map((ele) => {
      if (ele.colKeyValue === keyValue) {
        return {
          ...ele,
          isShow: e.target.checked,
        };
      }
      return ele;
    });

    handleChangeShowCol(modifyCols);
  };

  //* Imperative hanlder
  useImperativeHandle(ref, () => ({}));

  return (
    <div className="c-product_productFilter">
      <div className="u-d-flex u-flex-jc-between u-flex-ai-center">
        <div className="c-product_productFilter_search">
          <form onSubmit={searchMethods.handleSubmit(handleSearchForm)}>
            <Controller
              control={searchMethods.control}
              name="search"
              render={({ field, fieldState: { error } }) => (
                <Input
                  id="product-filter-search"
                  placeholder={t("action.search")}
                  {...field}
                  error={error?.message}
                />
              )}
            />
          </form>
        </div>
        <div className="c-product_productFilter_actions u-d-flex u-flex-ai-center">
          <div className="c-product_productFilter_filter u-m-r-8">
            <Button variant="outlinePrimary" onClick={handleToggleFilter}>
              <div className="u-d-flex u-flex-ai-center">
                <div className="u-m-r-8">
                  <Icon iconName="filter" />
                </div>
                <Text>{t("action.filter")}</Text>
              </div>
            </Button>
          </div>
          <div className="c-product_productFilter_visual">
            <Popper
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              toggleEl={
                <Button
                  variant="outlinePrimary"
                  modifiers={["inline", "round"]}
                >
                  <Icon iconName="eyeConfig" />
                </Button>
              }
              customContentClass="u-m-t-8"
            >
              {columns?.map((ele) => {
                const keyVal = String(ele.colKeyValue);

                return (
                  <Checkbox
                    key={`checkbox-${keyVal}`}
                    id={keyVal}
                    checked={ele.isShow ?? false}
                    onChange={(e) => handleCheck(e, keyVal)}
                  >
                    <Text>{t(`table.${keyVal}`)}</Text>
                  </Checkbox>
                );
              })}
            </Popper>
          </div>
          {columns && sortKeys && (
            <div className="c-product_productFilter_sort  u-m-l-8">
              <SortFilter
                options={columns.filter((ele) =>
                  sortKeys?.includes(String(ele.colKeyValue))
                )}
                handleSort={(f) => handleSort && handleSort(f)}
              />
            </div>
          )}
        </div>
      </div>
      <div className="u-m-t-16 u-c-divider-horizontal" />
    </div>
  );
}

export const TableFilter: WithForwardRefType = forwardRef(TableFilterFnc);

interface SortFilterProps<T> {
  options: AdvanceTableColumnType<T>[];
  handleSort: (form: SortForm) => void;
}

const SortFilter = <T,>({ options, handleSort }: SortFilterProps<T>) => {
  //* Hooks
  const { t } = useTranslation();

  //* States

  //* Hook-form
  const sortMethods = useForm<SortForm>({
    defaultValues: {
      sortBy: "createdAt",
      sortOrder: "desc",
    },
  });

  return (
    <Popper
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      toggleEl={
        <Button variant="outlinePrimary" modifiers={["inline", "round"]}>
          <Icon iconName="sort" />
        </Button>
      }
      customContentClass="u-m-t-8"
    >
      <div className="u-m-b-4">
        <Text type="span">{t("action.sortBy")}</Text>
      </div>
      <Controller
        control={sortMethods.control}
        name="sortBy"
        render={({ field: { value, onChange } }) => (
          <>
            {options.map((ele) => {
              const keyVal = String(ele.colKeyValue);
              return (
                <Radio
                  key={keyVal}
                  id={keyVal}
                  label={t(`table.${keyVal}`)}
                  checked={keyVal === value}
                  onChange={(e) => e.target.checked && onChange(keyVal)}
                />
              );
            })}
          </>
        )}
      />
      <div className="u-m-y-8 u-c-divider-horizontal" />
      <div className="u-m-b-4">
        <Text type="span">{t("action.sortOrder")}</Text>
      </div>
      <Controller
        control={sortMethods.control}
        name="sortOrder"
        render={({ field: { value, onChange } }) => (
          <>
            {["asc", "desc"].map((ele) => (
              <Radio
                key={`api-sort-${ele}`}
                id={`api-sort-${ele}`}
                label={t(`action.${ele}Order`)}
                checked={ele === value}
                onChange={(e) => e.target.checked && onChange(ele)}
              />
            ))}
          </>
        )}
      />
      <div className="u-m-t-8">
        <Button onClick={sortMethods.handleSubmit(handleSort)}>
          {t("action.sort")}
        </Button>
      </div>
    </Popper>
  );
};
