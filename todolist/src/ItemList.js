import React, { Component } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

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
            <li>
                {this.props.item}
                <IconButton className="delete" color="secondary" aria-label="delete" onClick={this.removeItem}> <DeleteIcon style={{ fontSize: 35} }></DeleteIcon></IconButton>
            </li>
        )
    }
}

export default ItemList;


