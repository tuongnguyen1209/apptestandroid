import axios from "axios";
import { BarCodeScanner } from "expo-barcode-scanner";
import React, { useEffect, useState } from "react";
import { Image } from "react-native";
import { TextInput } from "react-native";
import { Button } from "react-native";
import { StyleSheet, Text, View } from "react-native";

const ScanScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState("");
  const [product, setProduct] = useState({});
  const [steps, setSteps] = useState(0);
  const [orders, setOrders] = useState({
    saler: "61027fb17965770015cf2120",
    customer: "60e81c4e50017d2c0426cc5d",
    details: [],
    type: "Đơn hàng bán",
  });
  const [color, setColor] = useState({
    product: "",
    color: "",
    price: 0,
    quantity: 1,
  });

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setData(data);

    if (data.indexOf("colorapp/product:") !== 1) {
      let id = data.split(":")[1];
      setLoading(true);
      axios
        .get(`https://monacolor.herokuapp.com/api/v1/products/${id}`)
        .then((result) => {
          console.log(result.data.data.product);
          setProduct(result.data.data.product);
        })
        .finally(() => {
          setLoading(false);

          setSteps(1);
        });
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return (
      <View>
        <Text>No access to camera</Text>
        <Button
          title="Allow Camera"
          onPress={BarCodeScanner.requestPermissionsAsync()}
        />
      </View>
    );
  }
  const preScan = () => {
    setData("");
    setProduct({});
    setSteps(0);
  };

  const choneColor = (idcolor) => {
    const newCl = { ...color };
    newCl.product = product._id;
    newCl.color = idcolor;
    newCl.price = product.lastestPrice;
    setColor(newCl);
    setSteps(2);
  };

  const onChangeNumber = (num) => {
    console.log(num);
    const newCl = { ...color };
    newCl.quantity = num;
    setColor(newCl);
  };
  const xacNhan = () => {
    const newOrders = { ...orders };
    newOrders.details.push(color);
    setOrders(newOrders);
    setSteps(3);
  };
  const buyOrder = () => {
    setColor({
      product: "",
      color: "",
      price: 0,
      quantity: 1,
    });
    setSteps(0);
    setData("");
  };
  const datOrder = () => {
    console.log(orders);
    console.log("dat hang");
    setLoading(true);
    axios
      .post("https://monacolor.herokuapp.com/api/v1/orders", orders)
      .then((result) => {
        console.log(result.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
        setSteps(0);
        setData("");
        setColor({
          product: "",
          color: "",
          price: 0,
          quantity: 1,
        });
        setOrders({
          saler: "61027fb17965770015cf2120",
          customer: "60e81c4e50017d2c0426cc5d",
          details: [],
          type: "Đơn hàng bán",
        });
      });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {!data && (
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}

      {steps === 1 && (
        <View>
          <Text>{data}</Text>
          <Text style={styles.styleText}>Tên:{product.name}</Text>
          <Text style={styles.styleText}>Giá:{product.lastestPrice}</Text>
          <Text style={styles.styleText}>Mô Tả:{product.desc}</Text>
          <Text style={styles.styleText}>Bề Mặt: {product.surfaces}</Text>
          <Text style={styles.styleText}>Loại: {product.types}</Text>
          <Text style={styles.styleText}>
            Bề Măt sau sơn: {product.surfacegloss}
          </Text>
          <Text>Màu Trong sản phẩm</Text>
          {product.colors &&
            product.colors.map((el) => (
              <Text key={el._id} style={{}}>
                -Màu: {el.color.name} -- Tồn Kho: {el.inventory} --
                <Button
                  title="Chọn mua"
                  onPress={() => {
                    choneColor(el._id);
                  }}
                />
              </Text>
            ))}
          <Image
            style={styles.img}
            source={{
              uri: product.image
                ? product.image
                : "https://matronggroup.com/wp-content/uploads/2021/01/Gia-1-thung-son-Kova-bao-nhieu-tien-12.jpg",
            }}
          />
          <Button title="Scan lại" onPress={preScan} />
        </View>
      )}
      {steps === 2 && (
        <View>
          <Text style={styles.styleText}>Tên:{product.name}</Text>
          <Text style={styles.styleText}>Màu đã chọn: {color.color} </Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeNumber}
            value={`${color.quantity}`}
            placeholder="Nhập Số Lượng muốn mua"
          />
          <Button title="Xác Nhận" onPress={xacNhan} />
        </View>
      )}
      {steps === 3 && (
        <View>
          <Text style={styles.styleText}>Tên khách:{orders.customer}</Text>
          <Text style={styles.styleText}>Tên seller:{orders.saler}</Text>

          {orders.details.length > 0 &&
            orders.details.map((el, ind) => (
              <Text style={styles.styleText} key={`mau${ind}`}>
                --Tên Màu:{el.color}--số lượng:{el.quantity}
              </Text>
            ))}
          <View style={styles.wrapbutton}>
            <Button title="Mua Sản Phẩm Khác" onPress={buyOrder} />
          </View>
          <View style={styles.wrapbutton}>
            <Button title="Đặt mua" onPress={datOrder} />
          </View>
        </View>
      )}
      {loading && <Text>loading</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  camera: {
    width: "100%",
    height: "100vh",
  },
  forcus: {
    width: "50%",
    position: "absolute",
    top: "50%",
    left: "25%",
    borderColor: "white",

    zIndex: 999,
  },
  styleText: {
    padding: 15,
  },
  img: {
    width: 100,
    height: 100,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  wrapbutton: {
    marginBottom: 10,
  },
});

export default ScanScreen;
