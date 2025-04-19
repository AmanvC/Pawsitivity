export enum ESecureStoreKeys {
  JWT_TOKEN = "JWT_TOKEN",
  SELECTED_COMMUNITY = "SELECTED_COMMUNITY",
  DEVICE_ID = "DEVICE_ID"
}

export enum EApiEndpoints {
  Login = "auth/login",
  ForceLogin = "auth/force-login",
  GetDogGroupsInfoInACommunity = "common/getAllInfo",
  CreateDog = "dog/create",
  CreateFeedingRequest = "feedingRequest/create",
  GetAllPendingFeedingRequests = "feedingRequest/get/pending",
  AcceptFeedingRequest = "feedingRequest/accept",
  GetAllUserCreatedFeedingRequests = "feedingRequest/get/userCreated",
  GetAllUserAcceptedFeedingRequests = "feedingRequest/get/userAccepted",
  SaveExpoPushToken = "common/save/expoPushToken"
}

export enum EApiStatus {
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE"
}

export type TApiGenericResponse = {
  status: EApiStatus;
  message: string
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
  status: EApiStatus;
  filters: TRegisteredDogsFilter[];
  dogsList: TRegisteredDogDTO[]
}

export type TREQUEST_GetAllCommunityDogGroupsAndDogInfo = TREQUEST_GetRegisteredDogs;

export type TRESPONSE_GetAllCommunityDogGroupsAndDogInfo = {
  status: EApiStatus,
  data: {
    _id: string;
    communityName: string;
    dogGroups: {
      _id: string;
      groupName: string;
      dogs: {
        _id: string;
        dogName: string;
      }[]
    }[]
  }[]
}

export type TREQUEST_CreateFeedingRequest = {
  communityId: string;
  dogGroupId: string;
  fromDate: string;
  toDate?: string | null;
  message?: string | null;
}

export type TREQUEST_GetPendingFeedingRequests = {
  communityId: string;
}

enum EFeedingRequestStatus {
  ACCEPTED = "ACCEPTED",
  PENDING = "PENDING"
}

export type TRESPONSE_GetPendingFeedingRequests = {
  status: EApiStatus,
  data: {
    _id: string;
    requestStatus: {
      status: EFeedingRequestStatus,
      acceptedBy?: {
        name: string;
      };
      acceptedOn?: Date
    };
    createdBy: {
      name: string;
    };
    dogGroup: {
      groupName: string;
      dogs: {
        dogName: string;
      }[]
    };
    fromDate: Date;
    toDate: Date;
    message: string | null;
    createdAt: Date;
  }[];
}

export type TREQUEST_AcceptFeedingRequest = {
  feedingRequestId: string;
}

export type TRESPONSE_GetUserCreatedFeedingRequests = TRESPONSE_GetPendingFeedingRequests;

export type TRESPONSE_GetUserAcceptedFeedingRequests = TRESPONSE_GetPendingFeedingRequests;