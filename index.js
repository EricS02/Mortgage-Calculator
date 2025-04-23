// Declare variables at the top
let mortgageAmount, mortgageTerm, interestRateInput, repayment, interestOnly, results;
let mortgageAmountError, mortgageTermError, interestRateError;
let secondResults, firstResults;
let clearAllButton;

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
  // Select all inputs
  mortgageAmount = document.getElementById("mortgageAmount");
  mortgageTerm = document.getElementById("mortgageTerm");
  interestRateInput = document.getElementById("interestRate");
  repayment = document.getElementById("repayment-option");
  interestOnly = document.getElementById("interest-only-option");
  results = document.getElementById("results");

  //Select all error span
  mortgageAmountError = document.getElementById("mortgageAmount-error");
  mortgageTermError = document.getElementById("mortgage-term-error");
  interestRateError = document.getElementById("interest-rate-error");

  //Select classes
  secondResults = document.getElementById("second-results");
  firstResults = document.getElementById("first-results");
  
  // Select the button
  const button = document.getElementById("calculate-btn");

  const clearAllButton = document.querySelector(".clear-all");

  //Select Form
  const form = document.querySelector("form");

  
  if (button) {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      calculateMortgage();
    });
  } else {
    console.error("Button with ID 'calculate-btn' not found");
  }
  
  // Make sure to keep this inside the DOMContentLoaded event
  if (clearAllButton) {
    clearAllButton.addEventListener("click", function(e) {
      e.preventDefault(); // Important for <a> elements
      form.reset();
      handleInput(mortgageAmountError, "");
      handleInput(mortgageTermError, "");
      handleInput(interestRateError, "");
      secondResults.classList.add("hidden");
      firstResults.classList.remove("hidden");
    });
  } else {
    console.error("Element with class 'clear-all' not found");
  }
});

function calculateMortgage() {
  if (!validate()) return;

  const principleMortgageAmount = Number(mortgageAmount.value);
  const mortgageTermYears = Number(mortgageTerm.value);
  const interestRate = Number(interestRateInput.value);

  //calculate monthly interest rate
  const monthlyInterestRate = interestRate / 100 / 12;

  //calculate number of monthly payments
  const numberOfMonthlyPayments = mortgageTermYears * 12;

  //show results div and hide empty results div
  firstResults.classList.add("hidden");
  secondResults.classList.remove("hidden");

  // Get the elements to update with calculated values
  const monthlyRepayElement = document.getElementById("monthly-repay-number");
  const termRepayElement = document.getElementById("term-repay-title");


  if (repayment.checked) {
    const exponentialCompound =
      (1 + monthlyInterestRate) ** numberOfMonthlyPayments;
    const monthlyRepayments =
      (principleMortgageAmount * (monthlyInterestRate * exponentialCompound)) /
      (exponentialCompound - 1);
    const totalRepayment = monthlyRepayments * numberOfMonthlyPayments;

    monthlyRepayElement.textContent = "£" + monthlyRepayments.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    termRepayElement.textContent = "£" + totalRepayment.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  if (interestOnly.checked) {
    const monthlyRepayments =
      principleMortgageAmount * monthlyInterestRate;
    const totalRepayment =
      principleMortgageAmount * monthlyInterestRate * numberOfMonthlyPayments +
      principleMortgageAmount;

    monthlyRepayElement.textContent = "£" + monthlyRepayments.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    termRepayElement.textContent = "£" + totalRepayment.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}

function validate() {
  let isValid = true;

  if (!mortgageAmount.value.trim()) {
    handleInvalidInput(mortgageAmountError, "This field is required");
    isValid = false;
  } else if (Number(mortgageAmount.value) <= 0) {
    handleInvalidInput(mortgageAmountError, "Needs to be above 0");
    isValid = false;
  } else {
    handleInput(mortgageAmountError, "");
  }

  if (!mortgageTerm.value.trim()) {
    handleInvalidInput(mortgageTermError, "This field is required");
    isValid = false;
  } else if (Number(mortgageTerm.value) <= 0) {
    handleInvalidInput(mortgageTermError, "Needs to be above 0");
    isValid = false;
  } else if (Number(mortgageTerm.value) > 100) {
    handleInvalidInput(mortgageTermError, "Needs to be less than 100");
    isValid = false;
  } else {
    handleInput(mortgageTermError, "");
  }

  if (!interestRateInput.value.trim()) {
    handleInvalidInput(interestRateError, "This field is required");
    isValid = false;
  } else if (Number(interestRateInput.value) <= 0) {
    handleInvalidInput(interestRateError, "Needs to be above 0");
    isValid = false;
  } else {
    handleInput(interestRateError, "");
  }
  
  return isValid;
}

function handleInput(labelError, message) {
  labelError.classList.add("hidden");
  labelError.textContent = message;
}

function handleInvalidInput(labelError, message) {
  labelError.classList.remove("hidden");
  labelError.textContent = message;
}

