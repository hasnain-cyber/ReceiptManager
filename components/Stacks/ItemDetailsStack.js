import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ItemCard from '../ItemCard';
import {store} from '../..';
import {main_colors} from './BuyerDetailsStack';

class ItemDetailsStack extends React.Component {
  constructor(props) {
    super(props);

    this.state = {itemsList: store.getState().itemsReducer};
  }

  componentDidMount() {
    store.subscribe(() => {
      this.unsubscribe = this.setState({
        itemsList: store.getState().itemsReducer,
      });
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe !== undefined) {
      this.unsubscribe();
    }
  }

  handleConfirmClick = () => {
    if (this.state.itemsList.length === 0) {
      this.showAlert(
        'Please specify at least one item before proceeding further.',
      );
    } else {
      this.props.navigation.navigate('showReceipt');
    }
  };

  showAlert = alertDescription => {
    Alert.alert('Invalid Input', alertDescription, [{text: 'OK'}]);
  };

  modifyItem = modifyName => {
    this.props.navigation.navigate('MyModal', {modifyName});
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        {this.state.itemsList.length > 0 ? (
          <View>
            <View style={styles.itemListHeader}>
              <Text style={styles.itemListHeaderText}>Name</Text>
              <Text style={styles.itemListHeaderText}>Quantity</Text>
              <Text style={styles.itemListHeaderText}>Total Price</Text>
            </View>
            <FlatList
              data={this.state.itemsList}
              renderItem={({item}) => (
                <ItemCard item={item} modifyFunction={this.modifyItem} />
              )}
              style={styles.flatList}
            />
          </View>
        ) : (
          <View style={styles.substitutionView}>
            <MaterialIcons name="add-shopping-cart" size={120} color="black" />
            <Text style={styles.substitutionViewText}>No items added!</Text>
          </View>
        )}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[
              styles.buttonTouchableOpacity,
              {backgroundColor: main_colors.ACCENT_COLOR_FAILURE},
            ]}
            onPress={() => this.props.navigation.goBack()}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButtonTouchableOpacity}
            onPress={() => {
              this.props.navigation.navigate('MyModal', {modifyName: null});
            }}>
            <MaterialCommunityIcons name="plus" size={40} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.buttonTouchableOpacity,
              {backgroundColor: main_colors.ACCENT_COLOR_SUCCESS},
            ]}
            onPress={this.handleConfirmClick}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: main_colors.BG_COLOR,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 15,
    margin: 10,
    padding: 5,
    backgroundColor: main_colors.PRIMARY_COLOR_SHADE,
  },
  buttonTouchableOpacity: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    margin: 10,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: main_colors.WHITE,
  },
  addButtonTouchableOpacity: {
    borderRadius: 40,
    backgroundColor: main_colors.PRIMARY_COLOR,
    padding: 5,
  },
  itemListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 5,
    borderWidth: 1,
    marginHorizontal: 10,
    padding: 20,
    backgroundColor: main_colors.PRIMARY_COLOR_SHADE,
    textAlign: 'center',
  },
  itemListHeaderText: {
    color: main_colors.WHITE,
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  flatList: {
    paddingHorizontal: 1,
    maxHeight: Dimensions.get('window').height * 0.8,
  },
  substitutionView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  substitutionViewText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: main_colors.BLACK,
  },
});

export default ItemDetailsStack;
