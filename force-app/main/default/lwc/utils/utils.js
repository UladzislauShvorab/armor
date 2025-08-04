// lwc/utils/utils.js
/**
 * Инжектит переданный CSS в <style> внутри указанного контейнера компонента
 * @param {LightningElement} cmp         – this of component
 * @param {string} customCssContainer    – класс контейнера, куда вставить <style>
 * @param {string} styleText             – текст CSS для вставки
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
