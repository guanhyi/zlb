import { createIdentifier } from '@wendellhu/redi'
import type { NgHttp } from './client'

export const HTTP_CLIENT = createIdentifier<NgHttp>('httpClientToken')
