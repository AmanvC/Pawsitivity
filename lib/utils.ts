import { getKey, saveKey } from "./secureStore";
import uuid from 'react-native-uuid';
import { ESecureStoreKeys } from "./types";

export const Utils = {
  getFormattedDate(date: Date) {
    const updatedDate = new Date(date); // because mongodb stores date in ISO 8601 format
    return updatedDate.toLocaleDateString('en-GB').split('/').join('-');
  },
  getAgeString(dob: Date | string) {
    const updatedDob = new Date(dob);
    let years =  (new Date()).getFullYear() - updatedDob.getFullYear();
    let months = (new Date()).getMonth() - updatedDob.getMonth();

    // Adjust if the end month is before the start month
    if (months < 0) {
      years--; // Reduce a year
      months += 12; // Convert negative months to positive
    }
    const yearsString = years + " Years";
    const monthsString = months + " Months";
    let ageString = "";
    if(!years) ageString = monthsString;
    else if (!months) ageString = yearsString;
    else ageString = yearsString + " and " + monthsString;
    return ageString;
  },
  getGroupNameAvatar(name: string) {
    const namesList = name.split(" ").slice(0, 2);
    return namesList[1] 
      ? namesList[0].charAt(0).toUpperCase() + namesList[1].charAt(0).toUpperCase()
      : namesList[0].charAt(0).toUpperCase();
  },

  async getOrCreateDeviceId()  {
    try {
      let deviceId = await getKey(ESecureStoreKeys.DEVICE_ID);
      
      if (!deviceId) {
        deviceId = uuid.v4();
        await saveKey(ESecureStoreKeys.DEVICE_ID, deviceId);
      }
      return deviceId;
    } catch (err) {
      console.log("Error in generating uuid!");
      return "";
    }
  },

  checkCorrectDateFormat(dateStr: string): boolean {
    const [dayStr, monthStr, yearStr] = dateStr.split("-");
    const day = Number(dayStr);
    const month = Number(monthStr);
    const year = Number(yearStr);

    if(!day || !month || !year) return false;
    const date = new Date(year, month - 1, day); // months are 0-indexed

    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }
}