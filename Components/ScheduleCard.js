import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ScheduleCard = ({ activity }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.activityName}>{activity.activityName}</Text>
      <Text>Start Date: {activity.startDate}</Text>
      <Text>End Date: {activity.endDate}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activityName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default ScheduleCard;