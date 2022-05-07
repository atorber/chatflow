import { FC } from 'react';
export interface Props {
    /**
     * Number of newlines to insert.
     *
     * @default 1
     */
    readonly count?: number;
}
/**
 * Adds one or more newline (\n) characters. Must be used within <Text> components.
 */
declare const Newline: FC<Props>;
export default Newline;
