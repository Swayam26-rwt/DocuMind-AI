import {z} from 'zod'; export const documentSchema=z.object({filename:z.string().min(1)});
