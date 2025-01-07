import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import { AppDispatch } from '@/store'
import { RootState } from '@/types/store.type'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
