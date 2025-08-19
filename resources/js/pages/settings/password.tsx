import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Password settings',
        href: '/settings/password',
    },
];

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <AppLayout breadcrumbs={[{ name: "လျို့၀ှက်နံပါတ် ပြောင်းလဲခြင်း" }]}>
            <Head title="လျို့၀ှက်နံပါတ် ပြောင်းလဲခြင်း" />

            {/* <SettingsLayout> */}
            <div className="space-y-6 w-4/5 md:w-3/5 lg:w-3/5 shadow-lg mx-auto rounded-lg p-6">
                <HeadingSmall title="လျို့၀ှက်နံပါတ် ပြောင်းလဲခြင်း" description="သင့်၏ လျို့၀ှက်နံပါတ် ပြောင်းလဲပြီးပါက သင့်၏အကောင့်သို့ပြန်၀င်ရပါမည်။" />

                <form onSubmit={updatePassword} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="current_password">ယခု အသုံးပြုနေသော လျို့၀ှက်နံပါတ်</Label>

                        <Input
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            type="password"
                            className="mt-1 block w-full"
                            autoComplete="current-password"
                            placeholder="ယခု အသုံးပြုနေသော လျို့၀ှက်နံပါတ်"
                        />

                        <InputError message={errors.current_password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">လျို့၀ှက်နံပါတ် အသစ်</Label>

                        <Input
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            type="password"
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            placeholder="လျို့၀ှက်နံပါတ် အသစ်"
                        />

                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">လျို့၀ှက်နံပါတ် အသစ်ကို ထပ်မံရိုက်ထည့်ပါ။</Label>

                        <Input
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            type="password"
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            placeholder="လျို့၀ှက်နံပါတ် အသစ်ကို ထပ်မံရိုက်ထည့်ပါ"
                        />

                        <InputError message={errors.password_confirmation} />
                    </div>

                    <div className="flex items-center   gap-4">
                        <Button disabled={processing}>လျို့၀ှက်နံပါတ် ပြောင်းလဲမည်</Button>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-neutral-600">ပြောင်းလဲပြီးပါပြီ</p>
                        </Transition>
                    </div>
                </form>
            </div>
            {/* </SettingsLayout> */}
        </AppLayout>
    );
}
