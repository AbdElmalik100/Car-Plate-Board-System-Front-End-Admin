
const Heading = ({ title, children }) => {
    return (
        <div className='flex items-center gap-4 justify-between'>
            <h2 className='font-semibold text-3xl'>{title}</h2>
            {children}
        </div>
    )
}

export default Heading