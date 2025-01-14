import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Styles from './ArchitectTable.module.css'
import axios from 'axios'
import Add from '../../../Assets/Add.svg'
import MaterialTable from 'material-table';
import { Paper } from '@material-ui/core';
import Modal from '../../Layout/Modal/Modal';
import ArchitectEditForm from '../../Forms/ArchitectEditForm';
import { toast, ToastContainer } from 'react-toastify';
import Select from 'react-select'
import TextField from '@mui/material/TextField';
const ArchitecTable = ({ modalHandler, refresh }) => {
  const [architects, setArchitects] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [editModalData, setEditModalData] = useState({});
  const [tabledata, setTableData] = useState([])
  const [startDate, setStartDate] = useState(new Date('2022-08-01'));
  const [endDate, setEndDate] = useState(new Date());
  const [branches, setBranches] = useState([]);
  let selectedBranch = [];
  const [isLoading, setIsLoading] = useState(false);
  const startDateHandler = (e) => {
    setStartDate(new Date(e.target.value));
  }

  const endDateHandler = (e) => {
    setEndDate(new Date(e.target.value));
  }

  const dateformater = (date) => {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1) > 9 ? date.getMonth() + 1 : '0' + date.getMonth();
    let day = (date.getDay() + 1) > 9 ? date.getDay() + 1 : '0' + date.getDay();
    return `${year}-${month}-${day}`
  }

  const submitDateRangeHandler = (e) => {
    console.log(startDate, endDate);
    let data = architects.filter((item) => {
      let date = item.date;
      date = new Date(date);
      if (date < endDate && date > startDate) {
        return true
      }
      else {
        return false
      }
    })
    setTableData(data)
  }

  const delteHandler = async (id) => {
    const data = await axios.delete(`/api/v1/architect/delete/${id}`);
    fetchArchitect();
  }

  const fetchArchitect = async () => {
    const { data } = await axios.get("/api/v1/architect/getall");
    setArchitects(data.architects);
    setTableData(data.architects);
  }


  const fetchBranches = async () => {
    const { data } = await axios.get("/api/v1/branch/getall");

    const branches = data.branches.map((branch) => (
      {
        branchname: branch.branchname,
        value: branch.branchname,
        label: branch.branchname

      }
    ))
    setBranches(branches);
  }
  const sleep = time => {
    return new Promise(resolve => setTimeout(resolve, time));
  };

  const fetchArchitectsofBranch = async () => {
    setIsLoading(true);
    sleep(500);

    console.log(selectedBranch);
    const response = await axios.post("/api/v1/branch/architects", selectedBranch, { headers: { "Content-Type": "application/json" } });

    console.log(response);
    const newarchitects = response.data.architects;

    setTableData(newarchitects);
    setIsLoading(false);
  }
  const handlebranch = (selected) => {
    console.log(selected);

    selectedBranch = selected;
    fetchArchitectsofBranch();
  }
  const [salesman, setSalesman] = useState([]);
  let selectedSalesman = [];
  const fetchSalesmen = async () => {
    const { data } = await axios.get("/api/v1/salesman/getall");

    const salesmen = data.salesmans.map((branch) => (
      {
        name: branch.name,
        value: branch.name,
        label: branch.name

      }
    ))
    setSalesman(salesmen);
  }
  const fetchArchitectsofSalesman = async () => {
    setIsLoading(true);
    sleep(500);

    // console.log(selectedSalesman);
    const response = await axios.post("/api/v1/salesman/architects", selectedSalesman, { headers: { "Content-Type": "application/json" } });

    // console.log(response);
    const newarchitects = response.data.architects;

    setTableData(newarchitects);
    setIsLoading(false);
  }
  const handlesalesman = (selected) => {
    console.log(selected);

    selectedSalesman = selected;
    fetchArchitectsofSalesman();
  }

  useEffect(() => {

    fetchBranches();

    fetchArchitect();
    fetchSalesmen();
  }, [refresh]);

  const customStyles = {
    control: base => ({
      ...base,
      minHeight: 55
    }),
    dropdownIndicator: base => ({
      ...base,
      padding: 4
    }),
    clearIndicator: base => ({
      ...base,
      padding: 4
    }),
    multiValue: base => ({
      ...base,

    }),
    valueContainer: base => ({
      ...base,
      padding: '0px 6px'
    }),
    input: base => ({
      ...base,
      margin: 0,
      padding: 0
    })
  };
  const handleCallbackCreate = (childData) => {

    toast.success("Architect edited");
    fetchArchitect();
    window.scrollTo(0, 0)
  }
  return (
    <div className={Styles.container}>
      <div className={Styles.table}>
        <div className={Styles.header}>
          <h3>All Architect</h3>

          <div className={Styles.buttonContainer}>
            <img className={Styles.addImg} src={Add} alt="add" />
            <p className={Styles.buttonText} onClick={modalHandler}>
              Add Architect
            </p>

          </div>
        </div>
        <div className={Styles.Yellow}>

          <div className={Styles.DateRangeContainer}>
            <label>Salesman Filter</label>
            <Select styles={customStyles} onChange={(e) => handlesalesman(e)} options={salesman} />
            <label>Branch Filter</label>
            <Select styles={customStyles} onChange={(e) => handlebranch(e)} options={branches} />
            <TextField
              className={Styles.InputDate}
              id="date"
              label="Start Date"
              type="date"

              onChange={(e) => startDateHandler(e)}
              sx={{ width: 180, margin: 1 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField

              className={Styles.InputDate}
              id="date"
              label="End Date"
              type="date"
              onChange={(e) => endDateHandler(e)}

              sx={{ width: 180, margin: 1 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <button className={Styles.SubmitButton} onClick={(e) => submitDateRangeHandler(e)} type="submit"> Submit </button>
          </div>
        </div>

        {architects && <MaterialTable
          isLoading={isLoading}
          className={Styles.Table}
          columns={[
            { title: 'Date', field: 'date', type: "date", dateSetting: { locale: "en-GB" }, },
            { title: 'Name', field: 'name' },
            { title: 'Email', field: 'Email', hidden: 'true' },
            { title: 'Address', field: 'address' },
            { title: 'Company Name', field: 'companyName', hidden: 'true' },
            { title: 'Birth Date', field: 'birthdate', hidden: 'true' },
            { title: 'Marriage Date', field: 'marriagedate', hidden: 'true' },
            { title: 'Remarks', field: 'remarks', hidden: 'true' },
            { title: 'Bank Name', field: 'bankname', hidden: 'true' },
            { title: 'IFS Code', field: 'IFSCcode', hidden: 'true' },
            { title: 'Branch Name', field: 'branchname', hidden: 'true' },
            { title: 'Adhar Card', field: 'adharcard', hidden: 'true' },
            { title: 'Pan Card', field: 'pancard', hidden: 'true' },
          ]}
          data={tabledata}
          options={{
            sorting: true,
            headerStyle: {
              zIndex: 0
            },
            showTitle: false,
            actionsColumnIndex: -1,
            filtering: true,
            exportButton:true
          }}
          components={{
            Container: props => <Paper {...props}
              elevation={0}
              style={{
                padding: 20,
                width: "100%",
              }} />
          }}

          actions={[
            {
              icon: 'edit',
              tooltip: 'Edit',
              onClick: (event, rowData) => {
                window.scrollTo({
                  top: 0,
                  left: 0,
                  behavior: "smooth"
                });
                setEditModalData(rowData);
                setEditModal(true);
                console.log(`Edit `, rowData)
              }
            },
            {
              icon: 'delete',
              tooltip: 'Delete',
              onClick: (event, rowData) => {
                window.scrollTo({
                  top: 0,
                  left: 0,
                  behavior: "smooth"
                });
                delteHandler(rowData._id);
                console.log(`delete `, rowData)
              }
            }
          ]}
        />}

      </div>

      {
        editModal ? <Modal><ArchitectEditForm modalHandler={() => { setEditModal(false) }} data={editModalData} setIsOpen={setEditModal} parentCallback={handleCallbackCreate} /></Modal> : null}

      <div className={Styles.filter}>

      </div>
    </div>
  )
}

export default ArchitecTable