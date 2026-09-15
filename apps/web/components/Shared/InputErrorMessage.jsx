
const InputErrorMessage = ({ errorMessage }) => {
    return (
        <div className="text-destructive flex items-center gap-1 text-sm">
            <span className='flex-1'>{errorMessage}</span>
        </div>
    )
}

export default InputErrorMessage