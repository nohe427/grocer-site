import { initializeApp } from 'firebase/app';
import { getDataConnect, connectDataConnectEmulator } from 'firebase/data-connect'
import {connectorConfig} from '@grocer/dc';

export const getDataconnectClient = (host: string = 'localhost') => {
    // Note: When connecting to a prod instance, please replace the empty config with your firebase config provided in the console.	
    const firebaseApp = initializeApp({ projectId: 'lon-next' });
	const dataConnect = getDataConnect(firebaseApp, connectorConfig)

	if(dataConnect.isEmulator) {
		return dataConnect;
	}
	// If this is running on the client then tell Data Connect to use
	// the reverse proxy to send requests.
	// Note: This is only needed when running in a Cloud Editor
    // It is always 'localhost' on the server
    connectDataConnectEmulator(
        dataConnect, 
        'localhost', 
        9399, 
        false
    );
	
    return dataConnect;
}