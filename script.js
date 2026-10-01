// ======================================================
// Trading Risk Calculator
// ======================================================


// Current calculation mode
// Percentage is the default mode
let currentMode = "percentage";


// ======================================================
// Quick Stop Loss Amounts
// ======================================================

const QUICK_SL_AMOUNTS = [
    5500,
    7500,
    9500
];


// ======================================================
// Get HTML Elements
// ======================================================

const quantityInput =
    document.getElementById("quantity");

const timesInput =
    document.getElementById("times");

const entryPriceInput =
    document.getElementById("entryPrice");


const stopLossAmountInput =
    document.getElementById("stopLossAmount");

const targetAmountInput =
    document.getElementById("targetAmount");


const stopLossPercentageInput =
    document.getElementById("stopLossPercentage");

const targetPercentageInput =
    document.getElementById("targetPercentage");


const percentageModeButton =
    document.getElementById("percentageMode");

const amountModeButton =
    document.getElementById("amountMode");


const percentageFields =
    document.getElementById("percentageFields");

const amountFields =
    document.getElementById("amountFields");


// ======================================================
// Format Numbers
// ======================================================

function formatNumber(value, decimals = 2) {

    return Number(value).toLocaleString("en-IN", {

        minimumFractionDigits: decimals,

        maximumFractionDigits: decimals

    });

}


// ======================================================
// Quick Stop Loss Calculation
// ======================================================

function updateQuickStopLoss() {

    const quantity =
        Number(quantityInput.value) || 0;

    const times =
        Number(timesInput.value) || 0;

    const entryPrice =
        Number(entryPriceInput.value) || 0;


    const overallQuantity =
        quantity * times;


    // Update each fixed stop loss amount

    QUICK_SL_AMOUNTS.forEach(amount => {

        const percentageElement =
            document.getElementById(
                `quickSlPercent${amount}`
            );

        const priceElement =
            document.getElementById(
                `quickSlPrice${amount}`
            );


        // Invalid input

        if (
            overallQuantity <= 0 ||
            entryPrice <= 0
        ) {

            percentageElement.textContent =
                "0.00%";

            priceElement.textContent =
                "SL ₹0.00";

            return;

        }


        // Total investment

        const investment =
            overallQuantity * entryPrice;


        // Percentage required to lose fixed amount

        const percentage =
            (amount / investment) * 100;


        // Stop Loss price

        const slPrice =
            entryPrice -
            (amount / overallQuantity);


        percentageElement.textContent =
            percentage.toFixed(2) + "%";


        priceElement.textContent =
            "SL ₹" + formatNumber(slPrice);

    });

}


// ======================================================
// Main Calculation
// ======================================================

function calculate() {

    const quantity =
        Number(quantityInput.value) || 0;

    const times =
        Number(timesInput.value) || 0;

    const entryPrice =
        Number(entryPriceInput.value) || 0;


    // Overall quantity

    const overallQuantity =
        quantity * times;


    document.getElementById(
        "overallQuantity"
    ).textContent =
        formatNumber(overallQuantity, 0);


    document.getElementById(
        "resultQuantity"
    ).textContent =
        formatNumber(overallQuantity, 0);


    // Update fixed Stop Loss amounts

    updateQuickStopLoss();


    // Invalid input

    if (
        overallQuantity <= 0 ||
        entryPrice <= 0
    ) {

        return;

    }


    // Total investment

    const investment =
        overallQuantity * entryPrice;


    let slPrice;
    let targetPrice;

    let maxLoss;
    let targetProfit;


    // ==================================================
    // Percentage Mode
    // ==================================================

    if (currentMode === "percentage") {

        const slPercentage =
            Number(
                stopLossPercentageInput.value
            ) || 0;


        const targetPercentage =
            Number(
                targetPercentageInput.value
            ) || 0;


        // Stop Loss Price

        slPrice =
            entryPrice *
            (1 - slPercentage / 100);


        // Target Price

        targetPrice =
            entryPrice *
            (1 + targetPercentage / 100);


        // ₹ Loss

        maxLoss =
            (entryPrice - slPrice) *
            overallQuantity;


        // ₹ Profit

        targetProfit =
            (targetPrice - entryPrice) *
            overallQuantity;

    }


    // ==================================================
    // ₹ Amount Mode
    // ==================================================

    else {

        maxLoss =
            Number(
                stopLossAmountInput.value
            ) || 0;


        targetProfit =
            Number(
                targetAmountInput.value
            ) || 0;


        // Stop Loss Price

        slPrice =
            entryPrice -
            (maxLoss / overallQuantity);


        // Target Price

        targetPrice =
            entryPrice +
            (targetProfit / overallQuantity);

    }


    // ==================================================
    // Actual Percentages
    // ==================================================

    const actualSlPercentage =
        entryPrice !== 0
            ? ((entryPrice - slPrice) / entryPrice) * 100
            : 0;


    const actualTargetPercentage =
        entryPrice !== 0
            ? ((targetPrice - entryPrice) / entryPrice) * 100
            : 0;


    // ==================================================
    // Risk / Reward
    // ==================================================

    let riskReward = 0;

    if (maxLoss > 0) {

        riskReward =
            targetProfit / maxLoss;

    }


    // ==================================================
    // Update Results
    // ==================================================

    document.getElementById(
        "investment"
    ).textContent =
        "₹" + formatNumber(investment);


    document.getElementById(
        "slPrice"
    ).textContent =
        "₹" + formatNumber(slPrice);


    document.getElementById(
        "targetPrice"
    ).textContent =
        "₹" + formatNumber(targetPrice);


    document.getElementById(
        "loss"
    ).textContent =
        "₹" + formatNumber(maxLoss);


    document.getElementById(
        "profit"
    ).textContent =
        "₹" + formatNumber(targetProfit);


    document.getElementById(
        "riskReward"
    ).textContent =
        "1 : " + formatNumber(riskReward);


    // ==================================================
    // Summary
    // ==================================================

    const targetSign =
        actualTargetPercentage >= 0
            ? "+"
            : "";


    document.getElementById(
        "summary"
    ).textContent =

        `Buy ${formatNumber(overallQuantity, 0)} quantity ` +
        `at ₹${formatNumber(entryPrice)}. ` +
        `Stop Loss ₹${formatNumber(slPrice)} ` +
        `(${actualSlPercentage.toFixed(2)}%) ` +
        `and Target ₹${formatNumber(targetPrice)} ` +
        `(${targetSign}${actualTargetPercentage.toFixed(2)}%).`;

}


// ======================================================
// Switch to Percentage Mode
// ======================================================

function switchToPercentage() {

    currentMode = "percentage";


    percentageFields.classList.remove("hidden");

    amountFields.classList.add("hidden");


    percentageModeButton.classList.add("active");

    amountModeButton.classList.remove("active");


    calculate();

}


// ======================================================
// Switch to ₹ Amount Mode
// ======================================================

function switchToAmount() {

    currentMode = "amount";


    percentageFields.classList.add("hidden");

    amountFields.classList.remove("hidden");


    percentageModeButton.classList.remove("active");

    amountModeButton.classList.add("active");


    calculate();

}


// ======================================================
// Button Events
// ======================================================

percentageModeButton.addEventListener(
    "click",
    switchToPercentage
);


amountModeButton.addEventListener(
    "click",
    switchToAmount
);


// ======================================================
// Input Events
// ======================================================

document
    .querySelectorAll("input")
    .forEach(input => {

        input.addEventListener(
            "input",
            calculate
        );

    });


// ======================================================
// Initial State
// ======================================================

// Percentage mode is always visible initially

percentageFields.classList.remove("hidden");

amountFields.classList.add("hidden");

percentageModeButton.classList.add("active");

amountModeButton.classList.remove("active");


// Initial calculation

calculate();





// ======================================================
// Stopwatch
// ======================================================

let stopwatchInterval = null;

let stopwatchStartTime = 0;


// Stopwatch elements

const stopwatchDisplay =
    document.getElementById("stopwatchDisplay");

const startStopwatchButton =
    document.getElementById("startStopwatch");

const stopStopwatchButton =
    document.getElementById("stopStopwatch");


// ======================================================
// Format Stopwatch Time
// ======================================================

function formatStopwatchTime(milliseconds) {

    const totalSeconds =
        Math.floor(milliseconds / 1000);

    const hours =
        Math.floor(totalSeconds / 3600);

    const minutes =
        Math.floor(
            (totalSeconds % 3600) / 60
        );

    const seconds =
        totalSeconds % 60;


    return (
        String(hours).padStart(2, "0") +
        ":" +
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0")
    );

}


// ======================================================
// Update Stopwatch
// ======================================================

function updateStopwatch() {

    const elapsedTime =
        Date.now() - stopwatchStartTime;

    stopwatchDisplay.textContent =
        formatStopwatchTime(elapsedTime);

}


// ======================================================
// Start Stopwatch
// ======================================================

function startStopwatch() {

    // Prevent multiple intervals

    if (stopwatchInterval !== null) {
        return;
    }


    stopwatchStartTime = Date.now();


    updateStopwatch();


    stopwatchInterval =
        setInterval(
            updateStopwatch,
            100
        );

}


// ======================================================
// Stop & Reset Stopwatch
// ======================================================

function stopStopwatch() {

    clearInterval(stopwatchInterval);

    stopwatchInterval = null;


    // Reset to zero

    stopwatchStartTime = 0;

    stopwatchDisplay.textContent =
        "00:00:00";

}


// ======================================================
// Button Events
// ======================================================

startStopwatchButton.addEventListener(
    "click",
    startStopwatch
);


stopStopwatchButton.addEventListener(
    "click",
    stopStopwatch
);
