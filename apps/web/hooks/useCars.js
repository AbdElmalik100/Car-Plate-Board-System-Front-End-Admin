import { db } from "@/lib/firebase";
import queryClient from "@/lib/react-query";
import { canonicalPlateKey, formatExcelDate } from "@/utils";
import { useMutation, useQuery } from "@tanstack/react-query"
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    setDoc,
    getDoc,
    where,
    writeBatch,
    limit,
    getCountFromServer,
    startAt,
    serverTimestamp,
    updateDoc,
    Timestamp,
} from 'firebase/firestore';
import { toast } from "sonner";
import * as XLSX from "xlsx"


export const useGetCars = (params = {}) => {
    return useQuery({
        queryKey: ['get cars', params],
        queryFn: async () => {
            try {
                const allowedSortFields = [
                    "plate",
                    "car_type",
                    "bank",
                    "chassis_number",
                    "record_date",
                    'created_at'
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

                // Date filters
                if (params.from_date) {
                    const fromDate = new Date(`${params.from_date}T00:00:00`)
                    constraints.push(
                        where(
                            "record_date",
                            ">=",
                            Timestamp.fromDate(fromDate)
                        )
                    )
                }

                if (params.to_date) {
                    const toDate = new Date(`${params.to_date}T23:59:59.999`)
                    constraints.push(
                        where(
                            "record_date",
                            "<=",
                            Timestamp.fromDate(toDate)
                        )
                    )
                }

                let carsQuery = query(
                    collection(db, "cars"),
                    orderBy(sortBy, sortOrder),
                    // ...constraints,
                    limit(pageLimit)
                )

                if (params.cursor) {
                    const cursorDoc = await getDoc(doc(db, "cars", params.cursor))
                    carsQuery = query(
                        collection(db, "cars"),
                        orderBy(sortBy, sortOrder),
                        ...constraints,
                        startAt(cursorDoc),
                        limit(pageLimit)
                    )
                }
                const countQuery = query(
                    collection(db, "cars"),
                    ...constraints
                )
                const [response, countResponse] = await Promise.all([
                    getDocs(carsQuery),
                    getCountFromServer(countQuery),
                ])

                let cars = response.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }))

                const search = params.search?.trim().toLowerCase()

                if (search) {
                    cars = cars.filter((car) =>
                        [
                            car.plate,
                            car.car_type,
                            car.bank,
                            car.chassis_number
                        ].some((value) =>
                            String(value ?? '')
                                .toLowerCase()
                                .includes(search)
                        )
                    )
                }
                const total = countResponse.data().count

                return {
                    cars,
                    meta: {
                        total,
                        page,
                        limit: pageLimit,
                        total_pages: Math.ceil(total / pageLimit),
                        last_doc: response.docs[response.docs.length - 1]?.id ?? null
                    },
                }
            } catch (error) {
                console.log(error);
                throw error
            }
        }
    })
}

export const useCreateCar = () => {
    return useMutation({
        mutationKey: ['create car'],
        mutationFn: async (formData) => {
            const response = await setDoc(doc(db, 'cars', formData.plate_key), formData)
            return response
        },
        onSuccess: () => {
            toast.success('تم اضافة السيارة بنجاح')
            queryClient.invalidateQueries({ queryKey: ['get cars'] })
        },
        onError: error => toast.error(error.response?.data?.message || 'هناك خظأ في اضافة السيارة, برجاء جرب لاحقا')
    })
}
export const useUpdateCar = () => {
    return useMutation({
        mutationKey: ['update car'],
        mutationFn: async (formData) => {
            const carRef = doc(db, 'cars', formData.plate_key)
            await updateDoc(carRef, formData)
            return formData
        },
        onSuccess: () => {
            toast.success('تم تحديث السيارة بنجاح')
            queryClient.invalidateQueries({ queryKey: ['get cars'] })
        },
        onError: (error) => toast.error(error.response?.data?.message || 'هناك خطأ في تحديث السيارة، برجاء المحاولة لاحقًا'),
    })
}

export const useDeleteCar = () => {
    return useMutation({
        mutationKey: ['delete car'],
        mutationFn: async (carId) => {
            const response = await deleteDoc(doc(db, 'cars', carId))
            return response
        },
        onSuccess: () => {
            toast.success('تم حذف السيارة بنجاح')
            queryClient.invalidateQueries({ queryKey: ['get cars'] })
        },
        onError: error => toast.error(error.response?.data?.message || 'هناك خظأ في اضافة السيارة, برجاء جرب لاحقا')
    })
}

export const useDeleteCars = () => {
    return useMutation({
        mutationKey: ['delete cars'],
        mutationFn: async (carsId) => {
            const batchSize = 500
            for (let i = 0; i < carsId.length; i += batchSize) {
                const batch = writeBatch(db)
                const chunk = carsId.slice(i, i + batchSize)
                chunk.forEach((car) => batch.delete(doc(db, "cars", car)))
                await batch.commit()
            }
            return {
                deleted: carsId.length,
            }
        },
        onSuccess: () => {
            toast.success('تمت عملية الحذف بنجاح')
            queryClient.invalidateQueries({ queryKey: ['get cars'] })
        },
        onError: error => toast.error(error.response?.data?.message || 'هناك خظأ في حذف السيارات, برجاء جرب لاحقا')
    })
}
export const useImportExcel = () => {
    return useMutation({
        mutationFn: async ({ file, onProgress }) => {
            // -------------------------
            // 1. Read Excel
            // -------------------------
            const buffer = await file.arrayBuffer()
            const workbook = XLSX.read(buffer, { type: "array" })
            const sheet = workbook.Sheets[workbook.SheetNames[0]]
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 })
            const cars = rows
                .slice(1)
                .filter(
                    (row) =>
                        row?.[0] != null &&
                        String(row[0]).trim() !== ""
                )
                .map((row) => {
                    const plate = String(row[0]).trim()

                    return {
                        plate_key: canonicalPlateKey(plate),
                        plate,
                        car_type:
                            row[1] != null
                                ? String(row[1]).trim()
                                : "",
                        bank:
                            row[2] != null
                                ? String(row[2]).trim()
                                : "",
                        chassis_number:
                            row[3] != null
                                ? String(row[3]).trim()
                                : "",
                        record_date:
                            row[4] != null
                                ? formatExcelDate(String(row[4]).trim())
                                : "",
                        created_at: serverTimestamp(),
                    }
                })

            const total = cars.length

            if (!total) {
                onProgress?.(100)

                return {
                    total: 0,
                    added: 0,
                    updated: 0,
                }
            }
            onProgress?.(10)
            // -------------------------
            // 2. Check existing cars
            // -------------------------
            const existingDocs = []

            const checkChunkSize = 100

            for (
                let i = 0;
                i < cars.length;
                i += checkChunkSize
            ) {
                const chunk = cars.slice(
                    i,
                    i + checkChunkSize
                )

                const snapshots = await Promise.all(
                    chunk.map((car) =>
                        getDoc(
                            doc(
                                db,
                                "cars",
                                car.plate_key
                            )
                        )
                    )
                )

                existingDocs.push(...snapshots)

                // 10% → 50%
                const progress = 10 + Math.round(((i + chunk.length) / total) * 40)

                onProgress?.(progress)
            }

            let added = 0
            let updated = 0

            existingDocs.forEach((snapshot) => {
                if (snapshot.exists()) {
                    updated++
                } else {
                    added++
                }
            })

            // -------------------------
            // 3. Write cars
            // -------------------------
            onProgress?.(50)
            const batchSize = 500

            for (
                let i = 0;
                i < cars.length;
                i += batchSize
            ) {
                const batch = writeBatch(db)

                const chunk = cars.slice(
                    i,
                    i + batchSize
                )

                chunk.forEach((car) => {
                    const ref = doc(
                        db,
                        "cars",
                        car.plate_key
                    )
                    batch.set(ref, car)
                })

                await batch.commit()
                // 50% → 100%
                const progress = 50 + Math.round(((i + chunk.length) / total) * 50)
                onProgress?.(progress)
            }

            return {
                total,
                added,
                updated,
            }
        },
    })
}