"use client"

import BaseButton from "@/components/Shared/BaseButton"
import DatePicker from "@/components/Shared/DatePicker"
import InputErrorMessage from "@/components/Shared/InputErrorMessage"
import { useCreateCar, useUpdateCar } from "@/hooks/useCars"
import { canonicalPlateKey } from "@/utils"
import { yupResolver } from "@hookform/resolvers/yup"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Field, FieldGroup, FieldSet } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { serverTimestamp, Timestamp } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as yup from "yup"

const CarForm = ({ car, isEdit, children }) => {
    const [open, setOpen] = useState(false)
    const { mutate, isPending } = useCreateCar()
    const { mutate: updateCar, isPending: updatePending } = useUpdateCar()

    const validationSchema = yup.object({
        plate_key: yup.string(),
        plate: yup.string().trim().required("هذا الحقل مطلوب"),
        car_type: yup.string().trim().required("هذا الحقل مطلوب"),
        bank: yup.string().trim().required("هذا الحقل مطلوب"),
        chassis_number: yup.string().trim().required("هذا الحقل مطلوب"),
        record_date: yup.mixed().required("هذا الحقل مطلوب"),
    })

    const {
        handleSubmit,
        register,
        getValues,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            plate_key: "",
            plate: "",
            car_type: "",
            bank: "",
            chassis_number: "",
            record_date: null,
        },
    })

    const onSubmit = handleSubmit(
        data => {
            const payload = {
                ...data,
                plate_key: canonicalPlateKey(data.plate),
            }

            if (isEdit) {
                updateCar(payload, {
                    onSuccess: () => setOpen(false)
                })
            } else {
                payload.created_at = serverTimestamp()
                mutate(payload, {
                    onSuccess: () => setOpen(false)
                })
            }
        },
        errors => {
            console.log(errors)
        }
    )
    useEffect(() => reset(car), [open, car])
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {
                    children
                        ? children
                        : <BaseButton
                            icon="at-icons:plus"
                            title="إضافة سيارة"
                        />
                }
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? 'تعديل سيارة' : 'إضافة سيارة'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit ? 'قم بتعديل بيانات السيارة ثم اضغط على حفظ.' : 'قم بإدخال بيانات السيارة ثم اضغط على حفظ.'}
                    </DialogDescription>
                </DialogHeader>
                <FieldSet disabled={isPending || updatePending}>
                    <FieldGroup>
                        <div className="flex items-center gap-5">
                            <Field>
                                <Label
                                    htmlFor="plate"
                                    required
                                >
                                    اللوحة
                                </Label>
                                <Input
                                    id="plate"
                                    name="plate"
                                    type="text"
                                    placeholder="ادخل رقم السيارة"
                                    data-error={errors.plate}
                                    {...register("plate")}
                                />
                                {errors.plate && <InputErrorMessage errorMessage={errors.plate?.message} />}
                            </Field>
                            <Field>
                                <Label
                                    htmlFor="car_type"
                                    required
                                >
                                    النوع
                                </Label>
                                <Input
                                    id="car_type"
                                    name="car_type"
                                    type="text"
                                    placeholder="ادخل نوع السيارة"
                                    data-error={errors.car_type}
                                    {...register("car_type")}
                                />
                                {errors.car_type && <InputErrorMessage errorMessage={errors.car_type?.message} />}
                            </Field>
                        </div>
                        <div className="flex items-center gap-5">
                            <Field>
                                <Label
                                    htmlFor="bank"
                                    required
                                >
                                    البنك
                                </Label>
                                <Input
                                    id="bank"
                                    name="bank"
                                    type="text"
                                    placeholder="ادخل اسم البنك"
                                    data-error={errors.bank}
                                    {...register("bank")}
                                />
                                {errors.bank && <InputErrorMessage errorMessage={errors.bank?.message} />}
                            </Field>
                            <Field>
                                <Label
                                    htmlFor="chassis_number"
                                    required
                                >
                                    الشاص
                                </Label>
                                <Input
                                    id="chassis_number"
                                    name="chassis_number"
                                    type="text"
                                    placeholder="ادخل الشاص الخاص بالسيارة"
                                    data-error={errors.chassis_number}
                                    {...register("chassis_number")}
                                />
                                {errors.chassis_number && <InputErrorMessage errorMessage={errors.chassis_number?.message} />}
                            </Field>
                        </div>
                        <Field>
                            <Label
                                htmlFor="record_date"
                                required
                            >
                                تاريخ المحفظة
                            </Label>
                            <DatePicker
                                dataError={errors.record_date}
                                date={getValues('record_date')?.toDate?.() ?? null}
                                setDate={(date) => setValue('record_date', date ? Timestamp.fromDate(date) : null, { shouldDirty: true, shouldValidate: true })}
                            />
                            {errors.record_date && <InputErrorMessage errorMessage={errors.record_date?.message} />}
                        </Field>
                    </FieldGroup>
                </FieldSet>
                <DialogFooter>
                    <DialogClose asChild>
                        <BaseButton
                            type="button"
                            variant="outline"
                            title="إلغاء"
                            disabled={isPending || updatePending}
                        />
                    </DialogClose>
                    <BaseButton
                        type="submit"
                        title={isEdit ? 'حفظ البيانات' : "إضافة السيارة"}
                        onClick={onSubmit}
                        isLoading={isPending || updatePending}
                        disabled={isPending || updatePending}
                    />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CarForm