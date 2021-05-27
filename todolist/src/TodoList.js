import React, { Component } from 'react';
import ItemList from "./ItemList"
import { Button, Icon } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import { green, purple } from '@material-ui/core/colors';
import AddBoxIcon from '@material-ui/icons/AddBox';

import "./TodoList.css"


class TodoList extends Component{
    
    constructor(props){
        super(props);
        let todo_tasks = [];
        this.state = {
            itemsState : todo_tasks
        };
        this.lastID = 0;
        
        // Para que las funciones esten vinculadas al objeto
        // y que puedan accdeder a las variables,funciones..etc
        this.addItem = this.addItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.clearAll = this.clearAll.bind(this);

        fetch("//192.168.1.42:8080/get_items").then((response)=>{
            
            response.json().then((data) =>{

               data.forEach(item =>{
                   console.log(item);
                   this.state.itemsState.push({
                       id: item.id,
                       item_name: item.item_name
                   })
               })

            this.setState({
                itemsState: this.state.itemsState
            });

            this.lastID = data[data.length - 1].id;
        });
        })
    }
    
    removeItem(id_item){
        

        console.log("Eliminado: " + id_item);

         for(let i = 0; i< this.state.itemsState.length; i++){

             if(this.state.itemsState[i].id === id_item){

                let itemToDelete = this.state.itemsState[i];
                
                 //FETCH
                fetch("//192.168.1.42:8080/remove",{
                method: "POST",
                headers:{
                    'Content-type' : "text/json"
                },
                body: JSON.stringify(itemToDelete)
                })

                 this.state.itemsState.splice(i,1);
                 break;
             }
         }

         this.setState({
             itemsState:this.state.itemsState
         });
         
            
            
            //this.lastID = data[data.length - 1].id;
    

    }
    clearAll(){
        if(this.state.itemsState.length > 0){
            this.state.itemsState = [];
        }
        this.setState({
            itemsState:this.state.itemsState
        });
        fetch("//192.168.1.42:8080/remove_all");
        
        this.lastID = 0;
    
    }
    addItem(e){
        //Hace que no se envie el formulario
        e.preventDefault();
        
        this.lastID++;
        let textValue = document.getElementById("text").value;
        
        if(textValue != ""){
            this.state.itemsState.push({id:this.lastID,item_name:textValue});
            this.setState({
                itemsState: this.state.itemsState
            });
            
            //Hacer fetch con todos los datos
            console.log(textValue);
            fetch("//192.168.1.42:8080/submit",{
                method: "POST",
                headers:{
                    'Content-type' : "text/json"
                },
                body: JSON.stringify({
                    id: this.lastID,
                    item_name:textValue
                })
            });
            //Borramos el contenido del texto
            document.getElementById("text").value ="";
            document.getElementById("text").focus();
        }
        

    }
    render(){
        
        let lista = this.state.itemsState.map((todoItem) => {
            return (<ItemList item={todoItem.item_name} 
                id_item={todoItem.id}
                parentRemove={this.removeItem}/>)
        });
       

        return(
            <div className="list">
                <h1>TODO LIST</h1>
                <div className="listContent">
                    <form onSubmit={this.addItem}>
                        <p><TextField label="Add your new todo" size="medium" id="standard-full-width" autoComplete="off" margin="normal" variant="outlined" type="text" id="text"/></p>
                        <p><IconButton variant="contained" type="Submit" aria-label="add" >  <AddBoxIcon style={{ fontSize: 65 ,color: purple[500] }}/> </IconButton></p>
                    </form>
                    <ul id="doList">
                        {lista}
                    </ul>
                    <div className="countTasks">
                        <p>You have {this.state.itemsState.length} pending tasks</p>
                        <p><Button color="secondary" type="Button"  variant="contained"  startIcon={<DeleteIcon />} onClick={this.clearAll}>Clear All</Button></p>
                    </div>
                </div>
            </div>
        )         
    }
}

export default TodoList;