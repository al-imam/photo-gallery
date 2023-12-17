import {
  FunctionComponent,
  ReactNode,
  createContext,
  useEffect,
  useState,
} from 'react'
import { POST, PUT } from '/lib'
import { Prettify } from '/types'

interface User {
  name: string
  email: string
  id: string
  createdAt: string
  updatedAt: string
  photoUrl?: string
}

interface CallBackFun<Res = any> {
  onError: (error: unknown) => void
  onSuccess: (res?: Res) => void
}

type AuthFunWrapper<AugmentType, ReturnType = any> = (
  values: AugmentType & Partial<CallBackFun<ReturnType>>
) => Promise<[ReturnType, null] | [null, unknown]>

type SignUpFun = AuthFunWrapper<{ email: string }, { success: true }>
type SignUpCompleteFun = AuthFunWrapper<
  { email: string; password: string },
  User
>
type SignInFun = AuthFunWrapper<
  Omit<{ email: string; password: string }, 'name'>,
  User
>
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
  changePassword: ChangePasswordFun
  setCurrentUser: (user: unknown) => void
  auth: null | string
}

const AuthContext = createContext<Prettify<Value> | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

function cb(..._: any[]) {}

const AuthProvider: FunctionComponent<AuthProviderProps> = ({ children }) => {
  const [currentUser, _setCurrentUser] = useState<User | null>(null)
  const [auth, _setAuth] = useState<string | null>(null)

  const signOut: signOutFun = ({ onError = cb, onSuccess = cb }) => {
    return new Promise((resolve) => {
      try {
        resolve([{ success: true }, null])
        onSuccess({ success: true })

        _setCurrentUser(null)
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
        const { data: res } = await POST<{ success: true }>('auth/signup', body)

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
        const { data: res } = await POST<{ user: User; auth: string }>(
          'auth/signup/complete',
          body
        )

        _setAuth(res.auth)
        onSuccess(res.user)
        resolve([res.user, null])
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
        const { data: res } = await POST<{ user: User; auth: string }>(
          'auth/signin',
          userCredential
        )

        _setAuth(res.auth)
        _setCurrentUser(res.user)
        onSuccess(res.user)
        resolve([res.user, null])
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

  function setCurrentUser(user: unknown) {
    _setCurrentUser(user as any)
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
        auth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
