import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={Colors.dark1} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Procurar',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'search' : 'search-outline'} color={Colors.dark1} />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: 'Lista de desejos',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'heart' : 'heart-outline'} color={Colors.dark1} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Meu Perfil',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person' : 'person-outline'} color={Colors.dark1} />
          ),
        }}
      />
      <Tabs.Screen
        name="warehouse"
        options={{
          title: 'Armazem',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'bag' : 'bag-outline'} color={Colors.dark1} />
          ),
        }}
      />
    </Tabs>
  );
}
