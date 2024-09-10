import { createIdentifier } from '@wendellhu/redi'
import { createHashRouter } from 'react-router-dom'

export const ROUTER = createIdentifier<ReturnType<typeof createHashRouter>>('RouterService')

export type RouterType = ReturnType<typeof createHashRouter>
