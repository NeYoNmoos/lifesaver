const webpageTimer = document.createElement('template');
webpageTimer.innerHTML = `
<style>
  /* Include Tailwind styles within the shadow DOM */
  @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
  @import url('/dist/styles.css');

  .edit-container {
    @apply flex items-center space-x-2;
  }

  input {
    @apply px-2 py-1 border;
  }
</style>
<div class="page-component">
  <p class="text-gray-600" id="pageName">Current page name</p>
  <div class="flex space-x-4 items-center mt-4 edit-container">
    <img class="w-16 h-16 border" id="imageSource" src="your-image-source.jpg">
    <canvas class="w-16 h-16 border"></canvas>
    <input class="w-24 px-2 py-1 border" style="display: none;">
    <button class="bg-blue-500 text-white px-4 py-2 rounded">
      <i class="fas fa-pen"></i> Edit
    </button>
    <button class="bg-red-500 text-white px-4 py-2 rounded">
      <i class="fas fa-ban"></i> Block
    </button>
  </div>
</div>
`;

class WebpageTimer extends HTMLElement {
  constructor() {
    // Always call super first in the constructor
    super();

    // Initial state
    this.isEditing = false;
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(webpageTimer.content);

    // Get elements inside the shadow DOM
    const editButton = shadowRoot.querySelector('.bg-blue-500');
    const blockButton = shadowRoot.querySelector('.bg-red-500');
    const canvas = shadowRoot.querySelector('canvas');
    const inputField = shadowRoot.querySelector('input');

    // Set event listeners
    editButton.addEventListener('click', () => {
      if (!this.isEditing) {
        this.isEditing = true;
        // Toggle between canvas and input field
        canvas.style.display = 'none';
        inputField.style.display = 'block';
        inputField.value = canvas.getAttribute('alt'); // Use some attribute for the initial value
        // Toggle between buttons
        editButton.innerHTML = '<i class="fas fa-check"></i> Submit';
        blockButton.innerHTML = '<i class="fas fa-times"></i> Cancel';
      } else {
        // Submit logic (save the edited value, etc.)
        // ...

        // Toggle back to view mode
        this.isEditing = false;
        canvas.style.display = 'block';
        inputField.style.display = 'none';
        // Toggle buttons back
        editButton.innerHTML = '<i class="fas fa-pen"></i> Edit';
        blockButton.innerHTML = '<i class="fas fa-ban"></i> Block';
      }
    });

    blockButton.addEventListener('click', () => {
      // Reset to the initial state if canceled
      this.isEditing = false;
      canvas.style.display = 'block';
      inputField.style.display = 'none';
      editButton.innerHTML = '<i class="fas fa-pen"></i> Edit';
      blockButton.innerHTML = '<i class="fas fa-ban"></i> Block';
    });
  }
}

customElements.define('timer-component', WebpageTimer);
