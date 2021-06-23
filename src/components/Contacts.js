import CssBaseline from '@material-ui/core/CssBaseline';
import React, {useContext, useState} from 'react';
import {Context} from "../index";
import {Button, Container, Grid} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import {useCollectionData} from "react-firebase-hooks/firestore";
import { DataGrid, ruRU } from '@material-ui/data-grid';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import SearchBar from "material-ui-search-bar";

const Contacts = () => {

  const {auth, db} = useContext(Context)
  const [value, setValue] = useState({
    name: '',
    text: '',
  });
  let result = db.collection("messages")
  const [items] = useCollectionData(result)
  const [SearchValue, setSearchValue] = useState([]);
  const [selectionModel, setSelectionModel] = React.useState([]);

  const requestSearch = (searchedVal) => {
    setSearchValue(searchedVal)
    console.log(SearchValue)
  };

  const cancelSearch = () => {
    requestSearch([]);
  };

  async function addContact() {
    var _id = localStorage.getItem('key');
    _id++;
    localStorage.setItem('key', _id);

    if(value.name && value.text){
      db.collection('messages').add({
        id: _id,
        name: value.name,
        text: value.text,
      })
    }else{
      alert('Заполните все поля, прежде чем добавить новые данные!')
    }
  }
  const handleEditCellChangeCommitted = React.useCallback(
    ({ id, field, props }) => {EditValue({id, field, props});},
  );

  async function EditValue(params) {

    var getDocument = db.collection("messages").where("id", "==", params.id).get()

    getDocument.then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.data(), " => ", params.row);
          var allData = doc.data();
          var query = db.collection("messages")
          
          query.doc(doc.id).set(
            params.field=='name'?
            {
              id: params.id,
              name: params.props.value,
              text: allData.text,
            }
              :
            {
              id: params.id,
              name: allData.name,
              text: params.props.value,
            }
          )
          .then(() => {
            console.log("Document successfully written!");
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
        });
      });
    });
  }

  const columns = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 90 
    }
    ,
    {
      field: 'name',
      headerName: 'Фамилия Имя Отчество',
      width: 500,
      editable: true,
    }
    ,
    {
      field: 'text',
      headerName: 'Контакты',
      width: 500,
      editable: true,
    }
  ];

  async function deleteSelected () {

    console.log('deleteSelected ', selectionModel)
     selectionModel.map((item) => { 
        var first_query = db.collection("messages").where("id", "==", item).get()
        first_query.then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                
                var query = db.collection("messages")
                query.doc(doc.id).delete().then(() => {
                  console.log("Document successfully deleted!");
                  }).catch((error) => {
                  console.error("Error removing document: ", error);
                  });

                  selectionModel.splice(item.id, 1);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
     })
  };

  return(
    <React.Fragment>
            <CssBaseline />
            <Container fixed>
            <AppBar color={"primary"} position="static">
              <Toolbar variant={"dense"}>
                {selectionModel.length > 0 && 
                <Button onClick={deleteSelected} variant={"contained"} color="secondary">Удалить</Button>}
                <Grid container justify={"flex-end"}>
                <SearchBar
                  style={{height:40,marginRight:30}}
                  onChange={(searchVal) => requestSearch(searchVal)}
                  onCancelSearch={() => cancelSearch()}
                />
                    {
                    <Button onClick={() => auth.signOut()} variant={"contained"} color="secondary">Выйти</Button>
                    }
                </Grid>
              </Toolbar>
            </AppBar>
              <div>
                    {
                      items &&
                      <div style={{ height: 650, width: '100%' }}>
                        <DataGrid
                          localeText={ruRU.props.MuiDataGrid.localeText}
                          rows={items.filter(row => (row.name + row.text).includes(SearchValue))}
                          columns={columns}
                          pageSize={10}
                          checkboxSelection
                          disableSelectionOnClick
                          disableColumnMenu
                          onEditCellChangeCommitted={handleEditCellChangeCommitted}
                          onSelectionModelChange={(newSelection) => 
                            {
                            setSelectionModel(newSelection.selectionModel);
                            console.log(newSelection)
                            console.log(newSelection.selectionModel)
                            }
                          }
                          selectionModel={selectionModel}
                        />
                        
                      </div>
                    }
              </div>
              <Grid container justify={"flex-end"}>
                  <Grid container direction="row" justify="flex-end" alignItems="flex-start" style={{width: '100%', marginTop:10}}>
                    <TextField style={{width: '50%', marginTop:10}} fullWidth rowsMax={1} variant={"outlined"} onChange={e => setValue({...value, name:e.target.value})}/>
                    <TextField style={{width: '50%', marginTop:10, paddingLeft:5}} fullWidth rowsMax={1} variant={"outlined"} onChange={e => setValue({...value, text:e.target.value})}/>
                  </Grid>
                  <Button onClick={addContact} style={{marginTop:5}} variant="contained" color="primary">Добавить</Button> 

              </Grid>
            </Container>
          </React.Fragment>
  );
}

export default Contacts;

