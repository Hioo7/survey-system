type AvatarBadgeProps = {
    label: string
    className?: string
    textClassName?: string
    showSteam?: boolean
}

const COFFEE_TONES = [
    'bg-espresso',
    'bg-mocha',
    'bg-caramel-burnt',
    'bg-mocha',
    'bg-espresso',
    'bg-caramel-burnt',
]

export function getAvatarInitials(label: string) {
    const base = label.includes('@') ? label.split('@')[0] : label
    const parts = base.split(/[\s._-]+/).filter(Boolean)

    if (parts.length === 0) return 'SP'
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()

    return parts
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase()
}

export function getAvatarTone(label: string) {
    let hash = 0
    for (let index = 0; index < label.length; index += 1) {
        hash = label.charCodeAt(index) + ((hash << 5) - hash)
    }

    return COFFEE_TONES[Math.abs(hash) % COFFEE_TONES.length]
}

export function AvatarBadge({
    label,
    className = 'h-16 w-16 rounded-2xl text-xl',
    textClassName = 'text-white',
    showSteam = true,
}: AvatarBadgeProps) {
    const initials = getAvatarInitials(label)
    const toneClassName = getAvatarTone(label)

    return (
        <div
            className={[
                toneClassName,
                textClassName,
                'relative flex items-center justify-center font-bold shadow-sm select-none overflow-hidden shrink-0',
                className,
            ].join(' ')}
        >
            {showSteam ? (
                <span
                    aria-hidden
                    className="absolute inset-x-2 top-2 flex items-center justify-center gap-1 opacity-50"
                >
                    <span className="h-2 w-1 rounded-full bg-cream/80" />
                    <span className="h-3 w-1 rounded-full bg-caramel/80" />
                    <span className="h-2 w-1 rounded-full bg-cream/80" />
                </span>
            ) : null}
            <span className="relative mt-1">{initials}</span>
        </div>
    )
}