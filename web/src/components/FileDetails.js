import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

const FileDetails = createReactClass({
    render() {
        const self = this;
        const file = self.props.file;
        const fileKeys = Object.keys(file);
        const index = fileKeys.indexOf("address");
        if (index !== -1) fileKeys.splice(index, 1);

        return (
            <div>
                <h4><b>Contract Address:</b><br/>{file["address"]}</h4>
                {fileKeys.map((fileKey, j) => {
                    let element = file[fileKey];
                    if (element instanceof Object) {
                        element = JSON.stringify(element);
                    }
                    return <span key={j} className="file-detail"><b>{fileKey}: </b>{element}<br/></span>
                })}
            </div>
        );
    }
});

export default FileDetails;

