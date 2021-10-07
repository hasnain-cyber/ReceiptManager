import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {deleteItem, store} from '..';
import {main_colors} from './Stacks/BuyerDetailsStack';

const ItemCard = ({item, modifyFunction}) => {
  const totalPrice = item.unitPrice * item.quantity - item.discount + item.gst;

  return (
    // single press to modify
    // long press to delete
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => modifyFunction(item.itemName)}
      onLongPress={() => store.dispatch(deleteItem(item.itemName))}>
      <View style={styles.mainContainer}>
        <Text style={styles.text}>{item.itemName}</Text>
        <Text style={styles.text}>{item.quantity.toFixed(2)}</Text>
        {/* to avoid showing too many decimal places */}
        <Text style={styles.text}>{totalPrice.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 5,
    borderBottomWidth: 1,
    marginHorizontal: 10,
    padding: 20,
    backgroundColor: main_colors.PRIMARY_COLOR_TINT,
  },
  text: {
    color: main_colors.BLACK,
    fontSize: 17,
    flex: 1,
    textAlign: 'center',
  },
});

export default ItemCard;
