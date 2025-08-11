import { LightningElement, api, track, wire } from "lwc";

import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import FIRSTNAME_FIELD from "@salesforce/schema/User.FirstName";
import USER_ID from "@salesforce/user/Id";
import communityBasePath from "@salesforce/community/basePath";

import { addCustomCssStyles, generateRandomId } from "c/utils";

const GUEST = "Guest";

export default class HomeBanner extends LightningElement {
    @api showBreadcrumbs = false;
    userId = USER_ID;

    @api showTheFirstLevelBreadcrumb = false;
    @api theFirstLevelBreadcrumbLabel = null;
    @api theFirstBreadcrumbLinkOpenLinkInNewTab;
    @api theFirstLevelBreadcrumbLink = null;

    @api showTheSecondLevelBreadcrumb = false;
    @api theSecondLevelBreadcrumbLabel = null;
    @api theSecondBreadcrumbLinkOpenLinkInNewTab = null;
    @api theSecondLevelBreadcrumbLink = null;

    @api showTheThirdLevelBreadcrumb = false;
    @api theThirdLevelBreadcrumbLabel = null;
    @api theThirdBreadcrumbLinkOpenLinkInNewTab = null;
    @api theThirdLevelBreadcrumbLink = null;

    @api showBackgroundImage = false;
    @api backgroundImage = null;
    @api tabletBackgroundImage = null;
    @api mobileBackgroundImage = null;
    @api backgroundColor = null;

    @api showTitle = false;
    @api title = null;
    @api titleColor = null;
    @api maxTitleWidth = null;

    @api showDescription = false;
    @api description = null;
    @api descriptionColor = null;
    @api maxDescriptionWidth = null;

    @track levelsMeta = ["First", "Second", "Third"];
    @track isFirstRender = true;
    @track customCssContainer = "custom-css-container";

    @wire(getRecord, { recordId: "$userId", fields: [FIRSTNAME_FIELD] })
    userRecord;

    connectedCallback() {
        console.log("UserId:", this.userId);
    }

    renderedCallback() {
        if (this.isFirstRender) {
            this.isFirstRender = false;
            this.addCustomCssStyles();
        }
    }

    get effectiveFirstName() {
        if (this.userRecord.data) {
            return (
                getFieldValue(this.userRecord.data, FIRSTNAME_FIELD) || GUEST
            );
        }

        return null;
    }

    get getTitle() {
        let firstName = this.effectiveFirstName;

        if (!this.title) return null;
        if (!this.title.includes("{0}")) return this.title;
        return this.title.replace("{0}", firstName || GUEST);
    }

    get getDescription() {
        if (!this.description) return null;
        return this.description;
    }

    get breadcrumbs() {
        let crumbs = [];

        this.levelsMeta.forEach((levelName) => {
            let showKey = `showThe${levelName}LevelBreadcrumb`;
            let labelKey = `the${levelName}LevelBreadcrumbLabel`;
            let linkKey = `the${levelName}LevelBreadcrumbLink`;
            let targetKey = `isTheBreadcrumbLinkExternal`;

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
        return this.getImageUrl(this.backgroundImage);
    }

    get tabletBackgroundImageUrl() {
        if (!this.tabletBackgroundImage) return null;
        return this.getImageUrl(this.tabletBackgroundImage);
    }

    get mobileBackgroundImageUrl() {
        if (!this.mobileBackgroundImage) return null;
        return this.getImageUrl(this.mobileBackgroundImage);
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

    get isTheBreadcrumbLinkExternal() {
        for (let level of this.levelsMeta) {
            let flag = this[`the${level}BreadcrumbLinkOpenLinkInNewTab`];
            if (flag !== undefined) {
                return flag ? "_blank" : "_self";
            }
        }
        return "_self";
    }

    addCustomCssStyles() {
        let styleText = ``;

        if (this.showBreadcrumbs) {
            styleText += `
            .home-banner__breadcrumbs {
                visibility: visible !important;
            }`;
        }

        let bgImages = [
            { url: this.backgroundImageUrl, media: null },
            {
                url: this.tabletBackgroundImageUrl,
                media: "max-width: 1023.98px"
            },
            { url: this.mobileBackgroundImageUrl, media: "max-width: 767.98px" }
        ].filter((item) => this.showBackgroundImage && item.url);

        if (bgImages.length) {
            bgImages.forEach(({ url, media }) => {
                let css = `
                .home-banner__wrapper {
                    background-image: url('${url}') !important;
                    background-size: cover !important;
                    background-position: center !important;
                    background-repeat: no-repeat !important;
                }
            `;
                styleText += media
                    ? `@media screen and (${media}) { ${css} }`
                    : css;
            });
        } else {
            // fallback: просто цвет
            styleText += `
            .home-banner__wrapper {
                background-color: ${this.backgroundColor} !important;
            }
        `;
        }

        if (this.showTitle) {
            if (this.titleColor) {
                styleText += `
                .home-banner__content-title {
                    color: ${this.titleColor} !important;
                }
            `;
            }
            if (this.maxTitleWidth) {
                styleText += `
                .home-banner__content-title {
                    max-width: ${this.maxTitleWidth} !important;
                }
            `;
            }
        }

        if (this.showDescription) {
            if (this.descriptionColor) {
                styleText += `
                .home-banner__content-description {
                    color: ${this.descriptionColor} !important;
                }
            `;
            }
            if (this.maxDescriptionWidth) {
                styleText += `
                .home-banner__content-description {
                    max-width: ${this.maxDescriptionWidth} !important;
                }
            `;
            }
        }

        addCustomCssStyles(this, this.customCssContainer, styleText);
    }

    getImageUrl(contentKey) {
        if (contentKey) {
            return `${communityBasePath}/sfsites/c/cms/delivery/media/${contentKey}`;
        }

        return null;
    }
}
