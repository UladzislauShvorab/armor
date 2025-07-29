import { LightningElement, api } from "lwc";

export default class HomeBanner extends LightningElement {
    @api showTheFirstLevelBreadcrumb = false;
    @api theFirstLevelBreadcrumbLabel;
    @api theFirstLevelBreadcrumbLink;

    @api showTheSecondLevelBreadcrumb = false;
    @api theSecondLevelBreadcrumbLabel;
    @api theSecondLevelBreadcrumbLink;

    @api showTheThirdLevelBreadcrumb = false;
    @api theThirdLevelBreadcrumbLabel;
    @api theThirdLevelBreadcrumbLink;

    @api showBackgroundImage = false;
    @api backgroundImage;
    @api backgroundColor = "transparent";

    @api showTitle = false;
    @api title;
    @api titleColor = "rgb(255, 255, 255)";
    @api maxTitleWidth;

    @api showDescription = false;
    @api description;
    @api descriptionColor = "rgb(255, 255, 255)";
    @api maxDescriptionWidth;

    connectedCallback() {
        console.log(this.backgroundImage);
    }

    get backgroundImageStyle() {
        const styles = [];

        if (this.showBackgroundImage && this.backgroundImage) {
            styles.push(`background-image: url(${this.backgroundImage})`);
            styles.push("background-size: cover");
            styles.push("background-position: center");
        }

        if (this.backgroundColor) {
            styles.push(`background-color: ${this.backgroundColor}`);
        }
        return styles.join("; ");
    }

    get titleStyle() {
        const styles = [];
        if (this.titleColor) {
            styles.push(`color: ${this.titleColor}`);
        }
        if (this.maxTitleWidth) {
            styles.push(`max-width: ${this.maxTitleWidth}px`);
        }
        return styles.join("; ");
    }

    get descriptionStyle() {
        const styles = [];
        if (this.descriptionColor) {
            styles.push(`color: ${this.descriptionColor}`);
        }
        if (this.maxDescriptionWidth) {
            styles.push(`max-width: ${this.maxDescriptionWidth}px`);
        }
        return styles.join("; ");
    }

    get hasBreadcrumbs() {
        return (
            this.showTheFirstLevelBreadcrumb ||
            this.showTheSecondLevelBreadcrumb ||
            this.showTheThirdLevelBreadcrumb
        );
    }
}
