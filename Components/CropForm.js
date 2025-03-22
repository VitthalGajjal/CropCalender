import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';  //Install using npm install @react-native-picker/picker
import cropService from '../Services/CropService';

const CropForm = ({ onFormSubmit }) => {
  const [region, setRegion] = useState('');
  const [crop, setCrop] = useState('');
  const [soilType, setSoilType] = useState('');
  const [climateCondition, setClimateCondition] = useState('');
  const [regions, setRegions] = useState([]);
  const [crops, setCrops] = useState([]);
  const [soilTypes, setSoilTypes] = useState([]);
    const [climateConditions, setClimateConditions] = useState([]);

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
    if (region && crop && soilType && climateCondition) {
      onFormSubmit({ region, crop, soilType, climateCondition });
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Region:</Text>
      <Picker
        selectedValue={region}
        style={styles.picker}
        onValueChange={(itemValue, itemIndex) => setRegion(itemValue)}
      >
        {regions.map((r) => (
          <Picker.Item key={r} label={r} value={r} />
        ))}
      </Picker>

      <Text style={styles.label}>Crop:</Text>
      <Picker
        selectedValue={crop}
        style={styles.picker}
        onValueChange={(itemValue, itemIndex) => setCrop(itemValue)}
      >
        {crops.map((c) => (
          <Picker.Item key={c.name} label={c.name} value={c.name} />
        ))}
      </Picker>

      <Text style={styles.label}>Soil Type:</Text>
      <Picker
        selectedValue={soilType}
        style={styles.picker}
        onValueChange={(itemValue, itemIndex) => setSoilType(itemValue)}
      >
        {soilTypes.map((s) => (
          <Picker.Item key={s} label={s} value={s} />
        ))}
      </Picker>

        <Text style={styles.label}>Climate Condition:</Text>
        <Picker
            selectedValue={climateCondition}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setClimateCondition(itemValue)}
        >
            {climateConditions.map((c) => (
                <Picker.Item key={c} label={c} value={c} />
            ))}
        </Picker>

      <Button title="Generate Schedule" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  picker: {
    marginBottom: 16,
    color : 'gray', 
  },
});

export default CropForm;