import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';  //Install using npm install @react-native-picker/picker
import cropService from '../Services/CropService';
import color from '../assets/Color';

const CropForm = ({ onFormSubmit }) => {
  const [region, setRegion] = useState('');
  const [crop, setCrop] = useState('');
  const [soilType, setSoilType] = useState('');
  const [climateCondition, setClimateCondition] = useState('');
  const [regions, setRegions] = useState([]);
  const [crops, setCrops] = useState([]);
  const [soilTypes, setSoilTypes] = useState([]);
  const [climateConditions, setClimateConditions] = useState([]);
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  // Handle screen dimension changes
  useEffect(() => {
    const updateLayout = () => {
      setScreenWidth(Dimensions.get('window').width);
    };
    
    Dimensions.addEventListener('change', updateLayout);
    
    return () => {
      // Clean up the event listener
      const dimensionsHandler = Dimensions.addEventListener('change', () => {});
      dimensionsHandler.remove();
    };
  }, []);

  useEffect(() => {
    const fetchRegions = async () => {
      const regionList = cropService.getRegions();
      setRegions(regionList);
      if (regionList.length > 0) {
        setRegion(regionList[0]); // Set default region
      }
    };

    fetchRegions();
  }, []);

  useEffect(() => {
    if (region) {
      const cropList = cropService.getCropsByRegion(region);
      setCrops(cropList);
      if (cropList.length > 0) {
        setCrop(cropList[0].name); // Set default crop
      } else {
        setCrop('');
      }
    } else {
      setCrops([]);
      setCrop('');
    }
  }, [region]);

  useEffect(() => {
    if (crop && region) {
      const soilTypeList = cropService.getSoilTypesByCropAndRegion(crop, region);
      setSoilTypes(soilTypeList);
      if (soilTypeList.length > 0) {
        setSoilType(soilTypeList[0]); // Set default soil type
      } else {
        setSoilType('');
      }
      const climateConditionList = cropService.getClimateConditionsByCropAndRegion(crop, region);
      setClimateConditions(climateConditionList);
      if (climateConditionList.length > 0) {
        setClimateCondition(climateConditionList[0]); // Set default climate condition
      } else {
        setClimateCondition('');
      }
    } else {
      setSoilTypes([]);
      setSoilType('');
      setClimateConditions([]);
      setClimateCondition('');
    }
  }, [crop, region]);

  const handleSubmit = () => {
    if (region && crop ) {
      onFormSubmit({ region, crop });
    } else {
      alert('Please fill in all fields.');
    }
  };

  // Determine if we're on a tablet
  const isTablet = screenWidth >= 768;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={[styles.container, isTablet && styles.tabletContainer]}>
        <View style={[styles.formGroup, isTablet && styles.tabletFormGroup]}>
          <Text style={styles.label}>Region:</Text>
          <View style={[styles.pickerContainer, isTablet && styles.tabletPickerContainer]}>
            <Picker
              selectedValue={region}
              style={styles.picker}
              onValueChange={(itemValue) => setRegion(itemValue)}
            >
              {regions.map((r) => (
                <Picker.Item key={r} label={r} value={r} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={[styles.formGroup, isTablet && styles.tabletFormGroup]}>
          <Text style={styles.label}>Crop:</Text>
          <View style={[styles.pickerContainer, isTablet && styles.tabletPickerContainer]}>
            <Picker
              selectedValue={crop}
              style={styles.picker}
              onValueChange={(itemValue) => setCrop(itemValue)}
            >
              {crops.map((c) => (
                <Picker.Item key={c.name} label={c.name} value={c.name} />
              ))}
            </Picker>
          </View>
        </View>

        

        <TouchableOpacity 
          style={[styles.submitButton, isTablet && styles.tabletSubmitButton]} 
          onPress={handleSubmit}
          activeOpacity={0.7}
        >
          <Text style={styles.submitButtonText}>Generate Schedule</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    padding: 16,
    width: '100%',
  },
  tabletContainer: {
    padding: 24,
    maxWidth: 600,
    alignSelf: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  tabletFormGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: color.lightPrimary,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  tabletPickerContainer: {
    borderRadius: 8,
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#333',
  },
  submitButton: {
    backgroundColor: color.primaryDark,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  tabletSubmitButton: {
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 16,
    maxWidth: 300,
    alignSelf: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CropForm;