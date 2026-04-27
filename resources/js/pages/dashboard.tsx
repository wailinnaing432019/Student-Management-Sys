import AppLayout from "@/layouts/app-layout";

export default function Dashboard() {
    const breadcrumbs = [
        { name: "ပင်မစာမျက်နှာ", href: "/dashboard" },
    ];

    return (
        <AppLayout title="Dashboard" breadcrumbs={breadcrumbs}>
            <div className="grid text-center auto-rows-min gap-4">
                <div className="overflow-hidden whitespace-nowrap">
                    <h2 className="text-3xl text-blue-500 inline-block marquee p-3">
                        ကွန်ပျူတာ တက္ကသိုလ်(မိတ္ထီလာ) မှ ကြိုဆိုပါ၏
                    </h2>
                </div>
            </div>
            <div className="relative w-full h-screen overflow-hidden rounded-xl">
                <img
                    src={`/storage/logos/ucsmtla.jpg`}
                    alt="UCSMTLA Logo"
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>
        </AppLayout>
    );
}
