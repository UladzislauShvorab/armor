import { LightningElement, api, track } from "lwc";

import communityBasePath from "@salesforce/community/basePath";

export default class HomeBanner extends LightningElement {
    @api recordId = null;
    @api firstName = null;

    @api showBreadcrumbs = false;

    @api showTheFirstLevelBreadcrumb = false;
    @api theFirstLevelBreadcrumbLabel;
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

        let styleElement = document.createElement("style");
        styleElement.innerText = styleText;

        let parenNode = this.template.querySelector(
            `.${this.customCssContainer}`
        );
        if (parenNode) {
            while (parenNode.firstChild) {
                parenNode.removeChild(parenNode.firstChild);
            }
            parenNode.appendChild(styleElement);
        }
    }

    get getTitle() {
        if (!this.title) return null;

        if (!this.title.includes("{0}")) return this.title;

        if (!this.firstName || this.firstName === "")
            return this.title.replace("{0}", "unknown");
        return this.title.replace("{0}", this.firstName);
    }

    get visibleBreadcrumbs() {
        const breadcrumbs = [];

        if (
            this.showTheFirstLevelBreadcrumb &&
            this.theFirstLevelBreadcrumbLabel
        ) {
            breadcrumbs.push({
                id: "first",
                label: this.theFirstLevelBreadcrumbLabel,
                link: this.theFirstLevelBreadcrumbLink,
                target: this.isTheFirstBreadcrumbLinkExternal,
                showArrow: false
            });
        }

        if (
            this.showTheSecondLevelBreadcrumb &&
            this.theSecondLevelBreadcrumbLabel
        ) {
            breadcrumbs.push({
                id: "second",
                label: this.theSecondLevelBreadcrumbLabel,
                link: this.theSecondLevelBreadcrumbLink,
                target: this.isTheSecondLevelBreadcrumbLinkExternal,
                showArrow: breadcrumbs.length > 0
            });
        }

        if (
            this.showTheThirdLevelBreadcrumb &&
            this.theThirdLevelBreadcrumbLabel
        ) {
            breadcrumbs.push({
                id: "third",
                label: this.theThirdLevelBreadcrumbLabel,
                link: this.theThirdLevelBreadcrumbLink,
                target: this.isTheThirdLevelBreadcrumbLinkExternal,
                showArrow: breadcrumbs.length > 0
            });
        }

        return breadcrumbs;
    }

    get backgroundImageUrl() {
        if (!this.backgroundImage) return null;
        return `${communityBasePath}/sfsites/c/cms/delivery/media/${this.backgroundImage}`;
    }

    get tabletBackgroundImageUrl() {
        if (!this.tabletBackgroundImage) return null;
        return `${communityBasePath}/sfsites/c/cms/delivery/media/${this.tabletBackgroundImage}`;
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
