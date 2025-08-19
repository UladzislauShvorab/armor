import { LightningElement, api, track } from "lwc";
import { addCustomCssStyles, generateRandomId } from "c/utils";
import communityBasePath from "@salesforce/community/basePath";

export default class CustomerHomeFooter extends LightningElement {
    @api logoFile = null;
    @api footerBackgroundColor = null;
    @api footerTextColor = null;
    @api showSocialMedia = false;
    @api socialMedia1 = null;
    @api socialMedia2 = null;
    @api socialMedia3 = null;
    @api socialMedia4 = null;

    @api showColumn1 = false;
    @api column1Title = null;
    @api showColumn1Link1 = false;
    @api column1Link1Text = null;
    @api column1Link1Url = null;
    @api showColumn1Link2 = false;
    @api column1Link2Text = null;
    @api column1Link2Url = null;
    @api showColumn1Link3 = false;
    @api column1Link3Text = null;
    @api column1Link3Url = null;
    @api showColumn1Link4 = false;
    @api column1Link4Text = null;
    @api column1Link4Url = null;
    @api showColumn1Link5 = false;
    @api column1Link5Text = null;
    @api column1Link5Url = null;
    @api showColumn1Link6 = false;
    @api column1Link6Text = null;
    @api column1Link6Url = null;
    @api showColumn1Link7 = false;
    @api column1Link7Text = null;
    @api column1Link7Url = null;

    @api showColumn2 = false;
    @api column2Title = null;
    @api showColumn2Link1 = false;
    @api column2Link1Text = null;
    @api column2Link1Url = null;
    @api showColumn2Link2 = false;
    @api column2Link2Text = null;
    @api column2Link2Url = null;
    @api showColumn2Link3 = false;
    @api column2Link3Text = null;
    @api column2Link3Url = null;
    @api showColumn2Link4 = false;
    @api column2Link4Text = null;
    @api column2Link4Url = null;
    @api showColumn2Link5 = false;
    @api column2Link5Text = null;
    @api column2Link5Url = null;
    @api showColumn2Link6 = false;
    @api column2Link6Text = null;
    @api column2Link6Url = null;
    @api showColumn2Link7 = false;
    @api column2Link7Text = null;
    @api column2Link7Url = null;

    @api showColumn3 = false;
    @api column3Title = null;
    @api showColumn3Link1 = false;
    @api column3Link1Text = null;
    @api column3Link1Url = null;
    @api showColumn3Link2 = false;
    @api column3Link2Text = null;
    @api column3Link2Url = null;
    @api showColumn3Link3 = false;
    @api column3Link3Text = null;
    @api column3Link3Url = null;
    @api showColumn3Link4 = false;
    @api column3Link4Text = null;
    @api column3Link4Url = null;
    @api showColumn3Link5 = false;
    @api column3Link5Text = null;
    @api column3Link5Url = null;
    @api showColumn3Link6 = false;
    @api column3Link6Text = null;
    @api column3Link6Url = null;
    @api showColumn3Link7 = false;
    @api column3Link7Text = null;
    @api column3Link7Url = null;

    @api showBottomLinks = false;
    @api showBottomLink1 = false;
    @api bottomLink1Text = null;
    @api bottomLink1Url = null;
    @api showBottomLink2 = false;
    @api bottomLink2Text = null;
    @api bottomLink2Url = null;
    @api showBottomLink3 = false;
    @api bottomLink3Text = null;
    @api bottomLink3Url = null;
    @api showBottomLink4 = false;
    @api bottomLink4Text = null;
    @api bottomLink4Url = null;

    @api privacyPolicyText = null;
    @api privacyPolicyUrl = null;
    @api cookiePolicyText = null;
    @api cookiePolicyUrl = null;
    @api patentNotificationText = null;
    @api patentNotificationUrl = null;
    @api caPropositionText = null;
    @api caPropositionUrl = null;

    @track isFirstRender = true;
    @track customCssContainer = "custom-css-container";
    @track footerData = [];

    connectedCallback() {
        this.footerData = this.parseFooterData();
    }

    renderedCallback() {
        if (this.isFirstRender) {
            this.isFirstRender = false;
            this.addCustomCssStyles();
        }
    }

    get logoUrl() {
        return this.logoFile
            ? `${communityBasePath}/sfsites/c/cms/delivery/media/${this.logoFile}`
            : null;
    }

    get copyrightText() {
        return `Copyright © ${new Date().getFullYear()} Armor Express`;
    }

    get columns() {
        return (this.footerData || []).filter(
            (column) => column.show && column.links && column.links.length > 0
        );
    }

    get socialMediaLinks() {
        return [
            { type: "facebook", url: this.socialMedia1 },
            { type: "instagram", url: this.socialMedia2 },
            { type: "linkedin", url: this.socialMedia3 },
            { type: "youtube", url: this.socialMedia4 }
        ];
    }

    get bottomLinks() {
        const links = [];
        for (let i = 1; i <= 4; i++) {
            if (
                this[`showBottomLink${i}`] &&
                this[`bottomLink${i}Text`] &&
                this[`bottomLink${i}Url`]
            ) {
                links.push({
                    text: this[`bottomLink${i}Text`],
                    url: this[`bottomLink${i}Url`],
                    id: generateRandomId()
                });
            }
        }
        return links;
    }

    parseFooterData() {
        const result = [];
        for (let col = 1; col <= 3; col++) {
            if (this[`showColumn${col}`]) {
                const links = [];
                for (let i = 1; i <= 7; i++) {
                    const show = this[`showColumn${col}Link${i}`];
                    const text = this[`column${col}Link${i}Text`];
                    const url = this[`column${col}Link${i}Url`];
                    if (show && text && url) {
                        links.push({ text, url, id: generateRandomId() });
                    }
                }
                result.push({
                    id: generateRandomId(),
                    show: this[`showColumn${col}`],
                    title: this[`column${col}Title`],
                    links
                });
            }
        }
        return result;
    }

    addCustomCssStyles() {
        let styleText = "";
        if (this.footerBackgroundColor) {
            styleText += `.footer__wrapper { background-color: ${this.footerBackgroundColor}; }`;
        }
        if (this.footerTextColor) {
            styleText += `.footer__column-title, .footer__copyright, .footer__link, .footer__bottom-link { color: ${this.footerTextColor} !important; }`;
        }
        addCustomCssStyles(this, this.customCssContainer, styleText);
    }

    handleLinkClick(event) {
        const url = event.currentTarget.getAttribute("href");
        const text = event.currentTarget.textContent;
        console.log(`Footer link clicked: ${text} - ${url}`);
    }
}
