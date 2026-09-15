import { auth, db } from "@/lib/firebase"
import { useMutation, useQuery } from "@tanstack/react-query"
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Cookies from 'js-cookie'

export const useMe = () => {
    return useQuery({
        queryKey: ["me"],
        queryFn: () => {
            return new Promise((resolve) => {
                const unsubscribe = onAuthStateChanged(auth, (user) => {
                    resolve(user)
                    unsubscribe()
                })
            })
        },
        staleTime: Infinity,
    })
}

export const useIsAdmin = (uid) => {
    return useQuery({
        queryKey: ["is admin", uid],
        queryFn: async () => {
            if (!uid) return false
            const response = await getDoc(doc(db, "admins", uid))
            return response.exists()
        },
        enabled: !!uid,
    })
}

export const useLogin = () => {
    const router = useRouter()
    return useMutation({
        mutationKey: ["login"],
        mutationFn: async ({ email, password }) => {
            const response = await signInWithEmailAndPassword(
                auth,
                email,
                password
            )
            return response.user
        },
        onSuccess: data => {
            Cookies.set('plate_access_token', data?.accessToken, {
                expires: 1,               // Expires in 1 days
                secure: true,             // 🔒 Only transmitted over HTTPS
                sameSite: 'strict',       // 🔒 Protects against CSRF attacks
                path: '/'                 // Accessible across your entire domain
            })
            toast.success('تم تسجيل الدخول بنجاح!')
            router.push('/')
        },
        onError: error => {
            if (error.code.includes('invalid')) {
                toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة")
            } else toast.error('هناك خطأ في تسجيل الدخول، برجاء المحاولة لاحقًا')
        }
    })
}

export const useLogout = () => {
    const router = useRouter()
    return useMutation({
        mutationKey: ["logout"],
        mutationFn: async () => await signOut(auth),
        onSuccess: () => {
            Cookies.remove("plate_access_token", { path: '' })
            toast.success('تم تسجيل الخروج بنجاح!')
            router.push('/login')
        },
        onError: error => toast.error(error.response?.data?.message || 'هناك خطأ في تسجيل الخروج برجاء المحاولة لاحقًا')
    })
}