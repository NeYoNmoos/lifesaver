const headerTemplate = document.createElement('template');
headerTemplate.innerHTML = `
<style>
/* Include Tailwind styles within the shadow DOM */
@import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
@import url('/dist/styles.css');

</style>
<header class="bg-accent flex flex-col">
    <a class="text-xl font-semibold bg-primary px-10 py-5" href="#">Summary</a>
    <a class="text-xl border-t border-accent font-semibold bg-secondary px-10 py-5" href="#">Calender</a>
    <a class="text-xl border-t border-accent font-semibold bg-secondary px-10 py-5" href="#">Limits</a>
    <a class="text-xl border-t border-accent font-semibold bg-secondary px-10 py-5" href="#">Statistics</a>
    <a class="text-xl border-t border-accent font-semibold bg-secondary px-10 py-5" href="#">Settings</a>
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
    }
}

customElements.define('header-component', Header);