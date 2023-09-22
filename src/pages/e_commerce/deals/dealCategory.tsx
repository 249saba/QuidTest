import ShellContainer from "@src/containers/shellContainer";
import CustomCard from "@src/shared/cards/customCard";
import CustomButton from "@src/shared/customButton";
import Input from "@src/shared/input";
import LazyImage from "@src/shared/lazyImage";
import { AddDealCategory, CategryModel } from "@src/shared/models";
import { Table } from "@src/shared/table/table";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import { useEffect, useState } from "react";
import { handleToastMessage } from "@src/shared/toastify";
import { CiSearch } from "react-icons/ci";
import Checkbox from "@src/shared/checkbox/checkbox";
import { FiSearch } from "react-icons/fi";
import TestImg from "@assets/images/Food.png";
import Switch from "@mui/material/Switch";
import MoreIcon from "@assets/vendor/icons/more.png";
import {
  Breadcrumbs,
  Button,
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import { Spinner } from "@src/shared/spinner/spinner";
import Pagination from "@src/shared/table/pagination";
import { Ifilters } from "@src/shared/interfaces";
import { getCategoriesById } from "@src/shared/apiService";
import { Link, useNavigate } from "react-router-dom";
import "@src/index.scss";

const AllCategory = ({
  categoryData,
  handleSelectCategory,
  handleModel,
  handleOpenDealCategory,
  selectedCat,
  category,
}: any) => {
  const [productsList, setProductsList] = useState([]) as any;
  const [categoryName, setCategoryName] = useState() as any;
  const [selectedCategory, setselectedCategory] = useState([]) as any;
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [isMandatory, setIsMandatory] = useState(true);
  const navigate = useNavigate();

  const [filterValue, setFilterValue] = useState<Ifilters>({
    searchValue: "",
    offset: 0,
    limit: 10,
    order: "asc",
  });
  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getProducts();
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [filterValue]);
 

  const getProducts = () => {
    let id = localStorage.getItem("id");
    setIsLoading(true);
    console.log(filterValue);
    backendCall({
      url: `/api/vendor/deals/products_by_category/${id}`,
      method: "GET",
      dataModel: AddDealCategory,
    }).then((res) => {
      if (res && !res.error) {
        setProductsList(res.data);
        if (res.data.length > 0) {
          setCategoryName(res?.data[0]?.Category_name);
        } else {
          setCategoryName(category);
        }

        let selected_all_product_arr = [...categoryData];
        console.log("selected_arr", selected_all_product_arr);
        let selected_all_product_arr_index = selected_all_product_arr.findIndex(
          (item_category: any, index) => {
            return (
              item_category.category_id == res?.data[0]?.category_id &&
              item_category.all_products_selected == 0
            );
          }
        );
        let arr_new = [...selectedCategory];
        if (selected_all_product_arr_index > -1) {
          
          selected_all_product_arr[
            selected_all_product_arr_index
          ]?.products.forEach((id: any) => {
            arr_new.push(id);
          });
          setselectedCategory(arr_new);
        } else {
          let selected_arr = [...selectedCat];
          console.log("selected_arr", selected_arr);
          let selected_index = selected_arr.findIndex((item, index: any) => {
            return (
              item.categoryName == res?.data[0]?.Category_name &&
              item.all_products_selected == 1
            );
          });

          if (selected_index > -1) {
            let arr = [...selectedCategory];
            res?.data?.forEach((item: any) => {
              arr.push(item.id);
            });
            setSelectAll(true);
            setselectedCategory(arr);
          }
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    });
  };

  const handleCategoryNext = () => {
    if (isEdit) {
      const dataToSend = {
        all_products_selected: 0,
        products: selectedCategory,
        categoryName: categoryName,
      };

      handleModel({}, dataToSend);
    } else {
      // const dataToSend = {
      //   all_products_selected: 1,
      //   products: selectedCategory,
      //   categoryName: categoryName,
      // };

      handleModel({}, "");
    }

    handleOpenDealCategory();
  };

  const handleselectCategory = (id: number) => {
    setIsEdit(true);
    let categories: any = [...selectedCategory];
    let _index = categories.findIndex((cat_id: number) => cat_id === id);
    if (_index > -1) {
      categories.splice(_index, 1);
    } else {
      categories.push(id);
    }
    setselectedCategory(categories);
  };
  const handleSelectAll = (select: boolean) => {
    setIsEdit(true);
    let arr: any = [];
    if (select) {
      productsList.map((product: any) => {
        return arr.push(product.id);
      });
      setselectedCategory(arr);
    } else {
      setselectedCategory([]);
    }

    setSelectAll(select);
  };
  console.log("selectedCategory", selectedCategory);
  const columns = [
    {
      title: (
        <div className="px-4 flex justify-between items-center">
          {categoryName ? (
            <>
              {" "}
              <div className="flex justify-between">
                <Checkbox
                  id={"checkbox"}
                  // key={index}
                  checked={
                    productsList.length == selectedCategory.length
                      ? true
                      : false
                  }
                  onChange={() => {
                    handleSelectAll(!selectAll);
                  }}
                  name={"checkbox"}
                />
                <span className="flex w-[370px]">{categoryName}</span>
                <span>{"Price"}</span>
              </div>
              <span
                className="text-blue-700 cursor-pointer"
                onClick={() => {
                  handleSelectAll(!selectAll);
                }}
              >
                {"Select All"}
              </span>
            </>
          ) : (
            ""
          )}
        </div>
      ),
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (name: string, row: any) => (
        <div className="flex gap-3 items-center px-4 ">
          <input
            type="checkbox"
            className="custom-checkbox"
            id={row.id}
            // key={index}
            checked={selectedCategory.some((id: any) => {
              const selected = id === row.id ? true : false;
              return selected;
            })}
            onChange={() => {
              handleselectCategory(row.id);
            }}
            name={row.id}
          />
          <LazyImage
            className="h-8 w-8 rounded"
            src={import.meta.env.VITE_REACT_API_URL + "/" + row.image_url}
            alt=""
          />
          <img />
          <div className="flex w-80 ">
            <div className="flex flex-col">
              <p
                className="text-xs text-black-900 "
                // onClick={() => {
                //   navigate("/promotions/allCategory");Next
                // }}
              >
                {row.name}
              </p>
              <span className="text-xs text-gray-900 ">ID : {row.id} </span>
              {/* <span className="text-xs text-gray-900 ">|</span> */}
              <span></span>
            </div>
          </div>

          <p
            className="text-xs text-black-900 "
            onClick={() => {
              navigate("/promotions/allCategory");
            }}
          >
            ${row.price}
          </p>
        </div>
      ),
    },
  ];
  return (
    <>
      <CustomCard styleClass="p-4">
        <div className="flex justify-between items-center">
          <div className="text-left">
            {/* <p className="text-gray-900 flex gap-1">
              <span>Dashboard</span>/<span>Promotions</span>/<span>Deals</span>
            </p> */}
            <Breadcrumbs aria-label="breadcrumb" className="bg-inherit pl-0">
              <Link to="/dashboard">
                <p>Dashboard</p>
              </Link>
              <Link to="/promotions/dealsList">
                <p>Promotions</p>
              </Link>
              {/* <Link to="" className="text-gray"> */}
              <p>{"Deals"}</p>
              {/* </Link> */}
            </Breadcrumbs>

            <h5 className="font-normal"> Deals</h5>
          </div>

          <div className="flex gap-4">
            <CustomButton
              type={"button"}
              label="Back"
              // styleClass="btn-gray-light !rounded-md"
              styleClass="btn-black !rounded-md"
              handleButtonClick={(e: any) => {
                handleCategoryNext();
                // handleModel(e, "");
              }}
            />
            {/* <CustomButton
              handleButtonClick={() => {
                handleCategoryNext();
              }}
              type={"button"}
              label="Next"
              styleClass="btn-black !rounded-md"
            /> */}
          </div>
        </div>
      </CustomCard>
      <CustomCard styleClass="sm:rounded-none">
        {/* <div className="p-4 ">
          <Input
            leftIcon={<FiSearch className="text-gray-900 h-6 w-6" />}
            id="searchValue"
            name="searchValue"
            inputClassName="!h-9"
            type="text"
            variant="outline"
            placeholder="Start typing to search for Categories"
            onChange={(e) =>
              setFilterValue({ ...filterValue, searchValue: e.target.value })
            }
          />
        </div> */}

        <Spinner isLoading={isLoading} classname="my-3" />
        <Table
          tableLayout="fixed"
          columns={columns as any}
          emptyText={"No data found"}
          data={productsList}
          rowKey="id"
          scroll={{ x: 1000 }}
          sticky={true}
          className="matrix"
          onHeaderRow={() => ({
            className: "header-title",
          })}
        />
        {/* <Pagination
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          totalCount={productsList.count}
        /> */}
      </CustomCard>
    </>
  );
};

export default AllCategory;
