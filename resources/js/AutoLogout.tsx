import { router } from '@inertiajs/react';
import { useEffect } from 'react';

export default function AutoLogout({ timeout = 1 * 60 * 1000 }) { // 5 minutes
    useEffect(() => {
        let timer;

        const resetTimer = () => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                router.post(route('logout'));
            }, timeout);
        };

        // Reset timer on user activity
        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keydown', resetTimer);
        window.addEventListener('click', resetTimer);

        resetTimer(); // start timer

        return () => {
            clearTimeout(timer);
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keydown', resetTimer);
            window.removeEventListener('click', resetTimer);
        };
    }, [timeout]);

    return null; // no UI
}
