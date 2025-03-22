import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// Colors for different activities - will be assigned based on activity name
const COLOR_PALETTE = [
  '#4CAF50', // Green
  '#1A476F', // Dark blue
  '#FF9800', // Orange
  '#9C27B0', // Purple
  '#2196F3', // Blue
  '#E91E63', // Pink
  '#795548', // Brown
  '#607D8B', // Blue Grey
  '#009688', // Teal
  '#FF5722', // Deep Orange
];

const ScheduleCard = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyText}>No activities scheduled yet</Text>
      </View>
    );
  }

  // Create a map of activity names to colors
  const activityColorMap = {};
  activities.forEach((activity, index) => {
    const colorIndex = index % COLOR_PALETTE.length;
    activityColorMap[activity.activityName] = COLOR_PALETTE[colorIndex];
  });

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Planting Schedule</Text>
      
      <View style={styles.chartContainer}>
        {/* Fixed activity names column */}
        <View style={styles.fixedColumn}>
          <View style={[styles.headerCell, styles.activityLabelHeader]}>
            <Text style={styles.headerText}>Crop</Text>
          </View>
          {activities.map((activity, index) => (
            <View key={index} style={styles.activityLabelCell}>
              <Text style={styles.activityName} numberOfLines={1} ellipsizeMode="tail">
                {activity.activityName}
              </Text>
            </View>
          ))}
        </View>
        
        {/* Scrollable months area */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollableArea}>
          <View>
            {/* Months header row */}
            <View style={styles.monthsHeaderRow}>
              {MONTHS.map((month, index) => (
                <View key={index} style={styles.monthColumn}>
                  <Text style={styles.monthLabel}>{month}</Text>
                </View>
              ))}
            </View>
            
            {/* Activity timeline rows */}
            {activities.map((activity, activityIndex) => {
              // Parse dates to get month indices (0-11)
              const startDate = new Date(activity.startDate);
              const endDate = new Date(activity.endDate);
              
              const startMonth = startDate.getMonth();
              const endMonth = endDate.getMonth();
              
              // Get color based on activity name
              const activityColor = activityColorMap[activity.activityName];
              
              return (
                <View key={activityIndex} style={styles.timelineRow}>
                  {MONTHS.map((month, index) => {
                    const isActive = (index >= startMonth && index <= endMonth);
                    return (
                      <View key={index} style={styles.monthColumn}>
                        <View 
                          style={[
                            styles.monthBlock,
                            isActive ? { backgroundColor: activityColor } : styles.inactiveMonth
                          ]} 
                        />
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
      
      <View style={styles.legendContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.legendInnerContainer}>
            {activities.map((activity, index) => (
              <View key={index} style={styles.legendItem}>
                <View 
                  style={[
                    styles.legendColor, 
                    { backgroundColor: activityColorMap[activity.activityName] }
                  ]} 
                />
                <Text style={styles.legendText}>{activity.activityName}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
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
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
  },
  fixedColumn: {
    width: 100,
    zIndex: 1, // Ensure the fixed column appears above the scrollable area
  },
  activityLabelHeader: {
    height: 32, // Match the height of the month header
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  activityLabelCell: {
    height: 40, // Match the height of the timeline rows
    justifyContent: 'center',
    paddingRight: 8,
  },
  activityName: {
    fontSize: 14,
    fontWeight: '500',
  },
  scrollableArea: {
    flex: 1,
  },
  monthsHeaderRow: {
    flexDirection: 'row',
    height: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  monthColumn: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabel: {
    fontSize: 12,
    color: '#666',
  },
  timelineRow: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
  },
  monthBlock: {
    width: 60,
    height: 40,
    borderWidth: 0.5,
    borderColor: '#ddd',
  },
  inactiveMonth: {
    backgroundColor: '#f5f5f5',
  },
  legendContainer: {
    marginTop: 16,
  },
  legendInnerContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
  },
  emptyCard: {
    backgroundColor: '#fff',
    padding: 32,
    marginVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default ScheduleCard;