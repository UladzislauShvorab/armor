import { LightningElement, api, track } from "lwc";

import communityBasePath from "@salesforce/community/basePath";
import { addCustomCssStyles, generateRandomId } from "c/utils";
import NO_IMAGE_PICTURE from "@salesforce/resourceUrl/noImagePicture";

const TILE_COUNT = 6;

export default class HomeTiles extends LightningElement {
    @api tilesTitleColor = null;
    @api tilesDescriptionColor = null;

    @api showTile1 = false;
    @api showTile1Image = false;
    @api tile1Image = null;
    @api showTile1Title = false;
    @api tile1Title = null;
    @api showTile1Description = false;
    @api tile1Description = null;
    @api tile1Link = null;
    @api tile1LinkOpenInNewTab = false;

    @api showTile2 = false;
    @api showTile2Image = false;
    @api tile2Image = null;
    @api showTile2Title = false;
    @api tile2Title = null;
    @api showTile2Description = false;
    @api tile2Description = null;
    @api tile2Link = null;
    @api tile2LinkOpenInNewTab = false;

    @api showTile3 = false;
    @api showTile3Image = false;
    @api tile3Image = null;
    @api showTile3Title = false;
    @api tile3Title = null;
    @api showTile3Description = false;
    @api tile3Description = null;
    @api tile3Link = null;
    @api tile3LinkOpenInNewTab = false;

    @api showTile4 = false;
    @api showTile4Image = false;
    @api tile4Image = null;
    @api showTile4Title = false;
    @api tile4Title = null;
    @api showTile4Description = false;
    @api tile4Description = null;
    @api tile4Link = null;
    @api tile4LinkOpenInNewTab = false;

    @api showTile5 = false;
    @api showTile5Image = false;
    @api tile5Image = null;
    @api showTile5Title = false;
    @api tile5Title = null;
    @api showTile5Description = false;
    @api tile5Description = null;
    @api tile5Link = null;
    @api tile5LinkOpenInNewTab = false;

    @api showTile6 = false;
    @api showTile6Image = false;
    @api tile6Image = null;
    @api showTile6Title = false;
    @api tile6Title = null;
    @api showTile6Description = false;
    @api tile6Description = null;
    @api tile6Link = null;
    @api tile6LinkOpenInNewTab = false;

    @track noImagePictureSrc = NO_IMAGE_PICTURE;
    @track isFirstRender = true;
    @track customCssContainer = "custom-css-container";
    @track tilesData = [];

    connectedCallback() {
        this.parseData();
    }

    renderedCallback() {
        console.log(NO_IMAGE_PICTURE);

        if (this.isFirstRender) {
            this.isFirstRender = false;
            if (this.tilesData.length > 0) {
                this.addCustomCssStyles();
            }
        }
    }

    get tiles() {
        return this.tilesData.filter((tile) => tile.show);
    }

    get isShowTileTitle() {
        return this.tiles.some((tile) => tile.showTitle && tile.title);
    }

    get isShowTileDescription() {
        return this.tiles.some(
            (tile) => tile.showDescription && tile.description
        );
    }

    get isShowImage() {
        return this.tiles.some((tile) => tile.showImage && tile.imgUrl !== "");
    }

    addCustomCssStyles() {
        let styleText = ``;

        if (this.tilesTitleColor) {
            styleText += `.home-tiles__item-title { color: ${this.tilesTitleColor}; }`;
        }

        if (this.tilesDescriptionColor) {
            styleText += `.home-tiles__item-description { color: ${this.tilesDescriptionColor}; }`;
        }

        addCustomCssStyles(this, this.customCssContainer, styleText);
    }

    parseData() {
        this.tilesData = [];

        for (let i = 1; i <= TILE_COUNT; i++) {
            const tileData = {
                id: generateRandomId(),
                show: this[`showTile${i}`],
                showImage: this[`showTile${i}Image`],
                image: this[`tile${i}Image`],
                imgUrl: this.getImageUrl(this[`tile${i}Image`]),
                showTitle: this[`showTile${i}Title`],
                title: this[`tile${i}Title`],
                showDescription: this[`showTile${i}Description`],
                description: this[`tile${i}Description`],
                link: this[`tile${i}Link`],
                target: this[`tile${i}LinkOpenInNewTab`] ? "_blank" : "_self"
            };

            if (tileData.show) {
                this.tilesData.push(tileData);
            }
        }
    }

    getImageUrl(contentKey) {
        if (contentKey) {
            return `${communityBasePath}/sfsites/c/cms/delivery/media/${contentKey}`;
        }
        return null;
    }
}
