import React, { Component } from 'react';
import { Menu } from '../Menu';
import "./sidebar.css";

class Sidebar extends Component {
    render() {
        return (
            <div id="sidebar" className="sidebar">
                <Menu />
            </div>
        );
    }
}

export default Sidebar;
