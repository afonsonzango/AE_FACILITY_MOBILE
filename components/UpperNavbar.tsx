import { StyleSheet, Text, View } from "react-native"
import { TabBarIcon } from "./navigation/TabBarIcon"

const UpperNavbar = () => {
    return (
        <View style={styles.NavbarTop}>
            <Text style={{ color: "#000", fontWeight: "bold", fontSize: 17 }}>AE Facility</Text>
            <TabBarIcon name={'bag-outline'} color={"#000"} />
        </View>
    )
}

const styles = StyleSheet.create({
    NavbarTop: {
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      height: 50,
      borderColor: '#ddd',
      paddingHorizontal: 10,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
      flexWrap: "wrap",
      position: "absolute",
      top: 0,
      width: "100%"
    }
  });

export default UpperNavbar;