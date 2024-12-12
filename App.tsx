import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Home, Task, Chatbot, Setting } from './Page'; // Adjust the import path accordingly
import { ThemeProvider } from './Page/ThemeContext';
import { LanguageProvider } from './Page/LanguageContext';
import CustomTabBarIcon from './Page/CustomTabBarIcon'; // Adjust the import path accordingly
import ProfileManage from './Page/ProfileManage'; // Adjust the import path accordingly
import ProfileDashboard from './Page/ProfileDashboard'; // Adjust the import path accordingly

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileManage" component={ProfileManage} />
    <Stack.Screen name="ProfileDashboard" component={ProfileDashboard} />
  </Stack.Navigator>
);

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              tabBarShowLabel: false,
              headerShown: false,
            }}
          >
            <Tab.Screen
              name="Home"
              component={Home}
              options={{
                tabBarIcon: ({ focused }) => <CustomTabBarIcon name="home" type="Entypo" focused={focused} />,
              }}
            />
            <Tab.Screen
              name="Task"
              component={Task}
              options={{
                tabBarIcon: ({ focused }) => <CustomTabBarIcon name="tasks" type="FontAwesome5" focused={focused} />,
              }}
            />
            <Tab.Screen
              name="ProfileStack"
              component={ProfileStack}
              options={{
                tabBarIcon: ({ focused }) => <CustomTabBarIcon name="face-man-profile" type="MaterialCommunityIcons" focused={focused} />,
              }}
            />
            <Tab.Screen
              name="Chatbot"
              component={Chatbot}
              options={{
                tabBarIcon: ({ focused }) => <CustomTabBarIcon name="chat" type="MaterialIcons" focused={focused} />,
              }}
            />
            <Tab.Screen
              name="Setting"
              component={Setting}
              options={{
                tabBarIcon: ({ focused }) => <CustomTabBarIcon name="setting" type="AntDesign" focused={focused} />,
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
