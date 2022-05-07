import { YogaNode } from 'yoga-layout-prebuilt';
import { Boxes } from 'cli-boxes';
import { LiteralUnion } from 'type-fest';
import { ForegroundColor } from 'chalk';
export interface Styles {
    readonly textWrap?: 'wrap' | 'end' | 'middle' | 'truncate-end' | 'truncate' | 'truncate-middle' | 'truncate-start';
    readonly position?: 'absolute' | 'relative';
    /**
     * Top margin.
     */
    readonly marginTop?: number;
    /**
     * Bottom margin.
     */
    readonly marginBottom?: number;
    /**
     * Left margin.
     */
    readonly marginLeft?: number;
    /**
     * Right margin.
     */
    readonly marginRight?: number;
    /**
     * Top padding.
     */
    readonly paddingTop?: number;
    /**
     * Bottom padding.
     */
    readonly paddingBottom?: number;
    /**
     * Left padding.
     */
    readonly paddingLeft?: number;
    /**
     * Right padding.
     */
    readonly paddingRight?: number;
    /**
     * This property defines the ability for a flex item to grow if necessary.
     * See [flex-grow](https://css-tricks.com/almanac/properties/f/flex-grow/).
     */
    readonly flexGrow?: number;
    /**
     * It specifies the “flex shrink factor”, which determines how much the flex item will shrink relative to the rest of the flex items in the flex container when there isn’t enough space on the row.
     * See [flex-shrink](https://css-tricks.com/almanac/properties/f/flex-shrink/).
     */
    readonly flexShrink?: number;
    /**
     * It establishes the main-axis, thus defining the direction flex items are placed in the flex container.
     * See [flex-direction](https://css-tricks.com/almanac/properties/f/flex-direction/).
     */
    readonly flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    /**
     * It specifies the initial size of the flex item, before any available space is distributed according to the flex factors.
     * See [flex-basis](https://css-tricks.com/almanac/properties/f/flex-basis/).
     */
    readonly flexBasis?: number | string;
    /**
     * The align-items property defines the default behavior for how items are laid out along the cross axis (perpendicular to the main axis).
     * See [align-items](https://css-tricks.com/almanac/properties/a/align-items/).
     */
    readonly alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
    /**
     * It makes possible to override the align-items value for specific flex items.
     * See [align-self](https://css-tricks.com/almanac/properties/a/align-self/).
     */
    readonly alignSelf?: 'flex-start' | 'center' | 'flex-end' | 'auto';
    /**
     * It defines the alignment along the main axis.
     * See [justify-content](https://css-tricks.com/almanac/properties/j/justify-content/).
     */
    readonly justifyContent?: 'flex-start' | 'flex-end' | 'space-between' | 'space-around' | 'center';
    /**
     * Width of the element in spaces.
     * You can also set it in percent, which will calculate the width based on the width of parent element.
     */
    readonly width?: number | string;
    /**
     * Height of the element in lines (rows).
     * You can also set it in percent, which will calculate the height based on the height of parent element.
     */
    readonly height?: number | string;
    /**
     * Sets a minimum width of the element.
     */
    readonly minWidth?: number | string;
    /**
     * Sets a minimum height of the element.
     */
    readonly minHeight?: number | string;
    /**
     * Set this property to `none` to hide the element.
     */
    readonly display?: 'flex' | 'none';
    /**
     * Add a border with a specified style.
     * If `borderStyle` is `undefined` (which it is by default), no border will be added.
     */
    readonly borderStyle?: keyof Boxes;
    /**
     * Change border color.
     * Accepts the same values as `color` in <Text> component.
     */
    readonly borderColor?: LiteralUnion<typeof ForegroundColor, string>;
}
declare const _default: (node: YogaNode, style?: Styles) => void;
export default _default;
