"use client"
import BaseButton from "@/components/Shared/BaseButton"
import InputErrorMessage from "@/components/Shared/InputErrorMessage"
import {
    useCreateRepresentative,
    useUpdateRepresentative,
} from "@/hooks/useRepresentatives"
import { generateLoginCode } from "@/utils"
import { yupResolver } from "@hookform/resolvers/yup"
import { Icon } from "@iconify/react"
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
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@workspace/ui/components/input-group"
import { Label } from "@workspace/ui/components/label"
import { serverTimestamp } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as yup from "yup"

const RepresentativeForm = ({ representative, isEdit, setOpenMenu, children }) => {
    const [open, setOpen] = useState(false)

    const { mutate, isPending } = useCreateRepresentative()
    const { mutate: updateRepresentative, isPending: updatePending, } = useUpdateRepresentative()

    const validationSchema = yup.object({
        name: yup
            .string()
            .trim()
            .required("هذا الحقل مطلوب"),
        email: yup
            .string()
            .trim()
            .email("البريد الإلكتروني غير صحيح")
            .required("هذا الحقل مطلوب"),
        code: yup
            .string()
            .trim()
            .min(6, 'الكود يجب ان لا يقل عن 6 احرف')
            .max(6, 'الكود يجب ان لا يزيد عن 6 احرف')
            .required("هذا الحقل مطلوب"),
        phone: yup
            .string()
            .trim()
            .required("هذا الحقل مطلوب"),
        address: yup
            .string()
            .trim()
            .required("هذا الحقل مطلوب"),
    })

    const {
        handleSubmit,
        register,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            name: "",
            email: "",
            code: "",
            phone: "",
            address: "",
        },
    })

    const onSubmit = handleSubmit(
        data => {
            const payload = { ...data }
            if (isEdit) {
                updateRepresentative(payload, {
                    onSuccess: () => {
                        setOpen(false)
                        setOpenMenu(false)
                    },
                })
            } else {
                payload.created_at = serverTimestamp()
                mutate({ ...payload, }, {
                    onSuccess: () => setOpen(false),
                })
            }
        },
        errors => {
            console.log(errors)
        }
    )

    useEffect(() => {
        reset(representative)
    }, [open, representative, reset])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children ? (
                    children
                ) : (
                    <BaseButton
                        icon="at-icons:plus"
                        title="إضافة مندوب"
                    />
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? "تعديل مندوب" : "إضافة مندوب"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? "قم بتعديل بيانات المندوب ثم اضغط على حفظ."
                            : "قم بإدخال بيانات المندوب ثم اضغط على حفظ."}
                    </DialogDescription>
                </DialogHeader>
                <FieldSet disabled={isPending || updatePending}>
                    <FieldGroup>
                        <div className="flex items-center gap-5">
                            <Field>
                                <Label
                                    htmlFor="name"
                                    required
                                >
                                    الاسم
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="ادخل اسم المندوب"
                                    data-error={errors.name}
                                    {...register("name")}
                                />
                                {errors.name && (<InputErrorMessage errorMessage={errors.name.message} />)}
                            </Field>
                            <Field>
                                <Label
                                    htmlFor="phone"
                                    required
                                >
                                    رقم الهاتف
                                </Label>
                                <Input
                                    id="phone"
                                    type="text"
                                    placeholder="ادخل رقم الهاتف"
                                    data-error={errors.phone}
                                    {...register("phone")}
                                />
                                {errors.phone && (<InputErrorMessage errorMessage={errors.phone.message} />)}
                            </Field>
                        </div>
                        <Field>
                            <Label
                                htmlFor="email"
                                required
                            >
                                البريد الإلكتروني
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="ادخل البريد الإلكتروني"
                                data-error={errors.email}
                                {...register("email")}
                            />
                            {errors.email && (<InputErrorMessage errorMessage={errors.email.message} />)}
                        </Field>
                        <Field>
                            <Label
                                htmlFor="code"
                                required
                            >
                                كود تسجيل الدخول
                            </Label>
                            <InputGroup>
                                <InputGroupInput
                                    type="text"
                                    placeholder="ادخل كود مكون من 6 احرف و ارقام"
                                    data-error={errors.code}
                                    {...register("code")}
                                />
                                <InputGroupAddon align="inline-end">
                                    <InputGroupButton
                                        variant={'default'}
                                        onClick={() => {
                                            const generatedCode = generateLoginCode()
                                            setValue("code", generatedCode, { shouldDirty: true, shouldValidate: true })
                                        }}
                                    >
                                        <Icon icon={'boxicons:bolt-filled'} />
                                        <span>انشاء كود عشوائي</span>
                                    </InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>
                            {errors.code && (<InputErrorMessage errorMessage={errors.code.message} />)}
                        </Field>
                        <Field>
                            <Label
                                htmlFor="address"
                                required
                            >
                                العنوان
                            </Label>
                            <Input
                                id="address"
                                type="text"
                                placeholder="ادخل عنوان المندوب"
                                data-error={errors.address}
                                {...register("address")}
                            />
                            {errors.address && (<InputErrorMessage errorMessage={errors.address.message} />)}
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
                        title={isEdit ? "حفظ البيانات" : "إضافة المندوب"}
                        onClick={onSubmit}
                        isLoading={isPending || updatePending}
                        disabled={isPending || updatePending}
                    />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default RepresentativeForm