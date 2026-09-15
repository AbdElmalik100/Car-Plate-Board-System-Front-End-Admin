import { db } from "@/lib/firebase"
import queryClient from "@/lib/react-query"
import { useMutation, useQuery } from "@tanstack/react-query"
import { addDoc, collection, deleteDoc, doc, getCountFromServer, getDoc, getDocs, limit, orderBy, query, startAfter, updateDoc, writeBatch } from "firebase/firestore"
import { toast } from "sonner"

export const useGetRepresentatives = (params = {}) => {
    return useQuery({
        queryKey: ["get-representatives", params],
        queryFn: async () => {
            try {
                const allowedSortFields = [
                    "name",
                    "phone",
                    "email",
                    "created_at",
                ]

                const sortBy = allowedSortFields.includes(params.sort_by)
                    ? params.sort_by
                    : "created_at"

                const sortOrder = params.sort_order === "asc"
                    ? "asc"
                    : "desc"

                const page = Number(params.page) || 1
                const pageLimit = Number(params.limit) || 10

                const constraints = []

                let representativesQuery = query(
                    collection(db, "representatives"),
                    ...constraints,
                    orderBy(sortBy, sortOrder),
                    limit(pageLimit)
                )

                if (params.cursor) {
                    const cursorDoc = await getDoc(
                        doc(db, "representatives", params.cursor)
                    )

                    if (cursorDoc.exists()) {
                        representativesQuery = query(
                            collection(db, "representatives"),
                            ...constraints,
                            orderBy(sortBy, sortOrder),
                            startAfter(cursorDoc),
                            limit(pageLimit)
                        )
                    }
                }

                const countQuery = query(
                    collection(db, "representatives"),
                    ...constraints
                )

                const [response, countResponse] = await Promise.all([
                    getDocs(representativesQuery),
                    getCountFromServer(countQuery),
                ])

                let representatives = response.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                const search = params.search?.trim().toLowerCase()

                if (search) {
                    representatives = representatives.filter((representative) =>
                        [
                            representative.name,
                            representative.email,
                            representative.phone,
                            representative.address,
                            representative.code,
                        ].some((value) =>
                            String(value ?? "")
                                .toLowerCase()
                                .includes(search)
                        )
                    )
                }
                const total = countResponse.data().count

                return {
                    representatives,
                    meta: {
                        total,
                        page,
                        limit: pageLimit,
                        total_pages: Math.ceil(total / pageLimit),
                        last_doc: response.docs.at(-1)?.id ?? null,
                    },
                }
            } catch (error) {
                console.error(error)
                throw error
            }
        },
    })
}



export const useCreateRepresentative = () => {
    return useMutation({
        mutationKey: ['create representative'],
        mutationFn: async (formData) => {
            const response = await addDoc(collection(db, 'representatives'), formData)
            return response
        },
        onSuccess: () => {
            toast.success('تم اضافة مندوب بنجاح')
            queryClient.invalidateQueries({ queryKey: ['get-representatives'] })
        },
        onError: error => {
            console.log("Error: ", error);
            toast.error(error.response?.data?.message || 'هناك خظأ في اضافة المندوب, برجاء جرب لاحقا')
        }
    })
}


export const useUpdateRepresentative = () => {
    return useMutation({
        mutationKey: ['update representative'],
        mutationFn: async (formData) => {
            const carRef = doc(db, 'representatives', formData.id)
            await updateDoc(carRef, formData)
            return formData
        },
        onSuccess: () => {
            toast.success('تم تحديث المندوب بنجاح')
            queryClient.invalidateQueries({ queryKey: ['get-representatives'] })
        },
        onError: (error) => toast.error(error.response?.data?.message || 'هناك خطأ في تحديث المندوب برجاء المحاولة لاحقًا'),
    })
}

export const useDeleteRepresentative = () => {
    return useMutation({
        mutationKey: ['delete representative'],
        mutationFn: async (representativeId) => {
            const response = await deleteDoc(doc(db, 'representatives', representativeId))
            return response
        },
        onSuccess: () => {
            toast.success('تم حذف المندوب بنجاح')
            queryClient.invalidateQueries({ queryKey: ['get-representatives'] })
        },
        onError: (error) => toast.error(error.response?.data?.message || 'هناك خطأ في تحديث المندوب برجاء المحاولة لاحقًا'),
    })
}


export const useDeleteRepresentatives = () => {
    return useMutation({
        mutationKey: ['delete representative'],
        mutationFn: async (representativesId) => {
            const batchSize = 500
            for (let i = 0; i < representativesId.length; i += batchSize) {
                const batch = writeBatch(db)
                const chunk = representativesId.slice(i, i + batchSize)
                chunk.forEach((representative) => batch.delete(doc(db, "representatives", representative)))
                await batch.commit()
            }
            return {
                deleted: representativesId.length,
            }
        },
        onSuccess: () => {
            toast.success('تمت عملية الحذف بنجاح')
            queryClient.invalidateQueries({ queryKey: ['get-representatives'] })
        },
        onError: error => toast.error(error.response?.data?.message || 'هناك خظأ في حذف المناديب, برجاء جرب لاحقا')
    })
}



// ------------------------------------
export const useGetLoginSessions = (params = {}) => {
    return useQuery({
        queryKey: ["get-login-sessions", params],
        queryFn: async () => {
            try {
                const allowedSortFields = [
                    "rep_name",
                    "status",
                    "requested_at",
                ]
                const sortBy = allowedSortFields.includes(params.sort_by)
                    ? params.sort_by
                    : "requested_at"
                const sortOrder = params.sort_order === "asc"
                    ? "asc"
                    : "desc"
                const page = Number(params.page) || 1
                const pageLimit = Number(params.limit) || 10
                const constraints = []
                let deviceLoginsQuery = query(
                    collection(db, "device_logins"),
                    ...constraints,
                    orderBy(sortBy, sortOrder),
                    limit(pageLimit)
                )
                if (params.cursor) {
                    const cursorDoc = await getDoc(
                        doc(db, "device_logins", params.cursor)
                    )
                    if (cursorDoc.exists()) {
                        deviceLoginsQuery = query(
                            collection(db, "device_logins"),
                            ...constraints,
                            orderBy(sortBy, sortOrder),
                            startAfter(cursorDoc),
                            limit(pageLimit)
                        )
                    }
                }
                const countQuery = query(
                    collection(db, "device_logins"),
                    ...constraints
                )
                const [response, countResponse] = await Promise.all([
                    getDocs(deviceLoginsQuery),
                    getCountFromServer(countQuery),
                ])
                let login_sessions = response.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                const search = params.search?.trim().toLowerCase()
                if (search) {
                    login_sessions = login_sessions.filter((deviceLogin) =>
                        [
                            deviceLogin.rep_name,
                            deviceLogin.device_label,
                            deviceLogin.device_id,
                        ].some((value) =>
                            String(value ?? "")
                                .toLowerCase()
                                .includes(search)
                        )
                    )
                }
                const total = countResponse.data().count
                return {
                    login_sessions,
                    meta: {
                        total,
                        page,
                        limit: pageLimit,
                        total_pages: Math.ceil(total / pageLimit),
                        last_doc: response.docs.at(-1)?.id ?? null,
                    },
                }
            } catch (error) {
                console.error(error)
                throw error
            }
        },
    })
}


export const useUpdateLoginSessions = () => {
    return useMutation({
        mutationKey: ['update-login-sessions'],
        mutationFn: async (formData) => {
            const loginSession = doc(db, 'device_logins', formData.id)
            await updateDoc(loginSession, formData)
            return formData
        },
        onSuccess: () => {
            toast.success('تم تحديث حاله تسجيل الدخول بنجاح')
            queryClient.invalidateQueries({ queryKey: ['get-login-sessions'] })
        },
        onError: (error) => toast.error(error.response?.data?.message || 'هناك خطأ في تحديث المندوب برجاء المحاولة لاحقًا'),
    })
}