import UpperNavbar from '@/components/UpperNavbar';
import React from 'react';
import { StyleSheet, Text, ScrollView, Dimensions } from 'react-native';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function HomeScreen() {
  return (
    <SafeAreaView>
      <UpperNavbar />
      <ScrollView showsHorizontalScrollIndicator={false} style={styles.container}>
        <View style={{ padding: 10 }}>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const deviceHeight = Dimensions.get('window').height;
const desiredHeight = deviceHeight - 100;

export const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    height: desiredHeight,
    backgroundColor: '#fff'
  }
});

export default HomeScreen;
