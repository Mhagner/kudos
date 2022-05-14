interface FormFieldProps {
    htmlFor: string;
    label: string;
    type?: string;
    value?: string;
    onChange?: (...args: any) => any;
}

export function FormField({ htmlFor, label, type = 'text', value, onChange = () => { } }: FormFieldProps) {
    return (
        <div className="flex flex-col gap-y-2">
            <label htmlFor={htmlFor} className='text-blue-600 font-semibold'>
                {label}
            </label>
            <input
                type={type}
                id={htmlFor}
                name={htmlFor}
                className='w-full p-2 rounded-xl my-2'
                value={value}
                onChange={onChange}
            />
        </div>
    )
}