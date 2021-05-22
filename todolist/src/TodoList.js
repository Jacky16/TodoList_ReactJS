import React, { Component } from 'react';
import ItemList from "./ItemList"
import { Button } from '@material-ui/core';
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
            console.log(response.json()).then((data) =>{
               data.forEach(item =>{
                   this.state.push({
                       id: item.id,
                       item: item.name
                   })
               })
            });
            this.setState({
                itemsState: this.state.itemsState
            });
            //this.lastID = data[data.length - 1].id;
        })
    }
    removeItem(id_item){
         
        console.log("Eliminado: " + id_item);
         for(let i = 0; i< this.state.itemsState.length; i++){
             if(this.state.itemsState[i].id === id_item){
                 this.state.itemsState.splice(i,1);
                 break;
             }
         }

         this.setState({
             itemsState:this.state.itemsState
         });
        
    }
    clearAll(){
        if(this.state.itemsState.length > 0){
            this.state.itemsState = [];
        }
        this.setState({
            itemsState:this.state.itemsState
        });
    }
    addItem(e){
        //Hace que no se envie el formulario
        e.preventDefault();
        
        this.lastID++;
        let textValue = document.getElementById("text").value;
        
        if(textValue != ""){
            this.state.itemsState.push({id:this.lastID,item:textValue});
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
            document.getElementById("text").value.focus();
        }
        

    }
    render(){
        
        let lista = this.state.itemsState.map((todoItem) => {
            return (<ItemList item={todoItem.item} 
                id_item={todoItem.id}
                parentRemove={this.removeItem}/>)
        });
        let errorMSG = "Type something";

        return(
            <div className="list">
                <h1>TODO LIST</h1>
                <div className="listContent">
                    <form onSubmit={this.addItem}>
                        <p><input type="text" id="text" placeholder="Add your new todo"/></p>
                        <p><Button color="primary" variant="contained" type="Submit">Add</Button></p>
                    </form>
                    <ul id="doList">
                        {lista}
                    </ul>
                    <div className="countTasks">
                        <p>You have {this.state.itemsState.length} pending tasks</p>
                        <p><Button color ="primary"type="Button" onClick={this.clearAll}>Clear All</Button></p>
                    </div>
                </div>
            </div>
        )         
    }
}

export default TodoList;