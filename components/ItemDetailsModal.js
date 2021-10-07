import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  ScrollView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {addItem, modifyItem, store} from '..';
import {main_colors} from './Stacks/BuyerDetailsStack';

const ItemDetailsModal = ({navigation, route}) => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [gst, setGst] = useState('');

  const [itemNameIconColor, setItemNameIconColor] = useState(main_colors.BLACK);
  const [quantityIconColor, setQuantityIconColor] = useState(main_colors.BLACK);
  const [unitPriceIconColor, setUnitPriceIconColor] = useState(
    main_colors.BLACK,
  );
  const [discountIconColor, setDiscountIconColor] = useState(main_colors.BLACK);
  const [gstIconColor, setGstIconColor] = useState(main_colors.BLACK);

  useEffect(() => {
    const modifyName = route.params.modifyName;

    // check to modify or not
    if (modifyName) {
      const itemsList = store.getState().itemsReducer;
      const searchItem = itemsList.filter(
        item => item.itemName === modifyName,
      )[0];

      // fill the fields with previous values if modify is required,
      // and convert float values back to string because textInput only works with strings
      setItemName(searchItem.itemName);
      setQuantity(searchItem.quantity.toString());
      setUnitPrice(searchItem.unitPrice.toString());
      setDiscount(searchItem.discount.toString());
      setGst(searchItem.gst.toString());

      // also change the icons to green as fields are already filled
      setItemNameIconColor(main_colors.ACCENT_COLOR_SUCCESS);
      setQuantityIconColor(main_colors.ACCENT_COLOR_SUCCESS);
      setUnitPriceIconColor(main_colors.ACCENT_COLOR_SUCCESS);
      setDiscountIconColor(main_colors.ACCENT_COLOR_SUCCESS);
      setGstIconColor(main_colors.ACCENT_COLOR_SUCCESS);
    }
  }, [route.params.modifyName]);

  const showAlert = alertDescription => {
    Alert.alert('Invalid Input', alertDescription, [{text: 'OK'}]);
  };

  const handleAddClick = () => {
    if (itemName.length === 0) {
      showAlert('Item name can not be empty.');
    } else if (quantity.length === 0) {
      showAlert('No quantity specified');
    } else if (unitPrice.length === 0) {
      showAlert('No unit price specified');
    } else if (gst.length === 0) {
      showAlert('No GST Rate specified');
    } else {
      const itemObject = {
        itemName: itemName.trimEnd(),
        quantity: parseFloat(quantity.trimEnd()),
        unitPrice: parseFloat(unitPrice.trimEnd()),
        // discount is by default 0
        discount: discount.length > 0 ? parseFloat(discount.trimEnd()) : 0,
        gst: parseFloat(gst.trimEnd()),
      };
      // if all fields are validated, then check if the modal was opened to modify or create new item.
      const modifyName = route.params.modifyName;
      if (modifyName) {
        store.dispatch(modifyItem(modifyName, itemObject));
        navigation.navigate('itemDetails');
      } else {
        const itemList = store.getState().itemsReducer;
        const result = itemList.filter(item => item.itemName === itemName);
        if (result.length === 0) {
          store.dispatch(addItem(itemObject));
          navigation.navigate('itemDetails');
        } else {
          showAlert('Item already exists in receipt.');
        }
      }
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View>
        <ScrollView>
          <View style={styles.inputGroup}>
            <Text style={styles.inputGroupLabel}>Item Name</Text>
            <View style={styles.textInputContainer}>
              <MaterialCommunityIcons
                name="zip-box-outline"
                size={40}
                color={itemNameIconColor}
              />
              <TextInput
                value={itemName}
                onChangeText={text => {
                  text = text.trimStart();
                  setItemName(text);
                  setItemNameIconColor(
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
            <Text style={styles.inputGroupLabel}>Quantity</Text>
            <View style={styles.textInputContainer}>
              <MaterialCommunityIcons
                name="format-list-numbered"
                size={40}
                color={quantityIconColor}
              />
              <TextInput
                value={quantity}
                keyboardType="numeric"
                onChangeText={text => {
                  console.log(typeof text);
                  text = text.trimStart();
                  setQuantity(text);
                  setQuantityIconColor(
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
            <Text style={styles.inputGroupLabel}>Unit Price</Text>
            <View style={styles.textInputContainer}>
              <MaterialIcons
                name="attach-money"
                size={40}
                color={unitPriceIconColor}
              />
              <TextInput
                value={unitPrice}
                keyboardType="numeric"
                onChangeText={text => {
                  text = text.trimStart();
                  setUnitPrice(text);
                  setUnitPriceIconColor(
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
            <Text style={styles.inputGroupLabel}>Discount</Text>
            <View style={styles.textInputContainer}>
              <MaterialCommunityIcons
                name="label-percent-outline"
                size={40}
                color={discountIconColor}
              />
              <TextInput
                value={discount}
                keyboardType="numeric"
                onChangeText={text => {
                  text = text.trimStart();
                  setDiscount(text);
                  setDiscountIconColor(
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
            <Text style={styles.inputGroupLabel}>GST</Text>
            <View style={styles.textInputContainer}>
              <MaterialCommunityIcons
                name="percent-outline"
                size={40}
                color={gstIconColor}
              />
              <TextInput
                value={gst}
                keyboardType="numeric"
                onChangeText={text => {
                  text = text.trimStart();
                  setGst(text);
                  setGstIconColor(
                    text.length === 0
                      ? main_colors.BLACK
                      : main_colors.ACCENT_COLOR_SUCCESS,
                  );
                }}
                style={styles.input}
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.buttonTouchableOpacity,
                {backgroundColor: main_colors.ACCENT_COLOR_FAILURE},
              ]}
              onPress={() => navigation.goBack()}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonTouchableOpacity}
              onPress={handleAddClick}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
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
    marginLeft: 10,
    color: main_colors.BLACK,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 30,
  },
  buttonTouchableOpacity: {
    backgroundColor: main_colors.ACCENT_COLOR_SUCCESS,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: main_colors.WHITE,
  },
});

export default ItemDetailsModal;
