function display(data) {

  console.log(data);
}
// // load data and display
// d3.tsv('data/words.tsv', display);
  // d3.csv('data/data.csv', display);
d3.csv('data/data.csv', dataPreprocessor, display);
// console.log(data);

function dataPreprocessor(row) {
    return {
      'Accident_Number': row['Accident_Number'],
      'Event_Date': row['Event_Date'],
      'Location': row['Location'],
      'Location Copy': row['Location Copy'],
      'Country': row['Country'],
      'Latitude': row['Latitude'],
      'Longitude': row['Longitude'],
      'Airport_Code': row['Airport_Code'],
      'Airport_Name': row['Airport_Name'],
      'Injury_Severity': row['Airport_Severity'],
      'Aircraft_Damage': row['Airport_Damage'],
      'Registration_Number': row['Registration_Number'],
      'Make': row['Make'],
      'Model': row['Model'],
      'Schedule': row['Schedule'],
      'Air_Carrier': row['Air_Carrier'],
      'Total_Fatal_Injuries': row['Total_Fatal_Injuries'],
      'Total_Serious_Injuries': row['Total_Serious_Injuries'],
      'Total_Uninjured': row['Total_Uninjured'],
      'Weather_Condition': row['Weather_Condition'],
      'Broad_Phase_of_Flight' : row['Broad_Phase_of_Flight']
    };
}
