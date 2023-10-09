var selectBox_area = document.getElementById("area-category");
var selectBox_order_type = document.getElementById("order-type");

// Variable to store the total number of pizzas delivered
var pizza_delivered;

// Variable to store the average delivery time
var average_time;

// Variable to store the total sales amount
var total_sales;

// Variables to store counts for feedback quality levels
var feedback_low;
var feedback_medium;
var feedback_high;

// variable to store the total number of pizza
var total_pizza = deliveryData.reduce(function (accumulator, data) {
    return accumulator + convertStringToInt(data.count);
}, 0);


dataFiltering(deliveryData);
updatePizzaSummury(deliveryData);
updateHtml( total_pizza,
            updatePizzaSummury(deliveryData).pizza_delivered,
            updatePizzaSummury(deliveryData).average_time,
            updatePizzaSummury(deliveryData).total_sales,
            updatePizzaSummury(deliveryData).feedback_low, 
            updatePizzaSummury(deliveryData).feedback_medium, 
            updatePizzaSummury(deliveryData).feedback_high
        );

/**
 * Updates the HTML content with various data values.
 *
 * @param {number} total_pizza - The total count of pizzas.
 * @param {number} pizza_delivered - The count of pizzas delivered.
 * @param {number} average_time - The average delivery time in minutes.
 * @param {number} total_sales - The total sales amount in dollars.
 * @param {number} feedback_low - The count of feedback entries rated as "Low."
 * @param {number} feedback_medium - The count of feedback entries rated as "Medium."
 * @param {number} feedback_high - The count of feedback entries rated as "High."
 */
function updateHtml(
    total_pizza,
    pizza_delivered,
    average_time,
    total_sales,
    feedback_low,
    feedback_medium,
    feedback_high
) {
    // Update content using JavaScript

    document.getElementById("total-pizza").innerHTML = "Total pizza : " + total_pizza;
    document.getElementById("pizza-delivered").innerHTML = "Pizza delivered : " + pizza_delivered;
    document.getElementById("average-time").innerHTML = "Average Time : " + average_time + " min";
    document.getElementById("total-sales").innerHTML = "Total sales : " + total_sales + " $";
    document.getElementById("feedback-low").innerHTML = "Low : " + feedback_low;
    document.getElementById("feedback-medium").innerHTML = "Medium : " + feedback_medium;
    document.getElementById("feedback-high").innerHTML = "High : " + feedback_high;
}


/**
 * Converts a string to an integer if it represents a valid number.
 *
 * @param {string} data - The input string to be converted.
 * @returns {number|string} - The integer value if conversion is successful, or the original string if not.
 */
function convertStringToInt(data) {
    if (!isNaN(data)) {
        return +data;
    }
    return data;
}


/**
 * Counts the occurrences of different quality categories ("low," "medium," "high")
 * that match the delivery IDs between feedbackData and deliveryData.
 *
 * @param {Array} feedbackData - An array of objects containing feedback data.
 * @param {Array} deliveryData - An array of objects containing delivery data.
 * @returns {Object} - An object with counts for each quality category.
 */
function countQualityWithMatchingDeliveryId(feedbackData, deliveryData) {
    var count_low = 0;
    var count_medium = 0;
    var count_high = 0;

    // Loop through each entry in deliveryData
    for (var i = 0; i < deliveryData.length; i++) {
        var deliveryId = deliveryData[i].delivery_id;

        var feedbackEntry = feedbackData.find(function(feedback) {
            return feedback.delivery_id === deliveryId;
        });

        if (feedbackEntry && feedbackEntry.quality === "low") {
            count_low++;
        } else if (feedbackEntry && feedbackEntry.quality === "medium") {
            count_medium++;
        } else if (feedbackEntry && feedbackEntry.quality === "high") {
            count_high++;
        }
    }

    return { count_low: count_low, count_medium: count_medium, count_high: count_high };
}

/**
 * Updates pizza-related summary statistics based on delivery and feedback data.
 *
 * @param {Array} data_pizza - An array of objects containing pizza delivery data.
 * @returns {Object} - An object with pizza-related summary statistics.
 */
function updatePizzaSummury(data_pizza) {
    var feedback_data = feedbackData;

    // Calculate the total number of pizzas delivered
    var pizza_delivered = data_pizza.reduce(function(accumulator, data) {
        return accumulator + convertStringToInt(data.count);
    }, 0);

    // Calculate the average delivery time
    var average_time = Math.round(
        data_pizza.reduce(function(accumulator, data) {
            return accumulator + convertStringToInt(data.delivery_time);
        }, 0) / deliveryData.length
    );

    // Calculate the total sales in USD
    var total_sales = Math.round(
        data_pizza.reduce(function(accumulator, data) {
            return accumulator + convertStringToInt(data.price);
        }, 0)
    );

    // Count feedback entries in different quality categories
    var quality_summary = countQualityWithMatchingDeliveryId(feedback_data, data_pizza);
    var feedback_low = quality_summary.count_low;
    var feedback_medium = quality_summary.count_medium;
    var feedback_high = quality_summary.count_high;

    // Return an object with pizza-related summary statistics
    return {
        total_pizza: total_pizza,
        pizza_delivered: pizza_delivered,
        average_time: average_time,
        total_sales: total_sales,
        feedback_low: feedback_low,
        feedback_medium: feedback_medium,
        feedback_high: feedback_high,
    };
}


/**
 * Manipulates and filters delivery data based on user-selected filters and updates the visualization and summary.
 */
function dataManipulation() {
    var delivery_data = deliveryData;
    var selected_value_area = selectBox_area.options[selectBox_area.selectedIndex].value;
    var selected_value_order_type = selectBox_order_type.options[selectBox_order_type.selectedIndex].value;

    if (selected_value_area === 'all' && selected_value_order_type === 'all') {
        // Apply data filtering with no filters
        dataFiltering(deliveryData);

        // Calculate and update pizza-related summary statistics and HTML content
        const pizzaSummary = updatePizzaSummury(deliveryData);
        updateHtml(
            pizzaSummary.total_pizza, 
            pizzaSummary.pizza_delivered, 
            pizzaSummary.average_time, 
            pizzaSummary.total_sales, 
            pizzaSummary.feedback_low, 
            pizzaSummary.feedback_medium, 
            pizzaSummary.feedback_high
        );
    } else {
        // Apply data filtering based on selected area and order type filters
        var delivery_data_filtered = delivery_data.filter(function (data) {
            var areaMatch = selected_value_area === 'all' || data.area === selected_value_area;
            var orderTypeMatch = selected_value_order_type === 'all' || data.order_type === selected_value_order_type;
            return (areaMatch && orderTypeMatch);
        });

        // Update the visualization with filtered data
        renderBarChart(delivery_data_filtered);

        // Calculate and update pizza-related summary statistics and HTML content
        const pizzaSummary = updatePizzaSummury(delivery_data_filtered);
        updateHtml(
            pizzaSummary.total_pizza, 
            pizzaSummary.pizza_delivered, 
            pizzaSummary.average_time, 
            pizzaSummary.total_sales, 
            pizzaSummary.feedback_low, 
            pizzaSummary.feedback_medium, 
            pizzaSummary.feedback_high
        );
    }
}


/**
 * Filters and processes delivery data and updates the bar chart visualization.
 *
 * @param {Array} data - The array of delivery data to be filtered and processed.
 */
function dataFiltering(data) {
    var delivery_data = data;
    renderBarChart(delivery_data);
}
