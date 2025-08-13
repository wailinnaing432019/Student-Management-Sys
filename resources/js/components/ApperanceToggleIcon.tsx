import { useAppearance } from '@/hooks/use-appearance';
import { Monitor, Moon, Sun } from 'lucide-react';

export default function AppearanceToggleIcon({ className = '' }) {
    const { appearance, updateAppearance } = useAppearance();

    const icons = {
        light: Sun,
        dark: Moon,
        system: Monitor,
    };

    const order: ("light" | "dark" | "system")[] = ["light", "dark", "system"];

    const Icon = icons[appearance];

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        const currentIndex = order.indexOf(appearance);
        const nextIndex = (currentIndex + 1) % order.length;
        updateAppearance(order[nextIndex]);
    };

    return (
        <div
            onClick={handleClick}
            className={`p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors ${className}`}
            title={`Switch to ${order[(order.indexOf(appearance) + 1) % order.length]} mode`}
        >
            <Icon className="h-4 w-4" />
        </div>
    );
}
