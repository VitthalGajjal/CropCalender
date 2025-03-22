import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import CropForm from '../Components/CropForm';
import CombinedActivityTimeline from '../Components/ScheduleCard';
import calendarService from '../Services/CalenderService';
import color from '../assets/Color';

const HomeScreen = () => {
  const [schedule, setSchedule] = useState([]);

  const handleFormSubmit = (formData) => {
    const { region, crop } = formData;
    const generatedSchedule = calendarService.generateSchedule(region, crop);
    setSchedule(generatedSchedule);
  };

  return (
    <ScrollView style={styles.container}>
      <CropForm onFormSubmit={handleFormSubmit} />
      <View style={styles.scheduleContainer}>
        <CombinedActivityTimeline activities={schedule} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: color.lightAccent,
  },
  scheduleContainer: {
    marginTop: 20,
    
  },
});

export default HomeScreen;