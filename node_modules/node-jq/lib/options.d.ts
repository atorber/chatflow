import * as Joi from "@hapi/joi";

export const optionsSchema: Joi.SchemaLike
export const preSpawnSchema: Joi.SchemaLike
export const spawnSchema: Joi.SchemaLike
export function parseOptions(options: PartialOptions, filter: string, json: any): any
export const optionDefaults: IOptions;
interface IOptions {
    color: boolean,
    input: string,
    locations: string[],
    output: string,
    raw: boolean,
    slurp: boolean,
    sort: boolean,
}
export type PartialOptions = Partial<IOptions>
