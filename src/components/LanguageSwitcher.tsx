"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { ChangeEvent, useTransition } from 'react';

export default function LanguageSwitcher() {
    const [isPending, startTransition] = useTransition();
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
        const nextLocale = event.target.value;
        startTransition(() => {
            router.replace({ pathname }, { locale: nextLocale });
        });
    }

    return (
        <div className="relative inline-block text-left">
            <select
                className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2 pr-8 outline-none hover:border-orange-400 cursor-pointer shadow-sm transition-colors"
                defaultValue={locale}
                disabled={isPending}
                onChange={onSelectChange}
            >
                <option value="en">English</option>
                <option value="gu">ગુજરાતી</option>
                <option value="hi">हिंदी</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
        </div>
    );
}
