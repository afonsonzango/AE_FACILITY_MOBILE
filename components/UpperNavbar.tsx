import { Image, StyleSheet, View } from "react-native"
import { TabBarIcon } from "./navigation/TabBarIcon"
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const UpperNavbar = () => {
    return (
      <SafeAreaView>
        <View style={styles.NavbarTop}>
            <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
            <TabBarIcon name={'bag-outline'} color={"#000"} onPress={() => router.replace('/app/aditional/usersReservations')} />
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
      top: -25,
      width: "100%",
      zIndex: 100
    },
    logo: {
      width: 190,
      height: 30
    }
  });

export default UpperNavbar;