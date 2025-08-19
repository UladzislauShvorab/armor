import { LightningElement, api, track, wire } from "lwc";
import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import FIRSTNAME_FIELD from "@salesforce/schema/User.FirstName";
import USER_ID from "@salesforce/user/Id";
import communityBasePath from "@salesforce/community/basePath";
import { addCustomCssStyles, generateRandomId } from "c/utils";

const GUEST = "Guest";
const LEVELS = ["First", "Second", "Third"];

export default class HomeBanner extends LightningElement {
    @api showBreadcrumbs = false;
    @api showTheFirstLevelBreadcrumb = false;
    @api theFirstLevelBreadcrumbLabel = null;
    @api theFirstLevelBreadcrumbLink = null;
    @api theFirstBreadcrumbLinkOpenLinkInNewTab = false;

    @api showTheSecondLevelBreadcrumb = false;
    @api theSecondLevelBreadcrumbLabel = null;
    @api theSecondLevelBreadcrumbLink = null;
    @api theSecondBreadcrumbLinkOpenLinkInNewTab = false;

    @api showTheThirdLevelBreadcrumb = false;
    @api theThirdLevelBreadcrumbLabel = null;
    @api theThirdLevelBreadcrumbLink = null;
    @api theThirdBreadcrumbLinkOpenLinkInNewTab = false;

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

    userId = USER_ID;
    @track isFirstRender = true;
    @track customCssContainer = "custom-css-container";

    @track parsed = { breadcrumbs: [], bgImages: [] };

    @wire(getRecord, { recordId: "$userId", fields: [FIRSTNAME_FIELD] })
    userRecord;

    connectedCallback() {
        this.parsed = this.parseData();
    }

    renderedCallback() {
        if (this.isFirstRender) {
            this.isFirstRender = false;
            this.addCustomCssStyles();
        }
    }

    get hasContent() {
        if (
            this.showBackgroundImage &&
            (this.backgroundImage ||
                this.tabletBackgroundImage ||
                this.mobileBackgroundImage)
        ) {
            return true;
        }

        if (this.showBreadcrumbs && this.breadcrumbs.length > 0) {
            return true;
        }

        if (this.showTitle && this.title) {
            return true;
        }

        if (this.showDescription && this.description) {
            return true;
        }

        for (let i = 1; i <= 3; i++) {
            if (this[`showColumn${i}`]) {
                if (this[`column${i}Title`]) return true;
                for (let j = 1; j <= 7; j++) {
                    if (
                        this[`showColumn${i}Link${j}`] &&
                        this[`column${i}Link${j}Text`]
                    ) {
                        return true;
                    }
                }
            }
        }

        if (this.showBottomLinks) {
            for (let i = 1; i <= 4; i++) {
                if (this[`showBottomLink${i}`] && this[`bottomLink${i}Text`]) {
                    return true;
                }
            }
        }

        return false;
    }

    get effectiveFirstName() {
        if (this.userRecord && this.userRecord.data) {
            return (
                getFieldValue(this.userRecord.data, FIRSTNAME_FIELD) || GUEST
            );
        }
        return null;
    }

    get getTitle() {
        if (!this.title) return null;
        const name = this.effectiveFirstName || GUEST;
        return this.title.includes("{0}")
            ? this.title.replace("{0}", name)
            : this.title;
    }

    get breadcrumbs() {
        return this.parsed.breadcrumbs;
    }

    get isShowBackgroundImage() {
        return (
            this.showBackgroundImage &&
            (!!this.backgroundImage ||
                !!this.tabletBackgroundImage ||
                !!this.mobileBackgroundImage)
        );
    }

    parseData() {
        const breadcrumbs = [];

        LEVELS.forEach((level) => {
            const show = this[`showThe${level}LevelBreadcrumb`];
            const label = this[`the${level}LevelBreadcrumbLabel`];
            const link = this[`the${level}LevelBreadcrumbLink`];
            const openInNew = this[`the${level}BreadcrumbLinkOpenLinkInNewTab`];

            if (show && label) {
                breadcrumbs.push({
                    id: generateRandomId(),
                    label,
                    link: link,
                    target: link ? (openInNew ? "_blank" : "_self") : null,
                    showArrow: breadcrumbs.length > 0
                });
            }
        });

        const bgCandidates = [
            { key: this.backgroundImage, media: null },
            { key: this.tabletBackgroundImage, media: "max-width: 1023.98px" },
            { key: this.mobileBackgroundImage, media: "max-width: 767.98px" }
        ];

        const bgImages = bgCandidates
            .map((it) => ({ url: this.getImageUrl(it.key), media: it.media }))
            .filter((it) => this.showBackgroundImage && it.url);

        return { breadcrumbs, bgImages };
    }

    addCustomCssStyles() {
        let styleText = "";

        if (this.showBreadcrumbs) {
            styleText += `
            .home-banner__breadcrumbs {
                visibility: visible !important;
                display: flex !important;
            }`;
        } else {
            styleText += `
            .home-banner__inner {
                display: flex;
                justify-content: center;
            }`;
        }

        const bgImages = this.parsed.bgImages;
        if (bgImages && bgImages.length) {
            bgImages.forEach(({ url, media }) => {
                const css = `.home-banner__wrapper{
                    background-image:url('${url}') !important;
                    background-size:cover !important;
                    background-position:center !important;
                    background-repeat:no-repeat !important;
                }`;
                styleText += media
                    ? `@media screen and (${media}){${css}}`
                    : css;
            });
        } else if (this.backgroundColor) {
            styleText += `.home-banner__wrapper{background-color:${this.backgroundColor} !important;}`;
        }

        if (this.showTitle) {
            if (this.titleColor)
                styleText += `.home-banner__content-title{color:${this.titleColor} !important;}`;
            if (this.maxTitleWidth)
                styleText += `.home-banner__content-title{max-width:${this.maxTitleWidth} !important;}`;
        }

        if (this.showDescription) {
            if (this.descriptionColor)
                styleText += `.home-banner__content-description{color:${this.descriptionColor} !important;}`;
            if (this.maxDescriptionWidth)
                styleText += `.home-banner__content-description{max-width:${this.maxDescriptionWidth} !important;}`;
        }

        addCustomCssStyles(this, this.customCssContainer, styleText);
    }

    getImageUrl(contentKey) {
        return contentKey
            ? `${communityBasePath}/sfsites/c/cms/delivery/media/${contentKey}`
            : null;
    }
}
