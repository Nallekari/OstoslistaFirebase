import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Button } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, onValue, remove } from 'firebase/database';

export default function App() {

  const firebaseConfig = {

    apiKey: "AIzaSyAOmBTr6wq-CXRP-4ZR536vA1fH1OswwO4",
    authDomain: "ostoslistafirebase-7e36e.firebaseapp.com",
    databaseURL: "https://ostoslistafirebase-7e36e-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "ostoslistafirebase-7e36e",
    storageBucket: "ostoslistafirebase-7e36e.appspot.com",
    messagingSenderId: "741505321814",
    appId: "1:741505321814:web:a5a94c89e685162a0b64f7"
  };
  
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

  ref(database,'items/')

  const [amount, setAmount] = useState('');
  const [product, setProduct] = useState('');
  const [items, setItems] = useState([]);



  const saveItem = () => {
    (async () => {
      push(ref(database, 'items/'),
        { 'product': product, 'amount': amount });
      })();
  }

  const deleteItem = (id) => {
    ref(database, `items/${id}`).remove();
  }

  useEffect(() => {
    const itemsRef = ref(database, 'items/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      setItems(Object.values(data));
    })
  }, []);

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder='Product' style={styles.typebox}
        onChangeText={(product) => setProduct(product)}
        value={product}/>  
      <TextInput placeholder='Amount' style={styles.typebox}
        onChangeText={(amount) => setAmount(amount)}
        value={amount}/>      
      <Button onPress={saveItem} title="Save" /> 
      <Text style={{marginTop: 30, fontSize: 20}}>Shopping list</Text>
      <FlatList 
        style={{marginLeft : "5%"}}
        keyExtractor={item => item.id} 
        renderItem={({ item }) =>
        <View style={styles.listcontainer}>
            <Text style={{ fontSize: 18 }}>{item.product}, {item.amount}</Text>
        <Text style={{fontSize: 18, color: '#0000ff'}} onPress={() => deleteItem(item.id)}> bought</Text></View>} 
        data={items} 
        ItemSeparatorComponent={listSeparator} 
      />      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 40
  },
  typebox: {
    width: 200,
    borderColor: 'gray',
    borderWidth: 1
  },
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
   },
  wordBold: {
    fontWeight: 'bold',
    color: 'blue'
 },
});
