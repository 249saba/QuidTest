import ShellContainer from "@src/containers/shellContainer";
import CustomCard from "@src/shared/cards/customCard";
import CustomButton from "@src/shared/customButton";
import Input from "@src/shared/input";
import LazyImage from "@src/shared/lazyImage";
import { CategryModel } from "@src/shared/models";
import { GetTaxTypes, GetProductCategory } from "@src/shared/apiService";
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
import { Spinner } from "@src/shared/spinner/spinner";
import Pagination from "@src/shared/table/pagination";
import { Ifilters } from "@src/shared/interfaces";
import { getCategoriesById } from "@src/shared/apiService";
import { useNavigate } from "react-router-dom";
import "@src/index.scss";
import AllCategory from "./dealCategory";

const SelectCategory = ({ handleModel,handleOpenDealCategory,selectedCat,handleCategory,categoryData }: any) => {
  const [productsList, setProductsList] = useState([]) as any;
  const [selectedCategory, setSelectedCategory] = useState([]) as any;
  const [dataSend, setdataSend] = useState() as any;
  const [categoryName, setCategoryName] = useState() as any;
  const [isOpenDealCat, setisOpenDealCat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMandatory, setIsMandatory] = useState(true);
  const [unitOptions, setUnitOptions] = useState([]);
  const navigate = useNavigate();

  const [filterValue, setFilterValue] = useState<Ifilters>({
    searchValue: "",
    offset: 0,
    limit: 10,
    order: "asc",
  });
  useEffect(() => {
    getCategories();
  }, []);

  console.log("productsselectedCat", selectedCat);
  const getCategories = () => {
    setIsLoading(true);
    GetProductCategory().then((res: any) => {
      if (res && !res.error) {
        setProductsList(res.data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    });
  };


  const handleSelectCategory = (row: any) => {
    if(row){
      localStorage.setItem("id", row.id);
      setCategoryName(row?.name)
    }
    setisOpenDealCat(!isOpenDealCat);

  };
  const selectCategory = (row:any,name: any) => {
    if(row){
      localStorage.setItem('id',row.id);
    }
    let categories=[...selectedCategory];
    categories.push(row.id)
    setSelectedCategory(categories);
    const dataToSend = { all_products_selected: 1, categoryName: name };
    setdataSend(dataToSend);
  
     
      handleModel({},dataToSend);
      handleCategory(dataToSend);
    
  
   
  };
  const columns = [
    {
      title: (
        <div className="pl-1 flex gap-3 items-center">
          {/* {productsList.length>0?<> <Checkbox id={"checkbox"} disabled={false} name={"checkbox"} />
          <span>{"Name"}</span></>:""} */}
         {/* <Checkbox id={"checkbox"} disabled={false} name={"checkbox"} /> */}
          <span>{"Name"}</span>
        </div>
      ),
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (name: string, row: any) => (
        <div className="flex gap-3 items-center pl-1">
          <input
            type="checkbox"
            className="custom-checkbox"
            onChange={() => {
              selectCategory(row,row.name);
            }}
            checked={selectedCat.some((item:any) => {
              const selected = item.cat_id == row.id ? true : false;
              return selected;
            })}
            id={row.id}
            // // key={row.id}
            // disabled={false}
            name={row.name}
          />
          <p
            className="text-xs text-black-900 cursor-pointer"
            onClick={() => {
              handleSelectCategory(row);
            }}
          >
            {row.name}
          </p>
        </div>
      ),
    },
  ];
  return (
    <>
      {!isOpenDealCat ? (
        <>
          {" "}
          <CustomCard styleClass="p-4">
            <div className="flex justify-between items-center">
              <div className="text-left">
                <p className="text-gray-900 flex gap-1">
                  <span>Dashboard</span>/<span>Promotions</span>/
                  <span>Deals</span>
                </p>

                <h5 className="font-normal"> Deals</h5>
              </div>

              <div className="flex gap-4">
                <CustomButton
                  type={"button"}
                  label="Cancel"
                  styleClass="btn-gray-light !rounded-md"
                  handleButtonClick={(e:any) => {
                    // handleModel(e,"");
                    handleOpenDealCategory()
                  }}
                />
                <CustomButton
                  //   handleButtonClick={() => {
                  //     navigate("/categoriesList/addCategory");
                  //   }}
                  handleButtonClick={(e:any) => {
                    // handleModel(e,"");
                    handleOpenDealCategory()
                  }}
                  type={"button"}
                  label="Next"
                  styleClass="btn-black !rounded-md"
                />
              </div>
            </div>
          </CustomCard>
          <CustomCard styleClass="sm:rounded-none">
            <div className="p-4 ">
              <Input
                leftIcon={<FiSearch className="text-gray-900 h-6 w-6" />}
                id="searchValue"
                name="searchValue"
                inputClassName="!h-9"
                type="text"
                variant="outline"
                placeholder="Start typing to search for Categories"
                onChange={(e) =>
                  setFilterValue({
                    ...filterValue,
                    searchValue: e.target.value,
                  })
                }
              />
            </div>

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
      ) : (
        
        <AllCategory category={categoryName} categoryData={categoryData} handleSelectCategory={handleSelectCategory} handleModel={handleModel} handleOpenDealCategory={handleSelectCategory}  selectedCat={selectedCat}/>
      )}
    </>
  );
};

export default SelectCategory;
