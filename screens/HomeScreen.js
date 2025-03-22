import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import CropForm from '../Components/CropForm';
import ScheduleCard from '../Components/ScheduleCard';
import calendarService from '../Services/CalenderService';

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
        {schedule.map((activity, index) => (
          <ScheduleCard key={index} activity={activity} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  scheduleContainer: {
    marginTop: 20,
  },
});

export default HomeScreen;