!function (global) {
  'use strict';

  var previousIfi = global.Ifi;

  function Ifi(options) {
    this.options = options || {};
    this.name = this.options.name || 'no name';
    this.fatCaloriesPerKg = this.options.fatCaloriesPerKg || 7200;
    this.proteinCaloriesPerGram = this.options.proteinCaloriesPerGram || 4;
    this.carbCaloriesPerGram = this.options.carbCaloriesPerGram || 4;
    this.fatCaloriesPerGram = this.options.fatCaloriesPerGram || 9;
    this.ageSpecificBsalMetabolicUnit = this.options.ageSpecificBsalMetabolicUnit || [
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
 
  Ifi.prototype.getAgeSpecificBsalMetabolicUnit = function getAgeSpecificBsalMetabolicUnit(gender, age) {
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

  Ifi.prototype.calcBmr = function calcBmr(gender, age, weight) {
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

  Ifi.prototype.calcBeeWithHbe = function calcBeeWithHbe(gender, age, weight, height) {
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

  Ifi.prototype.calcBeeWithHbeForJapanese = function calcBeeWithHbeForJapanese(gender, age, weight, height) {
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

  Ifi.prototype.calcTdee = function calcTdee(bmr, activityLevel) {
    if (!bmr || !activityLevel || isNaN(bmr) || isNaN(activityLevel)) {
      return '';
    }
    return bmr * activityLevel;
  };

  Ifi.prototype.getLBM = function getLBM(weight, bodyFatPercentage) {
    if (!weight || !bodyFatPercentage || isNaN(weight) || isNaN(bodyFatPercentage)) {
      return '';
    }
    return weight * (100 - bodyFatPercentage) / 100;
  };

  Ifi.prototype.getCaloriesPercentageOfTdee = function getCaloriesPercentageOfTdee(tdee, percentage) {
    if (!tdee || !percentage || isNaN(tdee) || isNaN(percentage)) {
      return '';
    }
    return tdee + tdee * percentage / 100;
  };

  Ifi.prototype.getDailyProteinsGrams = function getDailyProteinsGrams(weight, percentageOfBodyFat) {
    if (!weight || isNaN(weight)) {
      return '';
    }
    if (!percentageOfBodyFat || isNaN(percentageOfBodyFat)) {
      return weight * 2.0;
    }
    return (weight - (weight * percentageOfBodyFat / 100)) * 2.5;
  };

  Ifi.prototype.getWorkoutDayProteinsGrams = function getWorkoutDayProteinsGrams(lbm, calorieBalancePerCycle) {
    if (!lbm || isNaN(lbm) || !calorieBalancePerCycle || isNaN(calorieBalancePerCycle)) {
      return '';
    }
    if (calorieBalancePerCycle < 0) {
      return lbm * 2.2;
    }
    return lbm * 1.8;
  };

  Ifi.prototype.getRestDayProteinsGrams = function getRestDayProteinsGrams(lbm, calorieBalancePerCycle) {
    if (!lbm || isNaN(lbm) || !calorieBalancePerCycle || isNaN(calorieBalancePerCycle)) {
      return '';
    }
    if (calorieBalancePerCycle < 0) {
      return lbm * 2.8;
    }
    return lbm * 2.2;
  };

  Ifi.prototype.getRestDayFatGrams = function getRestDayFatGrams(tdee) {
    if (!tdee || isNaN(tdee)) {
      return '';
    }
    return tdee * 0.3 / this.fatCaloriesPerGram;
  };

  Ifi.prototype.getWorkoutDayFatGrams = function getWorkoutDayFatGrams(tdee) {
    if (!tdee || isNaN(tdee)) {
      return '';
    }
    return tdee * 0.2 / this.fatCaloriesPerGram;
  };

  Ifi.prototype.getCarbGrams = function getCarbGrams(tdee, protein, fat) {
    if (!tdee || !protein || !fat || isNaN(tdee) || isNaN(protein) || isNaN(fat)) {
      return '';
    }
    return (tdee - protein * this.proteinCaloriesPerGram - fat * this.fatCaloriesPerGram) / this.carbCaloriesPerGram;
  };

  Ifi.prototype.getCaloriesPerCycle = function getCaloriesPerCycle(cycleDays, workoutDays, workoutDayCalories, restDayCalories) {
    if (!cycleDays || !workoutDays || !workoutDayCalories || !restDayCalories || isNaN(cycleDays) || isNaN(workoutDays) || isNaN(workoutDayCalories) || isNaN(restDayCalories)) {
      return '';
    }
    return (workoutDays * workoutDayCalories) + ((cycleDays - workoutDays) * restDayCalories);
  };

  Ifi.prototype.getCalorieBalancePerCycle = function getCalorieBalancePerCycle(cycleDays, workoutDays, workoutDayCalories, restDayCalories, tdee) {
    if (!cycleDays || !workoutDays || !workoutDayCalories || !restDayCalories || !tdee || isNaN(cycleDays) || isNaN(workoutDays) || isNaN(workoutDayCalories) || isNaN(restDayCalories) || isNaN(tdee)) {
      return '';
    }
    return ((workoutDays * workoutDayCalories) + ((cycleDays - workoutDays) * restDayCalories)) - tdee * cycleDays;
  };

  Ifi.prototype.getFatWeightOfCalories = function getFatWeightOfCalories(fatCalories) {
    if (!fatCalories || isNaN(fatCalories)) {
      return '';
    }
    return fatCalories / this.fatCaloriesPerKg;
  };

  Ifi.prototype.getPlanedRows = function getPlanedRows(daysPerCycle, workoutsPerCycle, cyclesToTry, activityLevelFactor, restDayPercentage, workoutDayPercentage, gender, age, height, beginDate, beginWeight, beginBodyFat) {
    if (!daysPerCycle || isNaN(daysPerCycle)
            || !workoutsPerCycle || isNaN(workoutsPerCycle)
            || !cyclesToTry || isNaN(cyclesToTry)
            || !activityLevelFactor || isNaN(activityLevelFactor)
            || !restDayPercentage || isNaN(restDayPercentage)
            || !workoutDayPercentage || isNaN(workoutDayPercentage)
            || !beginDate
            || !beginWeight || isNaN(beginWeight)
            || !beginBodyFat || isNaN(beginBodyFat)) {
      return null;
    }
    var date = new Date(beginDate);
    var weight = new Number(beginWeight);
    var bfp = new Number(beginBodyFat);
    var lbm = this.getLBM(weight, bfp);
    var bodyFatWeight = new Number(weight - this.getLBM(weight, bfp));
    var bmr = new Number(this.calcBeeWithHbeForJapanese(gender, age, weight, height));
    var tdee = new Number(bmr * activityLevelFactor);
    var workoutDayCalories = this.getCaloriesPercentageOfTdee(tdee, workoutDayPercentage);
    var workoutDayProteins = this.getDailyProteinsGrams(weight, bfp);
    var workoutDayFats = this.getWorkoutDayFatGrams(tdee);
    var workoutDayCarbs = this.getCarbGrams(workoutDayCalories, workoutDayProteins, workoutDayFats);
    var restDayCalories = this.getCaloriesPercentageOfTdee(tdee, restDayPercentage);
    var restDayProteins = this.getDailyProteinsGrams(weight, bfp);
    var restDayFats = this.getRestDayFatGrams(tdee);
    var restDayCarbs = this.getCarbGrams(restDayCalories, restDayProteins, restDayFats);
    var bodyPlanPerCycles = new Array();
    bodyPlanPerCycles.push({
      Actual: 1,
      Date: IfiUtil.getDateString(date),
      Weight: IfiUtil.ceil(weight, 1),
      LBM: IfiUtil.ceil(lbm, 1),
      BFP: IfiUtil.ceil(bfp, 1),
      BMR: IfiUtil.ceil(bmr),
      TDEE: IfiUtil.ceil(tdee),
      RestDayCalories: IfiUtil.ceil(restDayCalories),
      RestDayProteins: IfiUtil.ceil(restDayProteins, 1),
      RestDayCarbs: IfiUtil.ceil(restDayCarbs, 1),
      RestDayFats: IfiUtil.ceil(restDayFats, 1),
      WorkoutDayCalories: IfiUtil.ceil(workoutDayCalories),
      WorkoutDayProteins: IfiUtil.ceil(workoutDayProteins, 1),
      WorkoutDayCarbs: IfiUtil.ceil(workoutDayCarbs, 1),
      WorkoutDayFats: IfiUtil.ceil(workoutDayFats, 1)
    });
    for (var i = 0; i < cyclesToTry; i++) {
      var diffWeight = this.getFatWeightOfCalories(this.getCaloriesPerCycle(daysPerCycle, workoutsPerCycle, workoutDayCalories, restDayCalories) - tdee * daysPerCycle);
      weight += diffWeight;
      if (diffWeight < 0) {
        bodyFatWeight += diffWeight;
      }
      bfp = 100 * bodyFatWeight / weight;
      bmr = new Number(this.calcBeeWithHbeForJapanese(gender, age, weight, height));
      tdee = new Number(bmr * activityLevelFactor);
      workoutDayCalories = this.getCaloriesPercentageOfTdee(tdee, workoutDayPercentage);
      workoutDayProteins = this.getDailyProteinsGrams(weight, bfp);
      workoutDayFats = this.getWorkoutDayFatGrams(tdee);
      workoutDayCarbs = this.getCarbGrams(workoutDayCalories, workoutDayProteins, workoutDayFats);
      restDayCalories = this.getCaloriesPercentageOfTdee(tdee, restDayPercentage);
      restDayProteins = this.getDailyProteinsGrams(weight, bfp);
      restDayFats = this.getRestDayFatGrams(tdee);
      restDayCarbs = this.getCarbGrams(restDayCalories, restDayProteins, restDayFats);
      date = new Date(date.getTime() + daysPerCycle * 24 * 60 * 60 * 1000);
      bodyPlanPerCycles.push({
        Actual: 0,
        Date: IfiUtil.getDateString(date),
        Weight: IfiUtil.ceil(weight, 1),
        LBM: IfiUtil.ceil(weight - bodyFatWeight, 1),
        BFP: IfiUtil.ceil(bfp, 1),
        BMR: IfiUtil.ceil(bmr),
        TDEE: IfiUtil.ceil(tdee),
        RestDayCalories: IfiUtil.ceil(restDayCalories),
        RestDayProteins: IfiUtil.ceil(restDayProteins, 1),
        RestDayCarbs: IfiUtil.ceil(restDayCarbs, 1),
        RestDayFats: IfiUtil.ceil(restDayFats, 1),
        WorkoutDayCalories: IfiUtil.ceil(workoutDayCalories),
        WorkoutDayProteins: IfiUtil.ceil(workoutDayProteins, 1),
        WorkoutDayCarbs: IfiUtil.ceil(workoutDayCarbs, 1),
        WorkoutDayFats: IfiUtil.ceil(workoutDayFats, 1)
      });
    }
    return bodyPlanPerCycles;
  };

  global.Ifi = Ifi;
}(this);
