import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { View, StyleSheet, Platform, Text } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Icon } from "react-native-elements";

type TProps = {
  allItems: { label: string; value: string }[];
  preSelectedValue?: string;
  dropdownTitle: string;
  onChange: (community: string, selectedValue: string) => void;
  dropdownKey: string;
  isDisabled: boolean;
  isRequired: boolean
};

const Dropdown = ({
  dropdownKey,
  allItems,
  dropdownTitle,
  preSelectedValue,
  onChange,
  isDisabled,
  isRequired
}: TProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(preSelectedValue || null);
  const [items, setItems] = useState(allItems);

  useFocusEffect(
    useCallback(() => {
      setValue(null);
    }, [])
  );

  return (
    <View style={[styles.container, open && styles.containerOpen]}>
      <Text style={isDisabled ? styles.labelDisabled : styles.label}>
        {dropdownTitle}
        {isRequired && <Text style={styles.required}>*</Text>}
      </Text>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder="Choose an option"
        disabled={isDisabled}
        disabledStyle={styles.disabled}
        containerStyle={styles.dropdownContainer}
        style={styles.dropdown}
        dropDownContainerStyle={[styles.dropdownList, open && styles.dropdownListOpen]}
        textStyle={styles.dropdownText}
        ArrowDownIconComponent={() => <Icon name="chevron-down" type="feather" />}
        ArrowUpIconComponent={() => <Icon name="chevron-up" type="feather" />}
        onChangeValue={() => onChange(dropdownKey, value as string)}
      />
    </View>
  );
};

export default Dropdown;

const styles = StyleSheet.create({
  required: { color: '#F75555' },
  container: {
    marginBottom: 15,
    position: "relative", // Ensure positioning
    zIndex: 1, // Default, lower than dropdown when closed
  },
  containerOpen: {
    zIndex: 1000, // Ensure it's above everything when open
  },
  labelDisabled: {
    fontSize: 14,
    marginBottom: 5,
    opacity: 0.5
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  disabled: {
    opacity: 0.5,
  },
  dropdownContainer: {
    zIndex: 1000, // Ensure it's higher than other UI elements
  },
  dropdown: {
    borderColor: "#0061FF1A",
    borderRadius: 10,
    zIndex: 1000, // Higher than background
  },
  dropdownList: {
    borderColor: "#0061FF1A",
    zIndex: 1000, // Ensure dropdown is above other elements
  },
  dropdownListOpen: {
    position: "absolute", // Prevents layout issues
    elevation: Platform.OS === "android" ? 1000 : 0, // Fixes Android layering issues
    zIndex: 1000, // Keeps it on top
  },
  dropdownText: {
    fontSize: 14,
    color: "#666876",
  },
});
