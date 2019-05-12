import React from 'react';
import createReactClass from 'create-react-class';
import {FilePond, File} from 'react-filepond';
import {
    Button, Modal, ListGroup, ListGroupItem, ControlLabel, FormControl, HelpBlock,
    FormGroup
} from 'react-bootstrap';
import api from '../helpers/api';
import PropTypes from 'prop-types';
import Dropzone from "react-dropzone";

const FileUploader = createReactClass({

    componentWillMount() {
        this.setState({
            files: [],
            showModal: false,
            privateKey: "",
            privateChecked: false,
            address: "",
            // current file properties for upload.
            currentFile: null,
            fileContent: null,
            metadata: null,
            fieldName: null
        });

    },


    handlePrivateChange(e) {
        this.setState({private: e.target.value});
    },

    handlePrivateKeyChange(e) {
        this.setState({privateKey: e.target.value});
    },

    handleSignAndSubmit() {
        this.setState({showModal: false});

        const { file, privateKey, privateChecked, fileContent, address} = this.state
        const d = file.lastModifiedDate;

        const fileDate = d.toLocaleDateString() + " " + d.toLocaleTimeString();
        const fileHash = api.hashData(privateKey, fileDate);

        // TODO: passing pkey sec risk, used for hashing server side temporary.
        const metadata = api.createMetaData(file, fileDate, fileHash, address, privateKey, 1);

        api.postUploadFile(fileContent, metadata).then((res) => {
            console.log('success', res);
        }).catch((err) => {
            console.error('error', err);
        });
    },

    // Initialized the file
    handleInit() {
        console.log('filepond now initialised', this.pond);
    },

    // handle file upload.
    handleProcessing(fieldName, file, metadata, load, error, progress, abort) {
        const self = this;
        // console.log(JSON.stringify(load));
        self.setState({fieldName: fieldName, currentFile: file, metadata: metadata});
        const reader = new FileReader();
        reader.onload = () => {
            const fileAsBinaryString = reader.result;
            // do whatever you want with the file content
            self.setState({showModal: true, fileContent: fileAsBinaryString});
            // console.log(file.name, fileAsBinaryString)
        };
        reader.onabort = () => console.log('file reading was aborted');
        reader.onerror = () => console.log('file reading has failed');

        reader.readAsBinaryString(file);
    },

    render() {
        const { files, privateChecked, privateKey, currentFile, showModal } = this.state

        return (
            <div className="file-uploader">
                <ListGroup>
                    <ListGroupItem bsStyle="info">Upload new contract</ListGroupItem>
                    <ListGroupItem>
                        <FilePond allowMultiple={true}
                                  maxFiles={3}
                                  ref={ref => this.pond = ref}
                                  server={{process: this.handleProcessing}}
                                  oninit={() => this.handleInit()}>

                            {files.map(file => (
                                <File key={file} source={file}/>
                            ))}
                        </FilePond>
                    </ListGroupItem>
                </ListGroup>

                

                {/*Upload file modal*/}
                <Modal show={showModal} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Hey, We Got Your File!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-body">
                        {currentFile &&<p>Are you ready to submit file: <b>{currentFile['name']}</b>?</p>}
                        <hr/>

                        <FormGroup controlId="formPrivateKey">
                            <ControlLabel>Private Key</ControlLabel>
                            <FormControl
                                type="password"
                                value={privateKey}
                                placeholder="Enter private key"
                                onChange={this.handlePrivateKeyChange}
                            />
                            <HelpBlock>This is used to prove this file was created/added by you.</HelpBlock>
                        </FormGroup>

                        <FormGroup controlId="formAddress">
                            <ControlLabel>Address</ControlLabel>
                            <FormControl
                                type="checkbox"
                                value={privateChecked}
                                placeholder="Make Contract Private - only viewable with Key above"
                                onChange={this.handlePrivateChange}
                            />
                            <HelpBlock>This will be used as a locator for your recorded files.</HelpBlock>
                        </FormGroup>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="success" onClick={this.handleSignAndSubmit}>Sign & Upload</Button>
                    </Modal.Footer>
                </Modal>


            </div>
        );
    }
});

export default FileUploader;

