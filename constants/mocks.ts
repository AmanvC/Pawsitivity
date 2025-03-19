import { TDogItemProps } from "@/components/RegisteredDogs"

export const Mocks = {
  getDogsList(): TDogItemProps[] {
    return ([
      {
        dogMetadata: {
          dogName: 'Sheru Lal',
          dob: new Date(),
          vaccinationStatus: 'Vaccinated',
          dogGroup: {label: 'PG Hostel', value: 'pgHostel'}
        },
        vaccinationDetails: [
          {
            vaccinationName: 'Rabies',
            vetName: 'Ganji Chudail',
            date: new Date()
          },
          {
            vaccinationName: 'Parvo',
            vetName: 'Ganji Chudail',
            date: new Date()
          },
        ]
      },
      {
        dogMetadata: {
          dogName: 'Casper',
          dob: new Date(),
          vaccinationStatus: 'Pending',
          dogGroup: {label: 'Departmental Store', value: 'departmentalStore'}
        },
        vaccinationDetails: []
      },
    ])
  }
}