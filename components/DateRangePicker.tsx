import React from "react";
import { View, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import { Text } from "react-native";

type TProps = {
  onDateChange: (fromDate: string | null, toDate: string | null) => void;
  isRequired: boolean;
  range: { startDate: string | null; endDate: string | null };
};

const DateRangePicker = ({ onDateChange, isRequired, range }: TProps) => {
  const today = new Date().toISOString().split("T")[0];

  const onDayPress = (day: { dateString: string }) => {
    if (!range.startDate || (range.startDate && range.endDate)) {
      onDateChange(day.dateString, null);
    } else {
      if (new Date(day.dateString) > new Date(range.startDate)) {
        onDateChange(range.startDate, day.dateString);
      } else {
        onDateChange(day.dateString, null);
      }
    }
  };

  const getMarkedDates = () => {
    let markedDates: { [key: string]: any } = {};

    if (range.startDate) {
      markedDates[range.startDate] = {
        startingDay: true,
        endingDay: !range.endDate,
        color: "#0061FF",
        textColor: "white",
      };
    }

    if (range.endDate) {
      markedDates[range.endDate] = {
        endingDay: true,
        color: "#0061FF",
        textColor: "white",
      };

      let currentDate = new Date(range.startDate!);
      while (currentDate < new Date(range.endDate)) {
        const dateString = currentDate.toISOString().split("T")[0];
        markedDates[dateString] = { color: "#A7C7E7", textColor: "white" };
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return markedDates;
  };

  return (
    <View style={styles.container}>
      <Text>
        Select a Date or a Date Range
        {isRequired && <Text style={styles.required}>*</Text>}
      </Text>
      <Calendar
        onDayPress={onDayPress}
        markingType="period"
        markedDates={getMarkedDates()}
        minDate={today}
        theme={{
          selectedDayBackgroundColor: "#0061FF",
          todayTextColor: "#FF5722",
          arrowColor: "#0061FF",
        }}
      />
      {range.startDate && (
        <Text style={styles.selectedDateRange}>
          Selected:{" "}
          {range.startDate && !range.endDate && `${range.startDate}`}
          {range.startDate && range.endDate && `${range.startDate} → ${range.endDate}`}
        </Text>
      )}
    </View>
  );
};


export default DateRangePicker;

const styles = StyleSheet.create({
  required: { color: '#F75555' },
  container: { flex: 1, marginTop: 10, backgroundColor: "#fff" },
  selectedDateRange: { color: '#0061FF', textAlign: 'center' }
});
