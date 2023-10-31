import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {IPV4} from '@env'


const addToCart = async (productId, quantity) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const endpoint = `http://${IPV4}:3000/api/cart`;
    const data = {
      cartItem: productId,
      quantity: quantity,
    };

    const headers = {
      "Content-Type": "application/json",
      token: "Bearer " + JSON.parse(token),
    };

    const response = await axios.post(endpoint, data, { headers });
    console.log("addToCart Response:", response.data);
  } catch (error) {
    throw new Error(error.message);
  }
};

export default addToCart;
