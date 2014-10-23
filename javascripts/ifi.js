!function (global) {
  'use strict';

  var previousIfi = global.Ifi;

  function Ifi(options) {
    this.options = options || {};
    this.name = options.name || 'no name';
    this.fatCaloriesPerKg = options.fatCaloriesPerKg || 7200;
    this.proteinCaloriesPerGram = options.proteinCaloriesPerGram || 4;
    this.carbCaloriesPerGram = options.carbCaloriesPerGram || 4;
    this.fatCaloriesPerGram = options.fatCaloriesPerGram || 9;
    this.ageSpecificBsalMetabolicUnit = options.ageSpecificBsalMetabolicUnit || [
      {min: 0, max: 2, male: 61.0, female: 59.7},
      {min: 3, max: 5, male: 54.8, female: 52.2},
      {min: 6, max: 7, male: 44.3, female: 41.9},
      {min: 8, max: 9, male: 40.8, female: 38.3},
      {min: 10, max: 11, male: 37.4, female: 34.8},
      {min: 12, max: 14, male: 31.0, female: 29.6},
      {min: 15, max: 17, male: 27.0, female: 25.3},
      {min: 18, max: 29, male: 24.0, female: 22.1},
      {min: 30, max: 49, male: 22.3, female: 21.7},
      {min: 50, max: 99, male: 21.5, female: 20.7}
    ];
  }

  Ifi.noConflict = function noConflict() {
    global.Ifi = previousIfi;
    return Ifi;
  };

  Ifi.prototype.set = function (key, val) {
    this[key] = val;
  };

  Ifi.prototype.get = function (key) {
    return this[key];
  };

  Ifi.getAgeSpecificBsalMetabolicUnit = function getAgeSpecificBsalMetabolicUnit(gender, age) {
    if (!age || isNaN(age)) {
      return '';
    }
    var bsalMetabolicUnit = 0;
    var ageSpecificBsalMetabolicUnit = this.ageSpecificBsalMetabolicUnit;
    for (var i = 0; i < ageSpecificBsalMetabolicUnit.length; i++) {
      if (ageSpecificBsalMetabolicUnit[i].min <= age && age <= ageSpecificBsalMetabolicUnit[i].max) {
        if (gender === 'male') {
          bsalMetabolicUnit = ageSpecificBsalMetabolicUnit[i].male;
        } else if (gender === 'female') {
          bsalMetabolicUnit = ageSpecificBsalMetabolicUnit[i].female;
        } else {
          bsalMetabolicUnit = (ageSpecificBsalMetabolicUnit[i].male + ageSpecificBsalMetabolicUnit[i].female) * 0.5;
        }
        break;
      }
    }
    return bsalMetabolicUnit;
  };
  
  Ifi.calcBmr = function calcBmr(gender, age, weight) {
    if (!age || !weight || isNaN(age) || isNaN(weight)) {
      return '';
    }
    var bsalMetabolicUnit = 0;
    var ageSpecificBsalMetabolicUnit = this.ageSpecificBsalMetabolicUnit;
    for (var i = 0; i < ageSpecificBsalMetabolicUnit.length; i++) {
      if (ageSpecificBsalMetabolicUnit[i].min <= age && age <= ageSpecificBsalMetabolicUnit[i].max) {
        if (gender === 'male') {
          bsalMetabolicUnit = ageSpecificBsalMetabolicUnit[i].male;
        } else if (gender === 'female') {
          bsalMetabolicUnit = ageSpecificBsalMetabolicUnit[i].female;
        } else {
          bsalMetabolicUnit = (ageSpecificBsalMetabolicUnit[i].male + ageSpecificBsalMetabolicUnit[i].female) * 0.5;
        }
        break;
      }
    }
    return weight * bsalMetabolicUnit;
  };

  Ifi.calcBeeWithHbe = function calcBeeWithHbe(gender, age, weight, height) {
    if (!gender || !age || !weight || !height || isNaN(age) || isNaN(weight) || isNaN(height)) {
      return '';
    }
    if (gender === 'male') {
      return 66.473 + 13.7516 * weight + 5.0033 * height - 6.755 * age;
    } else if (gender === 'female') {
      return 655.0955 + 9.5634 * weight + 1.8496 * height - 4.6756 * age;
    }
    return '';
  };

  Ifi.calcBeeWithHbeForJapanese = function calcBeeWithHbeForJapanese(gender, age, weight, height) {
    if (!gender || !age || !weight || !height || isNaN(age) || isNaN(weight) || isNaN(height)) {
      return '';
    }
    if (gender === 'male') {
      return 66 + 13.7 * weight + 5 * height - 6.8 * age;
    } else if (gender === 'female') {
      return 665 + 9.6 * weight + 1.7 * height - 7 * age;
    }
    return '';
  };

  Ifi.calcTdee = function calcTdee(bmr, activityLevel) {
    if (!bmr || !activityLevel || isNaN(bmr) || isNaN(activityLevel)) {
      return '';
    }
    return bmr * activityLevel;
  };

  Ifi.getLBM = function getLBM(weight, bodyFatPercentage) {
    if (!weight || !bodyFatPercentage || isNaN(weight) || isNaN(bodyFatPercentage)) {
      return '';
    }
    return weight * (100 - bodyFatPercentage) / 100;
  };

  Ifi.getCaloriesPercentageOfTdee = function getCaloriesPercentageOfTdee(tdee, percentage) {
    if (!tdee || !percentage || isNaN(tdee) || isNaN(percentage)) {
      return '';
    }
    return tdee + tdee * percentage / 100;
  };

  Ifi.getDailyProteinsGrams = function getDailyProteinsGrams(weight, percentageOfBodyFat) {
    if (!weight || isNaN(weight)) {
      return '';
    }
    if (!percentageOfBodyFat || isNaN(percentageOfBodyFat)) {
      return weight * 2.0;
    }
    return (weight - (weight * percentageOfBodyFat / 100)) * 2.5;
  };

  Ifi.getWorkoutDayProteinsGrams = function getWorkoutDayProteinsGrams(lbm, calorieBalancePerCycle) {
    if (!lbm || isNaN(lbm) || !calorieBalancePerCycle || isNaN(calorieBalancePerCycle)) {
      return '';
    }
    if (calorieBalancePerCycle < 0) {
      return lbm * 2.2;
    }
    return lbm * 1.8;
  };

  Ifi.getRestDayProteinsGrams = function getRestDayProteinsGrams(lbm, calorieBalancePerCycle) {
    if (!lbm || isNaN(lbm) || !calorieBalancePerCycle || isNaN(calorieBalancePerCycle)) {
      return '';
    }
    if (calorieBalancePerCycle < 0) {
      return lbm * 2.8;
    }
    return lbm * 2.2;
  };

  Ifi.getRestDayFatGrams = function getRestDayFatGrams(tdee) {
    if (!tdee || isNaN(tdee)) {
      return '';
    }
    return tdee * 0.3 / this.fatCaloriesPerGram;
  };

  Ifi.getWorkoutDayFatGrams = function getWorkoutDayFatGrams(tdee) {
    if (!tdee || isNaN(tdee)) {
      return '';
    }
    return tdee * 0.2 / this.fatCaloriesPerGram;
  };

  Ifi.getCarbGrams = function getCarbGrams(tdee, protein, fat) {
    if (!tdee || !protein || !fat || isNaN(tdee) || isNaN(protein) || isNaN(fat)) {
      return '';
    }
    return (tdee - protein * this.proteinCaloriesPerGram - fat * this.fatCaloriesPerGram) / this.carbCaloriesPerGram;
  };

  Ifi.getCaloriesPerCycle = function getCaloriesPerCycle(cycleDays, workoutDays, workoutDayCalories, restDayCalories) {
    if (!cycleDays || !workoutDays || !workoutDayCalories || !restDayCalories || isNaN(cycleDays) || isNaN(workoutDays) || isNaN(workoutDayCalories) || isNaN(restDayCalories)) {
      return '';
    }
    return (workoutDays * workoutDayCalories) + ((cycleDays - workoutDays) * restDayCalories);
  };

  Ifi.getCalorieBalancePerCycle = function getCalorieBalancePerCycle(cycleDays, workoutDays, workoutDayCalories, restDayCalories, tdee) {
    if (!cycleDays || !workoutDays || !workoutDayCalories || !restDayCalories || !tdee || isNaN(cycleDays) || isNaN(workoutDays) || isNaN(workoutDayCalories) || isNaN(restDayCalories) || isNaN(tdee)) {
      return '';
    }
    return ((workoutDays * workoutDayCalories) + ((cycleDays - workoutDays) * restDayCalories)) - tdee * cycleDays;
  };

  Ifi.getFatWeightOfCalories = function getFatWeightOfCalories(fatCalories) {
    if (!fatCalories || isNaN(fatCalories)) {
      return '';
    }
    return fatCalories / this.fatCaloriesPerKg;
  };

  global.Ifi = Ifi;
}(this);
