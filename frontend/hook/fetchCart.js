import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useState, useEffect } from "react";
import {IPV4} from '@env'


const fetchCart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");

    try {
      const endpoint = `http://${IPV4}:3000/api/cart/find`;
      const headers = {
        "Content-Type": "application/json",
        token: "Bearer " + JSON.parse(token),
      };

      const response = await axios.get(endpoint, { headers });
      const cartProducts = response.data.products;
      console.log("fetchCart Response:", cartProducts);
      setData(cartProducts);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};

export default fetchCart;
