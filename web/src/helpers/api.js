const library = (function () {
    const PORT = 9001;
    // TODO: replace with prod endpoint.
    const BASE_URL = `http://localhost:${PORT}`;

    const axios = require('axios');
    var faker = require('faker');

    const sha256 = require('js-sha256').sha256;

    const TEST_DEMO_ADDRESS = "AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y";

    const getHeaders = () => {
        const token = localStorage.getItem("tok");
        return {
            headers: {Authorization: "Bearer " + token}
        };
    };

    const generateFileName = () => {
        const name = faker.address.city()
        return `${name} Rental.pdf`
    }

    function hashData(key, data) {
        return sha256.hmac(key, data);
    }

    function createTestMetaData(name, address, key) {
        const d = new Date();
        const now = d.toLocaleDateString() + " " + d.toLocaleTimeString();

        if (!name) {
            name = generateFileName()
        }

        return {
            name: name,
            timesViewed: 1,
            lastAccessed: now,
            lastModifiedDate: now,
            sizeKb: parseInt(Math.random() * 10000) + "kb",
            sharedKey: faker.random.uuid(),
            address,
        };
    }


    function createMetaData(file, sizeKb, fileDate, address, sharingKey, signingKey, privateChecked) {
        return {
            name: file.name,
            timesViewed: 1,
            lastAccessed: fileDate,
            lastModifiedDate: fileDate,
            sizeKb: sizeKb,
            sharingKey: sharingKey,
            signingKey: signingKey,
            privateChecked: privateChecked,
            address,
        }
    }

    // User request for granting permissions to another external user (by address) for accessing/downloading this file.
    function postGrantAccess(fileName, targetPublicKey, ownerSharingKey) {
        const url = `${BASE_URL}/api/file`;
        return axios.post(url, {
            fileName: fileName,
            targetPublicKey: targetPublicKey,
            ownerSharingKey: ownerSharingKey
        }).then(response => {
            const data = response.data;
            return data;
        });
    }

    function postUploadFile(file, metadata) {
        const url = `${BASE_URL}/upload`;

        const formData = new FormData();
        formData.append("metadata", JSON.stringify(metadata));
        formData.append("file", file);

        return axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            const data = response.data;
            return data;
        });
    }

    function getFilesForSharedKey(key) {
        const url = `${BASE_URL}/api/files/${key}`;
        return axios.get(url, getHeaders()).then(response => response.data);
    }

    function putView(name, address) {
        const url = `${BASE_URL}/view/${address}/${name}`;
        return axios.put(url, {}).then(response => {
            const data = response.data;
            return data;
        });
    }

    function putEdit(name, address) {
        const url = `${BASE_URL}/view/${address}/${name}`;
        return axios.put(url, {}).then(response => {
            const data = response.data;
            return data;
        });
    }

    return {
        putView,
        putEdit,
        BASE_URL: BASE_URL,
        TEST_DEMO_ADDRESS: TEST_DEMO_ADDRESS,
        generateFileName,
        createMetaData,
        createTestMetaData: createTestMetaData,
        hashData,
        postUploadFile: postUploadFile,
        postGrantAccess: postGrantAccess,
        getFilesForSharedKey
    }

})();
module.exports = library;