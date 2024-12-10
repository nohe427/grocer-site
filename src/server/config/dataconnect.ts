import { initializeApp } from 'firebase/app';
import { getDataConnect, connectDataConnectEmulator } from 'firebase/data-connect'
import {connectorConfig} from '@grocer/dc';

export const getDataconnectClient = (host: string = 'localhost') => {
    // Note: When connecting to a prod instance, please replace the empty config with your firebase config provided in the console.	
    const firebaseApp = initializeApp({
        apiKey: "AIzaSyDsfZ75K15WUutJxESZnIHxPAt6qo-_aXI",
        authDomain: "lon-next.firebaseapp.com",
        projectId: "lon-next",
        storageBucket: "lon-next.firebasestorage.app",
        messagingSenderId: "1039410413539",
        appId: "1:1039410413539:web:70afda114ffd296afb2ad6"
    });
	const dataConnect = getDataConnect(firebaseApp, connectorConfig)

	// if(dataConnect.isEmulator) {
	// 	return dataConnect;
	// }
	// // If this is running on the client then tell Data Connect to use
	// // the reverse proxy to send requests.
	// // Note: This is only needed when running in a Cloud Editor
    // // It is always 'localhost' on the server
    // connectDataConnectEmulator(
    //     dataConnect, 
    //     'localhost', 
    //     9399, 
    //     false
    // );
	
    return dataConnect;
}