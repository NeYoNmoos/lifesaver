const webpageTimer = document.createElement('template');
webpageTimer.innerHTML = `
<style>
/* Include Tailwind styles within the shadow DOM */
@import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
@import url('/dist/styles.css');

</style>
    <div class="page-component">
        <p class="text-gray-600" id="pageName">Current page name</p>
        <div class="flex space-x-4 items-center mt-4">
            <img class="w-16 h-16 border" id="imageSource" src="your-image-source.jpg">
            <canvas class="w-16 h-16 border"></canvas>
            <button class="bg-blue-500 text-white px-4 py-2 rounded">
                <i class="fas fa-pen"></i> Edit
            </button>
            <button class="bg-red-500 text-white px-4 py-2 rounded">
                <i class="fas fa-ban"></i> Block
            </button>
        </div>
    </div>
`

class WebpageTimer extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();
    }

    connectedCallback() {
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(webpageTimer.content);
    }
}

customElements.define('timer-component', WebpageTimer);