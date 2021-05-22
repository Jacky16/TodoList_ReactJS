import React, { Component } from 'react';
class ItemList extends Component{
    constructor(props){
        super(props);
        this.removeItem=this.removeItem.bind(this);
    }
   removeItem(){
       this.props.parentRemove(this.props.id_item);
   }
    render(){
        return(
            <li>{this.props.item}
             <button className="delete" onClick={this.removeItem}>❌</button>
             </li>
        )
    }
}

export default ItemList;