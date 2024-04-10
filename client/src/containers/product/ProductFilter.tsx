import Button from "@client/components/atoms/Button";
import Checkbox from "@client/components/atoms/Checkbox";
import Icon from "@client/components/atoms/Icon";
import Input from "@client/components/atoms/Input";
import Text from "@client/components/atoms/Text";
import Popper from "@client/components/molecules/Popper";
import { useTranslation } from "@client/libs/translation";
import { forwardRef, useImperativeHandle } from "react";
import { Controller, useForm } from "react-hook-form";

interface SearchForm {
  search: string;
}

interface ColumnType {
  id: string;
  keyValue: string;
  title: string;
  isShow: boolean;
}

interface ProductFilterProps<T> {
  columns?: T[];
  handleSearch?: (searchText: string) => void;
  handleChangeShowCol?: (column: T[]) => void;
}

export interface ProductFilterRef {}

function ProductFilterFnc<T extends ColumnType>(
  { columns, handleSearch, handleChangeShowCol }: ProductFilterProps<T>,
  ref: React.ForwardedRef<ProductFilterRef>
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
      if (ele.keyValue === keyValue) {
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
                <Text>Filter</Text>
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
              {columns?.map((ele) => (
                <Checkbox
                  key={ele.keyValue}
                  id={ele.keyValue}
                  checked={ele.isShow}
                  onChange={(e) => handleCheck(e, ele.keyValue)}
                >
                  <Text>{ele.title}</Text>
                </Checkbox>
              ))}
            </Popper>
          </div>
        </div>
      </div>
    </div>
  );
}

export const ProductFilter = forwardRef(ProductFilterFnc);
