import { LightningElement, api, track } from "lwc";

import { addCustomCssStyles, generateRandomId } from "c/utils";

import communityBasePath from "@salesforce/community/basePath";

const ITEMS_PER_CATEGORY = 5;

export default class Resources extends LightningElement {
    @api showTitle = false;
    @api title = null;

    @api resourcesTitleColor = null;
    @api resourcesLinkColor = null;

    @api showCategory1 = false;
    @api category1Title = null;
    @api category1Item1Name = null;
    @api category1Item1File = null;
    @api category1Item1OpenInNewTab = false;
    @api category1Item2Name = null;
    @api category1Item2File = null;
    @api category1Item2OpenInNewTab = false;
    @api category1Item3Name = null;
    @api category1Item3File = null;
    @api category1Item3OpenInNewTab = false;
    @api category1Item4Name = null;
    @api category1Item4File = null;
    @api category1Item4OpenInNewTab = false;
    @api category1Item5Name = null;
    @api category1Item5File = null;
    @api category1Item5OpenInNewTab = false;

    @api showCategory2 = false;
    @api category2Title = null;
    @api category2Item1Name = null;
    @api category2Item1File = null;
    @api category2Item1OpenInNewTab = false;
    @api category2Item2Name = null;
    @api category2Item2File = null;
    @api category2Item2OpenInNewTab = false;
    @api category2Item3Name = null;
    @api category2Item3File = null;
    @api category2Item3OpenInNewTab = false;
    @api category2Item4Name = null;
    @api category2Item4File = null;
    @api category2Item4OpenInNewTab = false;
    @api category2Item5Name = null;
    @api category2Item5File = null;
    @api category2Item5OpenInNewTab = false;

    @api showCategory3 = false;
    @api category3Title = null;
    @api category3Item1Name = null;
    @api category3Item1File = null;
    @api category3Item1OpenInNewTab = false;
    @api category3Item2Name = null;
    @api category3Item2File = null;
    @api category3Item2OpenInNewTab = false;
    @api category3Item3Name = null;
    @api category3Item3File = null;
    @api category3Item3OpenInNewTab = false;
    @api category3Item4Name = null;
    @api category3Item4File = null;
    @api category3Item4OpenInNewTab = false;
    @api category3Item5Name = null;
    @api category3Item5File = null;
    @api category3Item5OpenInNewTab = false;

    @track isFirstRender = true;
    @track customCssContainer = "custom-css-container";
    @track resourcesData = [];

    connectedCallback() {
        this.resourcesData = this.parseData();
    }

    renderedCallback() {
        if (this.isFirstRender) {
            this.isFirstRender = false;
            if (this.resourcesData.length > 0) {
                this.addCustomCssStyles();
            }
        }
    }

    get hasContent() {
        if (this.showTitle && this.title) {
            return true;
        }
        for (let i = 1; i <= 3; i++) {
            if (this[`showCategory${i}`]) {
                for (let j = 1; j <= ITEMS_PER_CATEGORY; j++) {
                    const itemName = this[`category${i}Item${j}Name`];
                    const itemFile = this[`category${i}Item${j}File`];

                    if (itemName && itemFile) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    get categories() {
        return this.resourcesData.filter(
            (category) => category.show && category.items.length > 0
        );
    }

    addCustomCssStyles() {
        let styleText = ``;

        if (this.resourcesTitleColor) {
            styleText += `.home-resources__category-title { color: ${this.resourcesTitleColor}; }`;
        }

        if (this.resourcesLinkColor) {
            styleText += `.home-resources__item-link, .home-resources__item-text { color: ${this.resourcesLinkColor}; }`;
        }

        addCustomCssStyles(this, this.customCssContainer, styleText);
    }

    parseData() {
        let result = (this.resourcesData = []);

        for (let i = 1; i <= 3; i++) {
            let categoryData = {
                id: generateRandomId(),
                show: this[`showCategory${i}`],
                title: this[`category${i}Title`],
                items: []
            };

            for (let j = 1; j <= ITEMS_PER_CATEGORY; j++) {
                const itemName = this[`category${i}Item${j}Name`];
                const itemFile = this[`category${i}Item${j}File`];

                if (itemName && itemFile) {
                    categoryData.items.push({
                        id: generateRandomId(),
                        name: itemName,
                        url: this.getImageUrl(itemFile),
                        openInNewTab:
                            itemFile &&
                            this[`category${i}Item${j}OpenInNewTab`],
                        target:
                            itemFile && this[`category${i}Item${j}OpenInNewTab`]
                                ? "_blank"
                                : "_self"
                    });
                }
            }

            if (categoryData.show && categoryData.items.length > 0) {
                result.push(categoryData);
            }
        }

        return result;
    }

    getImageUrl(contentKey) {
        if (contentKey) {
            return `${communityBasePath}/sfsites/c/cms/delivery/media/${contentKey}`;
        }
        return null;
    }

    async openUrlInNewTab(url, target) {
        try {
            let resp = await fetch(url, { credentials: "same-origin" });
            if (!resp.ok) throw new Error(`Fetch failed: ${resp.status}`);

            let arrayBuffer = await resp.arrayBuffer();

            let pdfBlob = new Blob([arrayBuffer], {
                type: "application/pdf"
            });

            let blobUrl = URL.createObjectURL(pdfBlob);

            let newWin = window.open(blobUrl, target);
            if (newWin) {
                try {
                    newWin.opener = null;
                } catch (e) {
                    console.error(e);
                }
            }
        } catch (err) {
            console.error("Error while opening PDF:", err);
            window.open(url, target);
        }
    }

    handleItemClick(event) {
        event.preventDefault();

        let target = event.currentTarget.getAttribute("target");
        let url = event.currentTarget.getAttribute("href");

        if (target) {
            this.openUrlInNewTab(url, target);
        } else {
            window.location.href = url;
        }
    }
}
