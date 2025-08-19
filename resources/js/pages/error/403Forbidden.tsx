import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';

export default function Forbidden() {
    const { auth } = usePage().props;
    return (
        <AppLayout>
            <Head title="403 Forbidden" />
            <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-4">
                <h1 className="text-6xl font-bold text-red-600">403</h1>
                <p className="text-xl">သင်သည် ဤစာမျက်နှာသို့ ဝင်ရောက်ရန် ခွင့်ပြုမထားပါ။</p>

                {(auth?.user?.role == "admin") &&
                    <TextLink href={route('dashboard')} className='btn bg-red-500 p-2 rounded-xl'> Go Back</TextLink>

                }
                {(auth?.user?.role == "staff") &&
                    <TextLink href={route('dashboard')} className='btn bg-red-500 p-2 rounded-xl' > နောက်သို့</TextLink>

                }
            </div>
        </AppLayout>
    );
}
