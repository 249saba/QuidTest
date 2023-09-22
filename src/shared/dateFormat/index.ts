export const formatedDate = (date: string | number | Date) => {
    const dataValue = new Date(date);
    const _day =
      dataValue.getDate() > 9 ? dataValue.getDate() : `0${dataValue.getDate()}`;
    const _month =
      dataValue.getMonth() + 1 > 9
        ? dataValue.getMonth() + 1
        : `0${dataValue.getMonth() + 1}`;
    const _year = dataValue.getFullYear();
  
    // const d = new Date(date);
    // const _hours = d.getHours() > 9 ? d.getHours() : `0${d.getHours()}`;
    // const _mints = d.getMinutes() > 9 ? d.getMinutes() : `0${d.getMinutes()}`;
    // const _seconds = d.getSeconds() > 9 ? d.getSeconds() : `0${d.getSeconds()}`;
  
    // let _formatedDate = `${`${_year}-${_month}-${_day} ${_hours}:${_mints}:${_seconds}`}`;
    const _formatedDate = `${`${_year}-${_month}-${_day}`}`;
    return _formatedDate;
  };
  