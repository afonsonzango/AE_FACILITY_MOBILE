import { StyleSheet, Text, View } from "react-native"
import { TabBarIcon } from "./navigation/TabBarIcon"
import { SafeAreaView } from "react-native-safe-area-context";

const UpperNavbar = () => {
    return (
      <SafeAreaView>
        <View style={styles.NavbarTop}>
            <Text style={{ color: "#000", fontWeight: "bold", fontSize: 17, marginTop: -13 }}>AE Facility</Text>
            <TabBarIcon name={'bag-outline'} color={"#000"} style={{ marginTop: -13 }} />
        </View>
      </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    NavbarTop: {
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      height: 60,
      borderColor: '#ddd',
      paddingHorizontal: 10,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
      position: "absolute",
      top: 0,
      width: "100%",
      zIndex: 100
    }
  });

export default UpperNavbar;