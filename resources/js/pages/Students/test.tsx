
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import AppLayout from "@/layouts/app-layout"
import { Head, Link, useForm, usePage } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSemesterText } from "@/Utils/SemesterText"
import { SharedData } from "@/types"

export default function StudentShowPage({ studentEnrollment }: { studentEnrollment: any }) {
    if (!studentEnrollment || !studentEnrollment.student) {
        return <div className="p-4 text-center text-muted-foreground">Loading student data...</div>
    }
    const student = studentEnrollment.student
    const profile = studentEnrollment.student_semester_profile
    const semester = studentEnrollment.semester
    const major = studentEnrollment.major
    const donor = studentEnrollment.student_semester_profile.donor
    const academicYear = studentEnrollment.academic_year
    const registrationAgreement = studentEnrollment.student_semester_profile.registration_agreement


    const { data, setData, post, processing, errors } = useForm({
        status: studentEnrollment.status ?? 'Pending',
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        post(route('enroll-students.update-status', studentEnrollment.id))
    }
    const { auth } = usePage<SharedData>().props;

    const userRole = auth?.user?.role || 'staff';

    return (

        <AppLayout breadcrumbs={[{ name: "Enrolled Students", href: "/enroll-students" }, { name: student.name_eng }]}>
            <Head title="Students" />
            <div className="print-area">
                <div className="flex no-print"  >
                    {studentEnrollment.pdf_path &&
                        <a
                            href={`/storage/${studentEnrollment.pdf_path}`} target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                        >
                            🖨️ Preview & Print
                        </a>
                    }
                </div>
                <div className="space-y-6 w-full mx-auto px-4 py-6 print-area">
                    <div className="p-6 space-y-6 text-[14px] leading-relaxed">


                        {/* Student Info */}
                        <section>
                            <div className='flex text-2xl justify-center'>
                                <div className=' '>
                                    {academicYear.name}  ပညာသင်နှစ်၊ ကျောင်းသား/သူ ပညာသင်ခွင့်လျှောက်လွှာ
                                </div>
                            </div>
                            <div className='text-center mt-3'>
                                <h3 >ကွန်ပျူတာ
                                    တက္ကသိုလ် ၊ မိတ္ထီလာမြို့ </h3>
                            </div>
                        </section>

                        {/* Guardian Info */}
                        <section>
                            <div className="flex mx-auto p-4  rounded  ">
                                <div className='w-2/5'>

                                    <div className="grid gap-2 justify-center">

                                        <img src={`/storage/${profile.image}`} alt="" className="w-32 h-24" />
                                    </div>
                                </div>
                                <div className='w-3/5'>
                                    <table className="table-auto w-full border border-gray-300 text-sm text-left">
                                        <tbody>
                                            <tr >
                                                <td className="border px-3 py-2">သင်တန်းနှစ်</td>
                                                <td className="border px-3 py-2">
                                                    <div> {getSemesterText(semester.semester_number)}</div>
                                                </td>

                                            </tr>
                                            <tr >
                                                <td className="border px-3 py-2">အထူးပြု ဘာသာ</td>
                                                <td className="border px-3 py-2">
                                                    <div>
                                                        {major.name}
                                                    </div>
                                                </td>

                                            </tr>
                                            <tr >
                                                <td className="border px-3 py-2">ခုံအမှတ်</td>
                                                <td className="border px-3 py-2">{profile.roll_no} </td>

                                            </tr>
                                            <tr >
                                                <td className="border px-3 py-2">တက္ကသိုလ်၀င်ရောက်သည့်အမှတ်</td>
                                                <td className="border px-3 py-2">{student.uid} </td>

                                            </tr>
                                            <tr >
                                                <td className="border px-3 py-2">တက္ကသိုလ်၀င်ရောက်သည့်နှစ်</td>
                                                <td className="border px-3 py-2"> {student.entried_year}</td>

                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>

                        {/* Registration Info */}
                        <section>
                            <table className="table-auto w-full border border-gray-300 text-sm text-left">
                                <thead>
                                    <tr>
                                        <th colSpan={2} className="border px-3 py-2"> ၁။ပညာဆက်လက်သင်ခွင့်‌‌‌တောင်းခံသူ</th>
                                        <th className="border px-3 py-2">‌ကျောင်းသား/သူ</th>
                                        <th className="border px-3 py-2">‌အဖအမည်</th>
                                        <th className="border px-3 py-2">အမိအမည်</th>
                                    </tr>
                                </thead>


                                <tbody>
                                    <tr >
                                        <td rowSpan={2} className="border px-3 py-2">အမည်</td>
                                        <td className="border px-3 py-2">မြန်မာစာဖြင့်</td>
                                        <td className="border px-3 py-2">{student.name_myan}</td>
                                        <td className="border px-3 py-2">{student.father.name_myan}</td>
                                        <td className="border px-3 py-2">{student.mother.name_myan}</td>
                                    </tr>
                                    <tr >
                                        <td className="border px-3 py-2">အင်္ဂလိပ်စာဖြင့်</td>
                                        <td className="border px-3 py-2">{student.name_eng}</td>
                                        <td className="border px-3 py-2">{student.father.name_eng}</td>
                                        <td className="border px-3 py-2">{student.mother.name_eng}</td>
                                    </tr>
                                    <tr >
                                        <td colSpan={2} className="border px-3 py-2">လူမျိုး</td>
                                        <td className="border px-3 py-2">{student.ethnicity}</td>
                                        <td className="border px-3 py-2">{student.father.ethnicity}</td>
                                        <td className="border px-3 py-2">{student.mother.ethnicity}</td>
                                    </tr>
                                    <tr >
                                        <td colSpan={2} className="border px-3 py-2">ကိုးကွယ်သည့် ဘာသာ</td>
                                        <td className="border px-3 py-2">{student.religion}</td>
                                        <td className="border px-3 py-2">{student.father.religion}</td>
                                        <td className="border px-3 py-2">{student.mother.religion}</td>
                                    </tr>
                                    <tr >
                                        <td colSpan={2} className="border px-3 py-2">မွေးဖွားရာ ဇာတိ</td>
                                        <td className="border px-3 py-2">{student.hometown}</td>
                                        <td className="border px-3 py-2">{student.father.hometown}</td>
                                        <td className="border px-3 py-2">{student.mother.hometown}</td>
                                    </tr>
                                    <tr >
                                        <td colSpan={2} className="border px-3 py-2">မြို့နယ်/ပြည်နယ်/တိုင်း</td>
                                        <td className="border px-3 py-2">{student.township_state_region}</td>
                                        <td className="border px-3 py-2">{student.father.township_state_region}</td>
                                        <td className="border px-3 py-2">{student.mother.township_state_region}</td>

                                    </tr>
                                    <tr>
                                        <td colSpan={2} className="border px-3 py-2">နိုင်ငံသား စီစစ်ရေးကတ်ပြား အမှတ်</td>
                                        <td className="border px-3 py-2">{student.nrc_state}/{student.nrc_township}({student.nrc_type}){student.nrc_number}</td>
                                        <td className="border px-3 py-2">{student.father.nrc_state}/{student.father.nrc_township}({student.father.nrc_type}){student.father.nrc_number}</td>
                                        <td className="border px-3 py-2">{student.mother.nrc_state}/{student.mother.nrc_township}({student.mother.nrc_type}){student.mother.nrc_number}</td>
                                    </tr>
                                    <tr >
                                        <td colSpan={2} className="border px-3 py-2">တိုင်းရင်းသား/နိုင်ငံခြားသား</td>
                                        <td className="border px-3 py-2">{student.local_foreign == "local" ? "တိုင်းရင်းသား" : "နိုင်ငံခြားသား"}</td>
                                        <td className="border px-3 py-2">{student.father.local_foreign == "local" ? "တိုင်းရင်းသား" : "နိုင်ငံခြားသား"}</td>
                                        <td className="border px-3 py-2">{student.mother.local_foreign == "local" ? "တိုင်းရင်းသား" : "နိုင်ငံခြားသား"}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <table className="table-auto w-full border border-gray-300 text-sm text-left page-break">
                                <tbody>
                                    <tr >
                                        <td colSpan={2} className="border px-3 py-2">မွေးသက္ကရာဇ်</td>
                                        <td className="border px-3 py-2">{student.dob}</td>
                                        <td rowSpan={4} colSpan={2} className="border px-3 py-2">
                                            <label htmlFor="" className="-mt-2 ">အဘအုပ်ထိန်းသူ၏ အလုပ်အကိုင်ရာထူး/ဌာန/လိပ်စာ အပြည့်အစုံ</label>
                                            <div className="mt-6 text-center">{student.father.job}</div>
                                        </td>
                                    </tr>
                                    <tr >
                                        <td rowSpan={3} className="border px-3 py-2">တက္ကသိုလ်၀င်တန်း စာမေးပွဲ အောင်မြင်သည့်</td>
                                        <td colSpan={2} className="border px-3 py-2">ခုံအမှတ် -{student.matriculation_passed_roll_no}
                                        </td>
                                    </tr>

                                    <tr >

                                        <td colSpan={2} className="border px-3 py-2">ခုနှစ် -  {student.matriculation_passed_year}
                                        </td>

                                    </tr>

                                    <tr >

                                        <td colSpan={2} className="border px-3 py-2">
                                            စာစစ်ဌာန - {student.examination_center}
                                        </td>

                                    </tr>
                                    <tr >

                                        <td rowSpan={3} className="border px-3 py-2">
                                            အမြဲတမ်းနေထိုင်သည့် လိပ်စာ (အပြည့်အစုံ)
                                        </td>
                                        <td colSpan={2} className="border px-3 py-2">
                                            ဖုန်း - {profile.phone}

                                        </td>
                                        <td colSpan={2} rowSpan={3} className="border px-3 py-2  ">

                                            <label htmlFor="" className=" ">အမိအုပ်ထိန်းသူ၏ အလုပ်အကိုင်ရာထူး/ဌာန/လိပ်စာ အပြည့်အစုံ</label>
                                            <div className="mt-6 text-center">{student.mother.job}</div>
                                        </td>

                                    </tr>
                                    <tr >

                                        <td colSpan={2} className="border px-3 py-2">

                                            Email - {profile.email}
                                        </td>


                                    </tr>
                                    <tr >


                                        <td colSpan={2} className="border px-3 py-2">
                                            အမြဲတမ်းနေရပ် - {profile.permanent_address}


                                        </td>


                                    </tr>
                                    <tr>

                                        <td className="border px-3 py-2">၂။ ဖြေဆိုခဲ့သည့်စာမေးပွဲများ
                                        </td>
                                        <td className="border px-3 py-2">အဓိက ဘာသာ</td>
                                        <td className="border px-3 py-2">ခုံအမှတ်</td>
                                        <td className="border px-3 py-2">ခုနှစ်</td>
                                        <td className="border px-3 py-2">အောင်/ရှုံး</td>

                                    </tr>
                                    {student.exams_taken.length == 0 && (
                                        <tr>

                                            <td className="border px-3 py-2">-
                                            </td>
                                            <td className="border px-3 py-2">-</td>
                                            <td className="border px-3 py-2">-</td>
                                            <td className="border px-3 py-2">-</td>
                                            <td className="border px-3 py-2">-</td>

                                        </tr>
                                    )}



                                    {student.exams_taken.map((exam: any) => (
                                        <tr key={exam.id}>
                                            <td className="border px-3 py-2">
                                                {exam.exam_name}
                                            </td>
                                            <td className="border px-3 py-2">
                                                {exam.major}
                                            </td>
                                            <td className="border px-3 py-2">
                                                {exam.roll_no}
                                            </td>
                                            <td className="border px-3 py-2">
                                                {exam.year}
                                            </td>



                                            <td className="border px-3 py-2">
                                                <Badge variant={exam.pass_fail === "pass" ? "default" : "destructive"}>
                                                    {exam.pass_fail.toUpperCase()}
                                                </Badge>
                                            </td>



                                        </tr>
                                    ))}

                                    <tr >

                                        <td colSpan={2} rowSpan={4} className="border px-3 py-2">
                                            ၃။ကျောင်းနေရန် အထောက်ပံ့ပြုမည့် ပုဂ္ဂိုလ်
                                        </td>
                                        <td className="border px-3 py-2">(က) အမည်</td>
                                        <td colSpan={2} className="border px-3 py-2">
                                            {donor.name}
                                        </td>

                                    </tr>
                                    <tr >


                                        <td className="border px-3 py-2">(ခ) ဆွေမျိုးတော်စပ်ပုံ</td>
                                        <td colSpan={2} className="border px-3 py-2">
                                            {donor.relationship}
                                        </td>

                                    </tr>
                                    <tr >


                                        <td className="border px-3 py-2">(ဂ) အလုပ်အကိုင်</td>
                                        <td colSpan={2} className="border px-3 py-2">
                                            {donor.job}
                                        </td>

                                    </tr>
                                    <tr >


                                        <td className="border px-3 py-2">(ဃ) ဆက်သွယ်ရန် လိပ်စာ ဖုန်းနံပါတ်</td>
                                        <td colSpan={2} className="border px-3 py-2">
                                            {donor.phone}
                                        </td>

                                    </tr>
                                    <tr >


                                        <td colSpan={2} className="border px-3 py-2">၄။ပညာသင်ထောက်ပံ့ကြေးပေးရန် ခွင့်ပြု / မပြု</td>
                                        <td colSpan={3} className="border px-3 py-2">
                                            <div>
                                                {donor.status == 1 ? "ခွင့်ပြု" : "ပြု"}
                                            </div>
                                        </td>

                                    </tr>
                                </tbody>

                            </table>


                        </section>
                        {/* {registrationAgreement !== null &&
                            <section >
                                <div className='w-full text-justify justify-evenly leading-loose'>
                                    <div className="mt-4">
                                        <p className="leading-loose">သို့</p>
                                        <p className="leading-loose">ကွန်ပျူတာတက္ကသိုလ်(မိတ္ထီလာ)</p>
                                        <p>အကြောင်းအရာ။ ။ကွန်ပျူတာတက္ကသိုလ်(မိတ္ထီလာ)တွင် {registrationAgreement.name} သင်တန်းတက်ရောက်ခွင့်လျှောက်ထားခြင်း။</p>
                                    </div>
                                    <div className='space-y-4'>
                                        <p className="leading-loose"> ၁။ <span className='ml-3'></span> (က) {registrationAgreement.gender == "male" ? "ကျွန်တော်" : "ကျွန်မ"}
                                            {registrationAgreement.name} သည် ကွန်ပျူတာတက္ကသိုလ်(မိတ္ထီလာ) သို့ ၀င်ခွင့်အမှတ်စဥ် ({student.uid}) ဖြင့် ပထမနှစ်သက်တန်းသို့ ၀င်ရောက်ခွင့် ရရှိသူဖြစ်ပါသည်။</p>

                                        <div className='ml-6 space-y-4'><p className=' leading-loose'> (ခ){registrationAgreement.gender == "male" ? "ကျွန်တော်" : "ကျွန်မ"}
                                            {registrationAgreement.name}  သည်  {registrationAgreement.examed_year} ခုနှစ် ၊  {registrationAgreement.examed_month} လ အတွင်းကျင်းပခဲ့သော {registrationAgreement.examed_name}သင်တန်းစာမေးပွဲကို ခုံအမှတ် {registrationAgreement.examed_roll_no} ဖြင့် ဖြေဆို
                                            {registrationAgreement.examed_status == "pass" ? "အောင်မြင်" : "ကျရှုံး"} ခဲ့ပါ၍ ကွန်ပျူတာတက္ကသိုလ်(မိတ္ထီလာ) တွင် ဖွင့်လှစ်မည့်

                                            {registrationAgreement.class}သင်တန်းသို့ တက်ရောက်ခွင့်ပြုပါရန် လျှောက်ထားအပ်ပါသည်။
                                            ကွန်ပျူတာတက္ကသိုလ်(မိတ္ထီလာ)တွင် ပညာသင်ကြားနေစဥ် ကာလအတွင်း ဤတက္ကသိုလ်မှ သတ်မှတ်ထားသည့် အောက်ဖော်ပြပါ အချက်အလက်များကို သိရှိပြီးကြောင်းနှင့် လိုက်နာကျင့်သုံးမည်ဖြစ်ကြောင်း ၀န်ခံကတိ လက်မှတ်ရေးထိုးပါသည်။</p>

                                            <p>(၁) B.C.Sc/B.C.Tech သင်တန်းမှာ(၄) နှစ်သင်တန်းဖြစ်ပါသည်။</p>
                                            <p>(၂) သင်တန်းကြေးမှာ တစ်လလျှင်
                                                {registrationAgreement.fee}ကျပ်တိတိ (  ) နှုန်းဖြစ်ပါသည်။</p>
                                            <p>(၃) မိမိအစီအစဉ်ဖြင့် နေထိုင်စားသောက်ရမည်ဖြစ်ပါသည်။</p>
                                            <p>(၄) ကျွန်တော်/ကျွန်မ သည် မည်သည့်နိုင်ငံရေးပါတီတွင်မျှ ပါတီ၀င်မဟုတ်ပါ။</p>
                                            <p>(၅) Credit Unit / Credit Hour ပြည့်မှီခြင်းမရှိပါက စာမေးပွဲဖြေဆိုခွင့် မပြုကြောင်းကို သိရှိပါ သည်။</p>
                                            <p>(၆) နေ့စဉ်ကျောင်းတက်ရောက်ခြင်းဆိုင်ရာကိစ္စ၊ ကျောင်းပြောင်း‌‌ရွှေ့ခြင်းဆိုင်ရာ ကိစ္စ၊ ဆေးခွင့်လျှောက်ထားခြင်း ဆိုင်ရာကိစ္စ၊ စာမေးပွဲဖြေဆိုခြင်းဆိုင်ရာ ကိစ္စများ၏ စည်းကမ်းသတ်မှတ်ချက်များအား ပူးတွဲပါ ကျောင်းစည်းကမ်းဆိုင်ရာ အချက်အလက်များ အတိုင်း သိရှိလိုက်နာသွားရန် ဖြစ်ပါသည်။</p>
                                            <p>(၇) ကျောင်းမှထုတ်ပြန်ထားသော ပူးတွဲဖော်ပြပါစည်းကမ်းချက်များကို ဖတ်ရှုလက်မှတ်ထိုးပြီး လိုက်နာပါမည်ဟု ကတိပြုပါသည်။</p>
                                        </div>
                                    </div>
                                    <div className='justify-between flex'>
                                        <div className='space-y-4'>
                                            <div className='p-3'>မိဘ/အုပ်ထိန်းသူ၏</div>
                                            <div>

                                                <label htmlFor="">အမည် - </label>
                                                {registrationAgreement.guardian}

                                            </div>
                                            <div >


                                                <div className="flex space-x-1 max-w-md">
                                                    <label htmlFor=""  >မှတ်ပုံတင်အမှတ် - </label>
                                                    <div className="flex gap-1 items-center max-w-md">
                                                        <div className="">
                                                            <span className="flex"> {registrationAgreement.nrc_state}/{registrationAgreement.nrc_township} ({registrationAgreement.nrc_type}) {registrationAgreement.nrc_number}</span>
                                                        </div>


                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        <div className='space-y-5'>
                                            <div className='p-3'>ပညာသင်လျှောက်ထားသူ၏</div>
                                            <div>

                                                <label htmlFor="">အမည် - </label>
                                                {registrationAgreement.name}

                                            </div>
                                            <div>

                                                <label htmlFor="">ယခင်နှစ်ခုံအမှတ် - </label>
                                                {registrationAgreement.examed_roll_no}
                                            </div>

                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-start space-x-2">

                                            <Label htmlFor="agreed" className="text-sm leading-snug p-3  font-bold">
                                                ဤအချက်အလက်များမှန်ကန်ကြောင်း သေချာပါသည်။ ဤအတည်ပြုချက်ကို ကျွန်ုပ်လက်ခံပါသည်။
                                            </Label>
                                        </div>

                                    </div>
                                </div>
                            </section>
                        } */}
                    </div>
                    {userRole !== "staff" && (<form onSubmit={handleSubmit} className="space-y-4 mt-6 max-w-sm no-print">
                        <div>
                            <Label htmlFor="status">Enrollment Status</Label>
                            <Select
                                value={String(data.status)}
                                onValueChange={(value) => setData('status', value)}
                            >
                                <SelectTrigger className="w-full  rounded-none border-0 border-b-2 focus:ring-0 focus:outline-none">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pending">လျှောက်ထားဆဲ</SelectItem>
                                    <SelectItem value="Accept">လက်ခံမည်</SelectItem>
                                    <SelectItem value="Reject">ငြင်းပယ်မည်</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-sm text-red-500 mt-1">{errors.status}</p>}
                        </div>

                        <Button type="submit" disabled={processing}>
                            Update Status
                        </Button>
                    </form>)}
                </div>
            </div>
        </AppLayout>
    )
}
