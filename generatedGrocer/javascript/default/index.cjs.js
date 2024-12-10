const { getDataConnect, queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'local',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

function changeAisleRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  if('_useGeneratedSdk' in dcInstance) {
    dcInstance._useGeneratedSdk();
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@dataconnect-preview`.');
  }
  return mutationRef(dcInstance, 'ChangeAisle', inputVars);
}
exports.changeAisleRef = changeAisleRef;
exports.changeAisle = function changeAisle(dcOrVars, vars) {
  return executeMutation(changeAisleRef(dcOrVars, vars));
};

function listStoreItemsRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  if('_useGeneratedSdk' in dcInstance) {
    dcInstance._useGeneratedSdk();
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@dataconnect-preview`.');
  }
  return queryRef(dcInstance, 'ListStoreItems', inputVars);
}
exports.listStoreItemsRef = listStoreItemsRef;
exports.listStoreItems = function listStoreItems(dcOrVars, vars) {
  return executeQuery(listStoreItemsRef(dcOrVars, vars));
};

