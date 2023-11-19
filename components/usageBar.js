const usageBar = document.createElement('template');
headerTemplate.innerHTML = `
<style>
/* Include Tailwind styles within the shadow DOM */
@import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
@import url('/dist/styles.css');

</style>
<header class="bg-accent h-screen flex flex-col">
    <a class="text-xl font-semibold bg-primary px-10 py-5" href="#">Summary</a>
    <a class="text-xl border-t border-accent font-semibold bg-secondary px-10 py-5" href="#">Calender</a>
    <a class="text-xl border-t border-accent font-semibold bg-secondary px-10 py-5" href="#">Limits</a>
    <a class="text-xl border-t border-accent font-semibold bg-secondary px-10 py-5" href="#">Statistics</a>
    <a class="text-xl border-t border-accent font-semibold bg-secondary px-10 py-5" href="#">Settings</a>
</header>
`


class ChartComponent extends HTMLElement {
    constructor() {
        super();
        let height = this.getAttribute("height");
        let width = this.getAttribute("width");
        let timeformat = this.getAttribute('timeformat');
        let timeonline = [parseInt(this.getAttribute('timeonline'))];
        let timeleft = [parseInt(this.getAttribute('timeleft'))];
        // Create a shadow root for the component
        const shadowRoot = this.attachShadow({ mode: 'open' });
        console.log(timeleft);
        // Define HTML content for the component
        shadowRoot.innerHTML = `
            <div class="chart-container">
                <canvas id="myChart1" width="${width}" height="${height}"></canvas>
            </div>
        `;
        
        // Create a script element for Chart.js and jQuery
        const chartScript = document.createElement('script');
        shadowRoot.appendChild(chartScript);
        
        const chartJS = document.createElement('script');
        chartJS.src = chrome.runtime.getURL(
            "/packages/chart-js//chart.js"
          );
        shadowRoot.appendChild(chartJS);

        // Create the chart within the component
        chartJS.onload = () => {
            const branches_canvas = shadowRoot.getElementById('myChart1');

            const branches = new Chart(branches_canvas, {
                type: 'bar',
                data: {
                    labels: [''],
                    datasets: [{
                        label: 'Time Spent',
                        data: timeonline,
                        backgroundColor: [
                            '#ca2e2e',
                        ],
                        hoverOffset: 0
                    },
                    {
                        label: 'Time Left',
                        data: timeleft,
                        backgroundColor: [
                            '#4287f5',
                        ],
                    }],
                },
                options: {
                    indexAxis: 'y',
                    plugins: {
                        legend: {
                            display: false // Hide the legend
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += context.parsed.x + timeformat;
                                    }
                                    return label;
                                },
                                footer: function(tooltipItems, data) {
                                    let sum = 0;
                                    tooltipItems.forEach(function(tooltipItem) {
                                        sum += tooltipItem.parsed.x; // Access 'y' value directly for the 'y' axis
                                    });
                                    return 'Limit: ' + sum + ' ' + timeformat;
                                }
                            }
                        },
                    },
                    scales: {
                        x: {
                            display: true,
                            stacked: true
                        },
                        y: {
                            display: false,
                            stacked: true
                        }
                    },
                }
            });
        };
    }
}

// Define the custom element 'chart-component'
customElements.define('chart-component', ChartComponent);

