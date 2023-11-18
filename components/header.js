const headerTemplate = document.createElement('template');
headerTemplate.innerHTML = `
<style>
/* Include Tailwind styles within the shadow DOM */
@import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
@import url('/dist/styles.css');

</style>
<header class="bg-accent h-screen flex flex-col">
    <a id="summary" class="text-xl font-semibold px-10 py-5" href="summary.html">Summary</a>
    <a id="calendar" class="text-xl border-t border-accent font-semibold px-10 py-5" href="calendar.html">Calendar</a>
    <a id="limits" class="text-xl border-t border-accent font-semibold px-10 py-5" href="limits.html">Limits</a>
    <a id="statistics" class="text-xl border-t border-accent font-semibold px-10 py-5" href="statistics.html">Statistics</a>
    <a id="settings" class="text-xl border-t border-accent font-semibold px-10 py-5" href="settings.html">Settings</a>
</header>
`

class Header extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();
    }

    connectedCallback() {
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(headerTemplate.content);
    
        // Access and use attributes in connectedCallback
        const dataText = this.getAttribute('page');
        
        const links = shadowRoot.querySelectorAll('a');
        links.forEach(link => {
        if (link.id !== dataText) {
            link.classList.add('bg-secondary'); // Set your desired color
        }else{
            link.classList.add('bg-primary');
        }
        });
    }
}

customElements.define('header-component', Header);