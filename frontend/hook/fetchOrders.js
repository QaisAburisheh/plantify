import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useState, useEffect } from "react";
import {IPV4} from '@env'


const fetchOrders = async () => {
  const [data, setData] = useState([]);
  const [loading, setLoader] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoader(true);
    const token = await AsyncStorage.getItem("token");

    try {
      const endpoint = `http://${IPV4}:3000/api/orders`;
      console.log(token);

      const headers = {
        "Content-Type": "application/json",
        token: "Bearer " + JSON.parse(token),
      };
      const response = await axios.get(endpoint, { headers });

      setData(response.data);
      setLoader(false);
    } catch (error) {
      setError(error);
    } finally {
      setLoader(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const refetch = () => {
    setLoader(true);
    fetchData();
  };
  return { data, loading, error, refetch };
};
export default fetchOrders;
