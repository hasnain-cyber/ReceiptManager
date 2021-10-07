import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
  AlertIOS,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {store} from '../..';
import {captureScreen} from 'react-native-view-shot';
import Share from 'react-native-share';
import {main_colors} from './BuyerDetailsStack';
import fs from 'react-native-fs';

const imageFormat = 'png';

const TableRow = ({itemObject}) => {
  const totalPrice =
    itemObject.unitPrice * itemObject.quantity -
    itemObject.discount +
    itemObject.gst;

  return (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{itemObject.itemName}</Text>
      <Text style={styles.tableCell}>
        {parseFloat(itemObject.quantity).toFixed(2)}
      </Text>
      <Text style={styles.tableCell}>
        {parseFloat(itemObject.unitPrice).toFixed(2)}
      </Text>
      <Text style={styles.tableCell}>
        {parseFloat(itemObject.discount).toFixed(2)}
      </Text>
      <Text style={styles.tableCell}>
        {parseFloat(itemObject.gst).toFixed(2)}
      </Text>
      <Text style={styles.tableCell}>{parseFloat(totalPrice).toFixed(2)}</Text>
    </View>
  );
};

const ReceiptShowStack = ({navigation}) => {
  const [tableRowList, setTableRowList] = useState([]);
  const [buyerName, setBuyerName] = useState('');
  const [buyDate, setBuyDate] = useState('');
  const [buyTime, setBuyTime] = useState('');
  const [grandTotal, setGrandTotal] = useState(0);

  const [storagePermission, setStoragePermission] = useState(false);
  const [componentVisible, setComponentVisible] = useState(true);

  useEffect(() => {
    // populating table and calculating grand total
    const tempList = [];
    let tempGrandTotal = 0;
    store.getState().itemsReducer.forEach(item => {
      tempGrandTotal +=
        item.unitPrice * item.quantity - item.discount + item.gst;

      tempList.push(<TableRow key={item.itemName} itemObject={item} />);
    });
    setTableRowList(tempList);
    setGrandTotal(tempGrandTotal);

    // get the buyer details
    const buyerDetails = store.getState().buyerReducer;
    setBuyerName(buyerDetails.name);
    setBuyDate(buyerDetails.date);
    setBuyTime(buyerDetails.time);
  }, []);

  const takeViewShot = () => {
    // setting other unnecessary components invisible
    setComponentVisible(false);
    // set some delay so that components get invisible properly
    setTimeout(() => {
      captureScreen()
        .then(imageUri => {
          setComponentVisible(true);

          // convert to base64
          const imageUriArr = imageUri.split('/');
          const fileName = imageUriArr[imageUriArr.length - 1];
          fs.readFile(imageUri, 'base64').then(imageBase64 => {
            // handle storage permissions first
            handleStoragePermission();

            // save to device storage
            const folderPath = fs.PicturesDirectoryPath + '/ReceiptGenerator';
            fs.exists(folderPath).then(folderExists => {
              const filePath = folderPath + '/' + fileName;
              if (folderExists) {
                saveImage(filePath, imageBase64);
              } else {
                fs.mkdir(folderPath)
                  .then(() => {
                    saveImage(filePath, imageBase64);
                  })
                  .catch(error => console.log(error));
              }
            });
          });
        })
        .catch(err => {
          setComponentVisible(true);
          console.log(err);
        });
    }, 10);
  };

  const saveImage = (imagePath, imageBase64) => {
    fs.writeFile(imagePath, imageBase64, 'base64')
      .then(() => {
        fs.scanFile(imagePath).catch(error => {
          console.log(error);
        });
        const message = 'Screenshot taken successfully!';
        if (Platform.OS === 'android') {
          ToastAndroid.show(message, ToastAndroid.SHORT);
        } else {
          AlertIOS.alert(message);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleStoragePermission = () => {
    if (!storagePermission) {
      if (Platform.OS === 'ios') {
        // storage permission is by default in ios
        setStoragePermission(true);
      } else {
        PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ).then(isPermitted => {
          if (isPermitted) {
            setStoragePermission(true);
          } else {
            PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            ).then(() => setStoragePermission(true));
          }
        });
      }
    }
  };

  return (
    <View style={styles.mainContainer}>
      {componentVisible ? (
        <TouchableOpacity
          style={styles.backButtonTouchableOpacity}
          onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            name="keyboard-backspace"
            size={40}
            color="white"
          />
        </TouchableOpacity>
      ) : null}
      {componentVisible ? (
        <View style={styles.floatingButtonsContainer}>
          <TouchableOpacity
            style={styles.floatingButtonTouchableOpacity}
            onPress={() => {
              setComponentVisible(false);
              setTimeout(() => {
                captureScreen().then(imageUri => {
                  setComponentVisible(true);
                  Share.open({
                    type: `image/${imageFormat}`,
                    url: imageUri,
                    failOnCancel: false,
                  });
                });
              }, 10);
            }}>
            <MaterialCommunityIcons name="share" size={40} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.floatingButtonTouchableOpacity}
            onPress={takeViewShot}>
            <MaterialCommunityIcons name="camera" size={40} color="black" />
          </TouchableOpacity>
        </View>
      ) : null}
      <View style={styles.receiptContainer}>
        <Text style={styles.receiptHeaderText}>Laxmi General Store</Text>
        <View style={styles.receiptFirstContainer}>
          <Text style={styles.detailsContainerText} multiline={true}>
            {
              'Laxmi General Store\nWall Street\nMumbai\nContact: 7698765478\nEmail: laxmi123@gmail.com'
            }
          </Text>
          <Text style={styles.detailsContainerText} multiline={true}>
            {`Buyer: ${buyerName}\nDate: ${buyDate}\nTime: ${buyTime}`}
          </Text>
        </View>
        <View style={styles.itemsTable}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellWeightedText}>Product</Text>
            <Text style={styles.tableCellWeightedText}>Quantity</Text>
            <Text style={styles.tableCellWeightedText}>Unit Price</Text>
            <Text style={styles.tableCellWeightedText}>Discount</Text>
            <Text style={styles.tableCellWeightedText}>GST</Text>
            <Text style={styles.tableCellWeightedText}>Total</Text>
          </View>
          {tableRowList}
          <View style={styles.tableRow}>
            <Text style={styles.tableCellBlankText} />
            <Text style={styles.tableCellBlankText} />
            <Text style={styles.tableCellBlankText} />
            <Text style={styles.tableCellBlankText} />
            <Text style={styles.tableCellWeightedText}>Grand Total</Text>
            <Text style={styles.tableCellWeightedText}>
              {parseFloat(grandTotal).toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={styles.receiptFooterSignatureContainer}>
          <Text style={styles.receiptFooterSignatureText}>Signature</Text>
          <FontAwesome5 name="signature" size={40} color="black" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: main_colors.BG_COLOR,
  },
  backButtonTouchableOpacity: {
    backgroundColor: main_colors.ACCENT_COLOR_FAILURE,
    borderWidth: 1,
    borderRadius: 5,
    margin: 5,
    alignSelf: 'flex-start',
    padding: 5,
  },
  floatingButtonsContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    zIndex: 5,
  },
  floatingButtonTouchableOpacity: {
    backgroundColor: main_colors.PRIMARY_COLOR,
    padding: 10,
    margin: 5,
    elevation: 5,
    zIndex: 5,
    borderRadius: 40,
  },
  tableCellWeightedText: {
    borderWidth: 1,
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
    textAlignVertical: 'center',
  },
  tableCellBlankText: {
    flex: 1,
  },
  receiptContainer: {
    borderWidth: 2,
    borderRadius: 5,
    margin: 10,
    flex: 1,
    backgroundColor: main_colors.WHITE,
  },
  receiptHeaderText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginVertical: 10,
  },
  receiptFirstContainer: {
    flexDirection: 'row',
    borderBottomWidth: 3,
    margin: 10,
  },
  detailsContainerText: {
    padding: 10,
    width: Dimensions.get('window').width / 2,
    color: main_colors.BLACK,
  },
  itemsTable: {
    margin: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    borderWidth: 1,
    flex: 1,
    textAlign: 'center',
    color: main_colors.BLACK,
  },
  receiptFooterSignatureContainer: {
    alignSelf: 'flex-end',
    margin: 10,
    alignItems: 'center',
  },
  receiptFooterSignatureText: {
    fontSize: 20,
    color: main_colors.BLACK,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default ReceiptShowStack;
