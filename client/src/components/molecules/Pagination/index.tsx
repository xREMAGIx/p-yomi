import Icon from "@client/components/atoms/Icon";
import { mapModifiers } from "@client/libs/functions";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import "./index.scss";

type Modifiers = "textSizeSm";

interface PaginationProps {
  totalPage: number;
  currentPage?: number;
  marginPagesDisplayed?: number;
  pageRangeDisplayed?: number;
  getPageNumber: (val: number) => void;
  modifiers?: Modifiers[];
}

const Pagination: React.FC<PaginationProps> = ({
  totalPage,
  marginPagesDisplayed,
  pageRangeDisplayed,
  getPageNumber,
  currentPage,
  modifiers,
}: PaginationProps) => {
  const [pageActive, setPageActive] = useState(0);

  const handlePageClick = (selectedItem: { selected: number }) => {
    const { selected } = selectedItem;
    getPageNumber(selected + 1);
  };

  useEffect(() => {
    setPageActive(currentPage ? currentPage - 1 : 0);
  }, [currentPage]);

  return (
    <ReactPaginate
      previousLabel={<Icon iconName="arrowLeft" size="16" />}
      nextLabel={<Icon iconName="arrowRight" size="16" />}
      breakLabel="..."
      breakClassName="break-me"
      pageCount={totalPage}
      forcePage={pageActive}
      marginPagesDisplayed={marginPagesDisplayed!}
      pageRangeDisplayed={pageRangeDisplayed!}
      onPageChange={handlePageClick}
      containerClassName="o-pagination"
      pageClassName="o-pagination_page"
      previousClassName={`${mapModifiers("o-pagination_prev", modifiers)} o-pagination_page`}
      nextClassName={`${mapModifiers("o-pagination_next", modifiers)} o-pagination_page`}
      activeClassName="o-pagination_page-active"
      disabledClassName="disabled"
    />
  );
};

Pagination.defaultProps = {
  marginPagesDisplayed: 1,
  pageRangeDisplayed: 2,
  currentPage: 1,
  modifiers: ["textSizeSm"],
};

export default Pagination;
