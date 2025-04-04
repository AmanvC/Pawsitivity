export enum ESecureStoreKeys {
  JWT_TOKEN = "JWT_TOKEN",
  SELECTED_COMMUNITY = "SELECTED_COMMUNITY",
  DEVICE_ID = "DEVICE_ID"
}

export enum TApiStatus {
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE"
}

export type TFilterType = {
  label: string;
  value: string;
}

export type TREQUEST_GetRegisteredDogs = {
  communityId: string;
}

type TRegisteredDogsFilter = {
  _id: string,
  groupName: string;
}

export type TVaccinationDetailDTO = {
  _id: string;
  vaccinationName: string;
  veterinaryName?: string;
  vaccinationDate?: Date;
}

export type TRegisteredDogDTO = {
  _id: string;
  lastUpdatedBy: {
    _id: string;
    name: string;
  };
  dogGroup: TRegisteredDogsFilter;
  dogName: string;
  dob?: Date;
  abcStatus: boolean;
  vaccinationStatus: boolean;
  vaccinationDetails: TVaccinationDetailDTO[];
  image?: string;
  createdAt: Date,
  updatedAt: Date
}

export type TRESPONSE_GetRegisteredDogs = {
  status: TApiStatus;
  filters: TRegisteredDogsFilter[];
  dogsList: TRegisteredDogDTO[]
}