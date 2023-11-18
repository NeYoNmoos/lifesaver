document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("submit");

    button.addEventListener('click', function () {
        // Get the input element values by their IDs
        var time = document.getElementById('time').value;
        var url = document.getElementById('url').value;
        var limits = { time: time, url: url };

        // Save the limits to Chrome local storage
        chrome.storage.local.get('limits', function (result) {
            var existingLimits = result.limits || [];

            // Add the new limit to the existing array
            existingLimits.push(limits);

            chrome.storage.local.set({ limits: existingLimits }, function () {
                console.log('Limits set:', existingLimits);

                // After adding a new limit, refresh the displayed limits
                displayLimits(existingLimits);
            });
        });
    });

    // Fetch and display existing limits when the page loads
    chrome.storage.local.get('limits', function (result) {
        var existingLimits = result.limits || [];
        displayLimits(existingLimits);
    });

    function displayLimits(limits) {
        const limitsContainer = document.getElementById('limitsContainer');

        // Check if there are any limits
        if (!Array.isArray(limits) || limits.length === 0) {
            limitsContainer.innerHTML = '<p>No limits set.</p>';
            return;
        }

        // Create an HTML list to display limits
        const limitsList = document.createElement('ul');

        // Iterate through each limit and create list items with delete buttons
        limits.forEach(function (limit, index) {
            const listItem = document.createElement('li');
            listItem.textContent = `URL: ${limit.url}, Limit: ${limit.time}`;

            // Create a delete button for each limit
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function () {
                // Remove the limit from the array
                limits.splice(index, 1);

                // Save the updated limits to Chrome local storage
                chrome.storage.local.set({ limits: limits }, function () {
                    console.log('Limit deleted. Updated limits:', limits);

                    // Refresh the displayed limits after deletion
                    displayLimits(limits);
                });
            });

            // Append the delete button to the list item
            listItem.appendChild(deleteButton);

            // Append the list item to the limits list
            limitsList.appendChild(listItem);
        });

        // Append the list to the container
        limitsContainer.innerHTML = ''; // Clear existing content
        limitsContainer.appendChild(limitsList);
    }
});
