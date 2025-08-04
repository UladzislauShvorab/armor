import { LightningElement, api, track, wire } from "lwc";

import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import Id from "@salesforce/user/Id";
import FIRSTNAME_FIELD from "@salesforce/schema/User.FirstName";
import communityBasePath from "@salesforce/community/basePath";

import { addCustomCssStyles, generateRandomId } from "c/utils";

export default class HomeBanner extends LightningElement {
    @api recordId = null;
    @api firstName = null;

    userId = Id;

    @api showBreadcrumbs = false;

    @api showTheFirstLevelBreadcrumb = false;
    @api theFirstLevelBreadcrumbLabel = null;
    @api theFirstBreadcrumbLinkOpenLinkInNewTab;
    @api theFirstLevelBreadcrumbLink;

    @api showTheSecondLevelBreadcrumb = false;
    @api theSecondLevelBreadcrumbLabel;
    @api theSecondBreadcrumbLinkOpenLinkInNewTab;
    @api theSecondLevelBreadcrumbLink;

    @api showTheThirdLevelBreadcrumb = false;
    @api theThirdLevelBreadcrumbLabel;
    @api theThirdBreadcrumbLinkOpenLinkInNewTab;
    @api theThirdLevelBreadcrumbLink;

    @api showBackgroundImage = false;
    @api backgroundImage;
    @api tabletBackgroundImage;
    @api mobileBackgroundImage;
    @api backgroundColor = null;

    @api showTitle = false;
    @api title;
    @api titleColor = null;
    @api maxTitleWidth;

    @api showDescription = false;
    @api description;
    @api descriptionColor = null;
    @api maxDescriptionWidth;

    @track isFirstRender = true;
    @track customCssContainer = "custom-css-container";

    @wire(getRecord, { recordId: "$userId", fields: [FIRSTNAME_FIELD] })
    userRecord;

    get effectiveFirstName() {
        if (this.firstName) {
            return this.firstName;
        }

        if (this.userRecord.data) {
            return getFieldValue(this.userRecord.data, FIRSTNAME_FIELD);
        }

        return null;
    }

    connectedCallback() {
        console.log("UserId:", this.userId);
        console.log("API firstName:", this.firstName);
    }

    renderedCallback() {
        if (this.isFirstRender) {
            this.isFirstRender = false;
            this.addCustomCssStyles();
        }
    }

    addCustomCssStyles() {
        let styleText = ``;

        if (this.showBreadcrumbs) {
            styleText += `
            .home-banner__breadcrumbs {
                visibility: visible !important;
            }`;
        }

        if (this.showBackgroundImage) {
            if (this.backgroundImageUrl) {
                styleText += `
                .home-banner__wrapper {
                    background-image: url('${this.backgroundImageUrl}') !important;
                    background-size: cover !important;
                    background-position: center !important;
                    background-repeat: no-repeat !important;
                }`;
            }

            if (this.tabletBackgroundImageUrl) {
                styleText += `
                @media screen and (max-width: 1024px) {
                    .home-banner__wrapper {
                        background-image: url('${this.tabletBackgroundImageUrl}') !important;
                        background-size: cover !important;
                        background-position: center !important;
                        background-repeat: no-repeat !important;
                    }
                }`;
            }

            if (this.mobileBackgroundImageUrl) {
                styleText += `
                @media screen and (max-width: 768px) {
                    .home-banner__wrapper {
                        background-image: url('${this.mobileBackgroundImageUrl}') !important;
                        background-size: cover !important;
                        background-position: center !important;
                        background-repeat: no-repeat !important;
                    }
                }`;
            }
        }

        if (
            !this.showBackgroundImage ||
            (!this.backgroundImageUrl &&
                !this.tabletBackgroundImageUrl &&
                !this.mobileBackgroundImageUrl)
        ) {
            styleText += `
            .home-banner__wrapper {
                background-color: ${this.backgroundColor} !important;
            }`;
        }

        if (this.showTitle && this.titleColor) {
            styleText += `
            .home-banner__content-title {
                color: ${this.titleColor} !important;
            }`;
        }

        if (this.showTitle && this.maxTitleWidth) {
            styleText += `
            .home-banner__content-title {
                max-width: ${this.maxTitleWidth} !important;
            }`;
        }

        if (this.showDescription && this.descriptionColor) {
            styleText += `
            .home-banner__content-description {
                color: ${this.descriptionColor} !important;
            }`;
        }

        if (this.showDescription && this.maxDescriptionWidth) {
            styleText += `
            .home-banner__content-description {
                max-width: ${this.maxDescriptionWidth} !important;
            }`;
        }

        addCustomCssStyles(this, this.customCssContainer, styleText);
    }

    // addCustomCssStyles() {
    //     let styleElement = document.createElement("style");
    //     styleElement.innerText = styleText;

    //     let parenNode = this.template.querySelector(
    //         `.${this.customCssContainer}`
    //     );
    //     if (parenNode) {
    //         while (parenNode.firstChild) {
    //             parenNode.removeChild(parenNode.firstChild);
    //         }
    //         parenNode.appendChild(styleElement);
    //     }
    // }

    get getTitle() {
        const firstName = this.effectiveFirstName;

        if (!this.title) return null;
        if (!this.title.includes("{0}")) return this.title;
        return this.title.replace("{0}", firstName || "Guest");
    }

    get breadcrumbs() {
        const levelsMeta = ["First", "Second", "Third"];
        const crumbs = [];

        levelsMeta.forEach((levelName) => {
            const showKey = `showThe${levelName}LevelBreadcrumb`;
            const labelKey = `the${levelName}LevelBreadcrumbLabel`;
            const linkKey = `the${levelName}LevelBreadcrumbLink`;
            const targetKey = `isThe${levelName}BreadcrumbLinkExternal`;

            if (this[showKey] && this[labelKey]) {
                crumbs.push({
                    id: generateRandomId(),
                    label: this[labelKey],
                    link: this[linkKey],
                    target: this[targetKey],
                    showArrow: crumbs.length > 0
                });
            }
        });

        return crumbs;
    }

    get backgroundImageUrl() {
        if (!this.backgroundImage) return null;
        return `${communityBasePath}/sfsites/c/cms/delivery/media/${this.backgroundImage}`;
    }

    get tabletBackgroundImageUrl() {
        if (!this.tabletBackgroundImage) return null;
        return `${communityBasePath}/sfsites/c/cms/delivery/media/${this.tabletBackgroundImage}`;
    }

    get mobileBackgroundImageUrl() {
        if (!this.mobileBackgroundImage) return null;
        return `${communityBasePath}/sfsites/c/cms/delivery/media/${this.mobileBackgroundImage}`;
    }

    get isShowBackgroundImage() {
        return (
            this.showBackgroundImage &&
            (!!this.backgroundImage ||
                !!this.tabletBackgroundImage ||
                !!this.mobileBackgroundImage)
        );
    }

    get hasBreadcrumbs() {
        return (
            this.showTheFirstLevelBreadcrumb ||
            this.showTheSecondLevelBreadcrumb ||
            this.showTheThirdLevelBreadcrumb
        );
    }

    get isTheFirstBreadcrumbLinkExternal() {
        return this.theFirstBreadcrumbLinkOpenLinkInNewTab ? "_blank" : "_self";
    }

    get isTheSecondBreadcrumbLinkExternal() {
        return this.theSecondBreadcrumbLinkOpenLinkInNewTab
            ? "_blank"
            : "_self";
    }

    get isTheThirdBreadcrumbLinkExternal() {
        return this.theThirdBreadcrumbLinkOpenLinkInNewTab ? "_blank" : "_self";
    }
}
