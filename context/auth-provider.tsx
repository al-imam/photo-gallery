'use client'

/* eslint-disable no-async-promise-executor */

import {
  PostBody as SignInBody,
  PostData as SignInRes,
} from '@/app/api/auth/signin/route'
import {
  PostBody as SignUpBody,
  PostData as SignUpRes,
} from '@/app/api/auth/signup/route'
import {
  PostBody as SignUpCompleteBody,
  PostData as SignUpCompleteRes,
} from '@/app/api/user/route'
import { DELETE, POST, PUT } from '@/lib'
import { Prettify, SafeUser } from '@/types'
import { FunctionComponent, ReactNode, createContext, useState } from 'react'

type User = SafeUser

interface CallBackFun<Res = any> {
  onError: (error: unknown) => void
  onSuccess: (res?: Res) => void
}

type AuthFunWrapper<AugmentType, ReturnType = any> = (
  values: AugmentType & Partial<CallBackFun<ReturnType>>
) => Promise<[ReturnType, null] | [null, unknown]>

type SignUpFun = AuthFunWrapper<SignUpBody, SignUpRes>
type SignUpCompleteFun = AuthFunWrapper<SignUpCompleteBody, SignUpCompleteRes>
type SignInFun = AuthFunWrapper<SignInBody, SignInRes>
type signOutFun = AuthFunWrapper<object, { success: true }>
type ChangePasswordFun = AuthFunWrapper<
  { current: string; password: string },
  { success: true }
>

interface Value {
  signUp: SignUpFun
  signIn: SignInFun
  signOut: signOutFun
  currentUser: User | null
  signUpComplete: SignUpCompleteFun
  changePassword: ChangePasswordFun
  setCurrentUser: (user: User) => void
  auth: null | string
}

const AuthContext = createContext<Prettify<Value> | null>(null)

interface AuthProviderProps {
  children: ReactNode
  currentUser: User | null
  auth: string | null
}

function cb(..._: any[]) {}

const AuthProvider: FunctionComponent<AuthProviderProps> = ({
  children,
  auth: _auth,
  currentUser: _currentUser,
}) => {
  const [currentUser, _setCurrentUser] = useState<User | null>(_currentUser)
  const [auth, _setAuth] = useState<string | null>(_auth)

  const signOut: signOutFun = ({ onError = cb, onSuccess = cb }) => {
    return new Promise(async (resolve) => {
      try {
        await DELETE('auth/signout')

        _setCurrentUser(null)
        _setAuth(null)

        resolve([{ success: true }, null])
        onSuccess({ success: true })
      } catch (error) {
        onError(error)
        resolve([null, error])
      }
    })
  }

  const signUp: SignUpFun = async ({
    onError = cb,
    onSuccess = cb,
    ...body
  }) => {
    return new Promise(async (resolve) => {
      try {
        const { data: res } = await POST<SignUpRes>('auth/signup', body)

        onSuccess(res)
        resolve([res, null])
      } catch (error) {
        onError(error)
        resolve([null, error])
      }
    })
  }

  const signUpComplete: SignUpCompleteFun = async ({
    onError = cb,
    onSuccess = cb,
    ...body
  }) => {
    return new Promise(async (resolve) => {
      try {
        const { data: res } = await POST<SignUpCompleteRes>('user', body)

        _setAuth(res.jwt_token)
        _setCurrentUser(res.user)
        onSuccess(res)
        resolve([res, null])
      } catch (error) {
        onError(error)
        resolve([null, error])
      }
    })
  }

  const signIn: SignInFun = async ({
    onError = cb,
    onSuccess = cb,
    ...userCredential
  }) => {
    return new Promise(async (resolve) => {
      try {
        const { data: res } = await POST<SignInRes>(
          'auth/signin',
          userCredential
        )

        _setAuth(res.jwt_token)
        _setCurrentUser(res.user)
        onSuccess(res)
        resolve([res, null])
      } catch (error) {
        onError(error)
        resolve([null, error])
      }
    })
  }

  const changePassword: ChangePasswordFun = async ({
    onError = cb,
    onSuccess = cb,
    ...userCredential
  }) => {
    return new Promise(async (resolve) => {
      try {
        const { data } = await PUT<{ success: true }>(
          'auth/change-password',
          userCredential
        )
        onSuccess(data)
        resolve([data, null])
      } catch (error) {
        onError(error)
        resolve([null, error])
      }
    })
  }

  function setCurrentUser(user: User) {
    _setCurrentUser(user)
  }

  return (
    <AuthContext.Provider
      value={{
        signOut,
        signUp,
        signIn,
        currentUser,
        setCurrentUser,
        changePassword,
        signUpComplete,
        auth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
