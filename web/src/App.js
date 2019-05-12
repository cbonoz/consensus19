import React, {Component} from 'react'
import Home from './components/Home'
import About from './components/About'
import Upload from './components/Upload'
import YourFiles from './components/YourFiles'
import Footer from './components/Footer'
import {Navbar, NavItem, NavDropdown, Nav, MenuItem} from 'react-bootstrap'
import { toast, ToastContainer } from 'react-toastify';


import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'

import './App.css'
import 'react-toastify/dist/ReactToastify.css';

// import contractsimpleLogo from './assets/contractsimple.png'
import contractsimpleLogo from './assets/contractsimple.png'

// Call it once in your app. At the root of your app is the best place
toast.configure()

class App extends Component {

    render() {
        return (
            <div className="App">
                <ToastContainer position={toast.POSITION.TOP_CENTER} />
                <Navbar collapseOnSelect>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <img onClick={() => window.location = "/"}src={contractsimpleLogo} className="header-bar-logo"/>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav pullRight>
                            <NavItem eventKey={1} href="/">
                                Sign Up
                            </NavItem>
                            <NavItem eventKey={1} href="/upload">
                                Upload Contract
                            </NavItem>
                            <NavItem eventKey={2} href="/files">
                                Find Your Contracts
                            </NavItem>
                            {/* <NavItem eventKey={3} href="/api">
                                API
                            </NavItem> */}
                            {/* <NavItem eventKey={3} href="/about">
                                About Us
                            </NavItem> */}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

                <Router>
                    <div>
                        <Route exact path="/" component={Home}/>
                        <Route path="/files" component={YourFiles}/>
                        <Route path="/about" component={About}/>
                        <Route path="/upload" component={Upload}/>
                    </div>
                </Router>
            </div>
        )
    }
}

export default App
