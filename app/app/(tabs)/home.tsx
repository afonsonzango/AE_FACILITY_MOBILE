import UpperNavbar from '@/components/UpperNavbar';
import React from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function HomeScreen() {
  return (
    <SafeAreaView>
      <UpperNavbar />
      <ScrollView showsHorizontalScrollIndicator={false} style={styles.container}>
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
      </ScrollView>
    </SafeAreaView>
  );
}

const deviceHeight = Dimensions.get('window').height;
const desiredHeight = deviceHeight - 100;

export const styles = StyleSheet.create({ 
  container: { 
    padding: 10, 
    marginTop: 50, 
    height: desiredHeight, 
  } 
});

export default HomeScreen;