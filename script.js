
 // Initialize the health monitoring app
document.addEventListener('DOMContentLoaded', function() {
// Local storage keys
const GLUCOSE_DATA_KEY = 'healthMonitor_glucose';
const BP_DATA_KEY = 'healthMonitor_bp';
const WEIGHT_DATA_KEY = 'healthMonitor_weight';
            
            // Get DOM elements
const entryTypeSelect = document.getElementById('entry-type');
const glucoseForm = document.getElementById('glucose-form');
const bpForm = document.getElementById('bp-form');
const weightForm = document.getElementById('weight-form');
const saveEntryBtn = document.getElementById('save-entry');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
            
            // Load existing data from localStorage
let glucoseData = JSON.parse(localStorage.getItem(GLUCOSE_DATA_KEY)) || [];
let bpData = JSON.parse(localStorage.getItem(BP_DATA_KEY)) || [];
let weightData = JSON.parse(localStorage.getItem(WEIGHT_DATA_KEY)) || [];
            
// Update dashboard with latest readings
updateDashboard();
            
// Display entries in tables
displayAllEntries();
displayGlucoseEntries();
displayBPEntries();
displayWeightEntries();
            
// Switch form based on selected entry type
entryTypeSelect.addEventListener('change', function() {
const selectedType = this.value;
                
// Hide all forms first
glucoseForm.style.display = 'none';
bpForm.style.display = 'none';
weightForm.style.display = 'none';
                
                // Show the selected form
if (selectedType === 'glucose') {
    glucoseForm.style.display = 'block';
    } else if (selectedType === 'bp') {
    bpForm.style.display = 'block';
     } else if (selectedType === 'weight') {
    weightForm.style.display = 'block';
        }
    });
            
 // Handle tab switching
 tabs.forEach(tab => {
   tab.addEventListener('click', function() {
   // Remove active class from all tabs
    tabs.forEach(t => t.classList.remove('active'));
      
        // Add active class to clicked tab
        this.classList.add('active');
                    
        // Hide all tab contents
        tabContents.forEach(content => content.classList.remove('active'));
                    
        // Show the selected tab content
        const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            });
            });
            
// Handle saving new entries
    saveEntryBtn.addEventListener('click', function() {
    const entryType = entryTypeSelect.value;
    const notes = document.getElementById('notes').value;
    const timestamp = new Date();
                
    if (entryType === 'glucose') {
        const glucoseValue = document.getElementById('glucose-value').value;
        const glucoseTime = document.getElementById('glucose-time').value;
                    
        if (!glucoseValue) {
        alert('Please enter a glucose reading');
        return;
       }
                    
    const newGlucoseEntry = {
        value: parseFloat(glucoseValue),
        time: glucoseTime,
        notes: notes,
        date: timestamp
        };
                    
    glucoseData.push(newGlucoseEntry);
        localStorage.setItem(GLUCOSE_DATA_KEY, JSON.stringify(glucoseData));
                    
        // Reset form
        document.getElementById('glucose-value').value = '';
        document.getElementById('notes').value = '';
                    
                } else if (entryType === 'bp') {
                    const systolic = document.getElementById('systolic').value;
                    const diastolic = document.getElementById('diastolic').value;
                    
                    if (!systolic || !diastolic) {
                        alert('Please enter both systolic and diastolic readings');
                        return;
                    }
                    
                    const newBPEntry = {
                        systolic: parseInt(systolic),
                        diastolic: parseInt(diastolic),
                        notes: notes,
                        date: timestamp
                    };
                    
                    bpData.push(newBPEntry);
                    localStorage.setItem(BP_DATA_KEY, JSON.stringify(bpData));
                    
                    // Reset form
                    document.getElementById('systolic').value = '';
                    document.getElementById('diastolic').value = '';
                    document.getElementById('notes').value = '';
                    
                } else if (entryType === 'weight') {
                    const weightValue = document.getElementById('weight-value').value;
                    
                    if (!weightValue) {
                        alert('Please enter a weight reading');
                        return;
                    }
                    
                    const newWeightEntry = {
                        value: parseFloat(weightValue),
                        notes: notes,
                        date: timestamp
                    };
                    
                    weightData.push(newWeightEntry);
                    localStorage.setItem(WEIGHT_DATA_KEY, JSON.stringify(weightData));
                    
                    // Reset form
                    document.getElementById('weight-value').value = '';
                    document.getElementById('notes').value = '';
                }
                
                // Update the dashboard and tables
                updateDashboard();
                displayAllEntries();
                displayGlucoseEntries();
                displayBPEntries();
                displayWeightEntries();
                
                alert('Entry saved successfully!');
            });
            
            // Function to format date
            function formatDate(date) {
                const d = new Date(date);
                return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
            
            // Function to update the dashboard with latest readings
            function updateDashboard() {
                // Update latest glucose reading
                if (glucoseData.length > 0) {
                    const latestGlucose = glucoseData[glucoseData.length - 1];
                    document.getElementById('latest-glucose').textContent = latestGlucose.value + ' mg/dL';
                    document.getElementById('glucose-date').textContent = formatDate(latestGlucose.date);
                }
                
                // Update latest BP reading
                if (bpData.length > 0) {
                    const latestBP = bpData[bpData.length - 1];
                    document.getElementById('latest-bp').textContent = latestBP.systolic + '/' + latestBP.diastolic;
                    document.getElementById('bp-date').textContent = formatDate(latestBP.date);
                }
                
                // Update latest weight reading
                if (weightData.length > 0) {
                    const latestWeight = weightData[weightData.length - 1];
                    document.getElementById('latest-weight').textContent = latestWeight.value + ' kg';
                    document.getElementById('weight-date').textContent = formatDate(latestWeight.date);
                }
            }
            
            // Function to display all entries
            function displayAllEntries() {
                const allEntriesBody = document.getElementById('all-entries-body');
                allEntriesBody.innerHTML = '';
                
                // Combine all entries and sort by date (newest first)
                const allEntries = [
                    ...glucoseData.map(entry => ({
                        type: 'Glucose',
                        reading: entry.value + ' mg/dL',
                        notes: entry.notes,
                        date: new Date(entry.date)
                    })),
                    ...bpData.map(entry => ({
                        type: 'Blood Pressure',
                        reading: entry.systolic + '/' + entry.diastolic,
                        notes: entry.notes,
                        date: new Date(entry.date)
                    })),
                    ...weightData.map(entry => ({
                        type: 'Weight',
                        reading: entry.value + ' kg',
                        notes: entry.notes,
                        date: new Date(entry.date)
                    }))
                ];
                
                allEntries.sort((a, b) => b.date - a.date);
                
                // Add entries to table
                allEntries.forEach(entry => {
                    const row = document.createElement('tr');
                    
                    const dateCell = document.createElement('td');
                    dateCell.textContent = formatDate(entry.date);
                    
                    const typeCell = document.createElement('td');
                    typeCell.textContent = entry.type;
                    
                    const readingCell = document.createElement('td');
                    readingCell.textContent = entry.reading;
                    
                    const notesCell = document.createElement('td');
                    notesCell.textContent = entry.notes || '-';
                    
                    row.appendChild(dateCell);
                    row.appendChild(typeCell);
                    row.appendChild(readingCell);
                    row.appendChild(notesCell);
                    
                    allEntriesBody.appendChild(row);
                });
            }
            
            // Function to display glucose entries
            function displayGlucoseEntries() {
                const glucoseEntriesBody = document.getElementById('glucose-entries-body');
                glucoseEntriesBody.innerHTML = '';
                
                // Sort glucose entries by date (newest first)
                const sortedGlucoseData = [...glucoseData].sort((a, b) => new Date(b.date) - new Date(a.date));
                
                // Add entries to table
                sortedGlucoseData.forEach(entry => {
                    const row = document.createElement('tr');
                    
                    const dateCell = document.createElement('td');
                    dateCell.textContent = formatDate(entry.date);
                    
                    const timeCell = document.createElement('td');
                    timeCell.textContent = entry.time === 'morning' ? 'Morning' : 'Evening';
                    
                    const readingCell = document.createElement('td');
                    readingCell.textContent = entry.value;
                    
                    const notesCell = document.createElement('td');
                    notesCell.textContent = entry.notes || '-';
                    
                    row.appendChild(dateCell);
                    row.appendChild(timeCell);
                    row.appendChild(readingCell);
                    row.appendChild(notesCell);
                    
                    glucoseEntriesBody.appendChild(row);
                });
            }
            
            // Function to display BP entries
            function displayBPEntries() {
                const bpEntriesBody = document.getElementById('bp-entries-body');
                bpEntriesBody.innerHTML = '';
                
                // Sort BP entries by date (newest first)
                const sortedBPData = [...bpData].sort((a, b) => new Date(b.date) - new Date(a.date));
                
                // Add entries to table
                sortedBPData.forEach(entry => {
                    const row = document.createElement('tr');
                    
                    const dateCell = document.createElement('td');
                    dateCell.textContent = formatDate(entry.date);
                    
                    const readingCell = document.createElement('td');
                    readingCell.textContent = entry.systolic + '/' + entry.diastolic;
                    
                    const notesCell = document.createElement('td');
                    notesCell.textContent = entry.notes || '-';
                    
                    row.appendChild(dateCell);
                    row.appendChild(readingCell);
                    row.appendChild(notesCell);
                    
                    bpEntriesBody.appendChild(row);
                });
            }
            
            // Function to display weight entries
            function displayWeightEntries() {
                const weightEntriesBody = document.getElementById('weight-entries-body');
                weightEntriesBody.innerHTML = '';
                
                // Sort weight entries by date (newest first)
                const sortedWeightData = [...weightData].sort((a, b) => new Date(b.date) - new Date(a.date));
                
                // Add entries to table
                sortedWeightData.forEach(entry => {
                    const row = document.createElement('tr');
                    
                    const dateCell = document.createElement('td');
                    dateCell.textContent = formatDate(entry.date);
                    
                    const readingCell = document.createElement('td');
                    readingCell.textContent = entry.value;
                    
                    const notesCell = document.createElement('td');
                    notesCell.textContent = entry.notes || '-';
                    
                    row.appendChild(dateCell);
                    row.appendChild(readingCell);
                    row.appendChild(notesCell);
                    
                    weightEntriesBody.appendChild(row);
                });
            }
        });