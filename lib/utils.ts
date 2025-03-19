export const Utils = {
  getFormattedDate(date: Date) {
    return date.toLocaleDateString('en-GB').split('/').join('-');
  },
  getAgeString(dob: Date) {
    let years =  (new Date()).getFullYear() - dob.getFullYear();
    let months = (new Date()).getMonth() - dob.getMonth();

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
  }
}