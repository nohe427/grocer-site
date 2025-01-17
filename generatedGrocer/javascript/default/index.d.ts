import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';
export const connectorConfig: ConnectorConfig;

export type TimestampString = string;

export type UUIDString = string;

export type Int64String = string;

export type DateString = string;


export interface ChangeAisleResponse {
  storeItem_update?: StoreItem_Key | null;
}

export interface ChangeAisleVariables {
  ref: string;
  newAisle: number;
}

export interface ListStoreItemsResponse {
  storeItems_descEmbedding_similarity: ({
    ref: string;
    name: string;
    aisle: number;
    category: string;
    msrp: number;
  } & StoreItem_Key)[];
}

export interface ListStoreItemsVariables {
  query: string;
}

export interface StoreItem_Key {
  ref: string;
  __typename?: 'StoreItem_Key';
}



/* Allow users to create refs without passing in DataConnect */
export function changeAisleRef(vars: ChangeAisleVariables): MutationRef<ChangeAisleResponse, ChangeAisleVariables>;
/* Allow users to pass in custom DataConnect instances */
export function changeAisleRef(dc: DataConnect, vars: ChangeAisleVariables): MutationRef<ChangeAisleResponse,ChangeAisleVariables>;

export function changeAisle(vars: ChangeAisleVariables): MutationPromise<ChangeAisleResponse, ChangeAisleVariables>;
export function changeAisle(dc: DataConnect, vars: ChangeAisleVariables): MutationPromise<ChangeAisleResponse,ChangeAisleVariables>;


/* Allow users to create refs without passing in DataConnect */
export function listStoreItemsRef(vars: ListStoreItemsVariables): QueryRef<ListStoreItemsResponse, ListStoreItemsVariables>;
/* Allow users to pass in custom DataConnect instances */
export function listStoreItemsRef(dc: DataConnect, vars: ListStoreItemsVariables): QueryRef<ListStoreItemsResponse,ListStoreItemsVariables>;

export function listStoreItems(vars: ListStoreItemsVariables): QueryPromise<ListStoreItemsResponse, ListStoreItemsVariables>;
export function listStoreItems(dc: DataConnect, vars: ListStoreItemsVariables): QueryPromise<ListStoreItemsResponse,ListStoreItemsVariables>;


