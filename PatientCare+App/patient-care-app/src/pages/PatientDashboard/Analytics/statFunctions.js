// calculate the standard deviation given a list of numbers
function stddev(list) {
    // calculate mean of list
    let mean = 0;
    list.forEach(element => {
        mean += element;
    });
    mean /= list.length;

    // using mean sum up the square of deviations
    let deviationSum = 0;
    list.forEach(element => {
        deviationSum += Math.pow((element-mean), 2);
    });

    // while returning divided by size - 1 for final standard deviation
    return Math.sqrt(deviationSum / (list.length - 1));
}

// calculate the percent of data that is within the bounds
function timeInRange(list, lowBound, highBound) {
    let count = 0;

    // get count of occurrences in within healthy range
    list.forEach(element => {
        if (lowBound <= element && element <= highBound) {
            count++;
        }
    });

    // return the percent of all data within the healthy range
    return count / list.length;
}

// calculate all of the index scores of the data and return in object
export function calculateHealthIndexScores(bloodSugarData, heartRateData, glucoseData, systolicData, diastolicData) {
    // individual index scores
    const bloodSugarScore = calculateBloodSugarScore(bloodSugarData);
    const heartRateScore = calculateHeartRateScore(heartRateData);
    const glucoseScore = calculateBloodSugarScore(glucoseData);
    const bloodPressureScore = calculateBloodPressureScore(systolicData, diastolicData);

    // alerts for alarming data
    const bloodSugarAlert = determineBloodSugarAlert(bloodSugarData);
    const heartRateAlert = determineHeartRateAlert(heartRateData);
    const glucoseAlert = determineBloodSugarAlert(glucoseData);
    const bloodPressureAlert = determineBloodPressureAlert(systolicData, diastolicData);

    // calculate time in health range values
    const bloodSugarHealthRange = timeInRange(bloodSugarData, 70, 100);
    const heartRateHealthRange = timeInRange(heartRateData, 60, 100);
    const glucoseHealthRange = timeInRange(glucoseData, 70, 100);
    // average the time in healthy range for combining systolic and diastolic
    const bloodPressureHealthRange = (timeInRange(systolicData, 90, 120) + timeInRange(diastolicData, 60, 80)) / 2

    // calculate the standard deviation for datasets
    const bloodSugarSTDDev = stddev(bloodSugarData);
    const heartRateSTDDev = stddev(heartRateData);
    const glucoseSTDDev = stddev(glucoseData);
    // take root mean square for combined standard deviation
    const bloodPressureSTDDev = Math.sqrt( (Math.pow(stddev(systolicData), 2) + Math.pow(stddev(diastolicData), 2)) / 2 )

    // totals for overall health
    const healthIndex = (bloodSugarScore + heartRateScore + glucoseScore + bloodPressureScore) / 4;
    const numberOfAlerts = bloodSugarAlert + heartRateAlert + glucoseAlert + bloodPressureAlert;

    // return this object of the data for easier parsing
    return {
        overall: {
            score: healthIndex,
            alerts: numberOfAlerts
        },
        bloodSugar: {
            score: bloodSugarScore,
            alert: bloodSugarAlert,
            percent: bloodSugarHealthRange,
            stdDev: bloodSugarSTDDev
        },
        heartRate: {
            score: heartRateScore,
            alert: heartRateAlert,
            percent: heartRateHealthRange,
            stdDev: heartRateSTDDev
        },
        glucose: {
            score: glucoseScore,
            alert: glucoseAlert,
            percent: glucoseHealthRange,
            stdDev: glucoseSTDDev
        },
        bloodPressure: {
            score: bloodPressureScore,
            alert: bloodPressureAlert,
            percent: bloodPressureHealthRange,
            stdDev: bloodPressureSTDDev
        }
    }
}

// get the average
function getAverage(data) {
    const sum = data.reduce((partialSum, e) => partialSum + e, 0)

    return sum / data.length;
}

// calculate the index score of blood sugar data
function calculateBloodSugarScore(bloodSugarData) {
    const average = getAverage(bloodSugarData);
    
    if (70 <= average && average <= 100) {
        return 100;
    }
    else if (average < 70) {
        return 100 - ((70 - average) * 4);
    }
    else if (100 < average && average <= 125) {
        return 100 - ((average - 100) * 1.5);
    }
    else {
        return 63 - ((average - 125) * 2);
    }
}

// calculate the index score of heart rate data
function calculateHeartRateScore(heartRateData) {
    const average = getAverage(heartRateData);

    if (60 <= average && average <= 100) {
        return 100;
    }
    else if (average < 60) {
        return 100 - ((60 - average) * 3);
    }
    else {
        return 100 - ((average - 100) * 3);
    }
}

// calculate the index score of the blood pressure data
function calculateBloodPressureScore(systolicData, diastolicData) {
    const systolicAverage = getAverage(systolicData);
    let systolicScore;
    if (systolicAverage <= 120) {
        systolicScore = 100;
    }
    else if (120 < systolicAverage && systolicAverage <= 130) {
        systolicScore = 100 - ((systolicAverage - 120) * 2);
    }
    else {
        systolicScore = 80 - ((systolicAverage - 130) * 3);
    }

    const diastolicAverage = getAverage(diastolicData);
    let diastolicScore;
    if (diastolicAverage <= 80) {
        diastolicScore = 100;
    }
    else if (80 < diastolicAverage && diastolicAverage <= 90) {
        diastolicScore = 100 - ((diastolicAverage - 80) * 2);
    }
    else {
        diastolicScore = 80 - ((diastolicAverage - 90) * 3);
    }

    return (systolicScore + diastolicScore) / 2;
}

// determine whether the blood sugar data warrants alert
function determineBloodSugarAlert(bloodSugarData) {
    const lastInput = bloodSugarData[bloodSugarData.length - 1];

    if (lastInput < 70 || lastInput > 125) {
        return true;
    }

    return false;
}

// determine whether the heart rate data warrants alert
function determineHeartRateAlert(heartRateData) {
    const lastInput = heartRateData[heartRateData.length - 1];

    if (lastInput < 50 || lastInput > 100) {
        return true;
    }

    return false;
}

// determine whether the blood pressure data warrants alert
function determineBloodPressureAlert(systolicData, diastolicData) {
    const lastSysInput = systolicData[systolicData.length - 1];
    const lastDiaInput = diastolicData[diastolicData.length - 1];

    if (lastSysInput < 90 || lastSysInput > 130 || lastDiaInput < 60 || lastDiaInput > 90) {
        return true;
    }

    return false;
}
