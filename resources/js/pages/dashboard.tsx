import AppLayout from "@/layouts/app-layout";

export default function Dashboard() {
    const breadcrumbs = [
        { name: "ပင်မစာမျက်နှာ", href: "/dashboard" },
    ];

    return (
        <AppLayout title="Dashboard" breadcrumbs={breadcrumbs}>
            <div className="grid text-center auto-rows-min gap-4">
                <div className="overflow-hidden whitespace-nowrap">
                    <h2 className="text-3xl inline-block marquee p-3">
                        ကွန်ပျူတာ တက္ကသိုလ်(မိတ္ထီလာ) မှ ကြိုဆိုပါ၏
                    </h2>
                </div>
            </div>
            <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
                <img src={`/storage/logos/ucsmtla.jpg`} alt="" />
            </div>
        </AppLayout>
    );
}
