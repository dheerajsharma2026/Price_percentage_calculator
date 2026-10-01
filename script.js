const DEFAULT_MAX_LOSS = 7500;
const DEFAULT_TARGET_PROFIT = 4000;

let currentMode = "amount";

const quantityInput = document.getElementById("quantity");
const timesInput = document.getElementById("times");
const entryPriceInput = document.getElementById("entryPrice");

const stopLossAmountInput = document.getElementById("stopLossAmount");
const targetAmountInput = document.getElementById("targetAmount");

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


function formatNumber(value, decimals = 2) {
    return Number(value).toLocaleString("en-IN", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}


function calculate() {

    const quantity = Number(quantityInput.value) || 0;
    const times = Number(timesInput.value) || 0;
    const entryPrice = Number(entryPriceInput.value) || 0;

    const overallQuantity = quantity * times;

    document.getElementById("overallQuantity").textContent =
        formatNumber(overallQuantity, 0);

    document.getElementById("resultQuantity").textContent =
        formatNumber(overallQuantity, 0);

    if (
        overallQuantity <= 0 ||
        entryPrice <= 0
    ) {
        return;
    }

    const investment = overallQuantity * entryPrice;

    let slPrice;
    let targetPrice;

    let maxLoss;
    let targetProfit;

    if (currentMode === "amount") {

        maxLoss =
            Number(stopLossAmountInput.value) ||
            DEFAULT_MAX_LOSS;

        targetProfit =
            Number(targetAmountInput.value) ||
            DEFAULT_TARGET_PROFIT;

        slPrice =
            entryPrice -
            (maxLoss / overallQuantity);

        targetPrice =
            entryPrice +
            (targetProfit / overallQuantity);

    } else {

        const slPercentage =
            Number(stopLossPercentageInput.value) || 0;

        const targetPercentage =
            Number(targetPercentageInput.value) || 0;

        slPrice =
            entryPrice *
            (1 - slPercentage / 100);

        targetPrice =
            entryPrice *
            (1 + targetPercentage / 100);

        maxLoss =
            (entryPrice - slPrice) *
            overallQuantity;

        targetProfit =
            (targetPrice - entryPrice) *
            overallQuantity;
    }

    const actualSlPercentage =
        ((entryPrice - slPrice) / entryPrice) * 100;

    const actualTargetPercentage =
        ((targetPrice - entryPrice) / entryPrice) * 100;

    const riskReward =
        maxLoss > 0
            ? targetProfit / maxLoss
            : 0;

    document.getElementById("investment").textContent =
        "₹" + formatNumber(investment);

    document.getElementById("slPrice").textContent =
        "₹" + formatNumber(slPrice);

    document.getElementById("targetPrice").textContent =
        "₹" + formatNumber(targetPrice);

    document.getElementById("loss").textContent =
        "₹" + formatNumber(maxLoss);

    document.getElementById("profit").textContent =
        "₹" + formatNumber(targetProfit);

    document.getElementById("riskReward").textContent =
        "1 : " + formatNumber(riskReward);

    if (currentMode === "amount") {

        stopLossPercentageInput.value =
            actualSlPercentage.toFixed(2);

        targetPercentageInput.value =
            actualTargetPercentage.toFixed(2);

    } else {

        stopLossAmountInput.value =
            Math.round(maxLoss);

        targetAmountInput.value =
            Math.round(targetProfit);
    }

    document.getElementById("summary").textContent =
        `Buy ${formatNumber(overallQuantity, 0)} quantity at ₹${formatNumber(entryPrice)}. ` +
        `Stop Loss ₹${formatNumber(slPrice)} (${actualSlPercentage.toFixed(2)}%) ` +
        `and Target ₹${formatNumber(targetPrice)} (+${actualTargetPercentage.toFixed(2)}%).`;
}


function switchToPercentage() {

    currentMode = "percentage";

    const quantity = Number(quantityInput.value) || 0;
    const times = Number(timesInput.value) || 0;
    const entryPrice = Number(entryPriceInput.value) || 0;

    const overallQuantity = quantity * times;

    if (overallQuantity > 0 && entryPrice > 0) {

        const maxLoss =
            Number(stopLossAmountInput.value) ||
            DEFAULT_MAX_LOSS;

        const targetProfit =
            Number(targetAmountInput.value) ||
            DEFAULT_TARGET_PROFIT;

        const investment =
            overallQuantity * entryPrice;

        stopLossPercentageInput.value =
            ((maxLoss / investment) * 100).toFixed(2);

        targetPercentageInput.value =
            ((targetProfit / investment) * 100).toFixed(2);
    }

    percentageFields.classList.remove("hidden");
    amountFields.classList.add("hidden");

    percentageModeButton.classList.add("active");
    amountModeButton.classList.remove("active");

    calculate();
}


function switchToAmount() {

    currentMode = "amount";

    const quantity = Number(quantityInput.value) || 0;
    const times = Number(timesInput.value) || 0;
    const entryPrice = Number(entryPriceInput.value) || 0;

    const overallQuantity = quantity * times;

    if (overallQuantity > 0 && entryPrice > 0) {

        const slPercentage =
            Number(stopLossPercentageInput.value) || 0;

        const targetPercentage =
            Number(targetPercentageInput.value) || 0;

        stopLossAmountInput.value =
            Math.round(
                overallQuantity *
                entryPrice *
                slPercentage / 100
            );

        targetAmountInput.value =
            Math.round(
                overallQuantity *
                entryPrice *
                targetPercentage / 100
            );
    }

    percentageFields.classList.add("hidden");
    amountFields.classList.remove("hidden");

    percentageModeButton.classList.remove("active");
    amountModeButton.classList.add("active");

    calculate();
}


percentageModeButton.addEventListener(
    "click",
    switchToPercentage
);

amountModeButton.addEventListener(
    "click",
    switchToAmount
);


// Recalculate whenever values change
document.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", calculate);
});


// Initial calculation
calculate();