import { Subscription } from './subscription';
export interface Scheduler {
    readonly now: number;
    delay(time: number): Promise<void>;
    schedule(action: () => void, dueTime: number): Subscription;
}
export declare class DefaultScheduler implements Scheduler {
    get now(): number;
    delay(dueTime: number): Promise<void>;
    schedule(action: () => void, dueTime: number): Subscription;
}
