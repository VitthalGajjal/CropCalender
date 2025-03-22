import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Text, Chip, Divider, Button, IconButton } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';

const CalendarView = ({ schedule }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  
  if (!schedule) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Paragraph>No schedule generated yet. Please fill out the form to create a crop calendar.</Paragraph>
        </Card.Content>
      </Card>
    );
  }
  
  // Prepare marked dates for the calendar
  const markedDates = {};
  schedule.activities.forEach(activity => {
    const start = moment(activity.startDate);
    const end = activity.endDate === 'Ongoing' 
      ? moment(schedule.activities[schedule.activities.length - 1].startDate)
      : moment(activity.endDate);
    
    let current = start.clone();
    while (current.isSameOrBefore(end)) {
      const dateStr = current.format('YYYY-MM-DD');
      
      // Define color based on activity type
      let color;
      switch(activity.name.split(' ')[0]) {
        case 'Seeding': color = '#8BC34A'; break;
        case 'Planting': color = '#4CAF50'; break;
        case 'Fertilization': color = '#673AB7'; break;
        case 'Irrigation': color = '#03A9F4'; break;
        case 'Harvest': color = '#FF9800'; break;
        default: color = '#9E9E9E';
      }
      
      if (markedDates[dateStr]) {
        // If date already marked, add to dots array
        markedDates[dateStr].dots.push({
          key: activity.name,
          color: color
        });
      } else {
        // Create new marked date
        markedDates[dateStr] = {
          dots: [{
            key: activity.name,
            color: color
          }],
          selected: dateStr === selectedDate,
        };
      }
      
      current.add(1, 'days');
    }
  });
  
  // If a date is selected, add selected property
  if (selectedDate) {
    if (markedDates[selectedDate]) {
      markedDates[selectedDate].selected = true;
    } else {
      markedDates[selectedDate] = { selected: true };
    }
  }
  
  // Get activities for selected date
  const getActivitiesForDate = (date) => {
    return schedule.activities.filter(activity => {
      const start = moment(activity.startDate);
      const end = activity.endDate === 'Ongoing' 
        ? moment(schedule.activities[schedule.activities.length - 1].startDate)
        : moment(activity.endDate);
      
      return moment(date).isBetween(start, end, null, '[]');
    });
  };
  
  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    const dayActivities = getActivitiesForDate(day.dateString);
    setSelectedActivity(dayActivities.length > 0 ? dayActivities[0] : null);
  };
  
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.scheduleCard}>
        <Card.Content>
          <Title>Crop Calendar: {schedule.crop}</Title>
          <View style={styles.headerInfo}>
            <Chip icon="map-marker" style={styles.chip}>{schedule.region}</Chip>
            <Chip icon="water" style={styles.chip}>{schedule.soilType}</Chip>
            <Chip icon="calendar" style={styles.chip}>Start: {moment(schedule.startDate).format('MMM D, YYYY')}</Chip>
          </View>
          
          <Divider style={styles.divider} />
          
          <Calendar
            markingType={'multi-dot'}
            markedDates={markedDates}
            onDayPress={onDayPress}
            theme={{
              todayTextColor: '#00adf5',
              selectedDayBackgroundColor: '#3498db',
            }}
          />
          
          {selectedDate && (
            <View style={styles.selectedDateInfo}>
              <Title>Activities for {moment(selectedDate).format('MMMM D, YYYY')}</Title>
              {getActivitiesForDate(selectedDate).length > 0 ? (
                getActivitiesForDate(selectedDate).map((activity, index) => (
                  <Card key={index} style={styles.activityCard} onPress={() => setSelectedActivity(activity)}>
                    <Card.Content>
                      <View style={styles.activityHeader}>
                        <Text style={styles.activityTitle}>{activity.name}</Text>
                        {activity.startDate === activity.endDate ? (
                          <Text>Single day</Text>
                        ) : (
                          <Text>{moment(activity.startDate).format('MMM D')} - {activity.endDate === 'Ongoing' ? 'Ongoing' : moment(activity.endDate).format('MMM D')}</Text>
                        )}
                      </View>
                      {selectedActivity && selectedActivity.name === activity.name && (
                        <Paragraph style={styles.activityDetails}>{activity.details}</Paragraph>
                      )}
                    </Card.Content>
                  </Card>
                ))
              ) : (
                <Paragraph>No activities scheduled for this date.</Paragraph>
              )}
            </View>
          )}
        </Card.Content>
      </Card>
      
      <Card style={styles.timelineCard}>
        <Card.Content>
          <Title>Activity Timeline</Title>
          <Divider style={styles.divider} />
          
          <View style={styles.timeline}>
            {schedule.activities.map((activity, index) => (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                {index < schedule.activities.length - 1 && <View style={styles.timelineLine} />}
                
                <View style={styles.timelineContent}>
                <Text style={styles.timelineDate}>
                    {moment(activity.startDate).format('MMM D')} 
                    {activity.endDate !== activity.startDate && activity.endDate !== 'Ongoing' ? 
                      ` - ${moment(activity.endDate).format('MMM D')}` : 
                      activity.endDate === 'Ongoing' ? ' - Ongoing' : ''}
                  </Text>
                  <Card style={styles.timelineCard}>
                    <Card.Content>
                      <Text style={styles.timelineActivityTitle}>{activity.name}</Text>
                      <Paragraph>{activity.details}</Paragraph>
                    </Card.Content>
                  </Card>
                </View>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  scheduleCard: {
    marginBottom: 16,
    elevation: 4,
  },
  headerInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  divider: {
    marginVertical: 16,
  },
  selectedDateInfo: {
    marginTop: 16,
  },
  activityCard: {
    marginVertical: 8,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityTitle: {
    fontWeight: 'bold',
  },
  activityDetails: {
    marginTop: 8,
  },
  timelineCard: {
    marginBottom: 16,
    elevation: 4,
  },
  timeline: {
    paddingLeft: 20,
  },
  timelineItem: {
    position: 'relative',
    marginBottom: 20,
  },
  timelineDot: {
    position: 'absolute',
    left: -20,
    top: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2196F3',
  },
  timelineLine: {
    position: 'absolute',
    left: -14,
    top: 12,
    bottom: -20,
    width: 2,
    backgroundColor: '#BBDEFB',
  },
  timelineContent: {
    marginLeft: 10,
  },
  timelineDate: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  timelineActivityTitle: {
    fontWeight: 'bold',
  },
});

export default CalendarView;