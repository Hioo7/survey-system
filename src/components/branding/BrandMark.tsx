import { GiCoffeeBeans } from 'react-icons/gi'

type BrandMarkProps = {
    className?: string
    cupClassName?: string
    steamClassName?: string
    detailClassName?: string
    title?: string
}

export function BrandMark({
    className = 'h-8 w-8',
    cupClassName = 'text-espresso',
    steamClassName,
    detailClassName,
    title = 'Staff Portal brand mark',
}: BrandMarkProps) {
    const colorClassName = cupClassName || steamClassName || detailClassName || 'text-espresso'

    return (
        <GiCoffeeBeans
            className={[
                className,
                colorClassName,
                'inline-block',
            ]
                .filter(Boolean)
                .join(' ')}
            aria-hidden={title ? undefined : true}
            role="img"
            title={title || undefined}
        />
    )
}