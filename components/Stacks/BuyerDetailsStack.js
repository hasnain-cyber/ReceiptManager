import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {addBuyerDetails, clearBuyerDetails, store} from '../..';

const DT_MODES = {
  DATE: 'date',
  TIME: 'time',
};

export const main_colors = {
  BLACK: 'black',
  WHITE: 'white',

  BG_COLOR: '#FFD9DA50',
  ACCENT_COLOR_SUCCESS: 'green',
  ACCENT_COLOR_FAILURE: '#FF4365',

  PRIMARY_COLOR: 'lightgreen',
  PRIMARY_COLOR_SHADE: '#3F3F37',
  PRIMARY_COLOR_TINT: '#B3F2DD',
};

const BuyerDetailsStack = ({navigation}) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [dTPickerMode, setDTPickerMode] = useState(DT_MODES.DATE);
  const [showDTPicker, setShowDTPicker] = useState(false);
  const [nameIconColor, setNameIconColor] = useState(main_colors.BLACK);
  const [phoneNumberIconColor, setPhoneNumberIconColor] = useState(
    main_colors.BLACK,
  );

  const showAlert = alertDescription => {
    Alert.alert('Invalid Input', alertDescription, [{text: 'OK'}]);
  };

  const handleNextClick = () => {
    // validating first
    if (name.length === 0) {
      showAlert('Name field cannot be empty.');
    } else if (phoneNumber.length !== 10) {
      showAlert('Contact Number should contain 10 digits.');
    } else {
      const buyerDetails = {
        name: name.trimEnd(),
        phoneNumber: phoneNumber.trimEnd(),
        date,
        time,
      };

      // clear fields before proceeding to next stack
      setName('');
      setPhoneNumber('');
      setNameIconColor(main_colors.BLACK);
      setPhoneNumberIconColor(main_colors.BLACK);
      store.dispatch(clearBuyerDetails());

      store.dispatch(addBuyerDetails(buyerDetails));
      navigation.navigate('itemDetails');
    }
  };

  const formatTime = dateObj => {
    let hours = dateObj.getHours();
    let minutes = dateObj.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes; // to add padding to minutes
    const currentTime = hours + ':' + minutes + ' ' + ampm;
    return currentTime;
  };

  const handleDTPickerChange = (event, selectedDateTime) => {
    setShowDTPicker(false);

    const tempDateObj = selectedDateTime || new Date();
    switch (dTPickerMode) {
      case DT_MODES.DATE:
        const currentDate =
          tempDateObj.getDate() +
          '/' +
          tempDateObj.getMonth() +
          '/' +
          tempDateObj.getFullYear();
        setDate(currentDate);
        break;
      case DT_MODES.TIME:
        setTime(formatTime(tempDateObj));
        break;
      default:
        break;
    }
  };

  // set date and time initially
  useEffect(() => {
    // re initiate date and time every time component gets focused to get current time and date
    return navigation.addListener('focus', () => {
      const tempDateObj = new Date();
      const currentDate =
        tempDateObj.getDate() +
        '/' +
        tempDateObj.getMonth() +
        '/' +
        tempDateObj.getFullYear();
      setDate(currentDate);
      setTime(formatTime(tempDateObj));
    });
  }, [navigation]);

  return (
    <View style={styles.mainContainer}>
      <View>
        <ScrollView>
          <View style={styles.inputGroup}>
            <Text style={styles.inputGroupLabel}>Customer Name</Text>
            <View style={styles.textInputContainer}>
              <MaterialIcons
                name="person-outline"
                size={40}
                color={nameIconColor}
              />
              <TextInput
                value={name}
                onChangeText={text => {
                  text = text.trimStart();
                  setName(text);
                  setNameIconColor(
                    text.length === 0
                      ? main_colors.BLACK
                      : main_colors.ACCENT_COLOR_SUCCESS,
                  );
                }}
                style={styles.input}
              />
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputGroupLabel}>Phone Number</Text>
            <View style={styles.textInputContainer}>
              <MaterialCommunityIcons
                name="cellphone"
                size={40}
                color={phoneNumberIconColor}
              />
              <TextInput
                value={phoneNumber}
                maxLength={10}
                onChangeText={text => {
                  text = text.trimStart();
                  setPhoneNumber(text.replace(/[^0-9]/g, ''));
                  setPhoneNumberIconColor(
                    text.length === 0
                      ? main_colors.BLACK
                      : main_colors.ACCENT_COLOR_SUCCESS,
                  );
                }}
                style={styles.input}
                keyboardType="numeric"
              />
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              setDTPickerMode(DT_MODES.DATE);
              setShowDTPicker(true);
            }}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputGroupLabel}>Date</Text>
              <View style={styles.textInputContainer}>
                <MaterialIcons name="date-range" size={40} color="green" />
                <TextInput value={date} style={styles.input} editable={false} />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              setDTPickerMode(DT_MODES.TIME);
              setShowDTPicker(true);
            }}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputGroupLabel}>Time</Text>
              <View style={styles.textInputContainer}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={40}
                  color="green"
                />
                <TextInput value={time} style={styles.input} editable={false} />
              </View>
            </View>
          </TouchableOpacity>
          {showDTPicker && (
            <DateTimePicker
              value={new Date()}
              mode={dTPickerMode}
              onChange={handleDTPickerChange}
            />
          )}
          <TouchableOpacity
            style={styles.buttonTouchableOpacity}
            onPress={handleNextClick}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: main_colors.BG_COLOR,
  },
  inputGroup: {
    margin: 10,
  },
  inputGroupLabel: {
    color: main_colors.BLACK,
    fontSize: 25,
    marginBottom: 5,
  },
  textInputContainer: {
    backgroundColor: main_colors.WHITE,
    flexDirection: 'row',
    borderRadius: 5,
    borderWidth: 1,
    alignItems: 'center',
    padding: 5,
  },
  input: {
    flex: 1,
    fontSize: 20,
    color: main_colors.BLACK,
  },
  buttonTouchableOpacity: {
    alignSelf: 'flex-end',
    backgroundColor: main_colors.ACCENT_COLOR_SUCCESS,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginHorizontal: 10,
    marginVertical: 30,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: main_colors.WHITE,
  },
});

export default BuyerDetailsStack;
