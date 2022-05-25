import type { Profile } from '@prisma/client'

interface UserCircleProps {
    profile: Profile
    className?: string
    onClick?: (...args: any) => any
}

export function UserCircle({ profile, onClick, className }: UserCircleProps) {
    return (
        <div
            className={`${className} cursor-pointer bg-gray-400 rounded-full flex justify-center items-center`}
            onClick={onClick}
        >
            <h2>
                {profile.firstName.charAt(0).toUpperCase()}
                {profile.lastName.charAt(0).toUpperCase()}
            </h2>
        </div>
    )
}