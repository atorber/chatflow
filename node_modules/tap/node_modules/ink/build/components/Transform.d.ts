import { FC, ReactNode } from 'react';
export interface Props {
    /**
     * Function which transforms children output. It accepts children and must return transformed children too.
     */
    readonly transform: (children: string) => string;
    readonly children?: ReactNode;
}
/**
 * Transform a string representation of React components before they are written to output.
 * For example, you might want to apply a gradient to text, add a clickable link or create some text effects.
 * These use cases can't accept React nodes as input, they are expecting a string.
 * That's what <Transform> component does, it gives you an output string of its child components and lets you transform it in any way.
 */
declare const Transform: FC<Props>;
export default Transform;
