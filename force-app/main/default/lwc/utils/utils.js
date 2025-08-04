// lwc/utils/utils.js

/**
 * Inject santed CSS in <style> inside the specified container
 * @param {LightningElement} cmp         – this of component
 * @param {string} customCssContainer    – class-container for <style>
 * @param {string} styleText             – CSS Text styles
 */
export function addCustomCssStyles(cmp, customCssContainer, styleText) {
    const styleElement = document.createElement("style");
    styleElement.innerText = styleText;

    const container = cmp.template.querySelector(`.${customCssContainer}`);
    if (container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        container.appendChild(styleElement);
    }
}

/**
 * Generate random unique id
 * @returns {string}
 */
export function generateRandomId() {
    return Math.random().toString(16).slice(2);
}
