import AuthHero from '@/components/Auth/AuthHero'

const AuthLayout = ({ children }) => {
    return (
        <main className='h-screen flex'>
            <section className='w-1/4'>
                {children}
            </section>
            <AuthHero />
        </main>
    )
}

export default AuthLayout