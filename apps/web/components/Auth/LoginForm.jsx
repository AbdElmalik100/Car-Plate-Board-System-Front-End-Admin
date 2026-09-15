'use client'
import BaseButton from '@/components/Shared/BaseButton'
import { yupResolver } from '@hookform/resolvers/yup'
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@workspace/ui/components/field'
import { Input } from '@workspace/ui/components/input'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import InputErrorMessage from '../Shared/InputErrorMessage'
import { useLogin } from '@/hooks/useAuth'


const LoginForm = () => {
    const {mutate, isPending} = useLogin()
    const validationSchema = yup.object({
        email: yup.string().email('عنوان البريد الإلكتروني غير صالح').required('هذا الحقل مطلوب'),
        password: yup.string().required('هذا الحقل مطلوب'),
    })
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    })

    const onSubmit = handleSubmit(data => {
        console.log(data);
        mutate(data)
    }, error => {
        console.log(error);
    })
    return (
        <div className='grid place-items-center h-full p-8'>
            <form className='w-full max-w-sm' onSubmit={onSubmit}>
                <FieldSet disabled={isPending}>
                    <FieldContent className='items-center'>
                        <FieldLegend className='text-3xl! font-black'>
                            مرحبًا بعودتك!
                        </FieldLegend>
                        <FieldDescription className='max-w-xs! text-center'>
                            يرجى إدخال بيانات الدخول الخاصة بك للوصول إلى لوحة التحكم
                        </FieldDescription>
                    </FieldContent>
                    <FieldGroup>
                        <Field>
                            <FieldLabel>
                                البريد الإلكتروني
                            </FieldLabel>
                            <Input
                                id='email'
                                name='email'
                                type='email'
                                placeholder='أدخل بريدك الإلكتروني'
                                data-error={errors.email}
                                {...register("email")}
                            />
                            {errors.email && <InputErrorMessage errorMessage={errors.email?.message} />}
                        </Field>
                        <Field>
                            <FieldLabel>
                                Password
                            </FieldLabel>
                            <Input
                                id='password'
                                name='password'
                                type='password'
                                placeholder='أدخل كلمة المرور'
                                data-error={errors.email}
                                {...register("password")}
                            />
                            {errors.password && <InputErrorMessage errorMessage={errors.password?.message} />}
                        </Field>
                        <Link href={'#'} className='text-sm underline hover:text-muted-foreground transition-all ease-out'>
                            نسيت كلمة المرور؟
                        </Link>
                        <Field>
                            <BaseButton
                                title={'تسجيل الدخول'}
                                isLoading={isPending}
                                disabled={isPending}
                            />
                        </Field>
                    </FieldGroup>
                </FieldSet>
            </form>
        </div>
    )
}

export default LoginForm