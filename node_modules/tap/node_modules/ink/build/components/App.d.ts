/// <reference types="node" />
import { PureComponent, ReactNode } from 'react';
interface Props {
    readonly children: ReactNode;
    readonly stdin: NodeJS.ReadStream;
    readonly stdout: NodeJS.WriteStream;
    readonly stderr: NodeJS.WriteStream;
    readonly writeToStdout: (data: string) => void;
    readonly writeToStderr: (data: string) => void;
    readonly exitOnCtrlC: boolean;
    readonly onExit: (error?: Error) => void;
}
interface State {
    readonly isFocusEnabled: boolean;
    readonly activeFocusId?: string;
    readonly focusables: Focusable[];
    readonly error?: Error;
}
interface Focusable {
    readonly id: string;
    readonly isActive: boolean;
}
export default class App extends PureComponent<Props, State> {
    static displayName: string;
    state: {
        isFocusEnabled: boolean;
        activeFocusId: undefined;
        focusables: never[];
        error: undefined;
    };
    rawModeEnabledCount: number;
    static getDerivedStateFromError(error: Error): {
        error: Error;
    };
    isRawModeSupported(): boolean;
    render(): JSX.Element;
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentDidCatch(error: Error): void;
    handleSetRawMode: (isEnabled: boolean) => void;
    handleInput: (input: string) => void;
    handleExit: (error?: Error | undefined) => void;
    enableFocus: () => void;
    disableFocus: () => void;
    focus: (id: string) => void;
    focusNext: () => void;
    focusPrevious: () => void;
    addFocusable: (id: string, { autoFocus }: {
        autoFocus: boolean;
    }) => void;
    removeFocusable: (id: string) => void;
    activateFocusable: (id: string) => void;
    deactivateFocusable: (id: string) => void;
    findNextFocusable: (state: State) => string | undefined;
    findPreviousFocusable: (state: State) => string | undefined;
}
export {};
