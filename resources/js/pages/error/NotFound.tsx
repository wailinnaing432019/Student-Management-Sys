import AppLayout from "@/layouts/app-layout";

export default function NotFound() {
    return (
        <AppLayout>
            <div className="text-center mt-20">
                <h1 className="text-5xl font-bold text-red-600">404</h1>
                <p className="mt-4 text-gray-700">တောင်းဆိုထားသော စာမျက်နှာ မတွေ့ပါ။</p>
                <a
                    href="/"
                    className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    ပင်မစာမျက်နှာသို့ ပြန်သွားမည်
                </a>
            </div>
        </AppLayout>
    );
}
