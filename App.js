import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import BuyerDetailsStack from './components/Stacks/BuyerDetailsStack';
import ItemDetailsStack from './components/Stacks/ItemDetailsStack';
import ItemDetailsModal from './components/ItemDetailsModal';
import ReceiptShowStack from './components/Stacks/ReceiptShowStack';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Group>
          <Stack.Screen
            name="buyerDetails"
            component={BuyerDetailsStack}
            options={{title: 'Buyer Details'}}
          />
          <Stack.Screen
            name="itemDetails"
            component={ItemDetailsStack}
            options={{title: 'Item Details'}}
          />
          <Stack.Screen
            name="showReceipt"
            component={ReceiptShowStack}
            options={{title: 'Receipt'}}
          />
        </Stack.Group>
        <Stack.Group screenOptions={{presentation: 'modal'}}>
          <Stack.Screen
            name="MyModal"
            component={ItemDetailsModal}
            options={{title: 'Add Item'}}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
