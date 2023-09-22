import { TablePagination } from "@mui/material";
import { useState } from "react";

const Pagination = ({
  handleChangePage,
  handleChangeRowsPerPage,
  totalCount = 0,
}: any) => {
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const onHandleChangePage = (event: unknown, newPage: number) => {
    handleChangePage(newPage);
    setPage(newPage);
    return newPage;
  };
  const onHandleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let _rowsPerPage = event.target.value;
    handleChangeRowsPerPage(_rowsPerPage);
    setRowsPerPage(parseInt(_rowsPerPage));
  };

  return (
    <TablePagination
      rowsPerPageOptions={[2, 5, 10, 25, 100]}
      component="div"
      count={totalCount}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={onHandleChangePage}
      onRowsPerPageChange={onHandleChangeRowsPerPage}
    />
  );
};

export default Pagination;
